# Feature Research

**Domain:** Local SEO landing pages — Norwegian city-targeted pages for a service-area web agency
**Milestone:** v1.5 Lokale SEO-sider (nettup.no)
**Researched:** 2026-03-08
**Confidence:** HIGH (multiple current sources cross-validated; Norwegian competitor analysis performed)

---

## Context: What Already Exists

The site has 5 core pages, 7 service pages, a price calculator, AI chatbot, and an automated blog pipeline. There is no city-specific content anywhere. The homepage and service pages target national Norwegian queries ("webbyrå", "nettside for bedrift") but have zero explicit coverage for local queries like "webbyrå Oslo" or "nettside bedrift Drammen".

This milestone adds:
- `src/config/locations.ts` — city data model with V1/V2/V3 expansion fields
- `src/pages/[location].astro` — static routes via `getStaticPaths()`
- 6–8 Tier 1 city pages with hand-written, genuinely differentiated copy
- `LocalBusiness` JSON-LD with `areaServed` per page
- Per-city SEO metadata + canonical URLs
- Internal linking updates (footer, contact page)

No new dependencies. All features use existing Astro 5 + Tailwind 4 + existing schema patterns.

---

## The Doorway Page Problem

This is the central design constraint for the entire feature set. Google's spam policies explicitly list location pages as a doorway page risk. The penalty is quiet (pages get "currently not indexed" status) but fatal.

**Doorway page definition:** A page that exists primarily for search engines, not users. The test: "Would this page exist if Google didn't exist?" If no — it's a doorway page.

**How agencies get penalized:**
- Identical page copied 40 times with only the city name swapped
- Pages orphaned from navigation (no internal links in or out)
- City name mentioned repeatedly in keyword-stuffed paragraphs with no genuine local content
- Footer crammed with 40+ city names as plain text links
- Thin FAQ sections that ask/answer nothing users actually want to know

**The 60% rule (MEDIUM confidence):** Industry consensus holds that at least 60% of content per city page must be genuinely unique — not shared boilerplate. This is the threshold that separates legitimate from thin.

**The intent test:** If you can swap the city name and nothing else changes, it needs more depth.

---

## Feature Landscape

### Table Stakes (Users and Crawlers Expect These)

