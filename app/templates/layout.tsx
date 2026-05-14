import type { ReactNode } from "react";

/**
 * Templates layout — mirrors `app/compass/layout.tsx` but for the
 * `/templates` route segment. Templates sits at /templates (not
 * /compass/templates) but is part of the same design system, so it
 * loads the same canonical base CSS bundle. When `/templates`
 * eventually moves under `/compass/`, this file goes away and the
 * route inherits from the parent Compass layout directly.
 *
 * What's loaded here:
 *   1. `compass-base.css` — Compass design-token mirror + `.site-header`
 *      chrome. (Same file the parent Compass layout pulls in.)
 *
 * What's intentionally NOT loaded here:
 *   - **Fonts** — loaded once at the root layout via `next/font/google`
 *     (Geist, Geist Mono, Manrope). No external `fonts.googleapis.com`
 *     stylesheet on this route.
 *   - **`compass-manual-base.css` + `compass-manual.css`** — these
 *     116KB of manual-page chrome (hero, sidebar TOC, mobile drawer,
 *     prev/next nav) target `.manual-section` / `.manual-hero` /
 *     `.manual-shell` selectors that don't exist on `/templates`.
 *     Loading them here previously cost 116KB of unused CSS on every
 *     templates request. They're now scoped to
 *     `app/compass/[manual]/layout.tsx` where they actually apply.
 *   - **`compass-typography.css`** — only targets legacy static-page
 *     card class names; see `app/compass/layout.tsx` for rationale.
 */
export default function TemplatesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Fonts fully self-hosted via `next/font/google` in
          `app/layout.tsx`. `/public/compass-base.css` (and the other
          mirror stylesheets in /public) now lead their `--font-*`
          stacks with `var(--font-manrope, 'Manrope')` etc., so the
          self-hosted faces resolve through the cascade — no external
          Google Fonts <link> needed on /templates either. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-base.css" />
      {/* compass-globals.css carries the cream-canvas overrides + the
          `html { font-size: 16px }` rule shared with every Compass
          surface. Must load AFTER compass-base.css so the cream
          `--canvas` wins. The manual-page CSS bundles
          (compass-manual-base.css + compass-manual.css) are no longer
          loaded here — they're scoped to /compass/[manual]/* now. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-globals.css" />
      {children}
    </>
  );
}
