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
];
