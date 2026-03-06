# Feature Landscape

**Domain:** Additive pricing calculator for Norwegian web agency (v1.2 Smart Priskalkulator)
**Researched:** 2026-03-06
**Confidence:** MEDIUM-HIGH

---

## Context: This Milestone

v1.2 replaces the existing 4-phase PrisKalkulatorIsland (goal-first wizard with hardcoded prices and 2-3 narrowing questions per service) with a deep, additive price calculator. The existing wizard asks "what's your goal?" then narrows with questions like page count and CMS need, landing on a single "fra X kr" estimate. The new calculator must produce a detailed line-item breakdown with min-max range, covering base price + size + features + integrations + design level, driven by a config file that Nettup also uses internally for client quoting.

**Target audience remains the same:** Norwegian SMB owners who are non-technical and price-sensitive. The calculator must feel simple despite being more granular.

**What exists today:**
- `PrisKalkulatorIsland.tsx`: React island with Framer Motion, 4 phases (goal/recommend/narrow/result)
- `services.ts`: 3 services with minPrice, monthlyPrice, priceRange
- `pricing.ts`: 3 fixed packages (Enkel/Standard/Premium) with hardcoded features
- The wizard lives as a section on `/tjenester` via `PrisKalkulator.astro`

---

## Table Stakes

Features users expect from a pricing calculator. Missing these makes the tool feel broken or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Service type selection** | Users must first pick what they need (nettside, nettbutikk, landingsside). This is the existing goal-first pattern and should be retained. | LOW | Already built. Keep the goal-first framing ("Hva er malet ditt?") rather than jumping to service names. |
| **Price range result (min-max)** | A single number feels like a binding quote. A range ("18 000 - 32 000 kr") sets expectations without creating false precision. Norwegian competitors (Nettsidelab, WebPluss, Webaas) all use ranges. | LOW | Display as "Estimert pris: 18 000 - 32 000 kr" with clear "dette er et estimat" disclaimer. |
| **Line-item breakdown** | Users need to see what drives the price. "Base: 8 000 kr + CMS: 4 000 kr + Vipps: 3 000 kr = 15 000 kr" builds trust and lets users self-adjust. This is what separates a real calculator from a marketing gimmick. | MEDIUM | Show each selected add-on with its price contribution. Use a receipt/summary style. |
| **Monthly cost display** | Norwegian SMBs think in monthly costs. One-time + monthly must both be visible. Monthly should also be additive (base hosting + CMS monthly + integration monthly). | LOW | Display as separate section: "Engangs: X kr" + "Manedlig: Y kr/mnd". |
| **Progress indicator** | Multi-step wizards without progress indicators cause abandonment. Users need to see "Step 2 of 5" or a progress bar. | LOW | Already implicit in current wizard ("Sporsmal 1 av 2"). Extend to cover all categories. |
| **Back navigation** | Users must be able to go back and change selections without losing progress. The current wizard lacks this. | MEDIUM | Store all selections in state. Allow stepping back to any previous category. Critical UX gap in current implementation. |
| **Mobile-first layout** | Over 60% of traffic is mobile. Calculator cards and buttons must be tap-friendly at 375px. | LOW | Already the project default. Existing wizard is mobile-friendly. Maintain this. |
| **Reset/start over** | Users who change their mind need a clean restart. | LOW | Already exists as "Start pa nytt" button. Keep it. |
| **CTA to contact form** | After seeing the estimate, the next step must be obvious: "Kom i gang" linking to `/kontakt?tjeneste=X`. | LOW | Already exists. Extend to pass selected features as context (or at minimum the service type). |
| **Launch discount display** | The 40% launch discount is active. Calculator results must show original price crossed out with discounted price, matching the existing visual pattern. | LOW | Already implemented in current wizard result phase. Keep the pattern. |

---

## Differentiators

