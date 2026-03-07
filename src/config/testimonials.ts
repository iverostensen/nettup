export interface Testimonial {
  quote: string; // 1-2 sentence testimonial text
  result: string; // concrete outcome, e.g., "Vi fikk tre nye kundehenvendelser..."
  name: string;
  title: string;
  company: string;
  photoUrl?: string; // optional — swap for real photo without markup changes
}

export const testimonials: Testimonial[] = [
  {
    quote: "Vi hadde et godt produkt for bedrifter, men ingen god måte å presentere det på nett. Nå sender vi bare linken til bedrifter som er nysgjerrige, siden forklarer resten.",
    result: "Bedriftskunder finner oss nå via Google, siden forklarer produktene våre tydelig og konverterer til salg",
    name: "Stein Eriksen",
    title: "Daglig leder",
    company: "iGive",
    photoUrl: "/images/stein_eriksen_profile_picture.jpg",
  },
  {
    quote: 'Vi trengte noen som forsto at vi ikke er én butikk, men to kolleksjoner med ulik stil og kundegruppe. Nettup leverte en løsning som holder begge separate og tydelige, uten at det føles fragmentert.',
    result: 'Nettbutikken håndterer begge kolleksjonene sømløst og gir oss full kontroll over innholdet via Sanity',
    name: 'Placeholder',
    title: 'Daglig leder',
    company: 'Blom Company',
  },
];
