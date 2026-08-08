# Priyanka Kher — Official Site

Soft-launch / “world unveiling” page for singer-songwriter **Priyanka Kher**, built with Next.js so the domain can be crawled and indexed while the full site is prepared.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + global `.pk-*` theme classes
- GSAP entrance animations
- Tabler Icons
- shadcn-style UI primitives (`Button` + CSS variables)
- Content & SEO driven by JSON (`src/data/`)

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Edit these files without touching components:

| File | Purpose |
|------|---------|
| `src/data/content.json` | Artist copy, quotes, portraits, originals, socials, activities |
| `src/data/seo.json` | Title, description, OG/Twitter, site URL |

Theme colors and shared layout live in `src/app/globals.css` under `:root` (`--pk-*` tokens).

## Build

```bash
npm run build
npm start
```

## Note

Update `siteUrl` in `src/data/seo.json` to the live domain before production deploy.