Features that a legitimate local SEO landing page must have. Missing these = page won't rank or will be penalized.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **City-specific `<title>` tag** | Google's primary ranking signal for location queries. `Webbyrå [By] — Nettup` is the canonical pattern. | LOW | Under 60 characters. Include city name near the start. Pattern confirmed by top-ranking Norwegian web agency pages. |
| **City-specific `<meta description>`** | CTR signal. Users scanning search results need to instantly see their city name and a relevant service claim. | LOW | 120–155 characters. City name in first 10 words. Outcome-first: "Profesjonell nettside for bedrifter i [By]. Rask levering og moderne teknologi." |
| **Canonical URL per city** | Prevents duplicate content signals when V2/V3 generates many similar pages. | LOW | `https://nettup.no/[city-slug]` — consistent with existing Astro canonical pattern. |
| **Unique H1 incorporating city** | On-page geo-relevance signal. Generic H1s shared across pages are a thin content red flag. | LOW | "Webbyrå i [By] — Profesjonelle nettsider for lokale bedrifter" is the table stakes pattern. Must be unique per city, not a template with swapped slug. |
| **City-specific introductory paragraph** | The 60% unique content threshold starts here. First 200 words are evaluated by both Google and AI systems. Boilerplate here is the #1 doorway page red flag. | MEDIUM | Must reference something specific to the city — business culture, local industries, geographic context, nearby areas served. Not just "Vi leverer webtjenester til bedrifter i [By]." |
| **Service offering section** | Users landing on a city page need to understand what's available in their area. This can be shared content presented consistently, as long as the intro and FAQ are unique. | LOW | Can reuse existing service summaries from `services.ts` with per-city CTA links. This is the shared 40% — acceptable. |
| **Clear contact CTA with city context** | Users must be able to take action immediately. A generic "Kontakt oss" CTA is weaker than "Kontakt oss for et uforpliktende møte om din [By]-bedrift." | LOW | Pre-fill `?by=[city]` or `?tjeneste=lokal-nettside` to carry city context into the contact form (pattern already exists in codebase). |
| **NAP consistency** | Name, Address, Phone must match the `LocalBusiness` JSON-LD exactly. Mismatches between on-page text and schema are a local ranking signal loss. | LOW | Nettup has no physical address per city — service-area business model. This changes the implementation: use `areaServed` + `serviceArea`, not `address` per city. |
| **`LocalBusiness` JSON-LD with `areaServed`** | Structured data is Google's machine-readable confirmation that you serve this city. Without it, city-targeted ranking relies on on-page signals alone — weaker. | MEDIUM | Use `ProfessionalService` subtype (more precise than `LocalBusiness` for a web agency). `areaServed` as array of city names is sufficient; `GeoCircle`/`GeoPolygon` adds minimal value for this use case. |
| **Sitemap inclusion** | City pages must be in `sitemap.xml` for discovery and crawl prioritisation. | LOW | Astro sitemap integration already auto-includes all static routes — confirmed in existing PROJECT.md setup. No additional work needed beyond ensuring routes are generated. |
| **Internal links from existing pages** | Orphaned pages are a doorway page red flag. City pages must receive links from at least 2–3 existing pages. | LOW | Footer "Områder vi dekker" section + `/kontakt` page "Vi betjener hele Viken og Oslofjordregionen" text. See Internal Linking section below. |
| **City-specific FAQ section** | FAQ serves two purposes: genuine user value (passes the doorway test) and `FAQPage` JSON-LD (schema signal). Questions must be specific to the city, not generic service FAQs. | MEDIUM | 3–4 questions. At least 2 must reference something specific to the city or region. "Leverer dere nettsider til bedrifter utenfor [By] sentrum?" is acceptable. "Hva er en nettside?" is not. |

### Differentiators (Competitive Advantage)

Features that elevate Nettup's local pages above the doorway-page-adjacent content published by most Norwegian agencies. Most competitors either skip city pages entirely or publish thin boilerplate.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Local industry mention per city** | Every Norwegian city has a dominant industry cluster. Referencing it signals genuine local knowledge and creates content that cannot be replicated by a template. Oslo: finance/tech/startup, Drammen: industri/logistikk, Asker/Bærum: it-konsulenter og liberale yrker, Lillestrøm: industri og offentlig sektor. | MEDIUM | Must be accurate and specific. 1–2 sentences. Not "many businesses in [city] need websites" — that's useless. "Askers mange IT-konsulentfirmaer trenger profesjonelle nettsider som demonstrerer fagkompetanse til bedriftskunder" is useful. |
| **Nearby areas served (explicit)** | For each Tier 1 city, explicitly naming nearby towns signals service-area coverage and creates longtail relevance ("webbyrå Nesbyen" can surface from a Drammen page if Numedal is mentioned). Feeds `areaServed` array in schema. | LOW | 2–4 nearby areas per city. Stored in `locations.ts` as `nearbyAreas[]`. Rendered as "Vi betjener også [Nedre Eiker], [Røyken] og [Hurum]." |
| **Unique testimonial reference per city (future)** | When real client testimonials are collected, displaying a testimonial from a client in the target city is the highest-trust local signal possible. Currently a known gap (placeholder testimonials site-wide). | LOW now, HIGH later | Add a `testimonialCity` field to `locations.ts` schema now so it's ready when real testimonials exist. Don't display fake/generic testimonials — worse than no testimonial. |
| **`FAQPage` JSON-LD co-located with FAQ** | Consistent with the pattern established in v1.1 service pages and v1.3 blog articles. City-specific FAQ with structured data is more citable by AI systems and more likely to generate rich results. | LOW | Implementation pattern already exists in codebase. Adapt from service page FAQ components. |
| **Chatbot context injection per city** | The existing AI chatbot (Claude Haiku) already receives page context. Injecting city name and local industries into the system prompt means the chatbot answers "Kan dere hjelpe en bedrift i Drammen?" intelligently without needing separate chatbot configs. | MEDIUM | Requires passing `city` and `region` from page frontmatter to chatbot context. The chatbot infrastructure supports this via existing page-context patterns. |
| **Blog cross-links from city-relevant articles** | The automated blog pipeline already generates articles with a "lokal-seo" topic cluster. Articles about "lokal SEO i Oslo" can link to `/oslo` city page, creating editorial internal link equity. | LOW | Update blog generation config to include city page links when relevant. No structural changes needed — just config update. |
| **`BreadcrumbList` JSON-LD** | Consistent with existing site-wide pattern. Establishes page position in site hierarchy for both Google and AI systems. | LOW | Pattern: `Nettup (/) > Webbyrå i [By] (/[city-slug])`. Simple 2-level breadcrumb. |

