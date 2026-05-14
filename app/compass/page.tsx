import Link from "next/link";
import { CompassLayout } from "@/compass/components/shared/CompassLayout";
import { CompassIndexHero } from "@/compass/components/shared/CompassIndexHero";
import { CompassSectionNav } from "@/compass/components/shared/CompassSectionNav";
import { CompassNewsletter } from "@/compass/components/shared/CompassNewsletter";
import { CompassPromptHeading } from "@/compass/components/shared/CompassPromptHeading";
import { ManualRowList } from "@/compass/components/manuals/ManualRowList";
import { InsightCardGrid } from "@/compass/components/insights/InsightCardGrid";
import { MANUAL_COVERS } from "@/compass/lib/manuals/content";
import { listInsights } from "@/compass/lib/insights/content";

export const metadata = {
  /* `absolute` bypasses the `%s | Mantle Compass` template defined in
     the root layout — the Compass home wants the brand to lead the
     title, not trail it. */
  title: {
    absolute: "Mantle Compass | Learn how to build, launch, and grow your app",
  },
  description:
    "Practical manuals, templates, workflows, and insights for founders building app businesses with AI and Mantle.",
  alternates: { canonical: "/compass" },
};

/**
 * /compass home — the front page for the Compass resource hub.
 *
 * Intentionally different presentation from `/manuals`:
 *   • Home uses `<ManualRowList>` — landscape rows w/ editorial
 *     copy, one manual per row, narrative ordering. The "here's what
 *     these manuals teach" frame.
 *   • The /manuals index uses `<ManualCoverGrid>` — portrait
 *     320×440 cover posters in a 4-column grid. The "browse the
 *     catalog" frame.
 *
 * Two presentations of the same data because the two surfaces have
 * different jobs. Home tells the story; the index shows the breadth.
 *
 * Section order:
 *   1. Hero (title + summary)
 *   2. Section nav (Manuals / Methods / Templates / Insights)
 *   3. Manual row list (the editorial intro to Compass)
 *   4. Latest insights — gold eyebrow + section heading + "View all"
 *   5. Newsletter signup footer
 */
export default async function CompassHomePage() {
  const insights = await listInsights();
  const latestInsights = insights.slice(0, 3);

  return (
    <CompassLayout showFooterCta={false}>
      <div className="mx-auto w-full max-w-[1320px] px-6 max-[720px]:px-5">
        <CompassIndexHero
          eyebrow={null}
          heading="Mantle Compass"
          description="Everything you need to go from idea to a real, working product."
        />
        <CompassSectionNav currentPath="/compass" />

        {/* Manual row list — editorial introduction to the manuals.
            Tighter top margin than the cover-grid version because the
            rows themselves have generous internal padding (py-12). */}
        <div className="mt-10 max-[720px]:mt-8">
          <ManualRowList covers={MANUAL_COVERS} />
        </div>

        {/* "View all manuals →" affordance below the row list so
            readers know the catalog page exists. Mirrors the
            next-gen Mantle marketing-site pattern (`mm-link` → arrow). */}
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
            <span aria-hidden>→</span>
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
                <span aria-hidden>→</span>
              </Link>
            </div>
            <InsightCardGrid insights={latestInsights} />
          </section>
        ) : null}
      </div>
      <CompassNewsletter />
    </CompassLayout>
  );
}
