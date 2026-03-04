# Feature Research

**Domain:** Web agency service pages — Norwegian SMB market (v1.1 Tjenesteutvidelse)
**Researched:** 2026-03-04
**Confidence:** MEDIUM-HIGH (based on codebase analysis of existing patterns + domain knowledge of agency service page conversion; web research tools unavailable, findings reflect training data through early 2025 and the established `/nettside-for-bedrift` page as ground truth)

---

## Context: This Milestone

v1.1 replaces the current `/tjenester` generic 3-tier pricing page with a dedicated subpage per service type. The target buyer is a Norwegian SMB owner — typically non-technical, results-oriented, price-sensitive, and skeptical of agency jargon. The `/nettside-for-bedrift` landing page already exists as a working template for high-converting service pages and should be the primary reference architecture.

**Existing validated pattern (from `/nettside-for-bedrift`):**
```
Hero (outcome headline + price signal + trust badges)
  → VisualProof (screenshots, metrics)
  → LogoCloud (clients)
  → Testimonial (single quote, real name/company)
  → WhyUs (differentiators as benefit-first list)
  → PricingSummary (3 tiers, guarantee banner)
  → FAQ (objection handling with JSON-LD schema)
  → FormSection (embedded form, no redirect)
```

This structure is the table stakes starting point for each new service page, with adjustments per service type.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features an SMB buyer expects on any agency service page. Missing these causes immediate bounce or loss of trust.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Outcome-focused headline** | SMB buyers do not care about technology. They care about "more customers," "professional image," or "sell online." Headline must state the business outcome, not the technical deliverable. | LOW | Pattern exists in `/nettside-for-bedrift`: "Profesjonell nettside for din bedrift" (outcome) not "Vi bruker Astro og React" (tech) |
| **Price signal above the fold** | Norwegian SMBs are price-conscious and will leave immediately if they can't gauge affordability. "Fra X kr" in or near the hero prevents the most common exit reason. | LOW | Validated in `/nettside-for-bedrift` hero: price displayed prominently with original/offer comparison |
| **What's included list** | Buyers need to understand scope before contacting. Without this, they fear hidden costs or misaligned expectations. | LOW | Already in Inkludert section on `/tjenester`. Each service page needs service-specific version. |
| **Price range with scope explanation** | Single prices feel arbitrary. Ranges ("fra 15 000 – 80 000 kr") with clear scope descriptions ("avhenger av antall produkter og integrasjoner") set expectations and prevent sticker shock after contact. | LOW | Not yet implemented for service pages. The PROJECT.md explicitly calls this out as required. |
| **FAQ section** | Every service has predictable objections. "Kan jeg redigere selv?", "Hva skjer om dere slutter?", "Eier jeg innholdet?" — answering these removes friction before the contact form. JSON-LD schema adds SEO value. | LOW | Pattern exists in both `/tjenester` and `/nettside-for-bedrift`. Each service needs service-specific questions. |
| **CTA to contact form with pre-fill** | After reading a service page, the visitor must be able to express interest with one click. The existing `?tjeneste=` pre-fill pattern removes form friction. | LOW | Pattern exists (`?pakke=` param). Extend to `?tjeneste=nettbutikk` etc. |
| **Trust signals** | For high-ticket services (webapps, AI integrations) especially, trust must be established before the price is revealed. Badges like "30 dagers garanti," "Norsk support," "24t responstid" reduce perceived risk. | LOW | All trust signals already exist as components. Apply per service page. |
| **Process overview (3-step)** | SMBs fear a complex, opaque process. Showing "Samtale → Design & utvikling → Lansering" as 3 clear steps removes the fear of getting started. | LOW | Exists in `/nettside-for-bedrift` WhyUs section. Reusable. |
| **Social proof near CTA** | A testimonial or metric placed directly before or after the CTA reduces last-second hesitation. The iGive testimonial is the only available proof point currently. | LOW | Component exists. Use strategically on each page, especially where the service is relevant to iGive's category. |
| **Mobile-first layout** | Over 60% of Norwegian web traffic is mobile. Service pages with complex layouts break at 375px. | LOW | Already the project default. Verify each new page at 375px. |
| **Service JSON-LD schema** | Each service page needs `@type: "Service"` structured data for Google. Helps rank for "[tjeneste] webbyrå" queries. | LOW | Pattern exists in `/tjenester/index.astro`. Each subpage needs its own schema instance. |

