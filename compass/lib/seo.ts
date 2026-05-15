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
const MANUALS_INDEX_URL = `${SITE_ORIGIN}/manuals`;

type SectionFrontmatter = {
  summary?: string;
  description?: string;
  /* SEO overrides — populated from the May SEO spreadsheet. When
     set, override the auto-generated `<title>` / meta description /
     OG fields for this manual chapter. Same shape as the workflow /
     template / insight content models. */
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
};

/** Public URL for a section page. Pass an empty section for the intro. */
export function manualSectionUrl(manualSlug: string, sectionSlug: string) {
  return sectionSlug
    ? `${SITE_ORIGIN}/manuals/${manualSlug}/${sectionSlug}`
    : `${SITE_ORIGIN}/manuals/${manualSlug}`;
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
    ? `/manuals/${loaded.manifest.slug}`
    : `/manuals/${loaded.manifest.slug}/${loaded.section.slug}`;
  /* Absolute URL for the canonical + OG `url`. Next.js resolves
     path-relative canonicals against `metadataBase`, so the
     practical effect is identical — but absolute is safer when the
     page is rendered under a preview host (the relative form would
     resolve against the preview origin). Mirrors the workflows /
     templates / insights detail pages. */
  const absoluteUrl = `${SITE_ORIGIN}${path}`;

  /* SEO-sheet override wins over the auto-generated title /
     description. Falls back to the auto-generated form when the
     frontmatter doesn't set the override.
     When `metaTitle` is set, the CSV value already includes the
     "| Mantle Compass" brand suffix — pass it through as `absolute`
     so the root-layout title template doesn't append the brand a
     second time. The auto-generated form (no override) is the bare
     chapter title, so the template appends the brand normally. */
  const autoTitle = isIntro
    ? loaded.manifest.title
    : `${loaded.manifest.title} — ${loaded.section.title}`;
  const title = fm.metaTitle ? { absolute: fm.metaTitle } : autoTitle;
  const description =
    fm.metaDescription ??
    fm.description ??
    fm.summary ??
    (isIntro
      ? `${loaded.manifest.title} — a Mantle Compass manual.`
      : `${loaded.section.title} — part of the ${loaded.manifest.title} manual from Mantle Compass.`);
  const ogTitle = fm.ogTitle ?? fm.metaTitle ?? autoTitle;
  const ogDescription = fm.ogDescription ?? description;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl },
    openGraph: { type: "article", title: ogTitle, description: ogDescription, url: absoluteUrl },
    twitter: { card: "summary_large_image", title: ogTitle, description: ogDescription },
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
      url: `${SITE_ORIGIN}/manuals/${loaded.manifest.slug}`,
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
      item: `${SITE_ORIGIN}/manuals/${loaded.manifest.slug}`,
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