Features that go beyond what Norwegian agency calculators offer. Based on analysis of Webaas, Nettsidelab, WebPluss, and Drobak Design calculators.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Additive pricing model** | Most Norwegian agency calculators use fixed tiers or opaque "kontakt for pris". Showing base + selected add-ons as a running total is genuinely rare. Nettsidelab uses sliders but doesn't show per-item costs. WebPluss caps at fixed max. A transparent additive model ("you picked X, Y, Z, here's what each costs") builds trust with price-sensitive Norwegian SMBs. | MEDIUM | This is the core value proposition of v1.2. The config file structure must support per-item pricing for each service type. |
| **Config-driven pricing file** | A single TS/JSON file that defines all base prices, add-on prices, categories, and monthly costs. Non-developer at Nettup can update prices without touching component code. Also used internally for quoting clients. | MEDIUM | Use TypeScript (not JSON) for type safety and inline comments explaining each price point. Import into both calculator UI and internal quoting. |
| **"Hva er inkludert" per selection** | When a user selects "CMS-panel" as an add-on, show a brief description of what that means: "Du kan redigere tekst, bilder og sider selv via et enkelt panel." Demystifies technical terms for non-technical buyers. | LOW | Add a `description` field per add-on in the pricing config. Display as tooltip or inline text. |
| **Category-based flow** | Instead of random questions, group into logical categories: Storrelse/omfang -> Funksjoner -> Integrasjoner -> Designniva. Each category is one step in the wizard. This matches how agencies actually scope projects. | LOW | 4 categories is the sweet spot. More than 6 causes abandonment per NNGroup research. |
| **Running total sidebar/footer** | Show the current price estimate updating in real-time as users select options. Creates a "shopping cart" feeling that's intuitive. Shakuro's calculator and WebPluss both do this effectively. | MEDIUM | On desktop: sticky sidebar with running total. On mobile: fixed bottom bar with current estimate. |
| **Dual use: public + internal** | The same pricing config drives both the website calculator and internal quoting. When a salesperson discusses pricing with a client, they use the same source of truth. Prevents "the website said X but you quoted Y" situations. | LOW | Architecture concern, not UI. The config file structure must be clean enough for internal reference. |
| **PDF/email summary** | After completing the calculator, offer "Send estimat til e-post" — captures lead AND gives user a takeaway. Norwegian competitors don't offer this. | HIGH | Requires email sending (Formspree or similar). Defer to post-MVP unless easy to implement with existing Formspree setup. |
| **Scope explanation per price driver** | For each add-on category, explain WHY it costs what it does. "CMS legger til 4 000 kr fordi vi setter opp Sanity med opplaering." This level of transparency is extremely rare among Norwegian agencies. | LOW | Add as static text per category in the wizard flow. Not dynamic — just educational framing. |

---

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Exact fixed quote** | An interactive calculator that outputs "Din nettside koster 23 450 kr" creates a binding expectation. Scope always varies in practice. Clients will hold Nettup to the exact number. | Always output a range (min-max). Label clearly as "estimat" and "uforpliktende". |
| **Too many questions** | NNGroup recommends under 10 steps for wizards. Asking about every possible feature (SSL type, font choice, icon pack) creates fatigue. The current wizard works because it's 2-3 questions. Going to 15+ will tank completion rates. | 4 category steps + result = 5 total screens. Each category has 2-5 options, not 15. |
| **Free-text input for requirements** | Tempting to add "Beskriv prosjektet ditt" textarea. Creates analysis paralysis and produces garbage data. | Use structured selections only. Free-text belongs in the contact form. |
| **Competitor price comparison** | "Vare priser vs. andre byraer" — legally risky, hard to maintain, and comes across as insecure. | Let transparency speak for itself. Competitors hide prices; Nettup shows them. |
| **Hourly rate display** | Showing "Vi tar 1 200 kr/t, dette prosjektet tar ~20 timer" invites negotiation on hours rather than value. | Show project-based pricing only. Internal hourly rate drives the config but is never shown to users. |
| **Complex conditional logic** | "If you picked Shopify AND over 500 products AND Vipps integration, then show ERP question." Deep branching makes the config unmaintainable and the UX unpredictable. | Keep conditions simple: service type determines which categories/options appear. Within categories, options are independent toggles. |
| **Account/save progress** | Requiring login or cookies to save calculator state adds friction with no clear value. The calculator takes under 2 minutes. | No persistence needed. If users want to save their estimate, offer the email summary (differentiator above). |
| **Animated price counter** | Counting up from 0 to the estimate with animation feels gimmicky. Norwegian SMBs are skeptical of flash over substance. | Show the number directly. Animate the transition between steps (already using Framer Motion), not the price itself. |

---

## Feature Dependencies