### Differentiators (Competitive Advantage)

Features that go beyond what generic agency sites do, specific to Nettup's positioning and this milestone.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Service-specific outcome metrics** | Generic: "Vi lager nettsider." Specific: "Nettbutikker vi bygger konverterer i snitt 2.3% av besøkende." Per-service metrics make claims verifiable and build credibility beyond competitors. | MEDIUM | Only meaningful with real data. Start with the metrics we have (Lighthouse scores). For Shopify/AI pages, use category benchmarks as context. |
| **"Passer for deg hvis" qualifier** | Helping buyers self-qualify reduces bad-fit leads and builds trust with good-fit buyers. "Passer for deg hvis du har 20-500 produkter og vil selge på nett uten teknisk kunnskap" creates an implicit recommendation. | LOW | No existing implementation. Very easy to add as a styled text block. High conversion impact. |
| **Scope explanation with price range** | "Fra 15 000 kr for enkel butikk med inntil 50 produkter. Opp til 80 000 kr for full Shopify-integrasjon med POS, lager og markedsautomatisering." This pattern is more honest than "ta kontakt for pris" and converts significantly better with SMBs. | LOW | The PROJECT.md explicitly requires this. Implementation is content + display component. |
| **Shopify Partner badge/callout** | If Nettup is or becomes a Shopify Partner, this credential instantly establishes authority for the nettbutikk page. Non-technical buyers recognize the Shopify brand. | LOW | Unknown if Nettup is a Shopify Partner. Verify. If not, frame as "Shopify-spesialister" with completed projects as proof. |
| **"Hva er forskjellen mellom X og Y" comparison** | SMBs frequently confuse adjacent services (webapp vs nettside, SEO vs landingsside). A simple comparison table or explanation reduces contact form friction and pre-qualifies. | LOW | Not currently implemented anywhere. Useful on nettside, webapp, and landingsside pages especially. |
| **Delivery timeline as social proof** | "Klar på 4–8 uker" is not just information — it's a differentiator versus agencies that take 6-12 months. Displaying it prominently on service pages reinforces the speed positioning. | LOW | Exists in `/nettside-for-bedrift` hero. Apply per service with realistic, service-specific timelines. |
| **Real results from delivered projects** | Linking to `/prosjekter` from service pages creates a credibility loop: service page makes a claim, portfolio page proves it. Currently underutilized. | LOW | iGive case study is available. Expand the prosjekter page with service-specific filtering or tagging eventually. |
| **"Inkludert uten ekstra kostnad" section** | Norwegian SMBs have been burned by agencies with hidden costs (domain, SSL, hosting billed separately). Explicitly listing what's included (and what isn't) differentiates on transparency. | LOW | Exists in `/tjenester` as `Inkludert` section. Each service page needs a version specific to that service's common gotchas. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Exact fixed prices on complex services** | Clients want certainty. "Just tell me the price." | Webapps and AI integrations vary 10x in scope. Fixed prices either scare away with overprice or trap Nettup in underpriced contracts. | Use "fra X kr" + scope explanation. Offer free consultation to determine exact price. |
| **Feature comparison table vs competitors** | Seems like a differentiator. | Creates legal risk, requires constant maintenance, and usually backfires when competitors update their offering. | Focus on benefits of choosing Nettup, not weaknesses of competitors. |
| **Tech stack listed prominently** | Developers care. Developers read agency sites. | SMB buyers don't care and may be confused by "Astro, React, TypeScript" jargon. It can also feel like "we're learning on your project." | Show outcomes, mention tech as a trust signal in FAQ ("Vi bruker moderne teknologi som laster lynraskt") not as the headline. |
| **Per-page live chat widget** | Seems like instant conversion opportunity. | Requires real-time staffing. Unanswered chat messages actively hurt trust more than no chat at all. | Keep the "24t responstid" promise and contact form. That's the right commitment level for a small agency. |
| **Before/after slider on nettside pages** | Visually appealing. Shows transformation. | Requires real before/after pairs from clients who agree to show their old site. Placeholder "old site" examples look fake and hurt credibility. | Show portfolio screenshots with metrics (Lighthouse scores, load time) as proof of quality, without fabricated "before" states. |
| **Testimonial carousels** | Shows scale ("look how many happy clients"). | Carousels are skipped by users. A single strong testimonial placed near the CTA outperforms a 5-item carousel. | One focused testimonial per service page, relevant to that service type. |
| **Pricing calculator** | Interactivity feels modern. | Complex calculators confuse SMBs and produce wrong expectations. They also require maintenance as pricing changes. | Simple range display with scope explanation + "ta kontakt for nøyaktig pris" CTA. |

