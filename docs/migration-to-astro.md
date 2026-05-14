# Compass → Mantle Astro migration spec

Migration plan for moving Compass content + UI from this standalone
Next.js app into the Mantle Astro site as the `/compass/*` subsection.

**Source repo:** `paige-mantle/compass` (this repo — Next.js 15 App Router)
**Destination repo:** Mantle Astro site (Astro 5.12, MDX, Tailwind v4, React islands)
**Production target:** `heymantle.com/compass/*` and `heymantle.com/compass/templates/*` served directly from the Astro deploy. No proxy, no second Vercel project.

The current Compass deployment at `compass-lime-rho.vercel.app` becomes a reference deploy during the migration, then shuts down at cutover.

---

## Why Astro

The Mantle Astro site is mature and battle-tested for content:

| Capability | How Astro provides it |
|---|---|
| Content collections w/ Zod-typed frontmatter | `defineCollection({ schema })` in `src/content.config.ts` |
| MDX rendering w/ shortcuts | `@astrojs/mdx` integration (already installed) |
| Code highlighting | Shiki, `rose-pine-moon` theme (already configured in `astro.config.mjs`) |
| Sitemap | `@astrojs/sitemap` integration (already installed) |
| Tailwind v4 + `@theme` design tokens | `@tailwindcss/vite` (already installed) |
| React interactivity when needed | `@astrojs/react` + `client:*` directives |
| YAML hot-reload for content edits | Custom Vite plugin in `astro.config.mjs` (already wired) |

Same content, fewer moving parts, better SEO output, no JS shipped to the browser for read-only pages.

---

## Direct artifact mapping

### Content collections

| Compass (Next.js) | Mantle (Astro) | Notes |
|---|---|---|
| `compass/content/manuals/<slug>/00-<slug>.mdx` (intro) | `src/content/compass-manuals/<slug>/00-<slug>.md` | Chapter-0 = intro |
| `compass/content/manuals/<slug>/NN-<slug>.mdx` (chapter) | `src/content/compass-manuals/<slug>/NN-<slug>.md` | One file per chapter |
| `compass/content/manuals/<slug>/manifest.json` | Fold into per-chapter `order:` field, OR keep as `src/content/compass-manuals/<slug>/manifest.yaml` | Astro's content layer reads YAML natively; or use order field |
| `compass/content/methods/*.mdx` | `src/content/compass-methods/*.mdx` | One file per method |
| `compass/content/templates/*.mdx` | `src/content/compass-templates/*.mdx` | One file per template |
| `compass/content/insights/*.mdx` | `src/content/compass-insights/*.mdx` | Same shape as `src/content/blog/` — reuse the BlogLayout pattern |
| `compass/lib/answers/content.ts` (inline TS array) | `src/content/compass-answers.yaml` | Matches Mantle's existing YAML-content pattern |

### Pages

| Compass (Next.js) | Mantle (Astro) |
|---|---|
| `app/compass/page.tsx` | `src/pages/compass/index.astro` |
| `app/compass/manuals/page.tsx` | `src/pages/compass/manuals/index.astro` |
| `app/compass/[manual]/page.tsx` | `src/pages/compass/[manual]/index.astro` |
| `app/compass/[manual]/[section]/page.tsx` | `src/pages/compass/[manual]/[section].astro` |
| `app/compass/methods/page.tsx` | `src/pages/compass/methods/index.astro` |
| `app/compass/methods/[slug]/page.tsx` | `src/pages/compass/methods/[slug].astro` |
| `app/compass/insights/page.tsx` | `src/pages/compass/insights/index.astro` |
| `app/compass/insights/[slug]/page.tsx` | `src/pages/compass/insights/[slug].astro` |
| `app/compass/answers/page.tsx` | `src/pages/compass/answers/index.astro` |
| `app/compass/callouts/page.tsx` | Drop — design-system demo doesn't migrate |
| `app/templates/page.tsx` | `src/pages/compass/templates/index.astro` (move under `/compass`) |
| `app/templates/[slug]/page.tsx` | `src/pages/compass/templates/[slug].astro` |

