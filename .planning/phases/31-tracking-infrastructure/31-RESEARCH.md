# Phase 31: Tracking Infrastructure - Research

**Researched:** 2026-03-19
**Domain:** Google Consent Mode v2, gtag.js, SEO noindex
**Confidence:** HIGH

## Summary

Phase 31 upgrades the existing gtag implementation in `LandingPageLayout.astro` from a consent-gated loading model (gtag only loads after accept) to Google Consent Mode v2 advanced mode (gtag always loads with denied defaults, updates on consent). This enables Google's conversion modeling for users who decline cookies, recovering ~70% of conversion data. The phase also defaults `noIndex` to `true` in `LandingPageLayout` to prevent ad landing pages from cannibalizing organic rankings.

The existing code has a clear structure: inline script in the layout handles consent banner + gtag loading. The upgrade is surgical -- same file, same pattern, different consent flow. Two React islands (`HeroMicroForm.tsx`, `ContactForm.tsx`) use `window.gtagLoaded && window.gtag` to fire conversions. This interface must remain compatible.

**Primary recommendation:** Replace the current "load gtag on consent" pattern with "load gtag immediately with denied defaults, update on consent" -- all in `LandingPageLayout.astro`'s inline script. Change `noIndex` default from `false` to `true`. Update `/personvern` to reflect Consent Mode v2 behavior.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Single accept/decline toggle covering all four consent types (ad_storage, analytics_storage, ad_user_data, ad_personalization) -- no granular toggles
- Minimal banner text: short explanation of cookie usage + inline link to /personvern
- Keep current position and animation: fixed bottom bar, fades out on accept/decline
- Button labels stay as "Godta" / "Avslå"
- gtag + consent banner stays on LandingPageLayout only -- no site-wide rollout
- noIndex defaults to true in LandingPageLayout (all ad landing pages should be noindexed by default)
- Consent persists via localStorage (current approach) -- carries across visits
- gtag loads immediately on page load with all consent states set to `denied`
- On user accept: update all four consent types to `granted`
- On user decline: consent stays `denied`, gtag still loaded (enables anonymous pings / conversion modeling)
- `ad_user_data` and `ad_personalization` parameters must be present in consent config
- Update /personvern to reflect Consent Mode v2 in user-friendly Norwegian (no technical jargon)
- Explain what data is collected and what accepting/declining means in plain language
- Mention Plausible Analytics separately: cookieless, no consent needed -- contrast with Google's cookie-based tracking
- Update technical references (localStorage key, consent types)

### Claude's Discretion
- Exact banner text wording (within the "minimal + /personvern link" constraint)
- Privacy page section structure and paragraph flow
- gtag consent initialization code structure

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TRACK-01 | Consent Mode v2 upgrade -- load gtag immediately with denied defaults, update on consent (recovers ~70% conversion data) | Google official docs provide exact gtag consent API. Existing code in LandingPageLayout.astro lines 186-242 is the upgrade target. |
| TRACK-04 | Landing page has `noindex` meta to prevent SEO cannibalization with `/tjenester/nettside` | LandingPageLayout already has `noIndex` prop with conditional meta tag (line 47). Change default from `false` to `true`. |

</phase_requirements>

## Standard Stack

### Core

No new libraries needed. This phase modifies existing code only.

| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| gtag.js | N/A (CDN) | Google Ads conversion tracking | Already in use, loaded from `googletagmanager.com/gtag/js` |
| Consent Mode v2 | Built into gtag.js | GDPR-compliant consent management | Google's official approach, required for EEA traffic since March 2024 |
| localStorage | Browser API | Persist consent choice | Already in use (`nettup_ads_consent` key) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom consent banner | Certified CMP (CookieScript, Cookiebot) | Google recommends certified CMPs for 2026, but a custom banner with Consent Mode v2 is valid for small sites. CMP adds dependency + cost. Revisit if Google enforces CMP requirement. |
| localStorage persistence | Cookie-based persistence | Cookies would be more standard, but localStorage is already in use and works fine for this single-page consent scope |

## Architecture Patterns

### Consent Mode v2 Script Order (Critical)

The order of gtag API calls is the most important detail. Getting this wrong means consent defaults are ignored.

```
1. Define dataLayer + gtag function
2. Call gtag('consent', 'default', {...})     ← BEFORE loading gtag.js
3. Load gtag.js script async
4. Call gtag('js', new Date())
5. Call gtag('config', 'AW-...')
6. Show consent banner (if no stored choice)
7. On user action → gtag('consent', 'update', {...})
```

### Pattern: Consent Mode v2 Advanced Implementation

**What:** gtag loads immediately with all consent states denied. On user accept, consent is updated to granted. On decline, gtag remains loaded but sends only anonymous/cookieless pings.

**When to use:** Always for GDPR regions when you want conversion modeling.

