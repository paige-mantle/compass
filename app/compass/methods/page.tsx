import { CompassLayout } from "@/compass/components/shared/CompassLayout";
import { CompassIndexHero } from "@/compass/components/shared/CompassIndexHero";
import { CompassSectionNav } from "@/compass/components/shared/CompassSectionNav";
import { CompassNewsletter } from "@/compass/components/shared/CompassNewsletter";
import { MethodCardGrid } from "@/compass/components/methods/MethodCardGrid";
import { listFrameworks } from "@/compass/lib/methods/content";

export const metadata = {
  title: "Methods — Mantle Compass",
  description:
    "Skills and prompts to help you build, grow, and run your product business with AI.",
  alternates: { canonical: "/compass/methods" },
};

/**
 * /compass/methods — listing index for the methods section.
 * Migrated from `public/mantle-compass-frameworks.html` (filename
 * still says "frameworks" — that was the old section name before
 * Methods). Same chrome / hero / section nav as the other Compass
 * listing pages; only the grid is unique.
 */
export default async function MethodsIndexPage() {
  const methods = await listFrameworks();

  return (
    <CompassLayout showFooterCta={false}>
      <div className="mx-auto w-full max-w-[1320px] px-6 max-[720px]:px-5">
        <CompassIndexHero
          heading="Methods"
          description="Skills and prompts to help you build, grow, and run your product business with AI."
        />
        <CompassSectionNav currentPath="/compass/methods" />
        <div className="mt-14 max-[720px]:mt-10">
          <MethodCardGrid methods={methods} />
        </div>
      </div>
      <CompassNewsletter />
    </CompassLayout>
  );
}