---

## Feature Dependencies

```
Service overview page (/tjenester redesigned)
  └──feeds into──> Each of the 7 service subpages (visitors flow from overview to subpage)

Price range config (per service in config file)
  └──required by──> Service subpage pricing section
  └──required by──> Service JSON-LD schema (priceRange field)

Contact form pre-fill (?tjeneste= URL param)
  └──extends──> Existing ContactForm component (already supports ?pakke=)
  └──required by──> Every service page CTA

Service JSON-LD schema
  └──extends──> Existing Service schema pattern in /tjenester/index.astro
  └──required per──> Each of the 7 subpages

FAQ content (service-specific)
  └──required by──> FAQ component (content-driven, component already exists)
  └──generates──> FAQPage JSON-LD schema (SEO benefit)

iGive testimonial
  └──available for──> nettside, nettbutikk pages (most relevant)
  └──not appropriate for──> AI, webapp pages (different buyer profile)
```

### Dependency Notes

- **Service overview redesign must precede subpages**: The `/tjenester` overview page is the navigation hub. Users land here and click through to subpages. If the overview doesn't clearly describe the 7 services, users won't know which subpage to visit.
- **Price config should be centralized**: Each service's price range should live in a config file (like the existing `pricing.ts`), not hardcoded in Astro templates. This allows easy updates without touching component code.
- **ContactForm pre-fill is already built**: The `?pakke=` param pattern already exists. Extending it to `?tjeneste=` requires verifying the ContactForm reads this param and populates a "Tjeneste" field.

---

## Service-by-Service Content Map

For each of the 7 services, documenting the buyer language patterns, key outcomes to emphasize, typical objections, and price range rationale.

### 1. Nettside (`/tjenester/nettside`)

**Buyer:** Small business owner, 10-50 employees, currently has no website or an old WordPress site from 2015.
**Core fear:** "Will it be worth the money if I don't have many customers online?"
**Core desire:** "I want to look professional when people search for me."

**Outcome language:**
- "Når kunder søker etter deg på Google, finner de noe de stoler på"
- "Profesjonell tilstedeværelse på nett — uten å betale byråpriser"
- "Nettside som laster på under ett sekund og ser moderne ut"

**Key sections:**
- Hero: Outcome headline + "fra X kr" + "klar på 1-3 uker"
- "For deg som...": Freelancer/SMB/professional, no/outdated site
- What's included: Pages, design, mobile, SEO basics, hosting, SSL
- Price range: 7 000 – 25 000 kr (scope: pages, complexity, integrations)
- Process: 3 steps
- FAQ: "Kan jeg redigere selv?", "Hva koster drift per år?", "Må jeg ha eget domene?"
- CTA: → /kontakt?tjeneste=nettside

**Differentiator to emphasize:** Speed (1-3 weeks vs months), transparency (all-in price), ownership ("nettsiden er din")

**Price range rationale:** Enkel 5-page site at 7 000 kr (current launch: 2 500 kr). Standard 10-page at 15 000 kr. Custom design up to 25 000 kr. Monthly: 350-750 kr.

---

### 2. Landingsside (`/tjenester/landingsside`)

**Buyer:** Business owner running or planning Google Ads / Meta Ads, or with a specific campaign/product launch.
**Core fear:** "I'm spending money on ads but my website doesn't convert."
**Core desire:** "I want one page that turns clicks into calls/emails."

**Outcome language:**
- "Reklamen din fortjener en side som faktisk konverterer"
- "En landingsside som er bygget for å selge, ikke bare informere"
- "Mer ut av hvert klikk du betaler for"

