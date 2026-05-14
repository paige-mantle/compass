import type { ReactNode } from "react";

/**
 * `/compass/[manual]` + `/compass/[manual]/[section]` layout.
 *
 * Loads the manual-page chrome (`compass-manual-base.css` for the
 * site-header / mega-menu / sidebar / card recipes shared with the
 * static index pages, and `compass-manual.css` for the
 * `.manual-section` / `.manual-hero` / `.manual-shell` overrides).
 *
 * These two stylesheets are ~116KB combined and only apply to manual
 * pages, so they're scoped here rather than to the Compass parent —
 * /compass/methods, /compass/insights, /compass/answers, /templates,
 * etc. don't pay their cost. Truly-global rules (cream canvas, root
 * font-size, body grain) live in `/public/compass-globals.css` and
 * are loaded by the Compass + Templates parent layouts.
 */
export default function ManualRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-manual-base.css" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-manual.css" />
      {children}
    </>
  );
}
