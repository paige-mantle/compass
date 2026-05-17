import type { ReactNode } from "react";
import { CompassHeader } from "./CompassHeader";
import { CompassBgFx } from "./CompassBgFx";
import { MantleFooter } from "./MantleFooter";

// `<MantleFooter />` is the direct port of the live heymantle.com
// footer (closing CTA band + 5-column link grid + decorative
// LogoText watermark + warm ambient wash). It renders at the bottom
// of every Compass page so the close mirrors the marketing site
// byte-for-byte. The old Compass-specific `<CompassFooterCta />`
// (CTA band only, no link grid) has been retired.

/**
 * Compass page layout — single source of truth for the chrome
 * every Compass page renders inside. Mirrors Mantle's marketing
 * `Layout.astro` recipe: outer wrapper carrying `data-layout-bg-fx`
 * + `data-bg-fx-scope` attributes that activate the
 * `--bg-ambient-color` cascade, optional ambient backdrop, fixed
 * `<CompassHeader />` chrome, page content, optional CTA band.
 *
 * Variants:
 *   • `surface` — paints the outer canvas.
 *       "default" (dark surface-medium) — listing pages, home,
 *                  detail surfaces under the compass-light-theme
 *                  subtree.
 *       "manual"  — transparent so the legacy manual CSS
 *                  (compass-manual.css `body:has(.manual-shell)`)
 *                  can paint the paper-white canvas underneath.
 *                  Will become `bg-white` directly once legacy
 *                  CSS is retired.
 *   • `headerVariant` — passed through to `<CompassHeader />`.
 *       "default" — the standard 5-tab nav.
 *       "manual"  — same chrome, retained as a separate prop so
 *                  manual-specific tweaks can land in `CompassHeader`
 *                  without touching every consumer.
 *
 * Other props:
 *   • `showBackgroundFx` — toggle the BgFx ambient layer (default
 *     true; manual pages typically pass false because the paper
 *     surface doesn't want the warm haze).
 *   • `backgroundFx` — pass-through to `<CompassBgFx />`.
 *   • `showFooter` — toggle the global `<MantleFooter />`. Default
 *     `true` everywhere. Manual chapter routes pass `false` because
 *     the manual surface owns its own full-height chrome and a
 *     marketing-site footer at the bottom would clash with that
 *     editorial reading flow. Kept as a prop so a future manual
 *     layout can opt back in without changing every consumer.
 *
 *   • `showFooterCta` — retained as an alias for `showFooter` for
 *     back-compat with the four existing consumers (they passed
 *     `showFooterCta={false}` to suppress the old CTA-only band).
 *     New code should pass `showFooter` directly.
 */
export function CompassLayout({
  children,
  showBackgroundFx = true,
  backgroundFx,
  showFooterCta,
  showFooter = true,
  surface = "default",
  headerVariant = "default",
  showHeader = true,
  hideSecondaryNav = false,
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
  /** @deprecated use `showFooter` */
  showFooterCta?: boolean;
  showFooter?: boolean;
  surface?: "default" | "manual";
  headerVariant?: "default" | "manual";
  /** Render the global `<CompassHeader />` chrome. Default `true`.
   *  Manual chapter surfaces pass `false` because they own their
   *  full-height left-rail navigation and don't want a competing
   *  top bar. When `false`, the body offset that clears the fixed
   *  header is also skipped — the content starts flush with the top
   *  of the viewport. */
  showHeader?: boolean;
  /** Suppress the secondary section-nav row inside `<CompassHeader>`.
   *  Detail-page surfaces (workflow / template / insight slug pages)
   *  pass `true`; listings + the home keep it visible. Also shrinks
   *  the body top-offset from 120px → 72px so detail pages don't
   *  carry phantom whitespace where the section nav used to live. */
  hideSecondaryNav?: boolean;
  className?: string;
}) {
  const surfaceBg = surface === "manual" ? "" : "bg-surface-medium";
  /* Body top offset clears the fixed `<CompassHeader />`. Header
     height depends on whether the secondary nav row renders:
       • Listings (secondary visible): 64px mobile / 100px desktop
         (primary 52px + secondary 48px on lg+).
       • Detail pages (secondary hidden): 64px mobile / 52px desktop.
     Primary row stepped down 72px → 60px → 52px as the nav-link
     `py` was progressively tightened
     (`md:py-[26px]` → `md:py-5` → `md:py-4`). The secondary row
     carries the editorial weight underneath, so the primary can
     sit quieter than next-gen's 72px.
     `showHeader={false}` means no header to clear → zero offset. */
  const headerOffsetClass = !showHeader
    ? ""
    : hideSecondaryNav
      ? "pt-16 lg:pt-[44px]"
      : "pt-16 lg:pt-[92px]";
  return (
    <div
      data-layout-bg-fx=""
      data-bg-fx-scope=""
      className={`relative isolate min-h-screen overflow-hidden ${surfaceBg} ${className}`.trim()}
    >
      {showBackgroundFx ? <CompassBgFx {...(backgroundFx ?? {})} /> : null}
      <div className={`relative z-10 ${headerOffsetClass}`.trim()}>
        {showHeader ? (
          <CompassHeader
            variant={headerVariant}
            hideSecondaryNav={hideSecondaryNav}
          />
        ) : null}
        <main>{children}</main>
        {/* `showFooterCta` is the deprecated alias; resolve through
            it for back-compat so existing `showFooterCta={false}`
            consumers (4 routes) keep suppressing the footer until
            they're explicitly migrated. New code uses `showFooter`. */}
        {(showFooterCta ?? showFooter) ? <MantleFooter /> : null}
      </div>
    </div>
  );
}
