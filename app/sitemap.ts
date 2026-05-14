import type { MetadataRoute } from "next";
import { listWorkflows } from "@/compass/lib/workflows/content";
import { listInsights } from "@/compass/lib/insights/content";
import { getManualManifest, listManuals } from "@/compass/lib/manuals/content";
import { listTemplates } from "@/compass/lib/templates/content";
import { SITE_ORIGIN } from "@/compass/lib/seo";

/**
 * Sitemap — every indexable Compass URL.
 *
 * Only Compass-owned routes live here (manuals, methods, templates,
 * insights). The Mantle marketing-site URLs (`/`, `/systems`,
 * `/results`, `/features`, etc.) live in the Mantle repo's own
 * sitemap. Both sitemaps emit absolute URLs against the same
 * `SITE_ORIGIN` (`https://heymantle.com`) so search engines see one
 * canonical origin even though two separate deploys produce them.
 *
 * Manual + insight + method + template detail pages are enumerated
 * dynamically from disk so new content shows up without a sitemap
 * edit.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_ORIGIN}/compass`,           lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_ORIGIN}/manuals`,   lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_ORIGIN}/workflows`,   lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_ORIGIN}/templates`,         lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_ORIGIN}/blog`,  lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
  ];

  const manualSlugs = await listManuals();
  const manualEntries: MetadataRoute.Sitemap = [];
  for (const slug of manualSlugs) {
    const manifest = await getManualManifest(slug);
    if (!manifest) continue;
    manualEntries.push({
      url: `${SITE_ORIGIN}/manuals/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
    for (const section of manifest.sections) {
      if (!section.slug) continue;
      manualEntries.push({
        url: `${SITE_ORIGIN}/manuals/${slug}/${section.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Method (formerly framework) detail pages — pulled dynamically
  // from disk so new methods land in the sitemap without an edit.
  const methods = await listWorkflows();
  const methodEntries: MetadataRoute.Sitemap = methods.map((m) => ({
    url: `${SITE_ORIGIN}/workflows/${m.slug}`,
    lastModified: m.lastUpdated ? new Date(m.lastUpdated) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const insights = await listInsights();
  const insightEntries: MetadataRoute.Sitemap = insights.map((i) => ({
    url: `${SITE_ORIGIN}/blog/${i.slug}`,
    lastModified: new Date(i.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const templates = await listTemplates();
  const templateEntries: MetadataRoute.Sitemap = templates.map((t) => ({
    url: `${SITE_ORIGIN}/templates/${t.slug}`,
    lastModified: t.lastUpdated ? new Date(t.lastUpdated) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...manualEntries,
    ...methodEntries,
    ...insightEntries,
    ...templateEntries,
  ];
}