**Key sections:**
- Hero: Framing around ad spend ROI, not just "a landing page"
- Why a dedicated page (vs. sending traffic to homepage): Explain in plain language
- What's included: Headline testing, form, mobile-first, fast load
- Price range: 5 000 – 20 000 kr
- Before/after concept: traffic → form inquiry conversion
- FAQ: "Trenger jeg en landingsside eller er hjemmesiden nok?", "Kan dere A/B-teste?"
- CTA: → /kontakt?tjeneste=landingsside

**Differentiator to emphasize:** The existing `/nettside-for-bedrift` IS a landing page — use it as proof of the product.

**Note:** This is the most "meta" service — Nettup sells landing pages, and `/nettside-for-bedrift` is one. The service page should reference this as a real example.

---

### 3. Nettbutikk/Shopify (`/tjenester/nettbutikk`)

**Buyer:** Retailer or brand wanting to sell online, possibly currently selling in-store only or through a competitor platform.
**Core fear:** "Running a webshop sounds complicated and expensive."
**Core desire:** "I want to sell online without needing to be technical."

**Outcome language:**
- "Selg produktene dine på nett — vi bygger nettbutikken, du fokuserer på å selge"
- "Shopify er verdens mest brukte nettbutikkplattform. Vi setter den opp for deg."
- "Kunder kan handle fra deg 24/7, selv når du sover"

**Key sections:**
- Hero: "Start din nettbutikk" + "klar om 4-8 uker" + price signal
- Why Shopify: Explain in one paragraph, buyer-friendly (no technical jargon, focus on: easy to manage, trusted by millions, works on any phone)
- What's included: Product setup, payment integration, shipping, mobile design
- Price range: 15 000 – 80 000 kr (scope: number of products, integrations, custom design)
- "Passer for deg hvis": Has physical products, wants to sell online, has 10-500 SKUs
- FAQ: "Kan jeg legge til produkter selv?", "Hva koster Shopify per måned?", "Kan jeg koble til kassaapparat?", "Hva med MVA og regnskap?"
- CTA: → /kontakt?tjeneste=nettbutikk

**Shopify-specific framing for non-technical buyers:**
- Don't say "headless Shopify" or "Liquid templates" — say "nettbutikk du kan oppdatere selv"
- Don't mention Shopify's monthly fee as a negative — frame it as "infrastrukturkostnad, som strøm til butikken"
- Emphasize Shopify's Norwegian payment support (Vipps, Norwegian banks)

**Price range rationale:** 15 000 kr for basic product catalog + Stripe/card. 30-50 000 kr for custom design + 100+ products. 80 000+ kr for Shopify Plus with POS integration and complex automation.

---

### 4. Webapplikasjon (`/tjenester/webapp`)

**Buyer:** Business owner with a specific operational problem they want to solve with software, OR a startup wanting to build a product.
**Core fear:** "Software projects always go over budget and take forever."
**Core desire:** "I want a specific tool built for my business — something no SaaS product offers."

**Outcome language:**
- "Verktøyet du alltid har ønsket fantes, men som ingen andre selger"
- "Vi bygger programvare som løser din spesifikke utfordring — ikke en halvgod standardløsning"
- "Fra idé til fungerende applikasjon"

**Key sections:**
- Hero: Problem-focused headline ("Trenger du programvare som er skreddersydd for din bedrift?")
- Use cases: Booking system, internal tools, customer portals, dashboards — examples in plain language
- Process: Discovery → Design → Development → Launch (4-step, more detailed than for nettside)
- Price range: 40 000 – 300 000+ kr
- Scope explanation: Critical for this service — explain what determines price (complexity, integrations, users)
- FAQ: "Eier vi koden?", "Kan dere bygge videre etterpå?", "Hva om kravene endrer seg underveis?"
- CTA: → /kontakt?tjeneste=webapp + "Book en kostnadsfri behovsanalyse"

**Non-technical framing challenge:** This is the hardest service to explain to non-technical buyers. Strategy:
1. Use analogies: "En webapplikasjon er som å bygge et tilpasset verktøy for en spesifikk jobb, ikke å kjøpe en hammer fra butikken"
2. Show examples of real problems → solution (without exposing client NDA)
3. Emphasize the discovery process — buyers fear jumping in blind

