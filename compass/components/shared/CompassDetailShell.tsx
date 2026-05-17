import type { ReactNode } from "react";
import { CompassLayout } from "./CompassLayout";
import {
  CompassDetailHero,
  type CompassDetailHeroAuthor,
} from "./CompassDetailHero";

/** Centred content container — matches the canonical next-gen
    Mantle recipe (`max-w-330 px-4 sm:px-6 md:px-8`). Same width +
    ramp `<CompassHeader />` and `<CompassListingPage>` use, so
    every Compass surface lines up vertically in the same column. */
const containerInner =
  "mx-auto max-w-page px-4 sm:px-6 md:px-8";

/**
 * One shell for every Compass detail surface — workflows, templates,
 * insights. Collapses what used to be `WorkflowShell` + `InsightShell`
 * into a single component now that the hero is shared
 * (`<CompassDetailHero />`) and the only real divergence is the
 * right-rail content + grid ratio.
 *
 * Two `rail` variants:
 *
 *   • `rail="code"` — workflows + templates. 1fr/1fr split, body left,
 *      code/prompt panel right, body uses the full column width.
 *      Collapses to one column at ≤1100px.
 *   • `rail="toc"`  — insights. 1fr/340px split, body left capped at
 *      60ch, TOC right. On mobile the rail orders FIRST so readers
 *      see the chapter list before the body. Collapses at ≤980px.
 *
 * Tags + share-URL are now passed THROUGH to the hero (`metaLayout=
 * "card"` renders them inside the bordered meta panel on the right).
 * The previous below-hero meta strip ("category dots · copy link")
 * was retired with the hero card refactor — every meta signal now
 * lives in one place.
 */
export type DetailRailVariant = "code" | "toc";

export interface CompassDetailShellProps {
  /* ───── Hero (forwarded to CompassDetailHero) ────────────── */
  breadcrumb: Array<{ label: string; href: string }>;
  title: string;
  summary?: string;
  authors?: CompassDetailHeroAuthor[];
  verified?: boolean;
  verifiedLabel?: string;
  worksWith?: string[];
  /** Surface-level taxonomy. Forwarded to the hero's meta card in
   *  the `card` layout. Ignored in `split` layout. */
  tags?: string[];
  /** Mantle product modules. Forwarded to the hero's meta card. */
  systems?: string[];
  /** Free-form "Estimated time" meta. Forwarded to the hero's
   *  meta card. */
  estimatedTime?: string;
  metaLine?: string;
  /** Canonical share URL — forwarded to the hero's `<ShareCluster>`
   *  in the `card` layout. */
  shareUrl?: string;
  /** Hero layout variant.
   *    "split" — summary on the right (insights / editorial).
   *    "card"  — summary under title; meta in a bordered card on
   *              the right (workflows / templates).
   *  Default `"split"`. */
  metaLayout?: "split" | "card";

  /* ───── Body + rail ──────────────────────────────────────── */
  /** Right-rail content. Workflows pass `<CodeBlocks>` or
   *  `<PreviewTabs>`; insights pass `<TableOfContents>`. */
  rightRail: ReactNode;
  /** Selects the body-grid ratio + mobile order. Default "code". */
  rail?: DetailRailVariant;
  /** ARIA label for the right-rail `<aside>`. */
  rightRailLabel?: string;
  /** Extra classes for the body MDX wrapper. The shell sets a
   *  baseline (`workflow-content insight-content`) so prose styles
   *  apply; add `max-w-[60ch]` here for insights, leave undefined
   *  for workflows/templates that use the full column. */
  bodyClassName?: string;

  /* ───── Footer + body ────────────────────────────────────── */
  /* Detail pages render the full `<MantleFooter />` by default (CTA
     band + 5-column link grid + decorative LogoText watermark).
     Pass `showFooterCta={false}` to suppress — currently only the
     manual chapter routes do this, to preserve their immersive
     reading chrome. */
  showFooterCta?: boolean;
  children: ReactNode;
}

