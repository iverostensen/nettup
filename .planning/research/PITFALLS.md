# Pitfalls Research

**Domain:** Additive price calculator for web agency (replacing simple wizard)
**Project:** Nettup.no v1.2 Smart Priskalkulator
**Researched:** 2026-03-06
**Confidence:** HIGH (codebase analysis of existing wizard + domain experience with multi-step pricing UX)

---

## Critical Pitfalls

### Pitfall 1: Decision Fatigue Kills Completion Rate

**What goes wrong:**
The current wizard asks 2-3 questions and takes "under ett minutt." Moving to a deep additive calculator with questions across 4 categories (storrelse, features, integrasjoner, designniva) easily reaches 8-12 questions. Users who came for a quick estimate abandon midway. The very feature meant to impress becomes a conversion killer. The target audience is "teknisk ukyndige beslutningstakere" -- they want a number, not a configurator.

**Why it happens:**
Developers think more granularity = more value. Each additional question feels reasonable in isolation ("surely they want to specify CMS choice?"), but cumulatively they create a wall. The additive model tempts you to ask about everything that adds cost, because every question "makes the estimate more accurate."

**How to avoid:**
- Cap at 5-6 questions maximum per service path. Not 8, not 12.
- Use smart defaults: pre-select the most common option for each question. This turns 6 questions into "confirm, confirm, change, confirm, done."
- Show the running price total updating live as they answer -- immediate feedback and motivation to continue.
- Group related choices into single compound questions ("Storrelse og innhold" rather than separate "antall sider" + "antall seksjoner" + "innholdsomfang").
- For any question where 80%+ of users would pick the same answer, make it a default, not a question.

**Warning signs:**
- More than 6 steps in any service flow
- Questions where the "most common" answer is obvious
- Completion rate below 60%

**Phase to address:**
Phase 1 (pricing config design) -- the question set must be designed before any code. If the config has 15 question fields per service, the UX is already broken regardless of how pretty the form is.

---

### Pitfall 2: Price Config Becomes a Second Codebase

**What goes wrong:**
The pricing config file grows into a complex nested structure with conditional logic, dependencies between options, discount rules, and special cases. What started as "a TS file anyone can edit" becomes a 500-line monster that only the developer understands. Updating a single price requires understanding the entire dependency graph.

**Why it happens:**
Additive pricing seems simple (base + features = total) until you encounter real-world cases: "CMS adds 4000 kr to nettside but is included in nettbutikk," "custom design adds 30% to base, not a flat fee," "Shopify monthly is platform-dependent, not a Nettup fee." Every special case adds a rule, and rules compound.

**How to avoid:**
- Flat additive model only: every option adds a fixed NOK amount (min and max). No percentage-based additions, no conditional pricing, no cross-option dependencies.
- If an option truly has different prices per service, duplicate the option in each service's config rather than creating a shared option with conditional logic.
- Separate the config into one section per service. No shared "features" array that gets filtered by service type.
- Keep the config in TypeScript (not JSON) so you get type checking, but keep it data-shaped -- no functions, no computed values, no imports from other modules.
- The existing `services.ts` stays for service metadata (name, tagline, slug). Create a NEW separate pricing config file. Don't bolt pricing complexity onto the Service interface.

**Warning signs:**
- Config file exceeds 150 lines
- Any `if/else` or ternary logic in the config
- Options that reference other options ("only available if X is selected")
- Developer needs to "test" a price change by running the calculator through

**Phase to address:**
Phase 1 (config design). The config schema is the foundation -- everything built on top inherits its complexity.

---

### Pitfall 3: Ranges So Wide They're Meaningless

**What goes wrong:**
Result shows "15 000 - 85 000 kr" which tells the customer nothing useful. They came for guidance and got a shrug. Alternatively, ranges too narrow ("23 400 - 25 100 kr") set unrealistic expectations for a service that hasn't been scoped in a discovery call.

**Why it happens:**
Wide ranges come from multiplicative uncertainty: if 3 options each have their own min/max with 2x spread, the combined range can be 8x. The additive model multiplies uncertainty rather than narrowing it. Narrow ranges come from treating the calculator as a quote generator rather than an estimator.