```
Service type selection (existing goal-first flow)
  +-- determines --> Available categories and options per service
  +-- determines --> Base price per service

Pricing config file (NEW - central to everything)
  +-- drives --> Calculator UI (what options to show, what prices to display)
  +-- drives --> Line-item breakdown in result
  +-- drives --> Monthly cost calculation
  +-- drives --> Internal quoting (same source of truth)
  +-- extends --> Existing services.ts (minPrice, monthlyPrice fields)

Category-based wizard steps (NEW)
  +-- depends on --> Pricing config (categories, options, prices per service)
  +-- depends on --> Service type selection (which categories to show)
  +-- feeds into --> Running total (updates after each category)

Result screen with breakdown (NEW)
  +-- depends on --> All category selections made
  +-- depends on --> Pricing config (to calculate min-max range)
  +-- depends on --> Launch discount config (existing launchOffer.ts)
  +-- feeds into --> CTA with ?tjeneste= pre-fill (existing)

/priskalkulator dedicated page (NEW)
  +-- reuses --> Calculator island component
  +-- linked from --> /tjenester section (existing PrisKalkulator.astro)
  +-- linked from --> Navigation (optional)

Back navigation (NEW)
  +-- depends on --> State management holding all selections
  +-- modifies --> Running total (recalculates on change)
```

### Dependency Notes

- **Pricing config must be designed first.** Everything else (UI categories, result breakdown, monthly costs) reads from this file. Get the data model right before building UI.
- **services.ts should be extended, not replaced.** The existing minPrice/maxPrice/monthlyPrice fields on services can be derived from or reference the pricing config, keeping backward compatibility with service pages that display "fra X kr".
- **pricing.ts (packages) may become obsolete.** The 3 fixed packages (Enkel/Standard/Premium) are a simpler model. Decide whether to keep packages as presets within the additive model or deprecate them.
- **The calculator component replaces PrisKalkulatorIsland.tsx.** Same mounting point, same Astro wrapper, new implementation.

---

## Additive Pricing Categories

Based on how Norwegian agencies actually scope projects, analysis of competitor calculators, and the milestone requirements.

### Per Service: Nettside

| Category | Options | Price Impact (one-time) | Monthly Impact |
|----------|---------|------------------------|----------------|
| **Storrelse** | 1-5 sider / 6-10 sider / 11-20 sider / 20+ sider | Base: 8 000 / +4 000 / +8 000 / +15 000 | - |
| **Innholdsstyring** | Statisk (vi oppdaterer) / CMS-panel (du oppdaterer selv) | - / +4 000 | - / +100 |
| **Funksjoner** | Kontaktskjema (inkl) / Booking-integrasjon / Blogg / Bildegalleri / Flerspraklig | inkl / +3 000 / +3 000 / +1 500 / +5 000 | - |
| **Integrasjoner** | Google Analytics (inkl) / Vipps betaling / Nyhetsbrev (Mailchimp) / Chat-widget | inkl / +2 000 / +1 500 / +3 000 | - / +50 / - / +200 |
| **Designniva** | Standard (profesjonelt) / Skreddersydd (unikt design) / Premium (animasjoner + interaktivt) | inkl / +5 000 / +12 000 | - |

### Per Service: Nettbutikk

| Category | Options | Price Impact (one-time) | Monthly Impact |
|----------|---------|------------------------|----------------|
| **Plattform** | Shopify / WooCommerce / Skreddersydd | 15 000 / 12 000 / 25 000 | +350 (Shopify abo) / +200 / +500 |
| **Produktomfang** | Under 50 / 50-200 / 200-500 / 500+ produkter | inkl / +3 000 / +6 000 / +10 000 | - |
| **Funksjoner** | Vipps/Klarna betaling / Lagerstyring / Fraktkalkulator / Rabattkoder / Produktanmeldelser | +2 000 / inkl / +1 500 / inkl / +1 000 | +50 / - / - / - / - |
| **Integrasjoner** | Regnskapssystem (Tripletex/Visma) / ERP / Kassaapparat (POS) / Nyhetsbrev | +5 000 / +8 000 / +6 000 / +1 500 | +200 / +300 / +150 / - |
| **Designniva** | Standard / Skreddersydd / Premium | inkl / +5 000 / +12 000 | - |

### Per Service: Landingsside

| Category | Options | Price Impact (one-time) | Monthly Impact |
|----------|---------|------------------------|----------------|
| **Type** | Kampanjeside (kortvarig) / SEO-landingsside (permanent) | 4 000 / 6 000 | - / +250 |
| **Funksjoner** | Kontaktskjema (inkl) / Booking / Betaling / Video-seksjon / Nedtelling/urgency | inkl / +2 000 / +2 000 / +1 000 / +500 | - / - / +50 / - / - |
| **Integrasjoner** | Google Analytics (inkl) / Meta Pixel / Google Ads tracking / Nyhetsbrev | inkl / +500 / +500 / +1 000 | - |
| **Designniva** | Standard / Skreddersydd / Premium (animasjoner) | inkl / +3 000 / +8 000 | - |

