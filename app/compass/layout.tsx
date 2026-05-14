import type { ReactNode } from "react";

/**
 * Compass — single canonical layout for every React-rendered route
 * under /compass/* (manuals index, manual intros, manual chapters,
 * methods detail, insights detail, callouts demo).
 *
 * Loads all the shared Compass stylesheets once at this parent level
 * so individual section / detail routes don't need their own
 * layout file. Per-section layouts (`manuals/layout.tsx`,
 * `methods/layout.tsx`, `insights/layout.tsx`, `[manual]/layout.tsx`)
 * have been collapsed into this single file — every Compass surface
 * now resolves the same set of styles in the same order.
 *
 * CSS load order (most general → most specific):
 *
 *   1. `compass-base.css`       — Compass design-token mirror of
 *                                 `app/globals.css` (`--text-*`,
 *                                 `--leading-*`, `--color-surface-*`,
 *                                 `--cover-accent-*`,
 *                                 `--color-accent-*`) + the
 *                                 `.site-header` chrome shared with
 *                                 the static Compass index pages.
 *   2. `compass-manual-base.css`
 *      `compass-manual.css`     — manual-page chrome (hero, sidebar
 *                                 TOC, mobile drawer, prev/next nav).
 *                                 Selectors are namespaced
 *                                 (`.manual-section`, `.manual-hero`)
 *                                 so they don't bleed onto non-manual
 *                                 Compass pages.
 *
 * MDX prose rules + callout components — formerly loaded via
 * `compass-content.css` and `compass-callouts.css` — now live in
 * `app/globals.css` `@layer components` so they resolve through the
 * canonical token system and load automatically with the rest of
 * the Tailwind v4 bundle.
 *
 * `compass-typography.css` is intentionally **omitted** here. It only
 * targets the legacy card class names (`.compass-manual-row`,
 * `.framework-card`, `.compass-blog-item`) used by the static index
 * pages — every React route uses Tailwind classes for cards, so the
 * rules don't apply. It can be deleted entirely once the remaining
 * static index pages migrate to React.
 *
 * Fonts: the Mantle Compass type system uses Manrope (heading), Geist
 * (body), Geist Mono (code/eyebrow). Loaded once at the parent so
 * preconnect + font-display swap apply across every Compass page.
 */
export default function CompassLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Fonts are fully self-hosted via `next/font/google` in
          `app/layout.tsx` (Geist, Geist Mono, Manrope). The CSS
          variables `--font-geist-sans` / `--font-geist-mono` /
          `--font-manrope` are exposed on <body> and lead every
          `--font-*` stack in both `app/globals.css` (@theme) and the
          /public/*.css mirror tokens. No external Google Fonts
          stylesheet — zero DNS, zero render-blocking. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-base.css" />
      {/* compass-globals.css carries the cream-canvas overrides + the
          `html { font-size: 16px }` rule that every Compass surface
          depends on. Must load AFTER compass-base.css so the cream
          `--canvas` wins over compass-base.css's pure-white value.
          Previously these rules lived at the top of
          compass-manual-base.css, which forced every non-manual route
          to drag in 116KB of manual chrome too. The manual-page CSS
          (compass-manual-base.css + compass-manual.css) now loads only
          on /compass/[manual]/* via that route's own layout. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-globals.css" />
      {children}
    </>
  );
}
