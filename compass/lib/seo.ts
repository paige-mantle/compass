import type { Metadata } from "next";
import type { LoadedSection } from "./manuals/content";

/**
 * Public origin used in canonical URLs and JSON-LD. Single source of
 * truth — change here when Compass moves to a new subdomain or
 * Astro deployment. The Vercel preview URL was being shipped as the
 * canonical for every page, which split Google's signal between the
 * preview and any real production URL. heymantle.com is the parent
 * site; Compass currently nests under /compass.
 */
export const SITE_ORIGIN = "https://heymantle.com";

const COMPASS_INDEX_URL = `${SITE_ORIGIN}/compass`;
const MANUALS_INDEX_URL = `${SITE_ORIGIN}/compass/manuals`;

type SectionFrontmatter = {
  summary?: string;
  description?: string;
};

/** Public URL for a section page. Pass an empty section for the intro. */
export function manualSectionUrl(manualSlug: string, sectionSlug: string) {
  return sectionSlug
    ? `${SITE_ORIGIN}/compass/${manualSlug}/${sectionSlug}`
    : `${SITE_ORIGIN}/compass/${manualSlug}`;
}

/**
 * Build Next.js Metadata for any manual section (intro or non-intro).
 * Both routes share the same shape — the only differences are URL and
 * default title fallback.
 */
export function buildSectionMetadata(loaded: LoadedSection): Metadata {
  const fm = loaded.frontmatter as SectionFrontmatter;
  const isIntro = !loaded.section.slug;
  const path = isIntro
    ? `/compass/${loaded.manifest.slug}`
    : `/compass/${loaded.manifest.slug}/${loaded.section.slug}`;

  const title = isIntro
    ? loaded.manifest.title
    : `${loaded.manifest.title} — ${loaded.section.title}`;
  const description =
    fm.description ??
    fm.summary ??
    (isIntro
      ? `${loaded.manifest.title} — a Mantle Compass manual.`
      : `${loaded.section.title} — part of the ${loaded.manifest.title} manual from Mantle Compass.`);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "article", title, description, url: path },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * Build Article + BreadcrumbList JSON-LD for a manual section. Returns
 * an array; render each as a <script type="application/ld+json"> block.
 */
export function buildSectionJsonLd(loaded: LoadedSection) {
  const fm = loaded.frontmatter as SectionFrontmatter;
  const description = fm.description ?? fm.summary ?? "";
  const isIntro = !loaded.section.slug;
  const url = manualSectionUrl(loaded.manifest.slug, loaded.section.slug);
  const headline = isIntro
    ? loaded.manifest.title
    : `${loaded.manifest.title} — ${loaded.section.title}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    isPartOf: {
      "@type": "Book",
      name: loaded.manifest.title,
      url: `${SITE_ORIGIN}/compass/${loaded.manifest.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Mantle",
      url: SITE_ORIGIN,
    },
    mainEntityOfPage: url,
  };

  const itemList: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
    { "@type": "ListItem", position: 1, name: "Mantle Compass", item: COMPASS_INDEX_URL },
    { "@type": "ListItem", position: 2, name: "Manuals", item: MANUALS_INDEX_URL },
    {
      "@type": "ListItem",
      position: 3,
      name: loaded.manifest.title,
      item: `${SITE_ORIGIN}/compass/${loaded.manifest.slug}`,
    },
  ];
  if (!isIntro) {
    itemList.push({
      "@type": "ListItem",
      position: 4,
      name: loaded.section.title,
      item: url,
    });
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itemList,
  };

  return [article, breadcrumb] as const;
}
