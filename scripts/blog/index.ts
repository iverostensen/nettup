import fs from 'node:fs';
import { selectTopic, readQueue, writeQueue } from './discover-topics.ts';
import { generateArticle } from './generate-article.ts';
import { runQualityGate } from './quality-gate.ts';
import { publishArticle } from './publish.ts';

function writeJobSummary(content: string): void {
  if (process.env.GITHUB_ACTIONS && process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, content + '\n');
  }
}

function log(stage: string, msg: string): void {
  const padded = stage.padEnd(10);
  console.log(`[ ${padded}] ${msg}`);
}

async function runPipeline(): Promise<void> {
  // Validate env vars early
  if (!process.env.ANTHROPIC_API_KEY) {
    log('Error', 'ANTHROPIC_API_KEY is not set. Set it before running the pipeline.');
    writeJobSummary('## Pipeline Error\n\nANTHROPIC_API_KEY is not set.');
    return;
  }

  if (!process.env.GITHUB_TOKEN) {
    log('Warning', 'GITHUB_TOKEN is not set — PR creation will fail at Stage 5. Continuing for local test...');
  }

  // Stage 1: Select topic
  log('Topic', 'Selecting topic...');
  let topic;
  try {
    topic = await selectTopic();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log('Topic', `No topic available: ${message}`);
    writeJobSummary(`## Pipeline: No Topic\n\n${message}`);
    return;
  }
  log('Topic', `Selected: "${topic.title}" (cluster: ${topic.cluster})`);

  // Stage 2: Generate article
  log('Generate', 'Generating article...');
  let article;
  try {
    article = await generateArticle(topic);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log('Generate', `Generation failed: ${message}`);
    writeJobSummary(`## Pipeline: Generation Failed\n\n${message}`);

    // Update queue entry to rejected
    const queue = readQueue();
    const entry = queue.find((e) => e.slug === topic.slug);
    if (entry) {
      entry.status = 'rejected';
      entry.reason = message;
      writeQueue(queue);
    }
    return;
  }

  const wordCount = article.markdownBody.split(/\s+/).filter((w) => w.trim().length > 0).length;
  log('Generate', `Done — ${wordCount} words`);

  // Stage 3: Quality gate
  log('Quality', 'Running quality gate...');
  let quality;
  try {
    quality = await runQualityGate(article);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log('Quality', `Quality gate error: ${message}`);
    writeJobSummary(`## Pipeline: Quality Gate Error\n\n${message}`);
    return;
  }

  log('Quality', `Pass 1 AI review: ${quality.aiAverage.toFixed(1)}/10 average`);

  if (!quality.passed) {
    log('Quality', `Rejected — ${quality.reason}`);
    writeJobSummary(`## Pipeline: Article Rejected\n\n**Reason:** ${quality.reason}\n\n**AI average:** ${quality.aiAverage.toFixed(1)}/10`);
    return;
  }

  log('Quality', 'Pass 2 automated checks: all passed');

  // Stage 4/5: Publish (create PR)
  log('PR', 'Creating GitHub PR...');
  let prUrl;
  try {
    prUrl = await publishArticle(article, quality);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log('PR', `PR creation failed: ${message}`);
    writeJobSummary(`## Pipeline: PR Creation Failed\n\n${message}`);
    return;
  }

  log('PR', `PR opened: ${prUrl}`);
  writeJobSummary(`## Pipeline: Success\n\n**PR:** ${prUrl}\n\n**AI average:** ${quality.aiAverage.toFixed(1)}/10\n\n**Words:** ${wordCount}`);
}

async function main(): Promise<void> {
  try {
    await runPipeline();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[ Error    ] Unexpected pipeline failure:', message);
    writeJobSummary('## Pipeline Error\n\n' + message);
  }
  process.exit(0); // Always exit 0 — rejection is expected behavior, not CI failure
}

main();