const RAIL_LAYOUT: Record<
  DetailRailVariant,
  {
    grid: string;
    breakpoint: string; // collapse breakpoint width (max-[Npx])
    railOrderFirstOnMobile: boolean;
    railOrderRightOnDesktop: boolean;
    label: string;
  }
> = {
  code: {
    /* 40/60 split — body left (recipe prose / overview / outputs),
       prompt panel right. Right column still gets the larger share
       so the prompt frame has breathing room for wrapped text, but
       the left column gets enough width that the section headings
       and bullet copy don't render as a narrow ribbon. */
    grid: "minmax(0, 4fr) minmax(0, 6fr)",
    breakpoint: "1100px",
    railOrderFirstOnMobile: false,
    railOrderRightOnDesktop: true,
    label: "Sidebar",
  },
  toc: {
    grid: "minmax(0, 1fr) 340px",
    breakpoint: "980px",
    railOrderFirstOnMobile: true,
    railOrderRightOnDesktop: false,
    label: "Table of contents",
  },
};

export function CompassDetailShell({
  breadcrumb,
  title,
  summary,
  authors,
  verified,
  verifiedLabel,
  worksWith,
  tags,
  systems,
  estimatedTime,
  metaLine,
  shareUrl,
  metaLayout,
  rightRail,
  rail = "code",
  rightRailLabel,
  bodyClassName,
  showFooterCta = true,
  children,
}: CompassDetailShellProps) {
  const layout = RAIL_LAYOUT[rail];

  /* `rail="code"` (workflows / templates) now uses the canonical
     STICKY SIDEBAR pattern at lg+:
       • Body grid scrolls with the page (normal flow + page-level
         padding) — the previous fixed-height inner-scroll variant
         coupled the two columns weirdly and made the page feel
         "stuck" before the user expected.
       • Left article column flows in the normal page scroll.
       • Right rail uses `position: sticky` keyed to the primary
         nav height (72px on desktop) + a 16px top breathing
         margin, with `max-height` capped to the viewport so its
         inner code frame can still scroll internally if the prompt
         list is long. Once the body grid's top edge passes under
         the header, the rail "catches" and stays planted while the
         user scrolls through the article.
     At ≤1100px the grid collapses to one column and the sticky
     behaviour unwinds entirely so mobile readers get normal flow.

     `rail="toc"` (insights) keeps its normal page scroll — the TOC
     is short and editorial articles read better with a single
     scrolling column. */
  const bodyGridClasses =
    rail === "code"
      ? "gap-10 lg:gap-16 max-[1100px]:!grid-cols-1 pt-12 pb-12 max-[720px]:pb-8"
      : "gap-16 max-[980px]:!grid-cols-1 max-[980px]:gap-8 max-[720px]:pb-8 pt-12 pb-12";
  const railMobileOrderClass = layout.railOrderFirstOnMobile
    ? rail === "code"
      ? "max-[1100px]:order-first"
      : "max-[980px]:order-first"
    : "";
  const railStaticClass =
    rail === "code" ? "max-[1100px]:static" : "max-[980px]:static";

  const railDesktopOrderClass = layout.railOrderRightOnDesktop
    ? "lg:order-2"
    : "";
  const bodyDesktopOrderClass = layout.railOrderRightOnDesktop
    ? "lg:order-1"
    : "";

  return (
    /* Detail pages suppress the secondary section-nav row — the
       reader is inside a content piece, and the breadcrumb in the
       hero handles wayfinding back to the section listing. The
       section switcher reads as clutter at the top of a long
       article. Listings + the home keep the secondary row visible. */
    <CompassLayout showFooterCta={showFooterCta} hideSecondaryNav>
      {/* Outer wrapper — no bottom padding. The body grid below
          closes itself with a hairline `border-b border-edge-medium`
          and the MantleFooter's gradient transition + CTA band picks
          up directly below the border. The previous `pb-20` left a
          dead-space gap between the end-of-content border and the
          CTA; the closing-band visual now lives in the footer
          directly. Mobile + desktop share this: the border sits
          flush with the footer's top edge everywhere. */}
      <div className="text-fg-high">
        <article>
          {/* Shared hero — breadcrumb, title, verified chip, author,
              summary, and (in card layout) the meta panel that
              gathers tags + works-with + updated date + share. */}
          <CompassDetailHero
            breadcrumb={breadcrumb}
            title={title}
            summary={summary}
            authors={authors}
            verified={verified}
            verifiedLabel={verifiedLabel}
            worksWith={worksWith}
            tags={tags}
            systems={systems}
            estimatedTime={estimatedTime}
            metaLine={metaLine}
            shareUrl={shareUrl}
            metaLayout={metaLayout}
          />

          {/* Body grid — `gridTemplateColumns` set inline because
              Tailwind v4's arbitrary-value parser splits commas
              inside `minmax(...)` and emits three column tracks. The
              responsive collapse to one column lives on the class so
              `!grid-cols-1` overrides the inline style. Top + bottom
              padding is owned by `bodyGridClasses` per-rail so the
              two-pane variant can drop the parent padding and push
              it onto each column instead.
              `border-b border-edge-medium` closes the section flush
              against the MantleFooter — the prompt rail's internal
              `lg:py-12` keeps the code panel breathing inside the
              section, but the section itself sits flush with the CTA
              below it. */}
          {/* Body grid — the inner page-width container does NOT
              carry the closing hairline anymore; we render a
              full-bleed `<hr>` after the grid so the divider
              between content and the MantleFooter CTA spans the
              full viewport width, not just `max-w-page`. */}
          <div
            className={`${containerInner} grid items-start ${bodyGridClasses}`}
            style={{ gridTemplateColumns: layout.grid }}
          >
            {/* Left article column. For `rail="code"` at lg+, the
                column has its own scrollbar (`overflow-y-auto`)
                inside a fixed-height parent — prose scrolls
                internally while the right rail stays planted (the
                two-pane spec). Mobile falls back to normal page
                flow because the body grid's parent loses its fixed
                height under 1100px. */}
            <article
              className={[
                "workflow-content insight-content space-y-8 [&>*:first-child]:mt-0",
                bodyDesktopOrderClass,
                bodyClassName ?? "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {children}
            </article>
            {/* Right rail.
                • `rail="code"` (workflows/templates) — `lg:sticky`
                  keyed to the header height + 16px breathing top
                  margin. Once the body grid's top edge scrolls
                  under the header, the rail "catches" and the user
                  reads the prose on the left while the prompt rail
                  stays planted. `lg:max-h-[…]` caps the rail at the
                  visible viewport so a long PreviewTabs/CodeBlocks
                  panel can scroll inside the rail without forcing
                  the page to expand.
                • `rail="toc"` (insights) — historical sticky
                  behaviour for the short TOC. */}
            <aside
              aria-label={rightRailLabel ?? layout.label}
              className={[
                rail === "code"
                  ? [
                      "flex flex-col",
                      "lg:sticky lg:top-[calc(var(--header-h,44px)+16px)] lg:self-start",
                      "lg:max-h-[calc(100dvh-var(--header-h,44px)-32px)] lg:overflow-hidden",
                    ].join(" ")
                  : "sticky top-[calc(var(--header-h,44px)+16px)] self-start space-y-6",
                railDesktopOrderClass,
                railStaticClass,
                railMobileOrderClass,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {rightRail}
            </aside>
          </div>
          {/* Full-bleed hairline closes the body section and sits
              flush against the MantleFooter's gradient transition
              strip + CTA band below. Renders as an `<hr>` so it
              spans the viewport edge-to-edge (the `<div>` above is
              constrained to `max-w-page`, so a `border-b` on it
              left the divider stranded inside the page gutter).
              `m-0 h-px` strips the browser default
              `<hr>` margins; `border-0 bg-edge-medium` recolors it
              to the canonical edge token. */}
          <hr
            aria-hidden="true"
            className="m-0 h-px w-full border-0 bg-edge-medium"
          />
        </article>
      </div>
    </CompassLayout>
  );
}
