import type { ImageMetadata } from 'astro';
import iGiveImage from '@/assets/images/igive-hero.png';
import blomImage from '@/assets/images/blom-hero.png';
import iGiveFeaturesImage from '@/assets/images/igive-features.png';
import blomFeaturesImage from '@/assets/images/blom-features.png';

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
  featuresImage?: { src: ImageMetadata; alt: string };
  summary?: string; // GEO-optimized opening paragraph, ≤200 words, self-contained
  testimonial?: {
    quote: string;
    result: string;
    name: string;
    title: string;
    company: string;
    photoUrl?: string;
  };
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
    featuresImage: { src: iGiveFeaturesImage, alt: 'Skjermbilde av iGive-plattformens funksjoner og produktoversikt' },
    summary: 'iGive er Norges ledende gavekortplattform for bedrifter, med løsninger for digitale gavekort, QR-kort og fysiske plastkort. Nettup bygget en dedikert salgsside — salg.igive.no — som hjelper iGive med å nå bedriftskunder direkte. Siden lastes inn på under ett sekund og scorer 96/100 på Google PageSpeed for Performance og Accessibility, med perfekte 100/100 på Best Practices og SEO. Bygget med Astro og Tailwind CSS, driftet på Vercel.',
    testimonial: {
      quote: 'Vi hadde et godt produkt for bedrifter, men ingen god måte å presentere det på nett. Nå sender vi bare linken til bedrifter som er nysgjerrige, siden forklarer resten.',
      result: 'Bedriftskunder finner oss nå via Google, siden forklarer produktene våre tydelig og konverterer til salg',
      name: 'Stein Eriksen',
      title: 'Daglig leder',
      company: 'iGive',
      photoUrl: '/images/stein_eriksen_profile_picture.jpg',
    },
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
    challenge: 'Blom Company er et norsk klesmerke med to distinkte kolleksjoner — livsstil og golf. De trengte en nettbutikk som kunne presentere begge kolleksjonene med en tydelig visuell identitet, integrere sømløst med Shopify for betalingsbehandling og lagerstyring, og levere en shoppingopplevelse som matcher merkevaren deres.',
    solution: 'Vi bygde en nettbutikk med Next.js 15 og Shopify som ryggrad, og Sanity CMS for innholdsstyring. Løsningen støtter to separate kolleksjoner — livsstil og golf — under én merkevare, med kolleksjonsfiltrering og produktsider som fremhever materialkvalitet og design. Sanity gir Blom Company full kontroll over innhold uten å måtte røre kode.',
    features: [
      'Dual-kolleksjon arkitektur (livsstil + golf)',
      'Shopify integrasjon for handel',
      'Sanity CMS for innholdsstyring',
      'Høyytelses Next.js 15 frontend',
      'Mobiloptimalisert shoppingopplevelse',
      'Fleksibelt produktkatalog-system',
    ],
    featuresImage: { src: blomFeaturesImage, alt: 'Skjermbilde av Blom Company nettbutikk med produktkolleksjon' },
    summary: 'Blom Company er et norsk klesmerke med to distinkte kolleksjoner — livsstil og golf. Nettup bygget en moderne nettbutikk som presenterer begge kolleksjonene under én merkevare, med Shopify for handel og Sanity CMS for full innholdskontroll. Nettbutikken scorer 99/100 på Google PageSpeed (Performance) med Accessibility, Best Practices og SEO alle på 100/100. Bygget med Next.js 15, Tailwind CSS 4 og driftet på Vercel.',
    testimonial: {
      quote: 'Vi trengte noen som forsto at vi ikke er én butikk, men to kolleksjoner med ulik stil og kundegruppe. Nettup leverte en løsning som holder begge separate og tydelige, uten at det føles fragmentert.',
      result: 'Nettbutikken håndterer begge kolleksjonene sømløst og gir oss full kontroll over innholdet via Sanity',
      name: 'Placeholder',
      title: 'Daglig leder',
      company: 'Blom Company',
    },
  },
];
