# Client Project Setup

> What to gather before starting a website project for a client.

---

## Before First Meeting

- [ ] Research the client's industry
- [ ] Look at their current website (if any)
- [ ] Check 2-3 competitor websites
- [ ] Prepare questions list

---

## Client Intake Checklist

Collect this information before quoting or starting work.

### 1. Business Basics

| Question | Answer |
|----------|--------|
| Company name | |
| Industry/what they do | |
| Target audience | |
| Main goal of the website | |
| Current website URL (if any) | |

### 2. Pages Needed

| Page | Needed? | Notes |
|------|---------|-------|
| Homepage | ☐ | |
| About / Om oss | ☐ | |
| Services / Tjenester | ☐ | |
| Contact / Kontakt | ☐ | |
| Portfolio / Projects | ☐ | |
| Blog | ☐ | |
| Other: | ☐ | |

**Total pages:** ___

### 3. Features

| Feature | Needed? | Notes |
|---------|---------|-------|
| Contact form | ☐ | |
| Google Maps embed | ☐ | |
| Social media links | ☐ | |
| Newsletter signup | ☐ | |
| Image gallery | ☐ | |
| Video embeds | ☐ | |
| Other: | ☐ | |

### 4. Content (Client Must Provide)

- [ ] Logo (SVG preferred, or high-res PNG)
- [ ] Brand colors (hex codes if available)
- [ ] Text content for each page
- [ ] Photos (high resolution)
- [ ] Team photos (if About page)
- [ ] Testimonials/reviews
- [ ] Social media URLs

### 5. Technical

| Question | Answer |
|----------|--------|
| Domain owned? | Yes / No / Need to buy |
| Domain name | |
| Current hosting? | |
| Email setup needed? | |
| Analytics needed? | |
| Cookie consent required? | |

### 6. Design Preferences

| Question | Answer |
|----------|--------|
| Style preference | Modern / Classic / Minimal / Bold |
| Reference websites they like | |
| Colors they want | |
| Colors to avoid | |
| Animations wanted? | Yes / Subtle / No |

### 7. Timeline & Budget

| Question | Answer |
|----------|--------|
| Deadline? | |
| Budget range | |
| Who approves final design? | |
| Who provides content? | |

---

## Determine Project Tier

Based on intake, assign a tier:

| If... | Tier |
|-------|------|
| Static content, no interactivity, "just professional" | **1: Essential** |
| Some forms, maybe a carousel, "modern feel" | **2: Enhanced** |
| Portfolio, creative industry, "want to impress" | **3: Expressive** |

**This project is Tier:** ___

---

## Before Coding Starts

### From Client

- [ ] Logo file received
- [ ] Brand colors confirmed
- [ ] All page content received (or placeholder approved)
- [ ] Photos received (or using stock)
- [ ] Domain access confirmed

### Our Setup

- [ ] Create project folder: `client-name/`
- [ ] Run tier-appropriate setup (see NETTUP.md)
- [ ] Connect to GitHub repo
- [ ] Connect to Vercel
- [ ] Share preview URL with client

---

## Project Folder Setup

```bash
# Tier 1 (Essential)
npm create astro@latest client-name -- --template minimal
cd client-name
npm install tailwindcss @tailwindcss/vite

# Tier 2 (Enhanced) — add after Tier 1
npx astro add react
npm install framer-motion

# Tier 3 (Expressive) — add after Tier 2
# Copy specific Aceternity components as needed
```

---

## Handoff Checklist

Before marking project complete:

- [ ] All pages built and responsive
- [ ] Forms working (test submission)
- [ ] Favicon and OG image set
- [ ] Meta descriptions on all pages
- [ ] Sitemap generated
- [ ] Custom domain configured
- [ ] SSL active
- [ ] Analytics connected (if requested)
- [ ] Client walkthrough done
- [ ] Invoice sent

---

## Post-Launch

- [ ] Submit sitemap to Google Search Console
- [ ] Run final Lighthouse check
- [ ] Document any client-specific notes
- [ ] Schedule 30-day check-in
