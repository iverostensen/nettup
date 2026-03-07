import type { ImageMetadata } from 'astro';
import iGiveImage from '@/assets/images/igive-hero.png';

export interface Project {
  id: string;
  name: string;
  category: string;
  type: string;
  tagline: string;
  description: string;
  image: ImageMetadata;
  imageAlt: string;
  url?: string;
  caseStudySection?: boolean;
  comingSoon?: boolean;
  // Case study fields (required when caseStudySection: true)
  challenge?: string;
  solution?: string;
  features?: string[];
  photoUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'igive',
    name: 'iGive',
    category: 'B2B',
    type: 'Gavekort-plattform',
    tagline: 'Profesjonell salgsside for Norges ledende gavekortplattform',
    description:
      'En dedikert salgsside som hjelper Norges ledende gavekortplattform med å nå bedriftskunder.',
    image: iGiveImage,
    imageAlt: 'Skjermbilde av salg.igive.no',
    url: 'https://salg.igive.no',
    caseStudySection: true,
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
  // Add future projects here — they will appear as project cards automatically
];