### Anti-Features (Explicitly Avoid)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **City-name-only differentiation** | Feels like scaling quickly | This is the textbook doorway page pattern. "Vi leverer nettsider i Oslo" and "Vi leverer nettsider i Drammen" are the same page with a swapped noun. Triggers the quiet deindexing penalty. | Write a unique intro paragraph per city that references real local context — industries, geography, or specific nearby areas. Even 2–3 unique sentences anchored in local reality pass the intent test. |
| **40+ city footer links** | Looks comprehensive | Google's webmaster guidelines cite this specific pattern as spammy. A wall of city links is a "doorway network" red flag. | Link to 6–8 Tier 1 cities in a clean "Områder vi dekker" footer section. The rest become relevant organically as V2/V3 pages get created and linked contextually. |
| **Fake "local office" address per city** | Boosts `address` schema trust | This is fraud. Using a virtual office address or co-working space address purely for schema is a violation of Google's local guidelines and will eventually trigger a manual penalty. | Be honest: Nettup is a service-area business. Use `areaServed` to declare coverage. This is the correct schema pattern and Google respects it. |
| **Identical service section per page** | Reduces copy effort | If services are described in identical language across all city pages, the similarity ratio across pages rises above the 60% unique threshold. | Share service section structure (same component), but vary service descriptions slightly per city, or accept that this is the "shared 40%" and ensure intro + FAQ + industry sections carry the uniqueness. |
| **Auto-generated city pages at launch** | Scales coverage fast | At V1, AI-generated copy for city pages produces thin content. Google is highly effective at detecting machine-generated local page content in 2026 — particularly the kind that rephrases "local businesses in [city] benefit from professional websites." | Hand-craft V1 (6–8 cities). Build the automation pipeline for V2 (30–50 towns) using AI + human review, not AI-only. |
| **Geo-targeted redirects based on visitor IP** | Feels personalized | Serves different content to Googlebot vs real users — this is cloaking, a spam policy violation. | Serve the same content to everyone. City pages are static, canonical, and crawlable. Let users choose their city explicitly. |
| **Generic keyword stuffing ("webbyrå Oslo webbyrå oslo webdesign Oslo")** | Old SEO tactic | Triggers spam detection. City name should appear naturally 3–5 times on the page — in the H1, the intro paragraph, the FAQ, and the schema. Not 15+ times in the body copy. | Use city name where it reads naturally. The schema does the machine-readable geo-targeting work. |

---

## Content Categories

The downstream consumer requested categories: Content, Schema, Internal Linking, City Data, Copy Strategy.

### Content

| Element | Unique per city? | Required | Notes |
|---------|-----------------|----------|-------|
| `<title>` tag | YES — must be | Table stakes | "Webbyrå [By] — Nettup" |
| `<meta description>` | YES | Table stakes | City name in first 10 words |
| H1 | YES | Table stakes | Includes city name naturally |
| Intro paragraph (200 words) | YES — critical | Table stakes | References local industries, geography, or character |
| Service section | NO — shared structure, slightly varied | Table stakes | Reuse `services.ts` data, vary CTA anchor text |
| FAQ section (3–4 questions) | YES (≥2 questions unique to city) | Table stakes | One question about nearby areas, one about local businesses |
| Industry mention | YES | Differentiator | 1–2 sentences on dominant local industries |
| Nearby areas list | YES (per city data) | Table stakes | Feeds schema `areaServed` and on-page text |
| Contact CTA | NO — shared, with city context | Table stakes | City name in CTA button or label |
| Testimonial | FUTURE (when real ones exist) | Differentiator | Field reserved in `locations.ts` |

