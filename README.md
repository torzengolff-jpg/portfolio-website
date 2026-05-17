# Suraj Kumar Chandravanshi — Portfolio

Production portfolio system. Modular HTML/CSS/JS architecture.

## Project Structure

```
suraj-portfolio/
├── index.html              ← Homepage (all sections)
├── about.html              ← About page
├── growth-logs.html        ← Growth Logs listing page
├── css/
│   ├── base.css            ← Design tokens, reset, typography
│   ├── layout.css          ← Container, grid, header, footer
│   ├── components.css      ← All section components
│   └── responsive.css      ← Utilities + breakpoints
├── js/
│   └── main.js             ← All interactions
└── assets/
    ├── suraj-hero.jpg      ← Your photo (required)
    ├── suraj-cv.pdf        ← Your CV (required)
    └── favicon.svg         ← Site favicon
```

## Deploy to Vercel

1. Upload entire folder to your GitHub repo
2. Connect repo to Vercel
3. Set output directory to `/` (root)
4. Deploy

## Required Assets (add these yourself)

- `assets/suraj-hero.jpg` — Your professional photo (recommend 800×1000px, JPG, <200KB)
- `assets/suraj-cv.pdf` — Your CV
- `assets/favicon.svg` — Favicon (32×32 SVG)

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--ink` | `#111009` | Primary text |
| `--paper` | `#f6f2ea` | Page background |
| `--bronze` | `#a67c3a` | Accent color |
| `--teal` | `#0a6b62` | Secondary accent |
| `--line` | `#ddd4c0` | Borders |

## Typography

- **Lora** (Google Fonts) — Headings, pull quotes
- **Inter** (Google Fonts) — Body, UI, nav

## Key Features

- Mobile-first responsive layout
- Smooth scroll reveal animations
- Animated skill bars
- Counter animations on metrics
- Mobile hamburger nav
- Scroll progress bar
- Search + filter on Growth Logs
- Contact form with feedback state
- Schema markup (Person)
- Open Graph meta tags
- Accessible (ARIA labels, focus states, skip link, semantic HTML)

## Customisation

**Change accent color:** Update `--bronze` in `css/base.css`

**Add a case study:** Duplicate `.case-card` block in `index.html`

**Add a Growth Log article:** Duplicate `.gl-card` block in `growth-logs.html`

**Update contact form endpoint:** Replace the `setTimeout` simulation in `js/main.js` → `initContactForm()` with a real fetch to Formspree, EmailJS, or your API.
