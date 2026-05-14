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
      {/* External Google Fonts <link> is still required here because the
          static stylesheets in /public (compass-base.css,
          compass-manual-base.css, compass-manual.css, insight.css,
          customer.css) reference `'Manrope'` / `'Geist'` / `'Geist Mono'`
          as LITERAL font-family strings. `next/font/google` (root layout)
          serves the same faces under renamed CSS variables
          (`--font-manrope` / `--font-geist-sans` / `--font-geist-mono`)
          — those resolve in React components via the @theme stacks in
          `globals.css`, but the literal names in the static CSS files
          would fall back to system sans without this stylesheet. When
          all five static CSS files migrate their `font-family`
          declarations to `var(--font-*)`, this <link> can be removed. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin=""
      />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap"
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-base.css" />
      {/* compass-manual-base.css is misnamed — despite the `manual` in
          its filename, it ships the GLOBAL body rules (html/body
          background, font-family, base color, body grain texture, root
          font-size) that every Compass route depends on. Removing it
          from non-manual routes collapses the body background to the
          UA default. compass-manual.css sits alongside it for the
          manual-section / hero / sidebar chrome. Both are loaded here
          (Compass parent) until the global body rules get extracted
          out into globals.css. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-manual-base.css" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-manual.css" />
      {children}
    </>
  );
}
