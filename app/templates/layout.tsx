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
      {/* External Google Fonts <link> is still required here because
          /public/compass-base.css references `'Manrope'` / `'Geist'` /
          `'Geist Mono'` as LITERAL font-family strings. See
          `app/compass/layout.tsx` for the full explanation. When the
          static CSS migrates to `var(--font-*)`, this <link> can be
          removed and `next/font/google` will fully self-host. */}
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
      {/* compass-manual-base.css ships the GLOBAL body rules (html/body
          background, font-family, base color, root font-size) every
          Compass surface depends on — including /templates. See the
          parent Compass layout for the full explanation. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-manual-base.css" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-manual.css" />
      {children}
    </>
  );
}
