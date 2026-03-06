---
phase: 09-specialist-service-pages
plan: "04"
subsystem: pages
tags: [ai, service-page, faq, json-ld, gdpr]
dependency_graph:
  requires: [09-01]
  provides: [tjenester/ai page]
  affects: [sitemap, FloatingNav]
tech_stack:
  added: []
  patterns: [4-section service page, FAQPage JSON-LD co-located in FAQ.astro, Service JSON-LD in index.astro]
key_files:
  created:
    - src/pages/tjenester/ai/index.astro
    - src/pages/tjenester/ai/_sections/Hero.astro
    - src/pages/tjenester/ai/_sections/Inkludert.astro
    - src/pages/tjenester/ai/_sections/FAQ.astro
    - src/pages/tjenester/ai/_sections/CTA.astro
  modified: []
decisions:
  - "GDPR integrated as first FAQ question (not a separate section) with locked reassuring framing including databehandleravtale (DPA)"
  - "Hero uses animate-fade-up (not reveal-on-scroll) for above-fold content — consistent with established pattern"
  - "Both one-time price (fra 20 000 kr) and monthly maintenance (fra 1 000 kr/mnd) shown as separate lines in Hero"
  - "FAQPage JSON-LD co-located in FAQ.astro (consistent with 08-01/08-02/08-03/09-03 pattern)"
metrics:
  duration: 2 min
  completed: "2026-03-05"
  tasks_completed: 2
  files_created: 5
---

# Phase 9 Plan 4: AI-løsning Service Page Summary

Skreddersydd AI-tjenesteside for /tjenester/ai med GDPR integrert i FAQ, tre kjernecases (chatbot, dokumentbehandling, systemintegrasjoner), og USP mot Zapier/Make.

## What Was Built

Complete /tjenester/ai service page following the 4-section pattern (Hero + Inkludert + FAQ + CTA) established in phase 08.

### Hero.astro
- Outcome-focused h1 with `animate-fade-up` class
- Two price signals: "fra 20 000 kr" (one-time) and "+ fra 1 000 kr/mnd vedlikehold" (monthly)
- CTA: "Fa et gratis tilbud" linking to /kontakt?tjeneste=ai

### Inkludert.astro
- 8-item feature grid (3 columns)
- Three locked use cases: chatbot/kundestotte-automatisering, dokumentbehandling og oppsummering, systemintegrasjoner via AI
- GDPR-vennlige AI-verktoy as a deliverable item
- `reveal-on-scroll` with staggered delays

### FAQ.astro
- 5 questions with GDPR as first question
- Locked GDPR framing: "Vi velger GDPR-vennlige verktoy og hjelper med databehandleravtale (DPA) der det er nodvendig — kunden gjor sine egne vurderinger"
- Zapier/Make differentiation question (skreddersydd, no caps, full ownership)
- FAQPage JSON-LD co-located inline

### CTA.astro
- "Klar for a la AI ta hand om rutinearbeidet?"
- "Fa et gratis tilbud" -> /kontakt?tjeneste=ai

### index.astro
- Service JSON-LD with minPrice: 20000 in Fragment slot="head"
- Unique meta title: "AI-losning for bedrift | Automatiser arbeidsflyt | Nettup"
- 4-section composition

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

All 5 files created and verified:
- FOUND: src/pages/tjenester/ai/index.astro
- FOUND: src/pages/tjenester/ai/_sections/Hero.astro
- FOUND: src/pages/tjenester/ai/_sections/Inkludert.astro
- FOUND: src/pages/tjenester/ai/_sections/FAQ.astro
- FOUND: src/pages/tjenester/ai/_sections/CTA.astro

Commits verified:
- FOUND: b3c4aa6 (Task 1)
- FOUND: 93b9134 (Task 2)
