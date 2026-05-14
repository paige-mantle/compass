import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/compass/lib/seo";

/**
 * Robots — Compass repo serves /compass/* and /templates/* at
 * heymantle.com via Mantle's rewrites. Crawlers should follow links
 * across both surfaces from a single Mantle-domain robots.txt.
 *
 * This deploy emits a robots.txt that allows all paths and points
 * the `Sitemap:` directive at the Compass sitemap on
 * heymantle.com/sitemap.xml (which the Mantle repo serves via its
 * own root sitemap, OR — if Mantle prefers — leave this Compass
 * sitemap exposed separately at heymantle.com/compass/sitemap.xml).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