**Price range rationale:** 40 000 kr for a simple single-purpose tool (e.g., booking form with admin panel). 100-200 000 kr for a multi-user application. 300 000+ kr for complex platform with integrations. These are real Norwegian agency market rates (MEDIUM confidence based on training data).

---

### 5. SEO (`/tjenester/seo`)

**Buyer:** Business owner who has heard about SEO but doesn't understand what it actually involves, or who has been burned by previous SEO agencies promising first-page rankings.
**Core fear:** "SEO is a scam — I paid an agency and nothing happened."
**Core desire:** "I want to be found on Google when people search for what I sell."

**Outcome language:**
- "Bli funnet av kunder som aktivt søker etter det du tilbyr"
- "SEO-optimalisering som faktisk synes i Google-resultatene"
- "Organisk trafikk som vokser over tid — uten å betale for hvert klikk"

**Key sections:**
- Hero: Outcome-first headline, NOT "vi driver med SEO"
- Demystify section: "Hva er SEO, egentlig?" — 3-4 sentences in buyer language
- What we do: Technical SEO, content optimization, local SEO — but described as outcomes ("vi sørger for at Google forstår hva siden din handler om")
- Timeline expectation: Be honest — "SEO tar 3-6 måneder å se resultater" — this builds trust
- Price range: 5 000 kr/mnd (ongoing) or 15 000 kr (one-time audit + fix)
- FAQ: "Kan dere garantere førsteplass?", "Hva er forskjellen på SEO og Google Ads?", "Hva er inkludert per måned?"
- CTA: → /kontakt?tjeneste=seo

**Critical framing:** Never promise ranking positions. This is both dishonest and a legal risk. Instead: "Vi optimaliserer siden slik at Google bedre forstår og rangerer innholdet ditt."

**Norwegian market specifics:**
- Local SEO is highly valuable in Norway ("rørlegger Oslo", "frisør Bergen")
- Google dominates Norwegian search (95%+ market share)
- Norwegian-language content optimization (bokmål vs nynorsk) is a real consideration

---

### 6. AI-integrasjon (`/tjenester/ai`)

**Buyer:** Business owner who has heard about "AI" from news coverage and wonders if it's relevant to their business. May range from skeptical ("AI is hype") to enthusiastic ("I want to automate everything").
**Core fear:** "AI is too complicated and expensive for a small business like mine."
**Core desire:** "I want to save time on repetitive tasks and look innovative."

**Outcome language:**
- "La AI gjøre de kjedelige, repeterende oppgavene — så kan du fokusere på det som faktisk krever din tid"
- "Smarte verktøy som svarer kunder, sorterer innkommende forespørsler, eller automatiserer rapporter"
- "AI-løsninger tilpasset din bedrift — ikke generelle verktøy som ikke passer"

**Key sections:**
- Hero: Concrete examples ("Kundeservice-chatbot som svarer 24/7", "Automatisk tekstgenerering fra produktdata")
- Use case gallery: 4-6 concrete examples in plain language, categorized by business problem
  - "Kundeservice: chatbot som svarer vanlige spørsmål"
  - "Markedsføring: generer produkttekster fra bullet-points"
  - "Internt: sammenfatt møtereferater automatisk"
  - "Analyse: trekk ut innsikt fra kundedata"
- What's NOT included (set expectations): "Vi integrerer eksisterende AI-modeller (som OpenAI) — vi trener ikke egne modeller"
- Price range: 10 000 – 60 000 kr (scope: integration complexity, number of touchpoints)
- FAQ: "Deler vi kundedata med OpenAI?", "Kan den norsk?", "Hva om AI-en gjør feil?"
- CTA: → /kontakt?tjeneste=ai + "Book en AI-workshop" (45 min free session to identify use cases)

**Non-technical framing challenge:** AI is uniquely difficult to explain without overpromising. Strategy:
1. Lead with examples, not technology ("chatbot" not "large language model")
2. Be explicit about limitations ("AI gjør feil — vi bygger alltid inn en 'snakk med et menneske' fallback")
3. Address the data privacy concern proactively — it's the #1 objection from Norwegian SMBs

