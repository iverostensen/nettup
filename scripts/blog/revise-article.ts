import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_MODEL } from './config.ts';
import {
  type ArticleResult,
  buildFrontmatter,
  extractMetadata,
} from './generate-article.ts';
import type { QualityResult } from './quality-gate.ts';
import { readExistingSlugs } from './discover-topics.ts';

const REVISION_SYSTEM_PROMPT = `Du er en streng redaktør. Du får en artikkel som ikke bestod kvalitetssjekken, og en liste over hva som feilet. Din oppgave er å fikse nøyaktig de problemene som er listet — ikke omskriv artikkelen. Behold struktur, tone og innhold der det fungerer.

Viktige regler som alltid gjelder:
- Skriv på norsk bokmål
- Bruk ALDRI tankestrek (—). Bruk bindestrek (-) eller skriv om setningen.
- Nevn Nettup naturlig maksimalt 2 ganger
- FØRSTE avsnitt skal besvare spørsmålet direkte i 1-2 setninger (ingen heading som første linje)
- Artikkelen skal inneholde en "## Vanlige spørsmål"-seksjon med 3-5 spørsmål

Returner kun den reviderte artikkelen i Markdown. Ingen forklaring, ingen kommentar.`;

function buildRevisionContext(quality: QualityResult): string {
  const lines: string[] = ['Artikkelen feilet på følgende punkter:'];

  const weakCriteria = Object.entries(quality.aiScores)
    .filter(([, score]) => score < 7)
    .map(([criterion, score]) => `- ${criterion}: ${score}/10 (krav: minimum 7/10)`);

  if (weakCriteria.length > 0) {
    lines.push('\nAI-vurdering — kriterier under grensen:');
    lines.push(...weakCriteria);
  }

  const checkLabels: Record<string, string> = {
    wordCount: 'Ordantall (minimum 1400 ord)',
    lixScore: 'LIX-score (maksimum 55 — forkort setninger og ord)',
    hasFaqSection: 'Mangler "## Vanlige spørsmål"-seksjon',
    nettupMentions: 'For mange Nettup-nevnelser (maksimum 2)',
    noH1InBody: 'Artikkelen inneholder en H1-overskrift (bruk kun H2 og lavere)',
    geoFirstParagraph: 'Første linje er en overskrift — åpne med et svar-avsnitt i stedet',
    seoTitleFormat: 'seoTitle mangler "| Nettup" eller er over 60 tegn',
  };

  const failedChecks = Object.entries(quality.automatedChecks)
    .filter(([, passed]) => !passed)
    .map(([check]) => `- ${checkLabels[check] ?? check}`);

  if (failedChecks.length > 0) {
    lines.push('\nAutomatiserte sjekker som feilet:');
    lines.push(...failedChecks);
  }

  if (quality.reason) {
    lines.push(`\nHovedgrunn: ${quality.reason}`);
  }

  return lines.join('\n');
}

export async function reviseArticle(
  article: ArticleResult,
  quality: QualityResult
): Promise<ArticleResult> {
  const client = new Anthropic();
  const existingSlugs = readExistingSlugs();

  const revisionContext = buildRevisionContext(quality);

  const userMessage = `${revisionContext}

---

Revider artikkelen nedenfor og rett opp disse problemene:

${article.markdownBody}`;

  // Call 1: Revise article body
  const revisionResponse = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 8096,
    system: REVISION_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const revisedBody = revisionResponse.content[0].type === 'text'
    ? revisionResponse.content[0].text
    : article.markdownBody;

  // Call 2: Re-extract metadata from revised body
  const metadata = await extractMetadata(revisedBody, existingSlugs);

  const frontmatter = buildFrontmatter(article.slug, metadata);
  const fullContent = frontmatter + '\n\n' + revisedBody;

  return {
    topic: article.topic,
    slug: article.slug,
    markdownBody: revisedBody,
    metadata,
    frontmatter,
    fullContent,
  };
}
