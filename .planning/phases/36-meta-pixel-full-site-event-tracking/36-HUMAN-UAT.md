---
status: partial
phase: 36-meta-pixel-full-site-event-tracking
source: [36-VERIFICATION.md]
started: 2026-03-28T18:35:00Z
updated: 2026-03-28T18:35:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Meta Pixel PageView fires on BaseLayout pages
expected: Facebook Pixel Helper shows PageView event on /om-oss, /tjenester, etc. when PUBLIC_META_PIXEL_ID is set in environment
result: [pending]

### 2. Consent banner accept/decline flow
expected: Clicking 'Godta' causes fbq('consent','grant') to fire; clicking 'Avslå' keeps pixel revoked; banner disappears in both cases; localStorage state persists on page reload
result: [pending]

### 3. ViewContent fires on service pages after consent
expected: Facebook Pixel Helper shows ViewContent with correct content_name on /tjenester/nettside, /nettbutikk, /landingsside, /priskalkulator after accepting banner; data-astro-rerun causes re-fire on ClientRouter navigation
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