**GDPR/data concern is critical for Norwegian market:** Norwegian SMBs are more GDPR-aware than many markets. The FAQ MUST address: "Hvor lagres dataene?" and "Er dette i henhold til GDPR?" Frame as Nettup's expertise, not a problem.

---

### 7. Vedlikehold (`/tjenester/vedlikehold`)

**Buyer:** Existing client OR business owner who has a website from another supplier and needs ongoing care, OR someone planning a new site who wants to understand total cost of ownership.
**Core fear:** "What happens to my website after it's built? Will it break?"
**Core desire:** "I want peace of mind — someone to call when something goes wrong."

**Outcome language:**
- "Nettsiden din er alltid oppdatert, sikker og fungerende — uten at du trenger å tenke på det"
- "Vi passer på nettsiden din mens du passer på bedriften din"
- "Fast månedlig kostnad, ingen overraskelser"

**Key sections:**
- Hero: Peace-of-mind framing ("Fokus på bedriften — vi tar oss av nettsiden")
- What's included: Hosting, SSL, updates, monitoring, monthly dev time, response time SLA
- Price tiers (monthly): 350 kr (basic), 500 kr (standard), 750 kr (premium) — matches existing pricing.ts
- "Hva skjer uten vedlikehold?": One short section explaining WordPress security risks, outdated plugins, expired SSL — reframes maintenance from "cost" to "insurance"
- FAQ: "Kan jeg avslutte abonnementet?", "Hva er responstiden?", "Inkluderer dette nye funksjoner?"
- CTA: → /kontakt?tjeneste=vedlikehold

**Note:** This is the lowest-stakes service page but the highest-retention business model. It should be positioned as the natural continuation after any Nettup project — not as an afterthought. Consider a "Etter lansering" section on other service pages that upsells maintenance.

---

## MVP Definition

### Launch With (v1.1 — all 7 service pages)

The following are non-negotiable for every service page:

- [ ] Outcome-focused headline (not feature/tech focused) — core to non-technical SMB buyer conversion
- [ ] Price signal or range visible without scrolling — prevents immediate bounce from price-sensitive SMBs
- [ ] "Hva er inkludert" section specific to that service — removes fear of hidden costs
- [ ] FAQ with service-specific objections (minimum 5 per service) + JSON-LD schema
- [ ] CTA → /kontakt with ?tjeneste= pre-fill — enables attribution and friction reduction
- [ ] Service JSON-LD schema (Service type) — required for Google structured data
- [ ] Trust badges (24t responstid, 30 dagers garanti, Norsk support) — applies to all services
- [ ] Mobile-first layout at 375px — required by project constraints

### Add After Validation (v1.x)

- [ ] "Passer for deg hvis" self-qualifier block — add once we know which services generate mismatched leads
- [ ] Service-specific testimonials — add as client portfolio grows beyond iGive
- [ ] "Se eksempel" link to a real delivered project — add as /prosjekter expands
- [ ] Interactive scope estimator — add if contact form gets "I don't know which tier I need" messages frequently
- [ ] AI service: "Book AI-workshop" CTA variant — add when Nettup is confident in running discovery sessions at scale

### Future Consideration (v2+)

- [ ] Service comparison page ("/tjenester/velg-tjeneste" guided quiz) — only if bounce rate on /tjenester overview is high and users can't self-select
- [ ] Per-service case studies beyond iGive — requires building more projects first
- [ ] Video explainer per service — high production cost, defer until content budget exists
- [ ] A/B testing on headlines/CTAs — add Vercel Experiments when traffic volume justifies it

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Outcome-focused headlines per service | HIGH | LOW | P1 |
| Price ranges with scope explanation | HIGH | LOW | P1 |
| Service-specific FAQ + JSON-LD | HIGH | LOW | P1 |
| CTA with ?tjeneste= pre-fill | HIGH | LOW | P1 |
| /tjenester overview as service catalog | HIGH | MEDIUM | P1 |
| Service JSON-LD schema per subpage | MEDIUM | LOW | P1 |
| "Passer for deg hvis" qualifier | HIGH | LOW | P2 |
| AI data privacy FAQ content | HIGH | LOW | P1 (AI page only) |
| Shopify value framing (non-technical) | HIGH | LOW | P1 (Shopify page only) |
| Webapp discovery process (4-step) | HIGH | LOW | P1 (webapp page only) |
| Service-specific testimonials | HIGH | MEDIUM | P2 |
| Delivery timeline per service | MEDIUM | LOW | P2 |
| Interactive pricing estimator | MEDIUM | HIGH | P3 |
| Video explainers | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for v1.1 launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Buyer Language Patterns (Norwegian SMB)