**Example:**
```javascript
// Source: https://developers.google.com/tag-platform/security/guides/consent

// Step 1: Define dataLayer and gtag function
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}

// Step 2: Set defaults BEFORE loading gtag.js
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
});

// Step 3: Load gtag.js
// (async script tag for googletagmanager.com/gtag/js?id=AW-17409050017)

// Step 4-5: Initialize
gtag('js', new Date());
gtag('config', 'AW-17409050017');

// Step 6: On user consent update
function updateConsent(granted) {
  gtag('consent', 'update', {
    'ad_storage': granted ? 'granted' : 'denied',
    'ad_user_data': granted ? 'granted' : 'denied',
    'ad_personalization': granted ? 'granted' : 'denied',
    'analytics_storage': granted ? 'granted' : 'denied',
  });
}
```

### Pattern: Returning Visitor (Stored Consent)

**What:** On page load, check localStorage. If previously granted, call `gtag('consent', 'update', ...)` immediately after the default call (before gtag.js loads or right after). If previously denied, do nothing extra (defaults stay denied). If no stored choice, show banner.

**Example:**
```javascript
const stored = localStorage.getItem('nettup_ads_consent');
if (stored === 'granted') {
  gtag('consent', 'update', {
    'ad_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted',
    'analytics_storage': 'granted',
  });
}
// Banner only shown if stored is null (no choice yet)
```

### Pattern: window.gtagLoaded Compatibility

**What:** The existing `window.gtagLoaded` flag is used by `HeroMicroForm.tsx` and `ContactForm.tsx` to guard conversion event calls. With Consent Mode v2, gtag is always loaded, so `window.gtagLoaded` should always be `true` and `window.gtag` always defined.

**Key change:** Conversion events will fire regardless of consent state. gtag itself handles whether to use cookies or send cookieless pings based on the current consent state. The React islands do NOT need to change.

### Anti-Patterns to Avoid

- **Calling consent default AFTER loading gtag.js:** The default must come first. If gtag.js loads before the default call, it fires with implicit granted state for a brief moment.
- **Conditionally loading gtag.js based on consent:** This is the OLD pattern (what we have now). Consent Mode v2 requires gtag to always load.
- **Forgetting ad_user_data and ad_personalization:** These are the v2 additions. Without them, Google treats them as granted by default, which violates GDPR.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Consent state management | Custom state machine | localStorage get/set + gtag consent API | The gtag consent API IS the state machine. Just read/write localStorage and call gtag. |
| Cookie blocking | Script that intercepts cookies | Consent Mode v2 denied state | When consent is denied, gtag automatically sends cookieless pings instead of setting cookies. No interception needed. |

## Common Pitfalls

### Pitfall 1: Wrong Script Order
**What goes wrong:** Consent defaults are ignored, cookies fire before user consents.
**Why it happens:** gtag.js script tag placed before the `gtag('consent', 'default', ...)` call.
**How to avoid:** The consent default call MUST execute before the async script tag loads. Put the default in a synchronous inline script above the async gtag.js script load.
**Warning signs:** Google Tag Assistant shows consent state as "not set" instead of "denied".

### Pitfall 2: Forgetting to Handle Returning Visitors
**What goes wrong:** User who previously accepted sees banner again, or worse, their consent is not applied until they interact.
**Why it happens:** Only checking localStorage for the banner, but not calling `gtag('consent', 'update')` on page load for returning granted users.
**How to avoid:** On page load, after setting defaults, immediately check localStorage and call update if previously granted.
**Warning signs:** Conversion data drops for returning visitors.

### Pitfall 3: Breaking window.gtagLoaded Interface
**What goes wrong:** HeroMicroForm and ContactForm stop firing conversion events.
**Why it happens:** Refactoring the gtag loading code and forgetting to set `window.gtagLoaded = true` and `window.gtag = gtag`.
**How to avoid:** After defining the gtag function and before/after loading the script, set both globals. The React islands depend on them.
**Warning signs:** Form submissions no longer appear as conversions in Google Ads.

### Pitfall 4: noIndex Breaking Sitemap
**What goes wrong:** `/nettside-for-bedrift` appears in sitemap despite noindex.
**Why it happens:** `@astrojs/sitemap` may still include the page.
**How to avoid:** Verify the sitemap config or output after changing the default. Note: noindex meta is sufficient for search engines -- they will respect it even if the URL appears in a sitemap. But it is cleaner to exclude noindexed pages from the sitemap.
**Warning signs:** Google Search Console shows "Indexed, though blocked by robots/noindex" warnings.

## Code Examples

### Full Consent Mode v2 Script (for LandingPageLayout.astro)

This replaces lines 186-242 in the current layout.

