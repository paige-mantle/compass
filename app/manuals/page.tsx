import { CompassLayout } from "@/compass/components/shared/CompassLayout";
import { CompassIndexHero } from "@/compass/components/shared/CompassIndexHero";
import { CompassSectionNav } from "@/compass/components/shared/CompassSectionNav";
import { CompassNewsletter } from "@/compass/components/shared/CompassNewsletter";
import { ManualCoverGrid } from "@/compass/components/manuals/ManualCoverGrid";
import { MANUAL_COVERS } from "@/compass/lib/manuals/content";

export const metadata = {
  title: "Manuals for building better apps",
  description:
    "Step-by-step manuals for shaping, building, launching, monetizing, growing, and operating an app business.",
  alternates: { canonical: "/manuals" },
};

/**
 * /manuals — listing index for the seven Compass manuals.
 * Built from the next-gen pattern (shared components below) so every
 * Compass listing page renders the same hero recipe, same section
 * nav, same footer CTA. Replaces `public/mantle-compass-manuals.html`.
 */
export default function ManualsIndexPage() {
  return (
    // `showFooterCta={false}` swaps the default "Grow your business with
    // Mantle" CTA band for the canonical newsletter footer used across
    // every static Compass index page. Detail pages (frameworks,
    // insights, manual chapters) keep the CTA band — it makes sense
    // after a piece of content; index pages don't have that context.
    <CompassLayout showFooterCta={false}>
      <div className="mx-auto w-full max-w-[1320px] px-6 max-[720px]:px-5">
        <CompassIndexHero
          heading="Manuals"
          description="Everything you need to go from idea to a real, working product."
        />
        <CompassSectionNav currentPath="/manuals" />
        <div className="mt-14 max-[720px]:mt-10">
          <ManualCoverGrid covers={MANUAL_COVERS} />
        </div>
      </div>
      <CompassNewsletter />
    </CompassLayout>
  );
}
