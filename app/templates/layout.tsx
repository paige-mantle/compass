import type { ReactNode } from "react";

/**
 * Templates layout — currently a pass-through.
 *
 * Compass prose + callout stylesheets (`@/compass/styles/index.css`)
 * are loaded at the ROOT layout (`app/layout.tsx`) so every Compass
 * surface, including this one, resolves the same prose / callout
 * recipes from a single source of truth.
 *
 * The legacy `/public/compass-base.css` and `/public/compass-globals.css`
 * stylesheets used to load here. They were retired in the system
 * cleanup once their content was either moved into `app/globals.css`
 * (Mantle tokens, `--cover-accent-*`, body resets) or replaced by
 * the React `<CompassHeader />` component (legacy `.site-header`).
 *
 * Kept as a discrete route-segment file so a future `/templates`
 * specific layout treatment can land here without touching the
 * parent.
 */
export default function TemplatesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
