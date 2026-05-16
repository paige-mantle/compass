import { CompassListingPage } from "@/compass/components/shared/CompassListingPage";
import { ManualCoverGrid } from "@/compass/components/manuals/ManualCoverGrid";
import { MANUAL_COVERS } from "@/compass/lib/manuals/content";
import { SITE_ORIGIN } from "@/compass/lib/seo";

/* SEO copy from the May spreadsheet. `title` / `description` /
   `canonical` / OG mirror the corresponding columns. */
const TITLE = "App Builder Manuals for AI Products | Mantle Compass";
const DESCRIPTION =
  "Step-by-step manuals for shaping, building, launching, and growing an app business with more clarity.";
const OG_TITLE = "Manuals for building better app businesses";
const OG_DESCRIPTION =
  "Step-by-step manuals for shaping, building, launching, growing, and operating an app business.";
const CANONICAL = `${SITE_ORIGIN}/manuals`;

export const metadata = {
  /* `absolute` bypasses the `%s | Mantle Compass` template in the
     root layout — the spreadsheet title already includes the brand
     suffix, so the template would render it twice otherwise. */
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
 * /manuals — listing index for the seven Compass manuals.
 * Uses `<CompassListingPage>` so chrome (hero, section nav,
 * newsletter footer) is shared with every other Compass index.
 * Only the grid is unique.
 */
export default function ManualsIndexPage() {
  /* `CollectionPage` + `BreadcrumbList` JSON-LD per the spreadsheet's
     `Schema type` column. Tells search engines this is a curated
     collection of related Article pages so they can expose richer
     SERP treatments. */
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "App Builder Manuals for AI Products",
    description:
      "Step-by-step manuals for shaping, building, launching, and growing an app business with more clarity.",
    url: CANONICAL,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: MANUAL_COVERS.map((cover, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: cover.manifestTitle,
        url: `${SITE_ORIGIN}/manuals/${cover.slug}`,
      })),
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Mantle Compass", item: `${SITE_ORIGIN}/compass` },
      { "@type": "ListItem", position: 2, name: "Manuals", item: CANONICAL },
    ],
  };

  return (
    <CompassListingPage
      heading="Operating manuals"
      description="Step-by-step manuals for shaping, building, launching, monetizing, growing, and operating an app business."
      currentPath="/manuals"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ManualCoverGrid covers={MANUAL_COVERS} />
    </CompassListingPage>
  );
}