### Layouts + chrome

| Compass (Next.js) | Mantle (Astro) |
|---|---|
| `CompassLayout.tsx` | Use existing `src/layouts/MainLayout.astro` |
| `CompassHeader.tsx` | Use existing `src/components/Header.astro` — drop the simplified Compass header |
| `FrameworkShell.tsx` (methods + templates) | `src/layouts/CompassArticleLayout.astro` w/ `kind: 'method' \| 'template'` |
| `InsightShell.tsx` | `src/layouts/CompassArticleLayout.astro` w/ `kind: 'insight'` — or reuse existing `BlogLayout.astro` |
| `ManualShell.tsx` | `src/layouts/CompassManualLayout.astro` (hero + sidebar + chapter nav) |
| `CompassFooterCta.tsx` | Use existing Mantle Footer |
| `CompassNewsletter.tsx` | Wire to Mantle's existing newsletter integration (whatever provider Mantle uses) |

### Components

| Compass (React `.tsx`) | Astro destination |
|---|---|
| `CompassPromptHeading.tsx` | Already exists in Mantle: `src/components/shared/PromptHeading.astro` ✓ |
| `CompassButton.tsx` | Already exists: `src/components/Button.astro` |
| `CompassSectionNav.tsx` | New: `src/components/compass/SectionNav.astro` |
| `CompassIndexHero.tsx` | New: `src/components/compass/IndexHero.astro` |
| `ManualCoverGrid.tsx` + `CoverArt.tsx` | New: `src/components/compass/ManualCoverGrid.astro` + per-motif SVG components |
| `MethodCardGrid.tsx` | New: `src/components/compass/MethodCardGrid.astro` |
| `TemplateCardGrid.tsx` | New: `src/components/compass/TemplateCardGrid.astro` |
| `InsightCardGrid.tsx` | New: `src/components/compass/InsightCardGrid.astro` |
| `AnswerCardGrid.tsx` | New: `src/components/compass/AnswerCardGrid.astro` |
| `TableOfContents.tsx` | New: `src/components/compass/TableOfContents.astro` |
| `CopyLinkButton.tsx`, `ManualShareButton.tsx`, `ManualCopyLink.tsx` | React islands (need clipboard interactivity) — keep `.tsx`, mount via `client:visible` |
| `CodeBlocks.tsx` (contentEditable + Shiki-less rendering) | Replace with Astro's native Shiki integration + a small React island for copy/edit — much cleaner than the current implementation |
| `PreviewTabs.tsx` | React island (tab state) — keep `.tsx`, mount via `client:load` |
| `PromptToggle.tsx` (manual chapter widget) | React island — keep `.tsx`, mount via `client:visible` |
| MDX shortcut components (`Callout`, `FAQ`, `Checklist`, `CheckItem`, `TLDR`, `AuthorCard`, `FieldNote`, `RealityCheck`, `CommonFailure`, `DecisionPoint`, `FounderShift`, `Chip`, `Chips`, `RelatedCards`, `RelatedCard`, `PairsWith`, `PairItem`, `Placeholder`) | Each → `src/components/compass/<Name>.astro` (pure Astro for read-only ones; React island for interactive ones) |

### Dead code — do NOT migrate

These were flagged in the Compass audit as unused. Don't carry them across:
- `compass/components/shared/CompassHero.tsx` (146 lines, no importers)
- `compass/components/shared/CompassCard.tsx` (107 lines, no importers)
- `compass/components/shared/CompassTabs.tsx` (97 lines, no importers)
- `compass/components/shared/CompassSection.tsx` (191 lines, no importers)
- `compass/components/shared/CompassText.tsx` (327 lines, no importers)
- `compass/components/shared/CompassBgFx.tsx` (likely unused — confirm before migrating)
- `compass/components/insights/ShareLinks.tsx` (explicitly retired per InsightShell comment)
- `app/compass/callouts/page.tsx` (design-system demo)

