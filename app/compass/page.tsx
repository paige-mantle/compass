import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CompassListingPage } from "@/compass/components/shared/CompassListingPage";
import { CompassPromptHeading } from "@/compass/components/shared/CompassPromptHeading";
import { ManualRowList } from "@/compass/components/manuals/ManualRowList";
import { InsightCardGrid } from "@/compass/components/insights/InsightCardGrid";
import { MANUAL_COVERS } from "@/compass/lib/manuals/content";
import { listInsights } from "@/compass/lib/insights/content";

/* All SEO copy below is the May spreadsheet's source of truth.
   `title` / `description` / `canonical` / OG / Twitter all map to
   the corresponding columns. The H1 + subheading are passed to
   `<CompassListingPage>` below. */
const TITLE = "App Builder Manuals, Workflows & Templates | Mantle Compass";
const DESCRIPTION =
  "Practical manuals, workflows, templates, and insights for app builders using AI to build real product businesses.";
const OG_TITLE = "App builder resources for the AI era";
const OG_DESCRIPTION =
  "Manuals, workflows, templates, and insights for builders turning AI-built products into real businesses.";
const CANONICAL = "https://heymantle.com/compass";

export const metadata = {
  /* `absolute` bypasses the `%s | Mantle Compass` template defined in
     the root layout — the Compass home wants the brand to lead the
     title, not trail it. */
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: CANONICAL,
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
  },
};

/**
 * /compass home — the front page for the Compass resource hub.
 *
 * Uses the shared `<CompassListingPage>` shell so the home anchors
 * to the same chrome every Compass index renders (hero, section
 * nav, newsletter footer). The home's unique content — the
 * `<ManualRowList>` editorial intro, the "Browse all manuals" link,
 * and the "What our team is saying" insights section — slots into
 * the shell's children area.
 *
 * Intentionally different presentation from `/manuals`:
 *   • Home uses `<ManualRowList>` — landscape rows w/ editorial
 *     copy, one manual per row, narrative ordering. The "here's
 *     what these manuals teach" frame.
 *   • `/manuals` uses `<ManualCoverGrid>` — portrait 320×440 cover
 *     posters in a 4-column grid. The "browse the catalog" frame.
 *
 * Two presentations of the same data because the two surfaces have
 * different jobs. Home tells the story; the index shows the breadth.
 */
export default async function CompassHomePage() {
  const insights = await listInsights();
  const latestInsights = insights.slice(0, 3);

  return (
    <CompassListingPage
      heading="Mantle Compass"
      description="Manuals, workflows, templates, and essays for app builders turning AI-built products into real businesses."
      currentPath="/compass"
      /* Eyebrow trails up to the Mantle marketing site. Listing
         pages use eyebrow="Compass" linking back here; the home's
         eyebrow points one level higher so the editorial trail
         reads MANTLE → MANTLE COMPASS → [section] → [page]. */
      eyebrow="Mantle"
      eyebrowHref="/"
    >
      {/* Manual row list — editorial introduction to the manuals.
          The rows have generous internal padding (py-12) so the
          shell's `mt-14` top margin doesn't compound into an
          oversized gap above. */}
      <ManualRowList covers={MANUAL_COVERS} />

      {/* "Browse all manuals →" affordance below the row list so
          readers know the catalog page exists. Mirrors the
          next-gen Mantle marketing-site pattern (mm-link → chevron),
          using the canonical Lucide `<ChevronRight />` instead of
          an ASCII arrow so every "→" across Compass renders as one
          icon family. */}
      <div className="mt-8 mb-4 flex justify-end">
        <Link
          href="/manuals"
          className="
            inline-flex items-center gap-1.5
            font-sans text-sm font-normal text-accent no-underline
            transition-colors duration-150 hover:text-accent-low
          "
        >
          <span>Browse all manuals</span>
          <ChevronRight width={16} height={16} strokeWidth={2} aria-hidden className="shrink-0" />
        </Link>
      </div>

      {latestInsights.length > 0 ? (
        /* Latest insights — mirrors the next-gen marketing-page
           section recipe: gold mono eyebrow, section heading,
           content, trailing "View all →" link. Vertical rhythm
           gives the section breathing room. */
        <section
          aria-label="Latest insights"
          className="border-t border-edge-medium pt-20 pb-16 max-[720px]:pt-14 max-[720px]:pb-12"
        >
          <div className="mb-4">
            <CompassPromptHeading text="Insights" color="accent" />
          </div>
          <div className="mb-10 flex items-end justify-between gap-6 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-4">
            <h2 className="m-0 max-w-[20ch] font-heading text-3xl font-medium tracking-tight leading-tight text-fg-high md:text-4xl">
              What our team is saying
            </h2>
            <Link
              href="/blog"
              className="
                inline-flex items-center gap-1.5
                font-sans text-sm font-normal text-accent no-underline
                transition-colors duration-150 hover:text-accent-low
              "
            >
              <span>View all insights</span>
              <ChevronRight width={16} height={16} strokeWidth={2} aria-hidden className="shrink-0" />
            </Link>
          </div>
          <InsightCardGrid insights={latestInsights} />
        </section>
      ) : null}
    </CompassListingPage>
  );
}
