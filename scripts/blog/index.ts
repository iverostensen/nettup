import fs from 'node:fs';
import { selectTopic, readQueue, writeQueue } from './discover-topics.ts';
import { generateArticle } from './generate-article.ts';
import { runQualityGate } from './quality-gate.ts';
import { reviseArticle } from './revise-article.ts';
import { publishArticle } from './publish.ts';
import { RETRY_LIMIT } from './config.ts';

const MAX_REVISIONS = 2;

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

  // Stage 3: Quality gate (with revision loop)
  log('Quality', 'Running quality gate...');
  let quality;
  let revisionCount = 0;

  try {
    quality = await runQualityGate(article, { skipQueueUpdate: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log('Quality', `Quality gate error: ${message}`);
    writeJobSummary(`## Pipeline: Quality Gate Error\n\n${message}`);
    return;
  }

  log('Quality', `Pass 1 AI review: ${quality.aiAverage.toFixed(1)}/10 average`);

  // Revision loop: attempt targeted fixes before giving up
  while (!quality.passed && revisionCount < MAX_REVISIONS) {
    revisionCount++;
    log('Revise', `Revision ${revisionCount}/${MAX_REVISIONS}: ${quality.reason}`);

    try {
      article = await reviseArticle(article, quality);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log('Revise', `Revision failed: ${message}`);
      writeJobSummary(`## Pipeline: Revision Failed\n\n${message}`);
      return;
    }

    try {
      quality = await runQualityGate(article, { skipQueueUpdate: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log('Quality', `Quality gate error after revision: ${message}`);
      writeJobSummary(`## Pipeline: Quality Gate Error\n\n${message}`);
      return;
    }

    log('Quality', `Revision ${revisionCount} result: ${quality.aiAverage.toFixed(1)}/10 — ${quality.passed ? 'passed' : 'failed'}`);
  }

  // Final rejection: update queue once here (all quality gate calls used skipQueueUpdate: true)
  if (!quality.passed) {
    const queue = readQueue();
    const entry = queue.find((e) => e.slug === topic.slug);
    if (entry) {
      entry.attempts = (entry.attempts ?? 0) + 1;
      entry.reason = quality.reason;
      entry.status = entry.attempts >= RETRY_LIMIT ? 'permanently_rejected' : 'rejected';
      writeQueue(queue);
    }

    const revisionNote = revisionCount > 0 ? ` after ${revisionCount} revision(s)` : '';
    log('Quality', `Rejected${revisionNote} — ${quality.reason}`);
    writeJobSummary(
      `## Pipeline: Article Rejected\n\n**Reason:** ${quality.reason}\n\n` +
      `**Revisions attempted:** ${revisionCount}\n\n` +
      `**AI average:** ${quality.aiAverage.toFixed(1)}/10`
    );
    return;
  }

  const passNote = revisionCount > 0 ? ` (after ${revisionCount} revision(s))` : '';
  log('Quality', `All checks passed${passNote}`);

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
  writeJobSummary(
    `## Pipeline: Success\n\n**PR:** ${prUrl}\n\n` +
    `**AI average:** ${quality.aiAverage.toFixed(1)}/10\n\n` +
    `**Words:** ${wordCount}\n\n` +
    `**Revisions:** ${revisionCount}`
  );
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
