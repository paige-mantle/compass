# Compass

Self-contained source tree for Mantle Compass — manuals, frameworks, and insights.
Routes still live under `/app/manuals/`, `/app/compass/frameworks/`, and `/app/compass/insights/`
in the Next.js app. Everything those routes import lives in this folder.

## Layout

```
compass/
├── content/                  MDX + manifests, one folder per surface
│   ├── manuals/<slug>/       manifest.json + section MDX
│   ├── frameworks/
│   └── insights/
├── components/               React components (server + client)
│   ├── manuals/              ManualShell, Callout, Checklist, FAQ, etc.
│   ├── frameworks/
│   ├── insights/
│   └── shared/CompassHeader.tsx
└── lib/                      Build-time content loaders (node:fs + gray-matter)
    ├── manuals/content.ts
    ├── frameworks/content.ts
    └── insights/content.ts
```

## Imports

Use the `@/compass/...` alias from anywhere in the app:

```ts
import { ManualShell } from "@/compass/components/manuals/ManualShell";
import { loadSection } from "@/compass/lib/manuals/content";
```

The `@/*` tsconfig path resolves to the repo root, so `@/compass/...` works without extra config.

## Static assets

Compass ships these static files via `public/`:

- `public/manuals/get-to-real-demand/manual-base.css` + `manual.css` — manual page styling
- `public/fonts/GeistPixel-Square.otf` — display face used in manual heros
- `public/mantle-logo.svg`, `public/compass-logo-*.svg` — brand marks

These stay in `public/` because Next and Astro both serve that folder identically. When porting
to Astro, copy the contents to Astro's `public/` and the URLs in CSS / `<link>` tags don't change.

## Astro porting notes

Designed to lift cleanly into an Astro app:

- `lib/*/content.ts` is pure Node (`fs/promises`, `path`, `gray-matter`) — works at build time on either side.
- Content MDX files use only `<Callout>`, `<FAQ>`, `<FAQItem>`, `<AuthorCard>`, `<PromptToggle>`, `<Checklist>`, `<CheckItem>` — all listed in `components/manuals/mdx-components.tsx`. Port these to `.astro` files where possible; only `PromptToggle` and `ManualCopyLink` need a client island.
- Routes (`app/manuals/[manual]/[section]/page.tsx` etc.) currently use `next-mdx-remote/rsc`. Astro uses build-time MDX via content collections — the route files get rewritten, but everything in `compass/` stays the same.

See the migration plan in repo notes for the full Astro + Cloudflare Pages cutover.
