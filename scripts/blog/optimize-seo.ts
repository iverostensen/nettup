import type { ArticleResult } from './generate-article.ts';
import type { QualityResult } from './quality-gate.ts';

export function buildPrBody(article: ArticleResult, quality: QualityResult): string {
  const passEmoji = (check: boolean) => (check ? '✅' : '❌');

  const aiScoresRows = Object.entries(quality.aiScores)
    .map(([criterion, score]) => `| ${criterion} | ${score}/10 |`)
    .join('\n');

  const wordCount = article.markdownBody.split(/\s+/).filter((w) => w.trim().length > 0).length;

  const lixValue = computeLix(article.markdownBody);

  return `## ${article.metadata.title}

**Cluster:** ${article.topic.cluster}
**Kategori:** ${article.metadata.category}
**Slug:** \`${article.slug}\`

---

### AI-vurdering (Pass 1)

| Kriterium | Score |
|-----------|-------|
${aiScoresRows}
| **Snitt** | **${quality.aiAverage.toFixed(1)}/10** |

---

### Automatiserte sjekker (Pass 2)

| Sjekk | Resultat |
|-------|----------|
| Ordantall (>= 1400) | ${passEmoji(quality.automatedChecks.wordCount)} ${wordCount} ord |
| LIX-score (<= 55) | ${passEmoji(quality.automatedChecks.lixScore)} ${lixValue.toFixed(1)} |
| FAQ-seksjon | ${passEmoji(quality.automatedChecks.hasFaqSection)} |
| Nettup-nevnelser (<= 2) | ${passEmoji(quality.automatedChecks.nettupMentions)} |

---

*Generert automatisk av blogg-pipeline*`;
}

function computeLix(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.trim().length > 0);
  const longWords = words.filter((w) => w.replace(/[^a-zA-ZæøåÆØÅ]/g, '').length > 6);
  if (sentences.length === 0 || words.length === 0) return 0;
  return (words.length / sentences.length) + (longWords.length * 100 / words.length);
}
