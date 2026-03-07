import type { ImageMetadata } from 'astro';
import iGiveImage from '@/assets/images/igive-hero.png';
import blomImage from '@/assets/images/blom-hero.png';

export interface Project {
  id: string;
  slug: string;
  name: string;
  category: string;
  type: string;
  tagline: string;
  description: string;
  image: ImageMetadata;
  imageAlt: string;
  url?: string;
  comingSoon?: boolean;
  techStack: string[];
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  testimonialId?: string;
  metrics?: {
    performance?: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
  };
  gallery?: { src: ImageMetadata; alt: string }[];
  // Case study content fields — populated in Phase 22
  challenge?: string;
  solution?: string;
  features?: string[];
  photoUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'igive',
    slug: 'igive',
    name: 'iGive',
    category: 'B2B',
    type: 'Gavekort-plattform',
    tagline: 'Profesjonell salgsside for Norges ledende gavekortplattform',
    description:
      'En dedikert salgsside som hjelper Norges ledende gavekortplattform med å nå bedriftskunder.',
    image: iGiveImage,
    imageAlt: 'Skjermbilde av salg.igive.no',
    url: 'https://salg.igive.no',
    techStack: ['Astro', 'Tailwind CSS', 'Vercel'],
    publishedAt: '2024-01-01',
    metaTitle: 'iGive – Gavekortplattform for bedrifter | Nettup',
    metaDescription:
      'Nettup bygget en dedikert salgsside for iGive som hjelper bedrifter med å tilby gavekort. Rask, tydelig og synlig i Google.',
    metrics: { performance: 96, accessibility: 96, bestPractices: 100, seo: 100 },
    challenge:
      'iGive hadde en nettbutikk for privatpersoner som ville kjøpe gavekort, men manglet en måte å nå bedrifter på. De trengte et sted hvor de kunne forklare sine tre ulike gavekortløsninger - digitale kort, QR-kort og fysiske plastkort - på en enkel og overbevisende måte.',
    solution:
      'Vi bygde en egen salgsside rettet mot bedrifter. Siden presenterer de tre produktene tydelig, viser konkrete fordeler som økt salg og full kontroll, og gjør det enkelt for interesserte bedrifter å ta kontakt. Alt på under ett sekund.',
    features: [
      'Tydelig produktpresentasjon',
      'Lynrask lasting',
      'Enkel vei til kontakt',
      'Fungerer på alle enheter',
      'Synlig i Google',
      'Profesjonelt design',
    ],
  },
  {
    id: 'blom-company',
    slug: 'blom-company',
    name: 'Blom Company',
    category: 'B2C',
    type: 'Nettbutikk',
    tagline: 'Eksklusiv nettbutikk for livsstil og golfklær',
    description:
      'En eksklusiv nettbutikk for et norsk livsstils- og golfklesmerke. Bygget med Next.js 15, Shopify og Sanity for rask og fleksibel e-handel.',
    image: blomImage,
    imageAlt: 'Skjermbilde av Blom Company nettbutikk',
    url: 'https://blom-no.vercel.app',
    techStack: ['Next.js 15', 'Shopify', 'Sanity', 'Tailwind CSS 4', 'Vercel'],
    publishedAt: '2024-01-01',
    metaTitle: 'Blom Company – Nettbutikk for livsstil og golfklær | Nettup',
    metaDescription:
      'Nettup bygget en eksklusiv nettbutikk for Blom Company med Next.js 15, Shopify og Sanity. Rask, visuell og klar for vekst.',
    metrics: { performance: 99, accessibility: 96, bestPractices: 100, seo: 100 },
  },
];
