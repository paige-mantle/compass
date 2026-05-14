# Mantle Compass

Practical manuals, methods, templates, and insights for early-stage
founders — the content hub of [heymantle.com](https://heymantle.com).

> Served in production at **heymantle.com/compass/\*** and
> **heymantle.com/templates/\***. The parent Mantle marketing site
> proxies both URL prefixes here via Vercel rewrites; this repo
> deploys as its own Vercel project.

---

## What lives here

| Surface | URL pattern | Source |
|---|---|---|
| Compass home | `/compass` | `app/compass/page.tsx` |
| Manuals — index + 7 manuals × N chapters each | `/compass/manuals`, `/compass/[manual]/[section]` | `compass/content/manuals/*/*.mdx` |
| Methods — practical AI-assisted skills | `/compass/methods`, `/compass/methods/[slug]` | `compass/content/methods/*.mdx` |
| Templates — drop-in components + flows | `/templates`, `/templates/[slug]` | `compass/content/templates/*.mdx` |
| Insights — Mantle team writing | `/compass/insights`, `/compass/insights/[slug]` | `compass/content/insights/*.mdx` |
| Answers — short Q&A snippets | `/compass/answers` | `compass/lib/answers/content.ts` |

All MDX content is loaded statically at build time via
`generateStaticParams` → 79 routes prerendered as static HTML.

---

## Local development

Requires Node 20+ and npm 10+.

```bash
npm install
npm run dev
```

Defaults to <http://localhost:3000> (or the next available port). Uses
Turbopack — first request to each route compiles on demand, subsequent
navigations are instant. The root `/` redirects to `/compass`.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint + next type-check
```

---

## Project layout

```
app/                            Next.js App Router routes
  compass/                      /compass/* React routes
    [manual]/[section]/         dynamic manual chapter routes
    methods/[slug]/             dynamic method detail
    insights/[slug]/            dynamic insight detail
  templates/[slug]/             dynamic template detail
  api/og/                       OG image API endpoint
  layout.tsx, globals.css       root chrome + Tailwind v4 @theme
  sitemap.ts, robots.ts         SEO config
compass/
  components/                   all React components, grouped by surface
    callouts/  insights/  manuals/  methods/  shared/  templates/  answers/
  content/                      MDX content (the body of the site)
    manuals/<slug>/<n>-<slug>.mdx  per-chapter MDX + manifest.json
    methods/, templates/, insights/   *.mdx
  lib/                          content loaders + SEO helpers
public/                         static assets + Compass-specific CSS
  compass-base.css              design-token mirror of globals.css @theme
  compass-globals.css           global body rules (cream canvas, root font-size)
  compass-manual-base.css       manual chrome (loaded only on /compass/[manual]/*)
  compass-manual.css            manual hero/sidebar/TOC styles
```

### Design system

- **Tokens** live in `app/globals.css` `@theme` block (Tailwind v4
  pattern). Same tokens mirrored into `public/compass-base.css` for any
  static HTML page that might consume Compass styles.
- **Dark theme** is canonical. `.compass-light-theme` scope flips
  fg/surface/edge tokens to light values on methods and templates
  detail pages.
- **Fonts** are fully self-hosted via `next/font/google` (Geist, Geist
  Mono, Manrope) — no external Google Fonts `<link>`. Token stacks
  lead with `var(--font-*)` for React routes, with literal name
  fallbacks (`'Manrope'`, `'Geist'`) so static HTML pages that load
  these stylesheets directly still resolve via their own `<link>`.

---

## SEO

- `metadataBase: new URL("https://heymantle.com")` in `app/layout.tsx`
  — every route's canonical resolves to the public domain.
- `SITE_ORIGIN` in `compass/lib/seo.ts` is the single source of truth
  for absolute URLs (JSON-LD, OG image footer, sitemap).
- Per-route `generateMetadata` sets canonical + OG + Twitter card.
- JSON-LD: `Article` + `BreadcrumbList` on every detail page.
  `compass/lib/seo.ts` `buildSectionJsonLd` powers the manual chapter
  routes.
- Per-route `opengraph-image.tsx` exists for the `/compass/insights/[slug]`
  and `/compass/[manual]/[section]` routes. Other routes fall back to
  the root `app/opengraph-image.tsx`.
- `sitemap.ts` enumerates content from disk so new MDX automatically
  appears in the sitemap without an edit.

---

## Production deployment

- This app runs on its own Vercel project. The Mantle marketing site
  (a separate repo) has two `rewrites` in its `next.config.ts`:
  ```ts
  { source: '/compass/:path*',   destination: 'https://<this-deploy>/compass/:path*' }
  { source: '/templates/:path*', destination: 'https://<this-deploy>/templates/:path*' }
  ```
- The standalone deploy URL (`mantle-compass.vercel.app` or similar)
  shouldn't be public-facing — visitors only ever hit
  `heymantle.com/compass`. The Vercel deployment alias should redirect
  back to `heymantle.com` if visited directly.
- Cold-cache build: ~30s in Vercel. 79 prerendered routes + a handful
  of dynamic OG generators.

### Environment variables

None required today — everything content-driven is loaded from disk.
Vercel Analytics (page views) is picked up automatically when deployed
to a Vercel project; no env var needed.

When new env vars are introduced (e.g. newsletter provider key), they
go in:

- `.env.local` for local development (gitignored)
- Vercel project env vars for preview/production (NOT in the repo)

---

## Editing content

Content is MDX with frontmatter. Pattern for every surface:

```mdx
---
title: "How to scope your MVP"
summary: "A short, scannable subtitle."
tags: ["positioning", "demand"]
published: "2026-03-12"
lastUpdated: "2026-03-15"
author: "Paige Harris"
---

Body content as MDX. Components from
`compass/components/{insights,manuals,methods}/mdx-components.tsx`
are auto-available — Callout, Checklist, FAQ, PromptToggle, TLDR,
etc.
```

Manual chapters: each manual lives in
`compass/content/manuals/<slug>/` with one `manifest.json` listing
ordered chapters + one MDX per chapter named
`<NN>-<chapter-slug>.mdx`.

---

## Migration provenance

This repo was extracted from the Mantle marketing-site monorepo
(`product-paige/mantle`) via `git filter-repo` to keep only the
Compass-relevant history. The first 18 commits in `git log` are the
filtered Compass history; commit `Bootstrap standalone Next app for
Mantle Compass` (`3f4f8e0`) is the standalone-app bootstrap. The
parent repo retains a backup at branch `mantle-init` if anything was
lost.

---

## Internal contacts

_Add here: who owns this project on the client side, where issues get
filed, what Slack channel for async questions._
