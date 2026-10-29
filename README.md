# BlackhoodAfrica Modeling Academy

A premium, editorial marketing site for **BlackhoodAfrica Modeling Academy**, a Tanzania-based
modeling agency and academy. Built with Vite, React, TypeScript, Tailwind CSS, and Lucide icons.

## Getting started

```bash
npm install
npm run dev
```

The dev server prints a local URL (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build     # type-check and produce a production build in dist/
npm run preview   # serve the production build locally
npm run lint       # run oxlint
```

## Project structure

```text
src/
├── assets/              # local static assets (logo, images) once supplied
├── components/
│   ├── layout/           # Header, Footer
│   ├── ui/                # Button, SectionHeading, WhatsAppButton, Reveal
│   ├── ModelCard.tsx
│   ├── ModelModal.tsx
│   ├── OpportunityCard.tsx
│   └── SocialLinks.tsx
├── data/                 # local placeholder data (models, programmes, opportunities)
├── pages/                # one component per route
├── utils/whatsapp.ts     # WhatsApp/Instagram/TikTok links + click-to-chat helper
├── App.tsx               # routes + shared layout
├── main.tsx               # app entry point
└── index.css              # Tailwind + design tokens + shared utility classes
```

## Content & assets to replace before launch

- **Logo** — the header/footer currently use a temporary text wordmark
  ("BlackhoodAfrica"). Replace with an official logo file in `public/images/` once available.
- **Photography** — all model and section imagery currently comes from royalty-free Unsplash
  URLs (see `src/data/models.ts`, `src/data/programmes.ts`, and the page hero sections).
  Replace with real model portfolios and academy photography.
- **Talent, programme, and opportunity data** — sample/local data lives in `src/data/`. Swap in
  real models, programmes, and current castings.
- **Favicon** — `public/favicon.svg` is a simple placeholder monogram; replace once a brand mark
  exists.
- **Apply & Contact forms** — both forms currently validate and show a success state client-side
  only (no backend). Connect to a form service, email, or CRM before relying on them to capture
  real applications.
- **Contact details** — email address in the footer/contact page is a placeholder
  (`hello@blackhoodafrica.com`); update to a real inbox.

## Brand links

- WhatsApp: https://wa.me/255711505927
- Instagram: https://www.instagram.com/blackhoodafrica/
- TikTok: https://www.tiktok.com/@blackhoodafrica
