# Project Retrospective: Nettup.no

*A living document updated after each milestone. Lessons feed forward into future planning.*

---

## Milestone: v1.0 — Launch

**Shipped:** 2026-03-04
**Phases:** 5 | **Plans:** 15 | **Timeline:** 2 days (2026-03-03 → 2026-03-04)

### What Was Built
- Brand identity system: BRAND.md, design token system (brand.ts → Tailwind), Space Grotesk typography
- Animation showcase: HeroIsland.tsx with orchestrated spring physics, HeroDeliveryAnimation 14-day delivery loop
- SEO coverage: BreadcrumbList, 3× Service schemas, per-page OG metadata and titles across all 5 pages
- Conversion layer: Contextual CTAs on /om-oss and /prosjekter, pricing pre-fill via ?pakke= URL param, WCAG 44px touch targets site-wide
- Testimonials section with typed config (placeholder copy — needs real testimonials before launch)

### What Worked
- **Brand-first sequencing:** Writing BRAND.md in Phase 1 gave Phase 2–4 concrete anchors — tone rules, contrast table, and visual values references (Framer, Resend) were used directly in subsequent phases
- **Token system eliminates drift:** `src/config/brand.ts` → Tailwind pattern meant Phase 4 had zero design inconsistencies to fix — all components already used tokens from Phase 1
- **useAnimate for animation loops:** Choosing imperative API over declarative variants was correct — springs have no fixed duration and would have broken await chains in the delivery loop
- **Human verification checkpoints:** Build-in human visual checkpoints (02.1-02, 04-02) caught real issues that automated checks can't (animation timing, 375px feel)
- **Config-driven data:** `src/config/projects.ts` and `src/config/testimonials.ts` pattern makes content additions zero-code — same pattern as existing `pricing.ts`

### What Was Inefficient
- Phase 02.1 was inserted as an urgent phase mid-milestone — the initial Phase 2 hero plan (stats card) was replaced entirely. Better upfront scoping of what "impressive hero animation" means would have avoided a rework phase
- Testimonials placeholder copy means this feature ships incomplete — should have surfaced this constraint earlier and either left it for v1.1 or built real content into scope

### Patterns Established
- `useAnimate + cancelled flag pattern` for unmount-safe async loops (see HeroDeliveryAnimation.tsx)
- `min-h-11 flex items-center` for inline anchor tap targets (44px WCAG minimum)
- `config/*.ts → Astro section` data flow for all content that might change (projects, testimonials, pricing)
- Brand token classes (`duration-fast`, `rounded-md`, `delay-N`) — never hardcode in component files

### Key Lessons
1. **Define "impressive" concretely before animating.** Phase 2 built a stats card; Phase 2.1 replaced it with a delivery story. Upfront time asking "what feeling should this create?" would save a rework phase.
2. **Content operations are part of feature shipping.** Testimonials shipped technically complete but content-incomplete. Either ship with real content or don't ship the feature — placeholder = tech debt.
3. **The token system is architecture.** Brand.ts is not just config — it's the constraint system that makes all downstream phases consistent without coordination overhead. Establish it first, always.
4. **Astro islands are the right default.** Pure Astro sections for static content, React islands only when animation sequencing is needed. This boundary held cleanly throughout v1.0.

### Cost Observations
- Model: Claude Sonnet 4.6 throughout (quality profile)
- All plans completed in 1–5 min average execution time
- Notable: Phase 02.1 was the most expensive phase (2 plans, but conceptually the heaviest — new animation architecture)

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 5 | 15 | First milestone — established brand-first sequencing and token system pattern |

### Top Lessons (Verified Across Milestones)

1. Brand identity first — all visual/copy decisions become easier with concrete anchors
2. Content operations are feature work — don't ship placeholder content without a plan to replace it
