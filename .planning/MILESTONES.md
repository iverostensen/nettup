# Milestones

## v1.1 Tjenesteutvidelse (Shipped: 2026-03-06)

**Phases completed:** 7 phases (6–12), 18 plans
**Timeline:** 2026-03-04 → 2026-03-06 (3 days)
**LOC:** ~8,112 TypeScript/TSX/Astro
**Git range:** 134 commits

**Delivered:** /tjenester utvidet fra generisk 3-nivå pristabell til fullverdig tjenestekatalog med 7 dedikerte undersider, mål-først priskalkulator, og AI chatbot-widget — komplett konverteringsløp fra oppdagelse til kontakt.

**Key accomplishments:**
1. Tjenestekatalog med 7 dedikerte undersider — outcome-first innhold med prisintervaller og JSON-LD Service + FAQPage schema
2. services.ts som single source of truth for all tjenestemetadata, cross-linking og prisdata
3. Mål-først priskalkulator — 4-fase wizard (mål → anbefaling → innsnevring → resultat) med Framer Motion
4. AI chatbot-widget — Claude-drevet tjenersterådgiver med SSE streaming, sidebevissthet og in-chat lead capture
5. Infrastruktur — ?tjeneste= pre-fill, breadcrumbs, aktiv nav-state på undersider
6. Cross-linking med relaterte tjenester og validert strukturert data på alle sider

---

## v1.0 Launch (Shipped: 2026-03-04)

**Phases completed:** 5 phases (1, 2, 2.1, 3, 4), 15 plans
**Timeline:** 2026-03-03 → 2026-03-04 (2 days)
**LOC:** ~6,136 TypeScript/TSX/Astro
**Git range:** `4a138fe` (feat(01-01)) → `e162a50` (refactor(ui))

**Delivered:** Nettup.no transformed from competent but generic to a polished showcase demonstrating brand identity, technical animation capability, full SEO coverage, and optimized conversion flows.

**Key accomplishments:**
1. Brand personality document written — mission statement, tone of voice rules, contrast table in Norwegian establishing Nettup's identity
2. Design token system (`src/config/brand.ts` → Tailwind) + animation preset library (`src/lib/animation.ts`) eliminating all hardcoded values
3. HeroIsland.tsx with orchestrated Framer Motion spring sequence replaces static hero — demonstrates technical capability on first load
4. HeroDeliveryAnimation — cinematic 14-day delivery story loop makes Nettup's 2-week promise visceral
5. Full SEO suite: BreadcrumbList, 3× Service schemas, per-page OG metadata and unique titles/descriptions across all 5 pages
6. Testimonials section, contextual CTAs on all pages, pricing pre-fill wiring, and WCAG 44px touch targets site-wide

---

