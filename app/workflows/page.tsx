import { CompassLayout } from "@/compass/components/shared/CompassLayout";
import { CompassIndexHero } from "@/compass/components/shared/CompassIndexHero";
import { CompassSectionNav } from "@/compass/components/shared/CompassSectionNav";
import { CompassNewsletter } from "@/compass/components/shared/CompassNewsletter";
import { WorkflowCardGrid } from "@/compass/components/workflows/WorkflowCardGrid";
import { listWorkflows } from "@/compass/lib/workflows/content";

export const metadata = {
  title: "Workflows for app builders",
  description:
    "Guided workflows for validating ideas, shaping products, making better decisions, and growing your app business.",
  alternates: { canonical: "/workflows" },
};

/**
 * /workflows — listing index for the methods section.
 * Migrated from `public/mantle-compass-frameworks.html` (filename
 * still says "frameworks" — that was the old section name before
 * Methods). Same chrome / hero / section nav as the other Compass
 * listing pages; only the grid is unique.
 */
export default async function MethodsIndexPage() {
  const methods = await listWorkflows();

  return (
    <CompassLayout showFooterCta={false}>
      <div className="mx-auto w-full max-w-[1320px] px-6 max-[720px]:px-5">
        <CompassIndexHero
          heading="Workflows"
          description="Skills and prompts to help you build, grow, and run your product business with AI."
        />
        <CompassSectionNav currentPath="/workflows" />
        <div className="mt-14 max-[720px]:mt-10">
          <WorkflowCardGrid methods={methods} />
        </div>
      </div>
      <CompassNewsletter />
    </CompassLayout>
  );
}