```javascript
// Source: https://developers.google.com/tag-platform/security/guides/consent
(function() {
  const GTAG_ID = 'AW-17409050017';
  const CONSENT_KEY = 'nettup_ads_consent';

  // 1. Define dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;

  // 2. Set consent defaults (MUST be before gtag.js loads)
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
  });

  // 3. Check stored consent and update immediately if previously granted
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === 'granted') {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted',
    });
  }

  // 4. Load gtag.js (always, regardless of consent)
  var script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GTAG_ID;
  script.async = true;
  document.head.appendChild(script);

  // 5. Initialize gtag
  gtag('js', new Date());
  gtag('config', GTAG_ID);
  window.gtagLoaded = true;

  // 6. Consent banner logic
  if (stored === null) {
    document.getElementById('cookie-banner')?.classList.remove('hidden');
  }

  document.getElementById('cookie-accept')?.addEventListener('click', function() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted',
    });
    hideBanner();
  });

  document.getElementById('cookie-decline')?.addEventListener('click', function() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    // No consent update needed -- defaults are already denied
    hideBanner();
  });

  function hideBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(100%)';
      banner.style.transition = 'opacity 0.3s, transform 0.3s';
      setTimeout(function() { banner.remove(); }, 300);
    }
  }
})();
```

### noIndex Default Change

```astro
// In LandingPageLayout.astro Props destructuring:
const {
  // ...other props
  noIndex = true,  // Changed from false → true
} = Astro.props;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Load gtag only after consent | Load gtag always, use consent defaults | March 2024 (Google enforcement) | Without Consent Mode v2, Google Ads loses all conversion data from non-consenting EEA users |
| ad_storage + analytics_storage only | + ad_user_data + ad_personalization | November 2023 (Consent Mode v2 launch) | Missing v2 parameters means Google assumes granted, violating GDPR |
| Basic mode (block tags until consent) | Advanced mode (tags load, send cookieless pings) | Same | Advanced mode enables conversion modeling, recovering ~70% of lost data |

## Open Questions

1. **Sitemap exclusion for noindexed pages**
   - What we know: `@astrojs/sitemap` is configured. Changing noIndex default to true means `/nettside-for-bedrift` gets noindex meta.
   - What's unclear: Whether the sitemap integration automatically excludes pages with noindex, or needs manual exclusion.
   - Recommendation: Check sitemap output after build. If the page still appears, add it to sitemap exclusion list. Not a blocker -- noindex meta is authoritative regardless.

2. **Google CMP requirement timeline**
   - What we know: Google has been pushing certified CMPs for 2025-2026. Custom consent banners still work with Consent Mode v2.
   - What's unclear: Whether/when Google will require a certified CMP for Google Ads measurement in EEA.
   - Recommendation: Proceed with custom banner (already decided). Monitor Google's policy. A custom banner with proper Consent Mode v2 implementation is compliant today.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (via devDependencies) |
| Config file | Exists in project |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TRACK-01 | gtag consent default called before gtag.js loads | manual-only | N/A -- requires browser execution with gtag | N/A |
| TRACK-01 | All 4 consent params present (ad_storage, ad_user_data, ad_personalization, analytics_storage) | manual-only | N/A -- verify by reading inline script | N/A |
| TRACK-01 | Consent update fires on accept | manual-only | N/A -- requires browser interaction | N/A |
| TRACK-01 | window.gtagLoaded and window.gtag set | manual-only | N/A -- browser globals | N/A |
| TRACK-04 | noIndex defaults to true in LandingPageLayout | manual-only | `npm run build && grep -l "noindex" dist/nettside-for-bedrift/index.html` | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (verifies no build errors)
- **Per wave merge:** `npm run build && npx vitest run`
- **Phase gate:** Build clean + manual verification of gtag consent in browser

### Wave 0 Gaps
None -- this phase modifies existing Astro templates and inline scripts. No new test files needed. Verification is manual (browser DevTools checking gtag consent state + build output for noindex).

## Sources

### Primary (HIGH confidence)
- [Google Developers - Set up consent mode on websites](https://developers.google.com/tag-platform/security/guides/consent) - Exact API for gtag consent default/update, script order, all 4 consent parameters
- Existing codebase: `LandingPageLayout.astro` lines 159-242 (current implementation to upgrade)
- Existing codebase: `HeroMicroForm.tsx` line 63, `ContactForm.tsx` line 152 (window.gtagLoaded interface)

### Secondary (MEDIUM confidence)
- [Simo Ahava - Consent Mode V2 For Google Tags](https://www.simoahava.com/analytics/consent-mode-v2-google-tags/) - Advanced vs basic mode distinction, implementation details
- [Google Tag Manager Help - Updates to consent mode for EEA](https://support.google.com/tagmanager/answer/13695607?hl=en) - EEA enforcement timeline

### Tertiary (LOW confidence)
- [Dataslayer - Track Google Ads After Consent Mode V2](https://www.dataslayer.ai/blog/track-google-ads-after-consent-mode-v2-2025-guide) - Conversion modeling requirements (700 clicks/7 days threshold)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new libraries, just gtag API changes verified against official Google docs
- Architecture: HIGH - Script order and consent API verified against official documentation, existing code fully understood
- Pitfalls: HIGH - Common issues well-documented across multiple sources, existing code review confirms integration points

**Research date:** 2026-03-19
**Valid until:** 2026-06-19 (90 days -- consent mode API is stable, Google rarely changes it)
