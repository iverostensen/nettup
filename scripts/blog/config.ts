export const CLAUDE_MODEL = 'claude-sonnet-4-6';

export const RETRY_LIMIT = 3;

export interface QueueEntry {
  slug: string;
  title: string;
  cluster: string;
  status: 'pending' | 'published' | 'rejected' | 'permanently_rejected';
  reason?: string;
  previousFailureReason?: string;
  attempts: number;
  createdAt: string;
}

export interface ClusterConfig {
  name: string;
  keywords: string[];
  intent: 'informational' | 'commercial' | 'comparison';
  articles_target: number;
}

export const CLUSTERS: ClusterConfig[] = [
  { name: 'Priser og kostnader', keywords: ['hva koster nettside', 'webdesign pris', 'billig nettside'], intent: 'commercial', articles_target: 5 },
  { name: 'Teknologi-valg', keywords: ['wordpress vs astro', 'beste cms 2026', 'react nettside'], intent: 'informational', articles_target: 4 },
  { name: 'SMB-tips', keywords: ['trenger bedrift nettside', 'nettside tips', 'konvertere kunder'], intent: 'informational', articles_target: 5 },
  { name: 'Lokal SEO', keywords: ['seo oslo', 'google bedrift', 'lokal synlighet'], intent: 'informational', articles_target: 3 },
];

export const SERVICE_PAGES = [
  { title: 'Nettsidepakker og priser', url: '/tjenester' },
  { title: 'Nettside for bedrift', url: '/nettside-for-bedrift' },
  { title: 'Priskalkulator', url: '/priskalkulator' },
  { title: 'Ta kontakt', url: '/kontakt' },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ArticleMetadata {
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  readTime: number;
  relatedSlugs: string[];
  faq: FaqItem[];
}

export function norwegianSlugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
