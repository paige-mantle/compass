import type { ReactNode } from "react";

/**
 * `/compass/[manual]` + `/compass/[manual]/[section]` layout —
 * pass-through. The manual-specific CSS bundles
 * (compass-manual-base.css + compass-manual.css) are loaded by the
 * parent `app/compass/layout.tsx` because compass-manual-base.css
 * also carries the GLOBAL body rules (background, font-family, root
 * font-size) every Compass route depends on. Until those global
 * rules get hoisted into `globals.css`, this file stays as a
 * pass-through so the route segment exists without
 * re-loading any stylesheet.
 */
export default function ManualRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