### Styles + tokens

| Compass | Mantle Astro |
|---|---|
| `app/globals.css` `@theme` block (`--color-*`, `--text-*`, `--radius-*`, `--font-*`, `--leading-*`) | Merge into `src/styles/global.css` — Tailwind v4 reads `@theme` identically in Astro. Check for naming collisions with existing Mantle tokens (use Mantle's names when there's overlap). |
| `/public/compass-base.css` | Token block: merge into `global.css`. Site-header rules: drop (Mantle's Header.astro handles this). Card recipes: convert to component-level styles or Tailwind utilities. |
| `/public/compass-globals.css` | Cream-canvas overrides go into `global.css` (under a `.compass-light-theme` scope) or get applied via layout. |
| `/public/compass-manual.css` + `compass-manual-base.css` | Manual chrome rules (hero, sidebar, mobile drawer): convert to scoped styles on `CompassManualLayout.astro`. Drop everything else. |
| `/public/framework.css`, `insight.css`, `customer.css` | Drop — Astro layouts replace these. |

### Routes + redirects

Add to `_redirects` in the Astro repo (Netlify-style):

```
# Compass URL inherited from earlier site, before the rename
/compass/frameworks                /compass/methods                          301
/compass/frameworks/*              /compass/methods/:splat                   301
/compass/framework                 /compass/methods                          301

# Manuals were renamed (Reality → Foundation) when restructured into 7 manuals
/compass/reality                   /compass/foundation                       301
/compass/reality/*                 /compass/foundation/:splat                301

# Legacy /manuals/* URLs (pre-Compass nesting)
/manuals/think-like-a-founder      /compass/foundation                       301
/manuals/think-like-a-founder/*    /compass/foundation                       301
/manuals/get-to-real-demand        /compass/shape                            301
/manuals/get-to-real-demand/*      /compass/shape                            301
/manuals/build-your-first-mvp      /compass/build                            301
/manuals/build-your-first-mvp/*    /compass/build                            301
/manuals/polish-your-product       /compass/launch                           301
/manuals/polish-your-product/*     /compass/launch                           301
/manuals                           /compass/manuals                          301
/manuals/*                         /compass/manuals                          301

# Templates moved under /compass per the Astro subsection plan
/templates                         /compass/templates                        301
/templates/*                       /compass/templates/:splat                 301

# Insights/answers/callouts old URLs (if any external links exist)
# add as needed
```

### SEO

| Concern | Astro approach |
|---|---|
| `metadataBase` | Astro `site` in `astro.config.mjs` is already `https://heymantle.com` ✓ |
| Per-route metadata | Pass title/description/og into `MainLayout.astro` props (the existing pattern) |
| Sitemap | `@astrojs/sitemap` integration auto-generates from all routes + collection content; the `app/sitemap.ts` Compass logic is unnecessary |
| Robots | Already handled by `src/pages/robots.txt.ts` (or similar — verify the existing pattern) |
| JSON-LD (Article + BreadcrumbList on detail pages) | Build into `CompassArticleLayout.astro` + `CompassManualLayout.astro`. The `compass/lib/seo.ts` `buildSectionJsonLd` logic ports directly — Astro can render JSON-LD in `<script type="application/ld+json">` blocks |
| OG images | Use existing Mantle OG pattern (`BlogLayout.astro` shows it). Drop `app/api/og/` + `app/opengraph-image.tsx` — Astro has built-in `getImage()` |

---

## Zod schemas — paste-ready for `src/content.config.ts`

```ts
// ============================================================
// Compass content collections
// Add these alongside the existing `blog`, `seismic`, etc.
// ============================================================

const compassManualSchema = z.object({
  title: z.string(),
  slug: z.string(),
  /** Chapter order within the manual. `00` is the intro. */
  order: z.number().int().nonnegative(),
  /** Short summary shown on the manual index card + as <meta description>. */
  summary: z.string(),
  /** Optional standalone description (when summary is too short). */
  description: z.string().optional(),
  /** ISO date (publish) */
  date: z.string().optional(),
  /** ISO date (last meaningful edit) */
  updated: z.string().optional(),
  author: z.string().optional(),
  /** True for manuals that aren't ready to navigate to. */
  comingSoon: z.boolean().default(false),
  /** Cover-card accent: gold | lilac | cyan | warm | orange | white */
  accent: z.enum(["gold", "lilac", "cyan", "warm", "orange", "white"]).optional(),
  /** Cover-card motif (svg id) */
  motif: z.string().optional(),
  /** Display ordinal — "Manual 01" */
  ordinal: z.string().optional(),
  /** Display title on the cover (often shorter than title) */
  coverTitle: z.string().optional(),
});

const compassMethodSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  ribbon: z.string().optional(),
  author: z.string().optional(),
  authorRole: z.string().optional(),
  authorAvatar: z.string().optional(),
  blockColor: z.enum(["yellow", "gray", "black", "orange", "blue", "graphite"]).optional(),
  tags: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  date: z.string().optional(),
  updated: z.string().optional(),
  codeBlocks: z.array(z.object({
    label: z.string(),
    language: z.string().optional(),
    body: z.string(),
  })).optional(),
});

const compassTemplateSchema = compassMethodSchema.extend({
  /** Templates can additionally declare a preview image (live mockup). */
  previewImage: z.string().optional(),
  /** Category — billing, screens, components, etc. */
  category: z.string().optional(),
  /** Output format — figma, react, html, etc. */
  format: z.string().optional(),
});

const compassInsightSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  date: z.string(),
  updated: z.string().optional(),
  author: z.string(),
  authorRole: z.string().optional(),
  authorAvatar: z.string().optional(),
  ribbon: z.string().optional(),
  readTime: z.string().optional(),
});

export const collections = {
  // ...existing collections,
  "compass-manuals":   defineCollection({ schema: compassManualSchema }),
  "compass-methods":   defineCollection({ schema: compassMethodSchema }),
  "compass-templates": defineCollection({ schema: compassTemplateSchema }),
  "compass-insights":  defineCollection({ schema: compassInsightSchema }),
};
```

The current Compass TS types (`compass/lib/{manuals,methods,templates,insights}/content.ts`) line up with these schemas modulo a few naming differences — see "Pre-migration cleanup" below.

---

## Pre-migration cleanup — do these in Compass repo before exporting

Goal: every MDX file should drop into Astro with **zero hand-edits**.

### 1. Standardize frontmatter field names

Replace inconsistent fields across the existing MDX in `compass/content/*`:

| Old field name (varies) | Canonical | Rationale |
|---|---|---|
| `description` (in templates) | `summary` | Matches manuals, methods, insights — one word for the same concept |
| `published` | `date` | Matches Mantle blog pattern + Astro convention |
| `lastUpdated` | `updated` | Matches Mantle convention |
| (manifest-driven chapter order) | `order: NN` in chapter frontmatter | Lets Astro sort without reading a manifest |
| `file` (Next.js internal — file path of source MDX) | drop | Astro doesn't need it |

**Action:** ripgrep-rename across `compass/content/`, then update TS types in `compass/lib/*/content.ts` to match.

### 2. Fix `comingSoon: true` lie

`compass/lib/manuals/content.ts` `MANUAL_COVERS` marks `launch`/`monetize`/`grow`/`operate` as `comingSoon: true` even though their MDX directories exist with full content. Either:
- Flip the flag to `false` (publish them), or
- Move their MDX dirs out of `compass/content/manuals/` until they're ready

**Decision needed pre-migration** — Astro `getStaticPaths` will generate routes for whatever exists on disk.

### 3. Clean up `billing-components.mdx`

This file references four Mantle marketing components (`<MantleProvider>`, `<HighlightedCard>`, `<HorizontalPlanCards>`, `<VerticalCards>`) that don't exist in Compass. They render as silent no-ops here. In Astro they'll resolve to the real components — **but verify the props are correct and the imports work** as the first migration test case. If anything's broken in this MDX, fix it on the Astro side post-migration.

### 4. Remove dead components

Listed in "Dead code — do NOT migrate" above. Optional — they can be filtered out at migration time — but pruning now reduces noise.

### 5. Decide `/templates` redirect strategy

The Next.js Compass has `/templates/*` at top-level. The Astro plan moves them to `/compass/templates/*`. Make sure the redirect in `_redirects` is in place at cutover so external links don't 404.

---

## Migration sequence (separate session, ~1-2 days)

Phase 1 — **Slice** (~2 hours, validates the approach):

1. Branch the Astro repo: `git checkout -b compass-migration`
2. Add the 4 Zod schemas above to `src/content.config.ts`
3. Create `src/content/compass-manuals/foundation/` and copy ONE chapter (`00-foundation.md`) over, with frontmatter normalized
4. Create `src/layouts/CompassManualLayout.astro` (basic — title + body, refine later)
5. Create `src/pages/compass/[manual]/index.astro` and `src/pages/compass/[manual]/[section].astro` reading from the collection
6. Boot dev, hit `/compass/foundation` — confirm the chapter renders
7. Stop. Verify the slice looks right before continuing.

Phase 2 — **Manuals** (~4 hours):

1. Migrate the remaining 7 manual directories
2. Build `ManualCoverGrid.astro` and `src/pages/compass/manuals/index.astro`
3. Add `CoverArt.astro` + the per-motif SVG components
4. Wire chapter navigation (prev/next, in-manual TOC)

Phase 3 — **Methods + Templates + Insights** (~4 hours):

1. Migrate `compass-methods` collection + index/detail pages
2. Migrate `compass-templates` collection + index/detail pages (under `/compass/templates`)
3. Migrate `compass-insights` collection + index/detail pages — likely shortest because BlogLayout pattern is reusable

Phase 4 — **Chrome + polish** (~3 hours):

1. Compass home (`/compass/index.astro`) — Mantle Compass landing
2. SectionNav, IndexHero, FooterCta, Newsletter
3. SEO: per-route metadata + JSON-LD on detail pages
4. Sitemap should auto-include via `@astrojs/sitemap`
5. Add all `_redirects` from "Routes + redirects" section above

Phase 5 — **Cutover** (~30 min):

1. Build the Astro site locally; spot-check every Compass route
2. Merge `compass-migration` → `main` in the Astro repo
3. Vercel/Netlify deploys, propagates
4. Take down `compass-lime-rho.vercel.app` (the Next.js Compass deploy)
5. Archive this repo (`paige-mantle/compass`) — set to read-only on GitHub

---

## What's NOT migrating

- `next.config.ts` (Astro has its own config; redirects move to `_redirects`)
- `package.json` (Astro repo has its own deps)
- `app/layout.tsx` (Astro uses its own `MainLayout.astro`)
- `app/globals.css` font/Tailwind setup (Astro handles this)
- `next/font` integration (Astro has its own font handling)
- `app/api/og/route.tsx` (Astro's `getImage()` replaces this)
- React server components (`generateStaticParams`, etc. — Astro has `getStaticPaths`)
- All Next-specific tooling (`.next/`, `turbopack`, `next-env.d.ts`)

---

## Reference deploy timeline

The Next.js Compass at `compass-lime-rho.vercel.app` stays running during the migration so you can:

- Compare behavior side-by-side with the Astro version while building
- Continue editing content here if needed (publishes to the staging URL)
- Roll back to it if the Astro migration hits a blocker that takes time to resolve

Take it down only after the Astro version is live at `heymantle.com/compass` and known-good for at least a deploy cycle.
