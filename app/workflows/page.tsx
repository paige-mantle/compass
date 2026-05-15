import { CompassListingPage } from "@/compass/components/shared/CompassListingPage";
import { WorkflowCardGrid } from "@/compass/components/workflows/WorkflowCardGrid";
import { listWorkflows } from "@/compass/lib/workflows/content";
import { SITE_ORIGIN } from "@/compass/lib/seo";

/* SEO copy from the May spreadsheet. */
const TITLE = "AI Workflows for App Builders | Mantle Compass";
const DESCRIPTION =
  "Guided AI workflows for validating ideas, improving onboarding, planning campaigns, and running better app systems.";
const OG_TITLE = "AI workflows for app builders";
const OG_DESCRIPTION =
  "Guided workflows for validating ideas, improving onboarding, planning campaigns, and running better app systems.";
const CANONICAL = `${SITE_ORIGIN}/workflows`;

export const metadata = {
  /* `absolute` bypasses the `%s | Mantle Compass` template in the
     root layout — the spreadsheet title already includes the brand. */
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
 * /workflows — listing index for the workflows section.
 * Uses `<CompassListingPage>` so chrome (hero, section nav,
 * newsletter footer) is shared with every other Compass index.
 * Only the grid is unique.
 */
export default async function WorkflowsIndexPage() {
  const methods = await listWorkflows();

  /* `CollectionPage` + `BreadcrumbList` JSON-LD per the May SEO
     sheet. Mirrors the rich-results recipe Google + Bing use to
     surface curated collections of Article children. */
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Workflows for App Builders",
    description:
      "Guided AI workflows for validating ideas, improving onboarding, planning campaigns, and running better app systems.",
    url: CANONICAL,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: methods.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: m.title,
        url: `${SITE_ORIGIN}/workflows/${m.slug}`,
      })),
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Mantle Compass", item: `${SITE_ORIGIN}/compass` },
      { "@type": "ListItem", position: 2, name: "Workflows", item: CANONICAL },
    ],
  };

  return (
    <CompassListingPage
      heading="Workflows"
      description="AI-assisted workflows for validating ideas, improving onboarding, planning campaigns, and running better app systems."
      currentPath="/workflows"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <WorkflowCardGrid methods={methods} />
    </CompassListingPage>
  );
}
