import type { ReactNode } from "react";
import { CompassHeader } from "./CompassHeader";
import { CompassBgFx } from "./CompassBgFx";
import { CompassFooterCta } from "./CompassFooterCta";

// The full Mantle <Footer /> will sit below this layout when
// Compass is integrated into the parent site. While standalone
// we render only the CTA band (CompassFooterCta) at the bottom
// of every page — it closes the page with a "Get started" call.

/**
 * Compass page layout — light-mirror of Mantle's marketing
 * `Layout.astro`. Single source of truth for the chrome that
 * every Compass page renders inside:
 *
 *   1. Outer wrapper — `relative isolate min-h-screen
 *      overflow-hidden bg-surface-medium` carrying the
 *      `data-layout-bg-fx data-bg-fx-scope` attributes that
 *      activate the `--bg-ambient-color` cascade.
 *   2. `<CompassBgFx />` — the absolute-positioned ambient
 *      backdrop. Skipped via `showBackgroundFx={false}`.
 *   3. Content shaft — `relative z-10 pt-16 md:pt-18` (the
 *      pt-* values clear the fixed `<CompassHeader />`).
 *      Contains `<CompassHeader />`, `<main>{children}</main>`,
 *      and optionally `<CompassFooter />`.
 *
 * The visual output is intentionally identical to the static-
 * page mirror in `/public/compass-bgfx.css` so React-rendered
 * detail pages (frameworks, insights, manual chapters) and the
 * five static index pages render the same chrome.
 *
 *   • `showBackgroundFx` (default true) — toggle the BgFx layer.
 *   • `backgroundFx`                   — passed through to
 *                                        `<CompassBgFx />`
 *                                        (className, showNoise,
 *                                        ambientColor).
 *   • `includeFooter` (default true)   — switch off on surfaces
 *                                        where the footer is
 *                                        deliberately absent
 *                                        (e.g. manual chapters).
 *   • `headerVariant`                  — passed through to
 *                                        `<CompassHeader />`.
 */
export function CompassLayout({
  children,
  showBackgroundFx = true,
  backgroundFx,
  showFooterCta = true,
  className = "",
}: {
  children: ReactNode;
  showBackgroundFx?: boolean;
  backgroundFx?: {
    className?: string;
    showNoise?: boolean;
    showAmbient?: boolean;
    ambientColor?: string;
  };
  /** Toggle the closing CompassFooterCta band. Default true.
      Surfaces that don't want the "Grow your business with Mantle"
      band (e.g. the Templates section while it's still being
      built out) pass `false`. */
  showFooterCta?: boolean;
  className?: string;
}) {
  return (
    <div
      data-layout-bg-fx=""
      data-bg-fx-scope=""
      className={`relative isolate min-h-screen overflow-hidden bg-surface-medium ${className}`}
    >
      {showBackgroundFx ? <CompassBgFx {...(backgroundFx ?? {})} /> : null}
      {/* No top padding here — the CompassHeader renders as
          `<header class="site-header">` with `position: sticky`,
          which takes flow space itself. Adding pt-16 here would
          stack on top of the sticky header's own height. */}
      <div className="relative z-10">
        <CompassHeader />
        <main>{children}</main>
        {showFooterCta ? <CompassFooterCta /> : null}
      </div>
    </div>
  );
}
