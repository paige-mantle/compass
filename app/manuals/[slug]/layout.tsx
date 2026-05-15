import type { ReactNode } from "react";

/**
 * `/manuals/[slug]` + `/manuals/[slug]/[section]` layout.
 *
 * Currently a pass-through. Manual chapter pages get every style
 * they need from the root layout's two imports:
 *
 *   • `app/globals.css`        — Mantle tokens, `body:has(.manual-shell)`
 *                                paper canvas + grain overlay (ported
 *                                from the legacy `/public/compass-
 *                                manual.css`), header chrome rules
 *   • `@/compass/styles/index.css` — `.manual-section` prose recipe,
 *                                v2 callout chrome, code fence tile
 *
 * The legacy stylesheets that used to load here (`compass-manual-
 * base.css` for the site-header / mega-menu / sidebar / card recipes
 * shared with the old static index pages, and `compass-manual.css`
 * for `.manual-section table/p/h2` overrides) are retired. They
 * carried duplicate prose rules that competed with `prose.css` and
 * referenced tokens (`--border-soft`, `--text-secondary`) that no
 * longer load on the manual route, which broke tables and callout
 * body typography. Single source of truth now lives in `compass/
 * styles/` + `app/globals.css`.
 *
 * Kept as a discrete route-segment file so a future manual-only
 * layout treatment (per-manual fonts, custom drawer, etc.) can
 * land here without touching the parent.
 */
export default function ManualRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