**Note on prices:** These are illustrative based on the existing pricing.ts ranges and Norwegian agency market rates. The exact numbers should be set by Nettup based on their actual cost structure and margin targets. The config file makes this trivially adjustable.

---

## UX Flow Recommendation

Based on wizard UX best practices (NNGroup, Eleken) and analysis of Norwegian competitor calculators.

### Recommended Flow (5 screens)

```
1. Mal (goal-first, existing)
   "Hva er malet ditt?" -> maps to service type

2. Storrelse/omfang
   Service-specific sizing question (pages, products, type)
   Running total appears

3. Funksjoner
   Multi-select checkboxes for features
   Running total updates per selection

4. Integrasjoner
   Multi-select checkboxes for integrations
   Running total updates

5. Designniva
   Single-select (3 options)

-> Result
   Full breakdown: line items, one-time total (range), monthly total
   Launch discount applied
   CTA: "Kom i gang" / "Send estimat pa e-post"
```

### Why This Order

1. **Goal first** — proven pattern from existing wizard, users think in outcomes
2. **Size** — establishes the base cost, anchors expectations early
3. **Features** — most variable, users enjoy the "build your own" feeling here
4. **Integrations** — often the most expensive add-ons, comes after features so users aren't scared off early
5. **Design level** — last because it's the easiest decision and creates a satisfying "finishing" feeling

### Multi-select vs Single-select

- **Size/scope:** Single-select (mutually exclusive options)
- **Features:** Multi-select checkboxes (additive, pick any combination)
- **Integrations:** Multi-select checkboxes (additive)
- **Design level:** Single-select (tiers, mutually exclusive)

This matches the CPQ (Configure, Price, Quote) pattern used in enterprise sales tools but adapted for a consumer-facing calculator.

---

## MVP Recommendation

### Build First (v1.2 core)

1. **Pricing config file** — The data model. Everything else depends on this.
2. **Category-based wizard with 5 screens** — Goal + 4 categories + result
3. **Additive line-item result** — Min-max range with per-item breakdown
4. **Monthly cost breakdown** — Separate from one-time, also additive
5. **Back navigation** — Critical UX improvement over current wizard
6. **Running total** — Updates as selections change
7. **Launch discount integration** — Reuse existing launchOffer.ts
8. **Dedicated /priskalkulator page** — Plus keep the section on /tjenester

### Defer

- **PDF/email summary:** HIGH complexity, requires email infrastructure. Add in v1.3 if lead capture from calculator is a priority.
- **Preset packages:** The existing Enkel/Standard/Premium could become "quick select" presets that pre-fill the calculator. Nice UX but not essential for launch.
- **Internal quoting UI:** The config file IS the internal tool for now. A dedicated internal interface is out of scope.
- **A/B testing calculator vs simple pricing:** Requires traffic volume. Revisit after 3 months of calculator usage data.

---

## Sources

- [Nettsidelab priskalkulator](https://nettsidelab.no/nettside-pris/) — 4-step slider-based calculator, Norwegian market (MEDIUM confidence, fetched 2026-03-06)
- [WebPluss priskalkulator](https://www.webpluss.no/nettsideutvikling/) — Multi-step with real-time updates, 3-minute completion target (MEDIUM confidence, fetched 2026-03-06)
- [Drobak Design priskalkulator](https://www.drobak-design.no/nettside-priskalkulator) — Accordion-style line-item pricing with 4 package tiers (MEDIUM confidence, fetched 2026-03-06)
- [Webaas priskalkulator](https://webaas.no/priskalkulator/) — Simple 3-type selection with instant estimate (MEDIUM confidence, fetched 2026-03-06)
- [Shakuro project calculator](https://shakuro.com/project-calculator) — 8-question wizard with feature toggles and flexible pricing (MEDIUM confidence, fetched 2026-03-06)
- [NNGroup wizard design](https://www.nngroup.com/articles/wizards/) — Under 10 steps, clear progress, backward navigation (HIGH confidence, authoritative UX source)
- [Eleken wizard UI pattern](https://www.eleken.co/blog-posts/wizard-ui-pattern-explained) — Progress indicators, contextual guidance, mobile optimization (MEDIUM confidence, fetched 2026-03-06)
- Codebase analysis: `PrisKalkulatorIsland.tsx`, `services.ts`, `pricing.ts` (HIGH confidence — direct code inspection)

---
*Feature research for: Nettup v1.2 — Smart Priskalkulator (additive pricing calculator)*
*Researched: 2026-03-06*