### Schema

| Schema Type | Property | Purpose | Notes |
|------------|----------|---------|-------|
| `ProfessionalService` | `@type` | More precise than `LocalBusiness` for a web agency | Use this subtype, not generic `LocalBusiness` |
| `ProfessionalService` | `name` | "Nettup" | Consistent across all pages |
| `ProfessionalService` | `url` | Canonical city page URL | Per-city canonical, not homepage |
| `ProfessionalService` | `areaServed` | Array of city + nearby area names | Drives city-query relevance. Text strings, not GeoShape |
| `ProfessionalService` | `serviceArea` | `GeoCircle` centered on city (optional) | Optional enhancement for V2; not needed for V1 with named cities |
| `ProfessionalService` | `description` | City-specific service description | Must match the on-page intro — no mismatch between schema and body |
| `FAQPage` | FAQ questions and answers | Rich result eligibility + AI citability | Co-located with FAQ section (existing pattern from v1.1) |
| `BreadcrumbList` | 2-level breadcrumb | Site hierarchy signal | `Nettup > Webbyrå i [By]` |
| `Organization` (existing) | `sameAs` | Brand authority signal | Already in BaseLayout — no changes needed for city pages |

**What NOT to add:** `address` per city (Nettup has no per-city physical address), `openingHours` variations per city (same hours everywhere), `geo` coordinates per city (misleading for a service-area business).

### Internal Linking

| Link Source | Link Target | Anchor Text | Notes |
|------------|-------------|-------------|-------|
| Footer — "Områder vi dekker" section | All V1 city pages | "[By]" (plain city name) | Max 8 links. Clean section, not a dump of 40+ cities. |
| `/kontakt` page | City pages collection or hub | "Se alle byene vi dekker" | Or specific top 3 cities in body text |
| `/om-oss` page | Oslo page (most relevant) | "Vi er basert i Drammen og betjener hele Oslofjordregionen" | Natural, contextual mention |
| Blog articles (lokal-seo cluster) | Relevant city pages | City name in context | Update blog generation config to include city page links |
| City pages → each other | Regional neighbors | "Jobber du i [Asker]? Se vår side for [Bærum]" | Adds relevance for clusters; 1 link max per page to avoid spam signals |
| City pages → service pages | All 7 service pages | Service name | City pages are entry points — they must link to conversion pages |
| Service pages → city hub or top cities | Top 2–3 city pages | "Vi leverer [tjeneste] i Oslo, Drammen og omegn" | Reverse link equity flow |

**Do not:** Create a standalone `/steder` or `/byer` index page as the only entry point to city pages. That pattern (hub page with no content, only links) is itself a doorway pattern. Link from content-rich pages instead.

### City Data (`locations.ts` schema)

Each city entry in `locations.ts` must support V1/V2/V3 expansion without structural changes:

| Field | Type | V1 | V2 | V3 | Notes |
|-------|------|----|----|-----|-------|
| `slug` | `string` | required | required | required | URL segment: `oslo`, `drammen`, `asker` |
| `name` | `string` | required | required | required | Display name: "Oslo", "Drammen" |
| `region` | `string` | required | required | required | "Akershus", "Viken", "Oslo" |
| `intro` | `string` | hand-written | AI-assisted + human review | AI-generated | The unique paragraph. V1: full craft. |
| `industries` | `string[]` | hand-written | AI-assisted | AI-generated | Local industry clusters for the city |
| `nearbyAreas` | `string[]` | hand-written | hand-written | config | Towns served from this city page |
| `faq` | `FAQ[]` | hand-written | AI-assisted | AI-generated | `{question: string, answer: string}[]` |
| `areaServed` | `string[]` | derived from `nearbyAreas` + `name` | same | same | Feeds schema directly |
| `tier` | `1 \| 2 \| 3` | 1 | 2 | 3 | Content quality tier, informs generation pipeline |
| `testimonialSlug` | `string?` | null | null | null | Reserved for real testimonial cross-reference |
| `metaTitle` | `string?` | optional override | optional | optional | If default pattern needs override |
| `metaDescription` | `string?` | optional override | optional | optional | If default pattern needs override |

