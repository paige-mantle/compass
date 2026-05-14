import { CompassLayout } from "@/compass/components/shared/CompassLayout";
import { CompassIndexHero } from "@/compass/components/shared/CompassIndexHero";
import { CompassSectionNav } from "@/compass/components/shared/CompassSectionNav";
import { CompassNewsletter } from "@/compass/components/shared/CompassNewsletter";
import { InsightCardGrid } from "@/compass/components/insights/InsightCardGrid";
import { listInsights } from "@/compass/lib/insights/content";

export const metadata = {
  title: "Insights for app builders",
  description:
    "Founder-minded essays and practical commentary on building, launching, growing, and operating app businesses in the AI era.",
  alternates: { canonical: "/blog" },
};

export default async function InsightsIndexPage() {
  const insights = await listInsights();

  return (
    <CompassLayout showFooterCta={false}>
      <div className="mx-auto w-full max-w-[1320px] px-6 max-[720px]:px-5">
        <CompassIndexHero
          heading="Insights"
          description="Insights, thinking, and announcements from the Mantle team — on building, shipping, and operating products with AI."
        />
        <CompassSectionNav currentPath="/blog" />
        <div className="mt-14 max-[720px]:mt-10">
          <InsightCardGrid insights={insights} />
        </div>
      </div>
      <CompassNewsletter />
    </CompassLayout>
  );
}
