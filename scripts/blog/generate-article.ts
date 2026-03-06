import Anthropic from '@anthropic-ai/sdk';
import {
  CLAUDE_MODEL,
  SERVICE_PAGES,
  type ArticleMetadata,
  type QueueEntry,
} from './config.ts';
import { readExistingSlugs } from './discover-topics.ts';

export interface ArticleResult {
  topic: QueueEntry;
  slug: string;
  markdownBody: string;
  metadata: ArticleMetadata;
  frontmatter: string;
  fullContent: string;
}

const BODY_SYSTEM_PROMPT = `Du er en erfaren norsk webutvikler og markedsfører som skriver for Nettup-bloggen.

Regler:
- Skriv på norsk bokmål, profesjonelt men tilgjengelig
- Målgruppe: norske SMB-eiere uten teknisk bakgrunn
- Lengde: 1500-2500 ord
- Struktur: H2 hvert 150-200 ord, korte avsnitt
- Inkluder konkrete tall, eksempler, sammenligninger
- Nevn Nettup naturlig maksimalt 2 ganger (ikke mer, ikke spammy)
- Avslutt med en naturlig CTA (ikke aggressiv)
- Svar på ÉTT spesifikt spørsmål fullstendig
- Skriv som en ekspert som deler kunnskap, ikke som en selger

GEO-regler (generative engine optimization):
- FØRSTE avsnitt skal besvare spørsmålet direkte i 1-2 setninger — ingen oppbygging,
  ingen kontekst først. AI-søkemotorer (ChatGPT, Perplexity) siterer dette avsnittet.
- Inkluder alltid en "## Vanlige spørsmål"-seksjon med 3-5 spørsmål og svar på slutten.
  Dette er obligatorisk, ikke valgfritt. Svar direkte og konsist i hvert FAQ-svar.
- Skriv korte, faktabaserte setninger som kan siteres standalone (unngå lange bi-setninger).

Intern lenking:
- Lenk naturlig til 1-2 av de oppgitte tjenestesidene der det er relevant.
- Lenk naturlig til 1-2 relaterte artikler fra den oppgitte listen der det er relevant.
  Format: [artikkeltittel](/blogg/slug)
- Ikke tving lenkene inn — bare bruk dem der de passer organisk.

Output-format: Kun Markdown (ingen JSON, ingen forklaring). Start direkte med innholdet.`;

const METADATA_SYSTEM_PROMPT = `Du er et presist JSON-ekstraksjonssystem. Returner BARE gyldig JSON, ingen forklaring.
Feltene: title (konversasjonell H1), seoTitle (keyword-først, maks 60 tegn, inkluder "| Nettup"),
description (150-160 tegn), category (én av: Priser, Teknologi, SMB-tips, Lokal SEO),
readTime (estimert lesetid i minutter, heltall), relatedSlugs (2-3 slugs fra listen som passer, eller []),
faq (array av {question, answer} — kopier fra ## Vanlige spørsmål-seksjonen i artikkelen).`;

export function buildFrontmatter(slug: string, metadata: ArticleMetadata): string {
  const today = new Date().toISOString().split('T')[0];

  const lines: string[] = [
    '---',
    `title: ${JSON.stringify(metadata.title)}`,
    `seoTitle: ${JSON.stringify(metadata.seoTitle)}`,
    `category: ${JSON.stringify(metadata.category)}`,
    `date: ${today}`,
    `readTime: ${metadata.readTime}`,
    `description: ${JSON.stringify(metadata.description)}`,
  ];

  if (metadata.relatedSlugs && metadata.relatedSlugs.length > 0) {
    lines.push('relatedSlugs:');
    for (const s of metadata.relatedSlugs) {
      lines.push(`  - ${s}`);
    }
  }

  if (metadata.faq && metadata.faq.length > 0) {
    lines.push('faq:');
    for (const item of metadata.faq) {
      lines.push(`  - question: ${JSON.stringify(item.question)}`);
      lines.push(`    answer: ${JSON.stringify(item.answer)}`);
    }
  }

  lines.push('---');
  return lines.join('\n');
}

export async function generateArticle(topic: QueueEntry): Promise<ArticleResult> {
  const client = new Anthropic();
  const existingSlugs = readExistingSlugs();

  // Build service pages list for prompt
  const servicePagesText = SERVICE_PAGES.map((p) => `- [${p.title}](${p.url})`).join('\n');
  const existingSlugsText = existingSlugs.length > 0
    ? existingSlugs.join('\n')
    : '(ingen eksisterende artikler ennå)';

  let bodyUserMessage = `Skriv en artikkel om: "${topic.title}"
Cluster: ${topic.cluster}

Tjenestesider for intern lenking:
${servicePagesText}

Eksisterende artikler for intern lenking (bruk slug-format /blogg/slug):
${existingSlugsText}`;

  if (topic.previousFailureReason) {
    bodyUserMessage += `\n\nOBS: Forrige forsøk ble avvist fordi: ${topic.previousFailureReason}. Unngå dette problemet.`;
  }

  // Call 1: Generate article body
  const bodyResponse = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: BODY_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: bodyUserMessage }],
  });

  const markdownBody = bodyResponse.content[0].type === 'text'
    ? bodyResponse.content[0].text
    : '';

  // Call 2: Extract metadata from body
  const metadataUserMessage = `Basert på denne artikkelen, returner JSON:

${markdownBody}

Tilgjengelige relaterte slug-er for relatedSlugs-feltet:
${existingSlugsText}`;

  const metadataResponse = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: METADATA_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: metadataUserMessage }],
  });

  const metadataText = metadataResponse.content[0].type === 'text'
    ? metadataResponse.content[0].text
    : '';

  // Parse metadata JSON
  let metadata: ArticleMetadata;
  try {
    const cleaned = metadataText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    metadata = JSON.parse(cleaned) as ArticleMetadata;
  } catch {
    throw new Error(`Failed to parse metadata JSON. Raw response:\n${metadataText}`);
  }

  // Filter relatedSlugs to only include slugs that actually exist
  metadata.relatedSlugs = (metadata.relatedSlugs ?? []).filter((s) =>
    existingSlugs.includes(s)
  );

  const frontmatter = buildFrontmatter(topic.slug, metadata);
  const fullContent = frontmatter + '\n\n' + markdownBody;

  return {
    topic,
    slug: topic.slug,
    markdownBody,
    metadata,
    frontmatter,
    fullContent,
  };
}