### Copy Strategy

**The city intro is the hardest and most important part.** It determines whether a page passes or fails the doorway test. Each Tier 1 intro must:

1. Open with a direct, specific claim that references the city (not just names it)
2. Mention 1–2 dominant local industries or business characteristics
3. Explain what Nettup does for those businesses specifically
4. Include geographic context (nearby areas, region, commuter belt)
5. Be written as a person, not a machine

**Good example (Drammen):**
> "Drammen er Norges femte største by og en voksende næringsregion med sterk industri-, logistikk- og teknologibase. Bedrifter her konkurrerer i et marked som strekker seg fra Kongsberg i sør til Sandvika i nord. Nettup hjelper Drammens-bedrifter med profesjonelle nettsider og nettbutikker som er raske, synlige i Google og bygget for å konvertere besøkende til kunder — fra vår base rett over fjorden."

**Bad example (doorway):**
> "Leter du etter et webbyrå i Drammen? Vi i Nettup leverer nettsider til bedrifter i Drammen og omegn. Kontakt oss for nettside i Drammen i dag."

**Scaling strategy for V2 (30–50 towns):** Use a two-call Claude generation pattern (same as blog pipeline) with a city data seed object. First call generates the body, second call generates metadata (title, description, FAQ). Human review gate before publish. The `tier: 2` field in `locations.ts` signals which pages went through AI generation vs hand-crafting.

---

## Feature Dependencies

```
[locations.ts config]
    +-- required by --> [getStaticPaths() in [location].astro]
    +-- drives --> [per-city SEO metadata]
    +-- drives --> [LocalBusiness/ProfessionalService JSON-LD]
    +-- drives --> [areaServed values in schema]
    +-- drives --> [nearbyAreas on-page text]
    +-- feeds --> [FAQPage JSON-LD (via faq[] field)]

[[location].astro dynamic route]
    +-- required by --> [all city pages]
    +-- reads from --> [locations.ts config]
    +-- includes --> [ProfessionalService JSON-LD]
    +-- includes --> [FAQPage JSON-LD]
    +-- includes --> [BreadcrumbList JSON-LD]
    +-- links to --> [service pages (conversion path)]
    +-- links to --> [contact page with pre-fill]

[Footer "Områder vi dekker" section]
    +-- links to --> [all V1 city pages]
    +-- prevents --> [orphaned pages (doorway red flag)]
    +-- requires --> [city pages to exist first]

[Contact page internal link update]
    +-- links to --> [city pages]
    +-- provides --> [2nd source of internal link equity]

[FAQPage JSON-LD]
    +-- requires --> [faq[] content in locations.ts]
    +-- pattern already exists in --> [v1.1 service pages]

[Blog lokal-seo cluster articles]
    +-- enhances --> [city pages via inbound editorial links]
    +-- requires --> [city pages to exist and be indexed first]

[Chatbot city context injection]
    +-- enhances --> [city pages UX]
    +-- requires --> [city page frontmatter passing city/region to ChatWidget]
    +-- existing infrastructure supports this --> [no new dependencies]
```

### Dependency Notes

- **`locations.ts` is the critical path.** Everything else depends on it being correctly structured. Get the data model right before writing any page component — it must support V1/V2/V3 without structural changes.
- **Orphan prevention is mandatory at launch.** City pages without internal links will fail Google's doorway page test. Footer update and `/kontakt` link update must ship with the city pages, not after.
- **FAQ content is a blocker for `FAQPage` JSON-LD.** The schema cannot be written until FAQ questions and answers exist in `locations.ts`. This means city data must be complete before the route template is finalized.
- **V2 AI generation pipeline is a separate milestone.** The `tier` field and AI generation workflow are future scope. V1 is hand-crafted only — resist the temptation to generate V1 content programmatically.

---