These are the phrases and framings that resonate with non-technical Norwegian SMB decision-makers, derived from the existing codebase copy that already works (validated in `/nettside-for-bedrift` and homepage).

**Use these patterns:**
- "Du fokuserer på [core business], vi tar oss av [technical thing]"
- "Klar på X uker" (concrete timeline > vague "raskt")
- "Fra X kr" (minimum price with "ta kontakt for nøyaktig tilbud")
- "Ingen skjulte kostnader"
- "Du eier alt — ingen binding"
- "Norsk support, 24t responstid"
- "Vi hjelper deg å velge riktig" (low-pressure framing)
- "[Outcome] uten å måtte forstå teknologien"

**Avoid these patterns:**
- Tech stack names as selling points ("Astro", "TypeScript", "headless")
- "Best practice" (meaningless jargon)
- "Skalerbar løsning" (developer speak for "it can grow")
- "State of the art" / "cutting edge" (cliché, erodes trust)
- "Vi leverer kvalitet" (every agency says this, says nothing)
- Passive voice: "Det settes opp" → Active: "Vi setter opp"

**Price framing for Norwegian SMBs:**
- "Fra X kr" is better than "X–Y kr" for high-end services (the floor matters more than the ceiling)
- "Per måned" is better than "månedlig" (more colloquial)
- Always show what's included in the monthly fee (removes recurring fear of surprise invoices)
- "Uforpliktende samtale" / "gratis behovsanalyse" reduces commitment anxiety before contact

---

## Competitor Feature Analysis

Based on Norwegian web agency market patterns (MEDIUM confidence — no live competitor sites analyzed, web tools unavailable):

| Feature | Typical Norwegian Agency | Nettup Current | Nettup v1.1 |
|---------|--------------------------|----------------|-------------|
| Service-specific subpages | Rare (most use single tjenester page) | None | All 7 services |
| Price transparency | Very rare (most say "kontakt for pris") | Strong (launch pricing) | Price ranges per service |
| FAQ with JSON-LD | Almost none | Exists on 2 pages | All service pages |
| Pre-fill CTA → form | None observed | Exists (?pakke=) | Extended (?tjeneste=) |
| Non-technical framing | Mixed — many use jargon | Good on landing page | Applied to all 7 |
| Delivery timelines stated | Rare | Homepage + landing page | Each service page |

**The biggest competitive gap Nettup can exploit:** Most Norwegian SMB-focused agencies either hide pricing entirely OR use generic "pakker" that don't map to specific needs. Dedicated service pages with honest price ranges and non-technical language is a genuine differentiator that few competitors offer.

---

## Sources

- Codebase analysis: `/nettside-for-bedrift/` page as primary conversion pattern reference (HIGH confidence — this is real, built, and structured for conversion)
- Codebase analysis: `/tjenester/`, `/src/config/pricing.ts`, `/src/pages/_home/Problem.astro` — existing buyer language patterns
- `.planning/PROJECT.md` — v1.1 requirements and scope
- `CLAUDE.md` — project rules and target audience specification
- Domain knowledge: Agency service page conversion best practices, Norwegian SMB buyer psychology, Shopify partner positioning, AI service framing patterns (MEDIUM confidence — training data through early 2025, trends in this area are relatively stable)
- **Confidence note:** Web research tools were unavailable. All findings beyond codebase analysis rely on training data. Norwegian market specifics (local SEO patterns, Vipps payment framing, GDPR sensitivity) are based on domain knowledge and may need validation against current market conditions.

---
*Feature research for: Nettup v1.1 — Tjenesteutvidelse (7 dedicated service pages)*
*Researched: 2026-03-04*
