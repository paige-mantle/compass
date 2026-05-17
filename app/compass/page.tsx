import { CompassListingPage } from "@/compass/components/shared/CompassListingPage";
import { CompassPromptHeading } from "@/compass/components/shared/CompassPromptHeading";
import { CompassButton } from "@/compass/components/shared/CompassButton";
import { ManualsHomeSection } from "@/compass/components/manuals/ManualsHomeSection";
import { InsightCardGrid } from "@/compass/components/insights/InsightCardGrid";
import { WorkflowCardSlider } from "@/compass/components/workflows/WorkflowCardSlider";
import { MANUAL_COVERS } from "@/compass/lib/manuals/content";
import { listInsights } from "@/compass/lib/insights/content";
import { listWorkflows } from "@/compass/lib/workflows/content";

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
  const [insights, workflows] = await Promise.all([
    listInsights(),
    listWorkflows(),
  ]);
  const latestInsights = insights.slice(0, 3);
  /* Featured workflows on the home — take the first 3 entries in
     filesystem order. When sort-by-`lastUpdated` lands across the
     content surfaces, the home will surface the freshest three. */
  const featuredWorkflows = workflows.slice(0, 3);

  return (
    <CompassListingPage
      heading="Compass"
      description="Manuals, workflows, and templates for app teams using AI to build, grow, and operate better."
      currentPath="/compass"
      /* Eyebrow trails up to the parent Mantle ecosystem.
         "Mantle Compass" — full brand label sits above the H1 so
         the editorial trail reads MANTLE COMPASS → [section] →
         [page]; clicking it returns to this home. */
      eyebrow="Mantle Compass"
      eyebrowHref="/compass"
    >
      {/* Manuals home section — left-side editorial header +
          right-side stacked manual rows. First 2 manuals
          (Clarity + Shape) are live; the 3rd (Build) renders
          with the coming-soon overlay. Replaces the older flat
          `<ManualRowList>` — see `ManualsHomeSection.tsx` for the
          full recipe + comments. */}
      <ManualsHomeSection covers={MANUAL_COVERS} />

      {/* "Browse all manuals" CTA now sits inside
          `<ManualsHomeSection>` directly under the subhead — see
          the component for the wiring. */}

      {featuredWorkflows.length > 0 ? (
        /* Featured workflows — same section recipe as the insights
            block below: eyebrow + heading + view-all link + card
            grid. Pulls the first 3 entries from `listWorkflows()`
            so the home surfaces the workflows readers will likely
            reach for first. `WorkflowCardGrid` is the same
            component the catalog at `/workflows` renders, so the
            cards read identically across surfaces. */
        <section
          aria-label="Featured workflows"
          className="border-t border-edge-medium pt-20 pb-14 max-[720px]:pt-14 max-[720px]:pb-10"
        >
          <div className="mb-4">
            <CompassPromptHeading text="Workflows" color="accent" />
          </div>
          {/* Section header — CTA stacked UNDER the subhead (was a
              side-by-side row with the heading on the left + button
              on the right). Vertical stack reads as one editorial
              cluster: kicker → H2 → subhead → CTA. */}
          <div className="mb-10 flex flex-col gap-3 max-w-[40ch]">
            <h2 className="m-0 font-heading text-3xl font-medium tracking-tight leading-tight text-fg-high md:text-4xl">
              Workflows for building with AI
            </h2>
            <p className="m-0 font-sans text-base leading-loose text-fg-medium">
              Reusable AI workflows that give teams more leverage
              without lowering the bar.
            </p>
            <div className="mt-3">
              <CompassButton
                href="/workflows"
                icon={{ icon: "ArrowRight", position: "right" }}
              >
                View all workflows
              </CompassButton>
            </div>
          </div>
          <WorkflowCardSlider methods={featuredWorkflows} />
        </section>
      ) : null}

      {latestInsights.length > 0 ? (
        // Latest insights — mirrors the next-gen marketing-page
        // section recipe: gold mono eyebrow, section heading,
        // content, trailing "View all →" link. Bottom padding
        // reduced — was `pb-16`, now `pb-0` so the section closes
        // flush against the MantleFooter gradient transition strip
        // + CTA band. The dead 64px of trailing padding above the
        // footer is what made the close feel cavernous; the tighter
        // footer gradient (h-12 md:h-16) carries the visual
        // transition now.
        <section
          aria-label="Latest insights"
          className="border-t border-edge-medium pt-20 pb-0 max-[720px]:pt-14"
        >
          <div className="mb-4">
            <CompassPromptHeading text="Insights" color="accent" />
          </div>
          {/* Same vertical stack as the Workflows section above
              (kicker → H2 → subhead → CTA). */}
          <div className="mb-10 flex flex-col gap-3 max-w-[40ch]">
            <h2 className="m-0 font-heading text-3xl font-medium tracking-tight leading-tight text-fg-high md:text-4xl">
              Notes on building app businesses
            </h2>
            <p className="m-0 font-sans text-base leading-loose text-fg-medium">
              Essays and commentary on product, growth, AI, and the
              operating layer behind modern app companies.
            </p>
            <div className="mt-3">
              <CompassButton
                href="/blog"
                icon={{ icon: "ArrowRight", position: "right" }}
              >
                View all insights
              </CompassButton>
            </div>
          </div>
          <InsightCardGrid insights={latestInsights} />
        </section>
      ) : null}
    </CompassListingPage>
  );
}
