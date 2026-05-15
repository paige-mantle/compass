import type { ReactNode } from "react";
import { CompassLayout } from "./CompassLayout";
import { CompassIndexHero } from "./CompassIndexHero";

/**
 * Shared listing-page shell for every Compass index surface
 * (/compass home, /manuals, /workflows, /templates, /blog).
 *
 * Uses `<CompassIndexHero>` — the canonical Compass index recipe:
 * eyebrow → big h1 + summary in a 7/5 grid at lg+. Same hero
 * treatment across home and section indexes so they all anchor to
 * one visual rhythm.
 *
 * Detail pages (workflow / template / insight) use a different,
 * heavier hero — `<CompassDetailHero>` — that adds a multi-segment
 * breadcrumb, verified-author chips, and works-with pills. Listing
 * pages stay lighter on purpose.
 *
 * Props:
 *   • `heading` — display title in the hero (e.g. "Manuals").
 *   • `description` — supporting paragraph beneath the title.
 *   • `currentPath` — used by `<CompassSectionNav />` to highlight
 *     the active tab.
 *   • `eyebrow` — optional override for the hero eyebrow. Defaults
 *     to "Compass" linking to /compass. Pass `null` to suppress.
 *     Pass a string for a custom label, or a ReactNode for full
 *     control.
 *   • `eyebrowHref` — destination for the eyebrow link when it's a
 *     string. Defaults to /compass.
 *   • `children` — the grid (or rows) of items rendered below the
 *     section nav.
 *
**Newsletter placement decision (intentional)** — the
 * newsletter signup is NOT rendered on the listing shell anymore.
 * Putting it on every listing (5 surfaces) burned hydration cost
 * on /compass + /manuals + /workflows + /templates where the
 * audience is browsing for resources, not subscribing to a
 * publication. Newsletter now renders only where reader intent is
 * highest:
 *
 *   • `/blog` — the insights index. Readers who land here are
 *     literally there for content. Render via `<CompassNewsletter />`
 *     inside the page's children.
 *   • End of each insight article (`/blog/[slug]`) — readers who
 *     just finished an article are warmest. Render below the MDX
 *     body.
 *
 * The global `<MantleFooter />` (rendered by `CompassLayout`) closes
 * every page with the "Grow your business with Mantle" CTA + the
 * 5-column link grid, so listing pages still have a strong close
 * without the newsletter form.
 */
export function CompassListingPage({
  heading,
  description,
  currentPath,
  eyebrow,
  eyebrowHref,
  children,
}: {
  heading: string;
  description: string;
  currentPath: string;
  eyebrow?: ReactNode | null;
  eyebrowHref?: string;
  children: ReactNode;
}) {
  return (
    <CompassLayout>
      {/* Container width + padding ramp matches next-gen Mantle
          (`max-w-330` ≈ 1320px under `--spacing: 4px`, then
          `px-4 sm:px-6 md:px-8`). Same recipe `<CompassHeader />`
          uses, so the listing chrome sits in the same vertical
          column as the global header. */}
      <div className="mx-auto w-full max-w-page px-4 sm:px-6 md:px-8">
        <CompassIndexHero
          heading={heading}
          description={description}
          {...(eyebrow !== undefined ? { eyebrow } : {})}
          {...(eyebrowHref !== undefined ? { eyebrowHref } : {})}
        />
        {/* `<CompassSectionNav>` retired from this surface — the
            section switcher (Manuals / Workflows / Templates /
            Insights with count badges) now lives in the secondary
            row of `<CompassHeader>` and stays sticky as the reader
            scrolls. `currentPath` is still passed through the layout
            chain so the header knows which tab to mark active. */}
        <div className="compass-content mt-10 max-[720px]:mt-8">{children}</div>
      </div>
    </CompassLayout>
  );
}
