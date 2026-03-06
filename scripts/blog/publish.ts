import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'node:fs/promises';
import { simpleGit } from 'simple-git';
import { Octokit } from '@octokit/rest';
import type { ArticleResult } from './generate-article.ts';
import type { QualityResult } from './quality-gate.ts';
import { buildPrBody } from './optimize-seo.ts';

const repoRoot = path.resolve(fileURLToPath(import.meta.url), '../../../');

async function resolveRepoIdentifier(): Promise<string> {
  if (process.env.GITHUB_REPOSITORY) {
    return process.env.GITHUB_REPOSITORY;
  }

  // Derive from git remote URL
  const git = simpleGit(repoRoot);
  const remoteUrl = await git.remote(['get-url', 'origin']);
  const url = (remoteUrl ?? '').trim();

  // Match SSH: git@github.com:owner/repo.git
  const sshMatch = url.match(/github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/);
  if (sshMatch) return sshMatch[1];

  // Match HTTPS: https://github.com/owner/repo.git
  const httpsMatch = url.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?$/);
  if (httpsMatch) return httpsMatch[1];

  throw new Error(`Cannot derive owner/repo from remote URL: ${url}`);
}

export async function publishArticle(article: ArticleResult, quality: QualityResult): Promise<string> {
  const git = simpleGit(repoRoot);
  const branchName = 'blogg/' + article.slug;

  // 1. Create and checkout branch
  await git.checkoutLocalBranch(branchName);

  // 2. Write article file
  const articlePath = path.join(repoRoot, 'src/content/blogg', article.slug + '.md');
  await fs.writeFile(articlePath, article.fullContent, 'utf8');

  // 3. Stage file
  await git.add('src/content/blogg/' + article.slug + '.md');

  // 4. Commit
  await git.commit('feat(blogg): ' + article.metadata.title);

  // 5. Push
  await git.push('origin', branchName);

  // 6. Create GitHub PR
  const repoIdentifier = await resolveRepoIdentifier();
  const [owner, repo] = repoIdentifier.split('/');

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const { data } = await octokit.pulls.create({
    owner,
    repo,
    title: 'feat(blogg): ' + article.metadata.title,
    body: buildPrBody(article, quality),
    head: branchName,
    base: 'main',
  });

  return data.html_url;
}
