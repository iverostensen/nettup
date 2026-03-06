import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_MODEL, RETRY_LIMIT, type QueueEntry } from './config.ts';
import type { ArticleResult } from './generate-article.ts';
import { readQueue, writeQueue } from './discover-topics.ts';

export interface QualityResult {
  passed: boolean;
  aiScores: Record<string, number>;
  aiAverage: number;
  automatedChecks: {
    wordCount: boolean;
    lixScore: boolean;
    hasFaqSection: boolean;
    nettupMentions: boolean;
    noH1InBody: boolean;
    geoFirstParagraph: boolean;
    seoTitleFormat: boolean;
  };
  reason?: string;
}

function lixScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.trim().length > 0);
  const longWords = words.filter((w) => w.replace(/[^a-zA-ZæøåÆØÅ]/g, '').length > 6);
  if (sentences.length === 0 || words.length === 0) return 0;
  return (words.length / sentences.length) + (longWords.length * 100 / words.length);
}

const REVIEW_SYSTEM_PROMPT = `Du er en streng innholdsredaktør for en norsk webbyrå-blogg. Din oppgave er å vurdere en artikkel på 6 kriterier.

For hvert kriterium, gi en score fra 1-10 (10 = perfekt).

Kriterier:
1. faktiskVerdi: Gir artikkelen faktisk, handlingsorientert informasjon? Konkrete tall, eksempler?
2. originalitet: Er innholdet unikt og ikke bare generisk? Har det en spesifikk vinkling?
3. lesbarhet: Korte avsnitt, logisk struktur, lett å skanne?
4. norskkvalitet: Korrekt norsk bokmål, naturlig språk, ingen oversetterfeil?
5. geoOptimering: Svarer første avsnitt direkte på spørsmålet? Er det siterbart for AI-søkemotorer?
6. ctaKvalitet: Er call-to-action naturlig og ikke aggressiv? Integrert i innholdet?

Returner BARE scores i dette formatet (én per linje):
faktiskVerdi: [tall]
originalitet: [tall]
lesbarhet: [tall]
norskkvalitet: [tall]
geoOptimering: [tall]
ctaKvalitet: [tall]`;

export async function runQualityGate(article: ArticleResult): Promise<QualityResult> {
  const client = new Anthropic();

  // Pass 1: Claude self-review
  const reviewResponse = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 512,
    system: REVIEW_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: article.markdownBody }],
  });

  const reviewText = reviewResponse.content[0].type === 'text' ? reviewResponse.content[0].text : '';

  const criteria = ['faktiskVerdi', 'originalitet', 'lesbarhet', 'norskkvalitet', 'geoOptimering', 'ctaKvalitet'];
  const aiScores: Record<string, number> = {};

  for (const criterion of criteria) {
    const regex = new RegExp(criterion + '\\s*:\\s*(\\d+)', 'i');
    const match = reviewText.match(regex);
    aiScores[criterion] = match ? parseInt(match[1], 10) : 5;
  }

  const scoreValues = Object.values(aiScores);
  const aiAverage = scoreValues.reduce((sum, s) => sum + s, 0) / scoreValues.length;

  const result: QualityResult = {
    passed: true,
    aiScores,
    aiAverage,
    automatedChecks: {
      wordCount: false,
      lixScore: false,
      hasFaqSection: false,
      nettupMentions: false,
      noH1InBody: false,
      geoFirstParagraph: false,
      seoTitleFormat: false,
    },
  };

  if (aiAverage < 7) {
    result.passed = false;
    result.reason = `AI review: average score ${aiAverage.toFixed(1)}/10`;
    await updateQueueOnRejection(article.topic, result.reason);
    return result;
  }

  // Pass 2: Automated checks (only if pass 1 passed)
  const words = article.markdownBody.split(/\s+/).filter((w) => w.trim().length > 0);
  const wordCount = words.length;
  const lix = lixScore(article.markdownBody);
  const hasFaqSection = /##\s*Vanlige spørsmål/i.test(article.markdownBody);
  const nettupCount = (article.markdownBody.match(/Nettup/g) ?? []).length;
  const noH1InBody = !/^#\s/m.test(article.markdownBody);
  const firstLine = article.markdownBody.split('\n').find((l) => l.trim().length > 0) ?? '';
  const geoFirstParagraph = !firstLine.trim().startsWith('#');
  const seoTitleFormat =
    article.metadata.seoTitle.includes('| Nettup') &&
    article.metadata.seoTitle.length <= 60;

  result.automatedChecks = {
    wordCount: wordCount >= 1400,
    lixScore: lix <= 55,
    hasFaqSection,
    nettupMentions: nettupCount <= 2,
    noH1InBody,
    geoFirstParagraph,
    seoTitleFormat,
  };

  if (!result.automatedChecks.wordCount) {
    result.passed = false;
    result.reason = `Automated check failed: word count ${wordCount} (minimum 1400)`;
  } else if (!result.automatedChecks.lixScore) {
    result.passed = false;
    result.reason = `Automated check failed: LIX score ${lix.toFixed(1)} (maximum 55)`;
  } else if (!result.automatedChecks.hasFaqSection) {
    result.passed = false;
    result.reason = `Automated check failed: missing "## Vanlige spørsmål" section`;
  } else if (!result.automatedChecks.nettupMentions) {
    result.passed = false;
    result.reason = `Automated check failed: Nettup mentioned ${nettupCount} times (maximum 2)`;
  } else if (!result.automatedChecks.noH1InBody) {
    result.passed = false;
    result.reason = 'Automated check failed: article body contains an H1 heading (use H2 and below only)';
  } else if (!result.automatedChecks.geoFirstParagraph) {
    result.passed = false;
    result.reason = 'Automated check failed: first line is a heading — GEO rule requires opening with a direct answer paragraph';
  } else if (!result.automatedChecks.seoTitleFormat) {
    result.passed = false;
    result.reason = `Automated check failed: seoTitle "${article.metadata.seoTitle}" must include "| Nettup" and be ≤ 60 chars`;
  }

  if (!result.passed && result.reason) {
    await updateQueueOnRejection(article.topic, result.reason);
  }

  return result;
}

async function updateQueueOnRejection(topic: QueueEntry, reason: string): Promise<void> {
  const queue = readQueue();
  const entry = queue.find((e) => e.slug === topic.slug);
  if (!entry) return;

  entry.attempts = (entry.attempts ?? 0) + 1;
  entry.reason = reason;

  if (entry.attempts >= RETRY_LIMIT) {
    entry.status = 'permanently_rejected';
  } else {
    entry.status = 'rejected';
  }

  writeQueue(queue);
}