## MVP Definition

### Launch With (v1.5 core)

All items required for the milestone to be meaningful. A partial release (pages without internal links, or schema without unique copy) is worse than no release.

**Infrastructure:**
- [ ] `locations.ts` with V1/V2/V3-ready schema — 6–8 Tier 1 entries with all fields populated
- [ ] `[location].astro` dynamic route with `getStaticPaths()` driven by `locations.ts`
- [ ] Per-city `<title>`, `<meta description>`, canonical URL
- [ ] `ProfessionalService` JSON-LD with `areaServed` per city
- [ ] `FAQPage` JSON-LD from `faq[]` field
- [ ] `BreadcrumbList` JSON-LD
- [ ] Sitemap auto-includes generated city pages (already handled by existing Astro integration)

**Content (per city):**
- [ ] Unique intro paragraph (200+ words, references local industries and geography)
- [ ] Industry mention (1–2 sentences, specific to city)
- [ ] Nearby areas list (2–4 towns per city, rendered on-page and in schema)
- [ ] City-specific FAQ (3–4 questions, ≥2 genuinely local)
- [ ] Service section (shared structure, city-aware CTA links)
- [ ] Contact CTA with city context

**Internal linking (ship with pages, not after):**
- [ ] Footer "Områder vi dekker" section linking to all V1 city pages
- [ ] `/kontakt` page mentions coverage area with city links
- [ ] City pages link to relevant service pages

### Add After Validation (v1.5.x)

- [ ] Real testimonials per city — when actual client quotes from each area are available
- [ ] Blog articles linking to city pages — update lokal-seo cluster config
- [ ] Chatbot city context injection — once city pages are indexed and converting
- [ ] `/om-oss` page geographic mention — minor, but adds contextual internal link

### Future Consideration (v2+)

- [ ] 30–50 Tier 2 city pages — requires AI generation pipeline with human review gate
- [ ] `serviceArea` with `GeoCircle` coordinates — marginal gain, only relevant at V3 scale
- [ ] City-specific landing page for each service type (e.g., `/oslo/nettbutikk`) — high complexity, only if Tier 1 city pages are ranking and converting
- [ ] Regional hub pages (e.g., `/oslofjord`) — aggregates nearby city pages, only useful at V3 scale

---

## Feature Prioritization Matrix

| Feature | SEO/User Value | Implementation Cost | Priority |
|---------|----------------|---------------------|----------|
| `locations.ts` V1/V2/V3-ready schema | HIGH | LOW | P1 |
| `[location].astro` with `getStaticPaths()` | HIGH | LOW | P1 |
| Unique city intro paragraphs (6–8 cities) | HIGH (doorway test) | MEDIUM (writing time) | P1 |
| `ProfessionalService` JSON-LD + `areaServed` | HIGH | LOW | P1 |
| `FAQPage` JSON-LD (city-specific questions) | HIGH | LOW | P1 |
| Footer "Områder vi dekker" section | HIGH (orphan prevention) | LOW | P1 |
| Per-city `<title>` + `<meta description>` | HIGH | LOW | P1 |
| Industry mentions per city | MEDIUM–HIGH | LOW (1–2 sentences) | P1 |
| Nearby areas on-page text | MEDIUM | LOW | P1 |
| BreadcrumbList JSON-LD | MEDIUM | LOW | P1 |
| `/kontakt` internal link update | MEDIUM | LOW | P1 |
| Service section with city-aware CTA | MEDIUM | LOW | P1 |
| Chatbot city context injection | MEDIUM | MEDIUM | P2 |
| Blog cross-links from lokal-seo articles | MEDIUM | LOW | P2 |
| Real testimonials per city | HIGH (when available) | EXTERNAL (client) | P2 (blocked) |
| `serviceArea` GeoCircle coordinates | LOW | LOW | P3 |
| Per-service city pages (`/oslo/nettbutikk`) | HIGH (long term) | HIGH | P3 |

---

## Norwegian Market Specifics

These points apply specifically to the Norwegian context and are not covered in generic local SEO guides.