**How to avoid:**
- Target a max 2x spread on the final range (e.g., 15 000 - 30 000 kr, not 15 000 - 85 000 kr).
- Use fixed price additions per option, not ranges per option. The range should come from the base price only (representing design complexity and unknowns), with features adding fixed known amounts.
- Example: Base nettside 8 000-12 000 kr (1.5x range) + CMS 4 000 kr (fixed) + bookingintegrasjon 3 000 kr (fixed) = 15 000-19 000 kr. Still a useful, believable range.
- Show the line items that compose the total. "Grunnpris: 8-12k, CMS: +4k, Booking: +3k" makes a wider total feel justified because the customer sees WHY.

**Warning signs:**
- Any result range wider than 2.5x (max/min ratio)
- Monthly cost ranges wider than 2x
- Users clicking "kontakt" without engaging with the estimate (suggests the number wasn't useful enough to review)

**Phase to address:**
Phase 1 (config design) for the pricing model, Phase 3 (results UI) for the line-item breakdown display.

---

### Pitfall 4: State Management Breaks on Back Navigation

**What goes wrong:**
User is on step 4 of 5, clicks browser back or a "tilbake" button, and either: (a) leaves the page entirely, (b) goes back to step 1 losing all answers, or (c) goes back to step 3 but the running total doesn't recalculate. The current wizard uses simple `useState` tracking only `phase`, `narrowStep`, and final `priceEstimate` -- it stores nothing about intermediate answers. The new additive calculator must store every selection because the price is the sum of all answers.

**Why it happens:**
The current `PrisKalkulatorIsland` only captures the price from the LAST question's selected option (line 182-186: `priceEstimate: option.priceEstimate`). This works for a funnel-to-price wizard but completely breaks for additive pricing where every step contributes to the total.

**How to avoid:**
- Store answers as a record keyed by step index or category. Each step writes to its slot. Going back doesn't clear forward answers unless the user changes their selection at that step.
- Use `useReducer` instead of `useState`. Actions: `SELECT_OPTION`, `GO_BACK`, `RESET`. The reducer ensures state transitions are predictable and testable in isolation.
- Do NOT use browser history / URL state for wizard steps. This is a React island embedded in an Astro page -- history API manipulation will conflict with Astro's page routing and View Transitions.
- Compute the price from the stored answers on every render (derived state). `answers.reduce((sum, a) => sum + a.priceAdd, basePrice)` is simpler and can never get out of sync. Never try to incrementally update a running total.

**Warning signs:**
- Price total stored as mutable state that gets incremented/decremented on step change
- No way to go back to a previous step
- More than 3 `useState` calls in the component (signals need for `useReducer`)
- Back navigation resets the entire form

**Phase to address:**
Phase 2 (component architecture). Must be designed into the state model from the start -- retrofitting back-nav onto an incremental-total model is a rewrite.

---

### Pitfall 5: Dual-Use (Customer vs Internal) Creates Design Paralysis

**What goes wrong:**
Building a calculator that serves both external customers and internal sales creates conflicting requirements. Customers need simplicity and reassurance. Internal use needs precision, notes, edge-case options, and the ability to override prices. Trying to serve both in one UI makes it mediocre for everyone. Or worse: the project stalls because every design decision triggers "but what about internal use?"

**Why it happens:**
PROJECT.md says the calculator should be "brukes internt av Nettup for kundeprising." This sounds like one sentence but it's actually a second product. Internally you want all variables visible, price overrides, custom line items, proposal export. Externally you want a clean, guided, 60-second experience.

**How to avoid:**
- Build for customers first, use for internal second. The public calculator IS the internal tool, used with domain knowledge. A Nettup employee knows which options to select -- they don't need a different interface.
- Do NOT build an "internal mode" with hidden features, admin toggles, or URL parameters that unlock extra options. This doubles the testing surface and maintenance burden for a tool used by 1-3 people internally.
- If internal needs truly diverge later (custom line items, overridden prices), that's a different tool -- a spreadsheet or a future admin panel. Not this calculator.
- The one concession: make the results page easy to screenshot or copy. "Kopier estimat" button that copies a clean text summary. This serves both customer ("send this to my partner") and internal ("attach to proposal email").

**Warning signs:**
- Designing features "for internal use" that customers won't see
- Adding query parameters or hidden modes
- Scope creep from internal feature requests before v1 of the calculator ships
- Config options that only make sense to a Nettup employee, not a customer

**Phase to address:**
Phase 1 (design decisions). Decide this upfront and document it: the calculator is a customer tool that Nettup also happens to use.

---

### Pitfall 6: Same Component on Two Pages Creates Drift

**What goes wrong:**
The calculator lives on both `/priskalkulator` (dedicated page) and `/tjenester` (as a section). If they're two separate component instances with different wrappers passing different props, they drift: one gets a bug fix the other doesn't, or they render differently due to parent layout differences. If someone tries to share state between them, navigating between pages resets it (Astro islands are isolated per page).

**Why it happens:**
The current `PrisKalkulatorIsland` is embedded in `/tjenester` via `PrisKalkulator.astro`. Adding it to `/priskalkulator` creates a second mount point. Natural instinct is to pass props like `preSelectedService` or `showHeader` to customize per page, which creates two divergent configurations.

**How to avoid:**
- One React component, zero behavior-changing props. Both pages render `<SmartPrisKalkulator client:visible />` identically.
- The Astro wrapper sections can differ (different titles, different surrounding content), but the island itself must be identical.
- If `/priskalkulator` needs a "pre-selected service" from a URL parameter (e.g., coming from a service page via `?tjeneste=nettside`), handle that INSIDE the component with `window.location.search` parsing, not via Astro props. This keeps both mount points identical.

**Warning signs:**
- Component accepts props that change its behavior per page
- Different Astro wrappers passing different props to the island
- Bug fixes applied in one page's copy but forgotten in the other

**Phase to address:**
Phase 2 (component architecture). Design the component as fully self-contained from the start.

---

### Pitfall 7: Replacing the Working Wizard Too Early

**What goes wrong:**
The existing `PrisKalkulatorIsland` works. It's live. It converts visitors. Developing the new calculator in-place by modifying the existing component means the live site has a broken or half-finished calculator for the entire development period. Every deploy is a risk.

**Why it happens:**
It feels efficient to modify the existing component. "It's the same thing, just more complex." But the new calculator is structurally different -- different state model, different config source, different result display.

**How to avoid:**
- Build the new component with a new name (`SmartPrisKalkulator` or similar). Keep the existing `PrisKalkulatorIsland` untouched and live.
- Only swap when the new component is complete, tested, and ready to deploy.
- The swap is a one-line change in the Astro wrapper: replace the component import.
- Delete the old component only after the new one has been live and stable for at least a week.

**Warning signs:**
- Direct edits to `PrisKalkulatorIsland.tsx` for the new calculator
- Broken calculator on production between deploys
- "It's almost ready" state that stretches across multiple deploys

**Phase to address:**
Phase 2 (component build). Start with a new file. Never modify the existing component.

---

### Pitfall 8: Over-Animating Price Updates

**What goes wrong:**
Every price change triggers a number-counting animation, every option selection has a spring animation, step transitions have elaborate enter/exit sequences. The calculator feels sluggish. Users click an option and wait 400ms before they can proceed. On mobile, animation jank makes the tool feel broken.

**Why it happens:**
The existing wizard uses Framer Motion with spring physics and AnimatePresence, and it works well for 3 steps. But a 5-6 step calculator with a running price total means more animations firing more often. The current code already has animation overhead (slideVariants, springs.gentle) -- scaling this to more steps and live price updates compounds the jank.

**How to avoid:**
- Animate step transitions only (slide in/out). Keep `AnimatePresence mode="wait"` for step swaps.
- Do NOT animate the price number (no counting-up animation). Update it instantly. Rapidly changing animated numbers feel janky and slow.
- Use CSS transitions (not Framer Motion) for the progress bar and selected-state highlights.
- Disable option buttons during the exit animation transition (~200ms) to prevent rapid-click queueing.
- Test on a real low-end Android phone, not just desktop Chrome.

**Warning signs:**
- `motion.span` or `AnimatePresence` wrapping the price display
- Animation duration longer than 300ms for step transitions
- Users can click faster than animations complete, causing queued transitions

**Phase to address:**
Phase 3 (UI polish). Animation decisions should be conservative initially -- add only what genuinely improves UX.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding prices in the component instead of config | Faster to prototype | Every price change requires code change and deploy | Never -- config-driven pricing is the core v1.2 requirement |
| Storing all pricing logic in one massive config object | Simple to find everything | Impossible to update one service without risk of breaking others | Never -- separate per-service config sections |
| Skipping `useReducer` and using multiple `useState` | Slightly less initial boilerplate | State bugs when selections interact, impossible to add back-navigation cleanly | Only for a throwaway prototype, never for production |
| Not showing line items in result | Simpler result UI | Users distrust the total, internal use is impaired, price feels arbitrary | Never -- line items are essential for trust and dual-use |
| Modifying existing PrisKalkulatorIsland directly | Avoid creating a new file | Live site broken during development, no rollback path | Never -- build new component alongside existing one |
| Putting pricing config in services.ts | Single file for all service data | services.ts becomes a 300-line config mixing metadata with pricing logic | Never -- separation of concerns |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Existing `services.ts` config | Extending the Service interface with all pricing fields (steps, options, additive amounts) | Keep `services.ts` for metadata (name, tagline, slug). Create a separate `pricing.ts` config that references service slugs. Clean separation. |
| Existing CTA flow (`?tjeneste=` param) | Breaking the existing kontakt pre-fill flow when changing calculator output | Keep the same `?tjeneste=` param format on the "Kom i gang" CTA. Optionally pass pricing summary via sessionStorage for the kontakt page to display, but don't change the URL contract. |
| Existing `PrisKalkulator.astro` wrapper | Modifying the wrapper and breaking `/tjenester` during development | Build the new component with a new name. Create a new Astro wrapper. Swap only when ready. |
| Framer Motion animations | Over-animating every price update and step transition (see Pitfall 8) | Animate step transitions (slide). Do NOT animate price number updates. Use CSS transitions for micro-interactions. |
| Launch discount (`LAUNCH_DISCOUNT = 0.4`) | Applying the 40% discount inside the calculator with hardcoded logic | Keep discount handling in the config or as a separate concern. The discount might change or expire -- it shouldn't be baked into component logic. |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Large pricing config imported into client bundle | Bundle size increase, slower island hydration | Keep config small and flat. Current island is 4.43 kB gzipped. New one should stay under 10 kB. | If config exceeds ~200 options across all services |
| Re-rendering entire form on every selection | Visible lag on mobile when tapping options | Memoize step components. Price computation in `useMemo`. Only re-render active step + price display. | Noticeable on low-end mobile with 6+ animated elements per step |
| AnimatePresence with many exit animations queued | Animation jank when clicking through steps quickly | Use `mode="wait"` (already in current code) and disable buttons during exit transition | When user clicks faster than animation duration (~300ms) |
| Importing full Framer Motion for simple transitions | Adds to an already 58.47 kB React client bundle | For the progress bar and price highlight, use CSS transitions. Reserve Framer Motion for step enter/exit only. | Not a hard break, but every kB matters for LCP < 2s |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Treating calculator output as a binding quote | Customer disputes: "your site said 15 000 kr" | Always display disclaimer: "Estimat -- endelig pris avtales etter samtale." Prominent, not fine print. |
| Exposing internal pricing margins in client code | Competitors see cost structure, pricing strategy | Config contains customer-facing prices only. No cost/margin data. No "internal" pricing tiers in client-side code. |
| Pricing config editable via URL params | Someone crafts a URL that overrides prices and shares it | Calculator reads from static config only. No URL-driven price overrides. |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Asking technical questions to non-technical users | "Trenger du headless CMS eller tradisjonell?" -- user has no idea | Frame in outcomes: "Vil du kunne oppdatere innholdet selv?" (current wizard does this well -- preserve the pattern) |
| No progress indicator | User doesn't know if they're 20% or 80% done, anxiety grows | Show step progress: "Steg 3 av 5" with visual progress bar. Current wizard has "Sporsmal X av Y" text -- enhance with a visual bar |
| Price shock without context | User sees "fra 25 000 kr" and closes tab | Show what's included with each addition: "CMS (+4 000 kr) -- oppdater innhold uten utvikler." Frame additions as value, not cost |
| No "usikker" option on questions | User forced to guess, picks wrong answer, gets wrong estimate | Add "Vet ikke enna" for non-critical questions. Use middle-of-range pricing for uncertain answers |
| Tiny tap targets on mobile | Misclicks on 375px screens | Current wizard uses full-width buttons with p-4 padding (good). Maintain this. Don't switch to compact radio buttons or checkbox grids |
| No way to share or save results | User can't show estimate to business partner | Add "Kopier estimat" button on results. Copies clean text summary to clipboard. Simple, no backend needed |
| Result page shows only a total number | User doesn't understand what they're paying for | Show full line-item breakdown: base price, each selected feature with its cost, monthly costs separately |
| Monthly and one-time costs mixed together | User thinks monthly cost is a one-time fee, or vice versa | Visually separate one-time "Oppstartskostnad" and recurring "Maanedlig kostnad" sections with clear labels |

---

## "Looks Done But Isn't" Checklist

- [ ] **Back navigation:** Can the user go back to any previous step and change an answer without losing other answers?
- [ ] **Price recalculation:** When a user changes a previous answer, does the running total update correctly (recalculated from all stored answers, not incrementally adjusted)?
- [ ] **Mobile scroll position:** When advancing to the next step, does the viewport scroll to the top of the calculator component? (AnimatePresence swap can leave user scrolled to wrong position on mobile)
- [ ] **Reduced motion:** Do all step transitions respect `prefers-reduced-motion`? (Current wizard handles this -- verify new one does too)
- [ ] **Pre-selected service:** If user arrives at `/priskalkulator?tjeneste=nettbutikk`, does the calculator skip to the nettbutikk flow?
- [ ] **Disclaimer visible:** "Dette er et estimat" disclaimer prominent on the results page. Not hidden, not fine print.
- [ ] **Monthly costs separate:** Monthly costs shown separately from one-time costs, also additive based on selections.
- [ ] **Line items visible:** Result shows a breakdown of what's included and what each item costs.
- [ ] **CTA flow intact:** "Kom i gang" links to `/kontakt?tjeneste=X` and the contact form pre-fills correctly.
- [ ] **Both pages identical:** Calculator works identically on `/priskalkulator` and `/tjenester`.
- [ ] **Norwegian content:** All labels, descriptions, error states, and button text in Norwegian. No English leaking through.
- [ ] **Launch discount applied:** The 40% launch discount is reflected correctly in the estimate. When the discount expires, it should be removable from config without touching component code.
- [ ] **Empty/edge states:** What happens with zero add-ons selected? What if all "vet ikke" options are chosen?

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Config too complex (Pitfall 2) | MEDIUM | Extract per-service configs, flatten conditional logic, remove cross-option dependencies. Config refactoring, minimal UI changes. |
| Too many questions / low completion (Pitfall 1) | LOW | Remove lowest-value questions, merge related ones, add smart defaults. Config change + minor UI tweak. |
| Price ranges too wide (Pitfall 3) | LOW | Tighten base ranges, make more additions fixed-price. Config-only change, no UI work. |
| State management bugs (Pitfall 4) | HIGH | If built with ad-hoc useState, requires rewrite to useReducer. Affects entire component architecture. |
| Dual-mode complexity (Pitfall 5) | HIGH | Rip out internal-only features, simplify back to single-purpose. Significant UI surgery. |
| Two-page drift (Pitfall 6) | LOW | Consolidate to one prop-free component. Localized refactor. |
| Broken live site during dev (Pitfall 7) | HIGH | Must emergency-revert or fast-forward. Preventable by building alongside, not in-place. |
| Over-animated calculator (Pitfall 8) | LOW | Remove/simplify animations. CSS changes only. |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Decision fatigue (1) | Phase 1: Config design | Count questions per service flow. Max 5-6. Test with a non-technical person. |
| Config complexity (2) | Phase 1: Config design | Config under 150 lines. No conditional logic. All types pass strict TypeScript check. |
| Wide price ranges (3) | Phase 1: Config design | No result range exceeds 2.5x ratio. Run sample calculations for all 3 services. |
| State management (4) | Phase 2: Component build | useReducer with typed actions. Back-nav works. Price recalculates correctly on answer change. |
| Dual-use paralysis (5) | Phase 1: Design decisions | Decision documented: "customer-first, no internal mode." |
| Two-page sync (6) | Phase 2: Component build | Same component, zero behavior-changing props. Render on both pages, verify identical behavior. |
| Replacing wizard too early (7) | Phase 2: Component build | New component has a new filename. Old component untouched until swap. |
| Over-animation (8) | Phase 3: Polish | Step transitions only. No animated price numbers. Test on low-end mobile. |

---

## Sources

- Codebase analysis: `src/components/islands/PrisKalkulatorIsland.tsx` -- current 379-line wizard, state model, animation patterns
- Codebase analysis: `src/config/services.ts` -- current Service interface, 3 services, pricing fields
- Codebase analysis: `src/pages/tjenester/_sections/PrisKalkulator.astro` -- current Astro wrapper pattern
- PROJECT.md v1.2 milestone requirements -- additive pricing, 4 categories, config-driven, dual-use, dedicated page
- Multi-step form UX patterns -- well-established domain knowledge (HIGH confidence)
- React state management patterns for wizard forms -- useReducer vs useState tradeoffs (HIGH confidence)

---
*Pitfalls research for: Additive price calculator (v1.2 Smart Priskalkulator)*
*Researched: 2026-03-06*
