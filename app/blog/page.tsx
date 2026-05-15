import { CompassListingPage } from "@/compass/components/shared/CompassListingPage";
import { InsightCardGrid } from "@/compass/components/insights/InsightCardGrid";
import { CompassNewsletter } from "@/compass/components/shared/CompassNewsletter";
import { listInsights } from "@/compass/lib/insights/content";
import { SITE_ORIGIN } from "@/compass/lib/seo";

/* SEO copy from the May spreadsheet. */
const TITLE = "App Builder Insights & Product Strategy | Mantle Compass";
const DESCRIPTION =
  "Founder-minded essays and practical commentary on building, shipping, and operating app businesses in the AI era.";
const OG_TITLE = "Insights for app builders";
const OG_DESCRIPTION =
  "Founder-minded essays and practical commentary on building, shipping, and operating app businesses in the AI era.";
const CANONICAL = `${SITE_ORIGIN}/blog`;

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
 * /blog — listing index for the Insights section.
 * Uses `<CompassListingPage>` so chrome (hero, section nav,
 * newsletter footer) is shared with every other Compass index.
 * Only the grid is unique.
 */
export default async function InsightsIndexPage() {
  const insights = await listInsights();

  /* `Blog` + `CollectionPage` + `BreadcrumbList` JSON-LD per the
     May SEO sheet. `Blog` tells Google this is a publication; the
     `CollectionPage`'s `ItemList` exposes each insight as a child. */
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Mantle Compass Insights",
    description:
      "Founder-minded essays and practical commentary on building, shipping, and operating app businesses in the AI era.",
    url: CANONICAL,
    blogPost: insights.map((i) => ({
      "@type": "BlogPosting",
      headline: i.title,
      datePublished: i.date,
      url: `${SITE_ORIGIN}/blog/${i.slug}`,
    })),
  };
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "App Builder Insights & Product Strategy",
    url: CANONICAL,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: insights.map((i, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: i.title,
        url: `${SITE_ORIGIN}/blog/${i.slug}`,
      })),
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Mantle Compass", item: `${SITE_ORIGIN}/compass` },
      { "@type": "ListItem", position: 2, name: "Insights", item: CANONICAL },
    ],
  };

  return (
    <CompassListingPage
      heading="Insights"
      description="Insights, thinking, and announcements from the Mantle team, on building, shipping, and operating products with AI."
      currentPath="/blog"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <InsightCardGrid insights={insights} />
      {/* Newsletter signup renders only on `/blog` (highest reader
          intent: they're already browsing the publication). The
          other 4 listing pages omit it to avoid hydration churn +
          CTA fatigue. */}
      <CompassNewsletter />
    </CompassListingPage>
  );
}