**Language:** All content in Norwegian bokmål. `hreflang="nb"` in schema. Query patterns use "webbyrå" (not "webbyrå"), "nettside for bedrift", "nettside Drammen". Norwegian users search in Norwegian — no need for English variants.

**Geographic clusters:** The Tier 1 cities are not random — they follow the Oslo commuter belt (Oslofjordregionen/Viken). This is Nettup's actual operational market. Asker, Bærum, Sandvika, and Ski are effectively greater-Oslo suburbs. Lillestrøm and Moss are regional centres with distinct business communities. The city pages should acknowledge this regional coherence, not pretend each city is an isolated market.

**No Google Business Profile at launch:** The PROJECT.md lists Google Business Profile as deferred. This means city pages carry all the local SEO weight at launch — schema and on-page content must work without GBP citation support. This increases the importance of `areaServed` completeness and on-page geographic specificity.

**Org number trust signal:** Norwegian B2B buyers verify org numbers on Proff.no or Brønnøysundregistrene. The existing `Organization` schema in BaseLayout already includes this. No change needed for city pages — they inherit from `BaseLayout`.

**Vipps:** Not relevant for a web agency landing page (no e-commerce on the marketing site).

**Competitor landscape:** Norwegian web agencies with local pages (Mediseo, Journey Agency, A2N) generally use a pattern of: service page with city name in title + a brief geographic paragraph. They do not typically include: city-specific FAQ, industry mentions, nearby areas, or `areaServed` in schema. This means Tier 1 pages built to the standard above will be technically superior to most current competitors' local pages.

---

## Sources

- PROJECT.md (`/Users/iverostensen/nettup/.planning/PROJECT.md`) — milestone scope and existing architecture (HIGH confidence)
- [RicketyRoo: Location Page Spam — What Crosses the Line?](https://ricketyroo.com/blog/location-page-spam/) — doorway page definition and detection patterns (HIGH confidence, 2026)
- [Sterling Sky: How to Create Unique and Helpful Service Area Pages](https://www.sterlingsky.ca/how-to-create-unique-and-helpful-service-area-pages-for-local-businesses/) — uniqueness requirements, thin content patterns (HIGH confidence)
- [Search Engine Land: Service Area Pages](https://searchengineland.com/guide/service-area-pages) — hub/spoke structure, orphan page risks (HIGH confidence)
- [Dalton Luka: How to Create Local Landing Pages That Rank (2026)](https://daltonluka.com/blog/local-landing-pages) — content structure, schema, internal linking (MEDIUM confidence)
- [Arc4: Local Landing Pages (2026)](https://arc4.com/local-landing-pages/) — table stakes content elements (MEDIUM confidence)
- [Schema.org: LocalBusiness](https://schema.org/LocalBusiness) — `areaServed`, `serviceArea` property definitions (HIGH confidence, authoritative)
- [Schema.org: ProfessionalService](https://schema.org/ProfessionalService) — correct subtype for web agency (HIGH confidence, authoritative)
- [AuthorityNW: Service-Area Businesses Schema Setup](https://authoritynw.com/blog/service-area-businesses-gmb-schema-setup/) — `areaServed` vs `serviceArea` distinction (MEDIUM confidence)
- [Search Engine Journal: Hub & Spoke Internal Links](https://www.searchenginejournal.com/hub-spoke-internal-links/442005/) — internal link strategy for city pages (MEDIUM confidence)
- [Journey Agency: Webbyrå Oslo](https://journeyagency.com/tjenester/nettside-og-brukeropplevelse/webbyra-oslo/) — Norwegian competitor local page analysis (HIGH confidence, direct observation)
- [Google Search Central Community: Landing pages turn into doorway pages](https://support.google.com/webmasters/thread/135300269/landing-pages-turn-into-doorway-pages?hl=en) — Google's stated position on location page patterns (HIGH confidence)
- [First Page Sage: Local SEO 2026](https://firstpagesage.com/seo-blog/local-seo-guide/) — 2026 local ranking factors (MEDIUM confidence)

---
*Feature research for: Nettup v1.5 — Lokale SEO-sider (city landing pages)*
*Researched: 2026-03-08*
