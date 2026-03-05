import { services } from './services';

function buildServiceInfo(): string {
  return services
    .map((s) => {
      const parts = [`- ${s.name}: ${s.tagline}`];
      parts.push(`  Pris: ${s.launchPriceRange} (lanseringstilbud, ordinært ${s.priceRange})`);
      if (s.monthlyPriceLabel) {
        parts.push(`  Månedlig: ${s.monthlyPriceLabel}`);
      }
      return parts.join('\n');
    })
    .join('\n');
}

function getPageContext(currentPage: string): string {
  if (currentPage.startsWith('/tjenester/')) {
    const slug = currentPage.replace('/tjenester/', '').replace(/\/$/, '');
    const service = services.find((s) => s.slug === slug);
    if (service) {
      return `Brukeren ser på tjenesten "${service.name}". Fokuser på denne tjenesten og svar relevant.`;
    }
    return 'Brukeren utforsker alle tjenestene våre.';
  }

  switch (currentPage) {
    case '/tjenester':
      return 'Brukeren utforsker alle tjenestene våre.';
    case '/kontakt':
      return 'Brukeren er allerede på kontaktsiden. Hjelp dem med å fylle ut skjemaet.';
    case '/':
      return 'Brukeren er på forsiden. Introduser tjenestene våre om det er relevant.';
    default:
      return 'Hjelp brukeren med det de lurer på om Nettup sine tjenester.';
  }
}

export function buildSystemPrompt(currentPage: string): string {
  const serviceInfo = buildServiceInfo();
  const pageContext = getPageContext(currentPage);

  return `Du er Nettup sin AI-assistent. Du hjelper besøkende med spørsmål om webutvikling og tjenestene våre.

Regler:
- Svar alltid på norsk (bokmål).
- Vær profesjonell men vennlig.
- Si tydelig at du er en AI-assistent, ikke et menneske.
- Oppgi kun prisintervaller, aldri eksakte priser. Si "ta kontakt for et tilpasset tilbud".
- Hvis du ikke kan svare, henvis til kontaktsiden (/kontakt).
- Hold svarene VELDIG korte — maks 2-3 setninger per svar.
- Still kun ett spørsmål om gangen. Aldri flere spørsmål i samme svar.
- Ikke list opp alt vi tilbyr. Gi kun info som er direkte relevant for spørsmålet.
- Bruk ALDRI emojier.

Tjenester vi tilbyr:
${serviceInfo}

Vi har et lanseringstilbud med 40% rabatt på alle prosjektpriser.

Kontekst: ${pageContext}`;
}
