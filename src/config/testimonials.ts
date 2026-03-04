// TODO: Replace with real client testimonials before production

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
    quote: "Nettup leverte en nettside vi er stolte av – rask, profesjonell og klar på to uker. Prosessen var enkel og de holdt det de lovet.",
    result: "Vi fikk tre nye kundehenvendelser allerede i første uke etter lansering.",
    name: "Kari Nordmann",
    title: "Daglig leder",
    company: "iGive",
  },
  {
    quote: "Vi hadde prøvd å lage nettside selv, men det ble aldri bra. Nettup fikk det til å se profesjonelt ut på rekordtid.",
    result: "Vi fikk endelig en nettside vi tør å vise til kunder.",
    name: "Ola Hansen",
    title: "Gründer",
    company: "Eksempelbedrift AS",
  },
];
