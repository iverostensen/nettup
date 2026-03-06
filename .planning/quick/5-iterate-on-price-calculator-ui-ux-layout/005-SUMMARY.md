---
phase: quick-005
plan: 1
subsystem: wizard-ui
tags: [micro-animations, hover-states, press-feedback, ux-polish]
dependency_graph:
  requires: []
  provides: [animated-check-icon, hover-depth, press-states, connector-transitions, result-grouping]
  affects: [SelectableCard, GoalCard, WizardStepper, SmartPrisKalkulator, FeaturesStep, IntegrationsStep, ResultStep]
tech_stack:
  added: []
  patterns: [AnimatePresence conditional rendering, spring animation on mount/unmount, active:scale Tailwind press state]
key_files:
  created: []
  modified:
    - src/components/islands/wizard/cards/SelectableCard.tsx
    - src/components/islands/wizard/cards/GoalCard.tsx
    - src/components/islands/wizard/WizardStepper.tsx
    - src/components/islands/SmartPrisKalkulator.tsx
    - src/components/islands/wizard/steps/FeaturesStep.tsx
    - src/components/islands/wizard/steps/IntegrationsStep.tsx
    - src/components/islands/wizard/steps/ResultStep.tsx
decisions:
  - AnimatePresence with conditional {selected && ...} pattern (not always-rendered) — cleaner JSX, spring handles instant mount/exit well at stiffness 500
  - transition shorthand (not transition-colors) on buttons to cover both color and transform in one utility
  - border-l border-white/10 left-rail on ResultStep items — low-contrast grouping cue without adding noise
metrics:
  duration: 2min
  completed_date: "2026-03-06"
  tasks_completed: 2
  files_modified: 7
---

# Quick Task 5: Price Calculator UI/UX Iteration Summary

**One-liner:** Spring-animated check icon via AnimatePresence + hover:bg-brand/5 depth on cards, active:scale press feedback on all buttons, duration-300 connector transitions, and subtle left-rail grouping on ResultStep items.

## What Was Done

### Task 1 — SelectableCard: animated check icon + hover depth

- Imported `AnimatePresence` and `motion` from `framer-motion`
- Replaced the conditional `{selected && <svg>}` with `<AnimatePresence>{selected && <motion.span ...>}` — spring animation (stiffness 500, damping 25) on mount and exit
- Changed icon wrapper from `flex items-center gap-2` to `flex h-5 w-5 items-center justify-center` — fixed slot size prevents layout shift when toggling selection
- Added `hover:bg-brand/5` to unselected state so hover has visual background depth, not just a border change

### Task 2 — GoalCard, WizardStepper, buttons, ResultStep

**GoalCard:**
- Replaced `hover:bg-surface-raised/80` with `hover:bg-brand/5` — now matches SelectableCard hover pattern consistently

**WizardStepper connector lines:**
- Added `transition-colors duration-300` to connector `<div>` — color fades from `bg-white/10` to `bg-brand/40` instead of jumping on step completion

**Back button (SmartPrisKalkulator):**
- `transition-colors` → `transition` + `active:scale-95` — covers both color and transform, gives physical press feedback

**Neste button (FeaturesStep + IntegrationsStep):**
- `transition-colors` → `transition` + `active:scale-[0.98]` — subtle press scale on the primary CTA

**ResultStep — copy button:**
- `transition-colors` → `transition` + `active:scale-95`

**ResultStep — line item rows:**
- Added `pl-3 border-l border-white/10` — faint left rail groups items visually under each category heading without adding layout complexity

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

### Files Exist
- `src/components/islands/wizard/cards/SelectableCard.tsx` — modified
- `src/components/islands/wizard/cards/GoalCard.tsx` — modified
- `src/components/islands/wizard/WizardStepper.tsx` — modified
- `src/components/islands/SmartPrisKalkulator.tsx` — modified
- `src/components/islands/wizard/steps/FeaturesStep.tsx` — modified
- `src/components/islands/wizard/steps/IntegrationsStep.tsx` — modified
- `src/components/islands/wizard/steps/ResultStep.tsx` — modified

### Commits
- `bef1b24` — Task 1: SelectableCard
- `1065a92` — Task 2: all remaining files

### Self-Check: PASSED
