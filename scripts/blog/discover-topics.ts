import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import {
  CLUSTERS,
  CLAUDE_MODEL,
  RETRY_LIMIT,
  norwegianSlugify,
  type QueueEntry,
} from './config.ts';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_PATH = path.join(__dir, 'topics-queue.json');
const BLOGG_DIR = path.resolve(__dir, '../../src/content/blogg');

export function readQueue(): QueueEntry[] {
  if (!fs.existsSync(QUEUE_PATH)) {
    return [];
  }
  const raw = fs.readFileSync(QUEUE_PATH, 'utf8');
  return JSON.parse(raw) as QueueEntry[];
}

export function writeQueue(entries: QueueEntry[]): void {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(entries, null, 2), 'utf8');
}

export function readExistingSlugs(): string[] {
  if (!fs.existsSync(BLOGG_DIR)) {
    return [];
  }
  return fs.readdirSync(BLOGG_DIR).map((f) => f.replace(/\.md$/, ''));
}

function countPublishedFromFiles(category: string): number {
  if (!fs.existsSync(BLOGG_DIR)) return 0;
  const pattern = new RegExp(`^category:\\s*["']?${category}["']?\\s*$`, 'm');
  return fs.readdirSync(BLOGG_DIR)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => pattern.test(fs.readFileSync(path.join(BLOGG_DIR, f), 'utf8')))
    .length;
}

async function askClaudeForTopic(
  clusterName: string,
  keywords: string[],
  existingSlugs: string[],
  attempt: number
): Promise<{ title: string; slug: string }> {
  const client = new Anthropic();

  const existingList = existingSlugs.length > 0
    ? `\n\nEksisterende artikler (unngå disse emnene):\n${existingSlugs.join('\n')}`
    : '';

  const userMessage = `Cluster: ${clusterName}
Nøkkelord: ${keywords.join(', ')}${existingList}

Forsøk ${attempt + 1} av 3. Velg en spesifikk artikkelvinkling som ikke overlapper med eksisterende artikler.
Returner BARE gyldig JSON (ingen forklaring): { "title": "...", "slug": "..." }
Slug skal være på norsk, URL-vennlig (kun a-z, 0-9, bindestrek).`;

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 512,
    system: 'Du er en innholdsstrateg for en norsk webbyrå-blogg. Velg spesifikke, verdifulle artikkelemneer. Returner BARE gyldig JSON.',
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  // Strip possible markdown code fences
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const parsed = JSON.parse(cleaned) as { title: string; slug: string };
  return parsed;
}

export async function selectTopic(): Promise<QueueEntry> {
  const queue = readQueue();
  const existingSlugs = readExistingSlugs();

  // Step 3: Find retryable entry (status 'rejected', attempts < RETRY_LIMIT)
  const retryable = queue
    .filter((e) => e.status === 'rejected' && e.attempts < RETRY_LIMIT)
    .sort((a, b) => a.attempts - b.attempts)[0];

  if (retryable) {
    retryable.attempts += 1;
    retryable.status = 'pending';
    retryable.previousFailureReason = retryable.reason;
    writeQueue(queue);
    return retryable;
  }

  // Step 4: Select cluster by remaining capacity (round-robin weighted)
  const clusterWithCapacity = CLUSTERS.map((c) => ({
    cluster: c,
    remaining: c.articles_target - countPublishedFromFiles(c.category),
  }))
    .filter((c) => c.remaining > 0)
    .sort((a, b) => (b.remaining * b.cluster.priority) - (a.remaining * a.cluster.priority))[0];

  const selectedCluster = clusterWithCapacity
    ? clusterWithCapacity.cluster
    : CLUSTERS[0]; // fallback: first cluster if all targets met

  // Step 5-6: Ask Claude for a unique topic angle (up to 3 attempts)
  let newEntry: QueueEntry | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    const suggestion = await askClaudeForTopic(
      selectedCluster.name,
      selectedCluster.keywords,
      existingSlugs,
      attempt
    );

    const slug = norwegianSlugify(suggestion.slug || suggestion.title);
    const currentSlugs = readExistingSlugs();

    if (!currentSlugs.includes(slug)) {
      newEntry = {
        slug,
        title: suggestion.title,
        cluster: selectedCluster.name,
        status: 'pending',
        attempts: 0,
        createdAt: new Date().toISOString(),
      };
      break;
    }
  }

  if (!newEntry) {
    throw new Error('Could not find unique topic after 3 attempts');
  }

  // Step 7: Write to queue
  queue.push(newEntry);
  writeQueue(queue);

  return newEntry;
}
