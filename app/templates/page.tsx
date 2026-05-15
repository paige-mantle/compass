import { CompassListingPage } from "@/compass/components/shared/CompassListingPage";
import { TemplateListing } from "@/compass/components/templates/TemplateListing";
import { listTemplates } from "@/compass/lib/templates/content";
import { SITE_ORIGIN } from "@/compass/lib/seo";

/* SEO copy from the May spreadsheet. */
const TITLE = "App Builder Templates & UI Resources | Mantle Compass";
const DESCRIPTION =
  "Practical templates, prompts, checklists, and components for building clearer app screens, flows, and systems.";
const OG_TITLE = "Templates and UI resources for app builders";
const OG_DESCRIPTION =
  "Templates, prompts, checklists, and components for building clearer app screens, flows, and systems.";
const CANONICAL = `${SITE_ORIGIN}/templates`;

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
 * /templates — listing index for the templates section.
 * Uses `<CompassListingPage>` so chrome (hero, section nav,
 * newsletter footer) is shared with every other Compass index.
 * Only the grid is unique.
 *
 * Content is loaded via `listTemplates()` which scans the
 * `compass/content/templates/` MDX files. Order is alphabetical by
 * default; sort by `lastUpdated` desc once we have more than two.
 */
export default async function TemplatesIndexPage() {
  const templates = await listTemplates();

  /* `CollectionPage` + `BreadcrumbList` JSON-LD per the May SEO
     sheet. Each template surfaces as an `ItemList` child. */
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "App Builder Templates & UI Resources",
    description:
      "Practical templates, prompts, checklists, and components for building clearer app screens, flows, and systems.",
    url: CANONICAL,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: templates.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.title,
        url: `${SITE_ORIGIN}/templates/${t.slug}`,
      })),
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Mantle Compass", item: `${SITE_ORIGIN}/compass` },
      { "@type": "ListItem", position: 2, name: "Templates", item: CANONICAL },
    ],
  };

  return (
    <CompassListingPage
      heading="Templates"
      description="Templates and UI components for better app, marketing, and product workflows."
      currentPath="/templates"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Client-side filter wrapper — adds search input + tag pill
          group above the grid. */}
      <TemplateListing templates={templates} />
    </CompassListingPage>
  );
}
