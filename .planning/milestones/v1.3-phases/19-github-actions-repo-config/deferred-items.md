# Deferred Items — Phase 19

## Pre-existing Lint Errors (Out of Scope)

These errors exist before Phase 19 changes and are not caused by blog-generate.yml:

- `scripts/blog/index.ts` — 'process' is not defined (no-undef) at lines 8, 9, 20, 26, 113
- `scripts/blog/publish.ts` — 'process' is not defined (no-undef) at lines 14, 15, 58

**Root cause:** The ESLint config does not include `node` in the `env` settings for the scripts/ directory.
**Fix:** Add `"env": { "node": true }` or `/* eslint-env node */` comments in the affected script files, or add an override in `.eslintrc` for `scripts/**`.
**Severity:** Low — these scripts run via `npx tsx` (Node.js), so `process` is available at runtime. Lint-only issue.
