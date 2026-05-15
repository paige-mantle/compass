import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { compassMdxOptions } from "@/compass/lib/mdx-options";
import { CompassDetailShell } from "@/compass/components/shared/CompassDetailShell";
import { TableOfContents } from "@/compass/components/insights/TableOfContents";
import { insightMdxComponents } from "@/compass/components/insights/mdx-components";
import { CompassNewsletter } from "@/compass/components/shared/CompassNewsletter";
import { listInsights, loadInsight } from "@/compass/lib/insights/content";
import { SITE_ORIGIN } from "@/compass/lib/seo";
import { formatShortDate } from "@/compass/lib/format-date";

type Params = { slug: string };

export async function generateStaticParams() {
  const items = await listInsights();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const loaded = await loadInsight(slug);
  if (!loaded) return {};
  /* SEO-sheet overrides win over auto-generated title/summary.
     Canonical is absolute. */
  const url = `${SITE_ORIGIN}/blog/${slug}`;
  const m = loaded.meta;
  /* `absolute` bypass when `metaTitle` is set — same rationale as
     workflows: CSV title includes brand suffix. */
  const title = m.metaTitle ? { absolute: m.metaTitle } : m.title;
  const description = m.metaDescription ?? m.summary;
  const ogTitle = m.ogTitle ?? m.metaTitle ?? m.title;
  const ogDescription = m.ogDescription ?? description;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: ogTitle,
      description: ogDescription,
      url,
      publishedTime: m.date,
      authors: [m.author],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const loaded = await loadInsight(slug);
  if (!loaded) notFound();

  /* All JSON-LD URLs resolve through `SITE_ORIGIN` (heymantle.com).
     Was hardcoded to the preview deploy — leaked into every social
     share + Google indexing. */
  const url = `${SITE_ORIGIN}/blog/${slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: loaded.meta.title,
    description: loaded.meta.summary,
    datePublished: loaded.meta.date,
    author: {
      "@type": "Person",
      name: loaded.meta.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Mantle",
      url: SITE_ORIGIN,
    },
    mainEntityOfPage: url,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Mantle Compass", item: `${SITE_ORIGIN}/compass` },
      { "@type": "ListItem", position: 2, name: "Insights", item: `${SITE_ORIGIN}/blog` },
      { "@type": "ListItem", position: 3, name: loaded.meta.title, item: url },
    ],
  };

  const authors = loaded.meta.author
    ? [{
        name: loaded.meta.author,
        role: loaded.meta.authorRole,
        avatar: loaded.meta.authorAvatar,
      }]
    : undefined;
  /* Short-form date — "MAR 3 24" / "DEC 15 24". `formatShortDate`
     resolves the ISO `date` string to the same compact format the
     insight + workflow + template card grids use, so listing meta
     and article-header meta read identically. */
  const formattedDate = formatShortDate(loaded.meta.date);
  const metaLine = `Published ${formattedDate}${loaded.meta.readTime ? ` · ${loaded.meta.readTime}` : ""}`;

  return (
    <CompassDetailShell
      breadcrumb={[
        { label: "Compass", href: "/compass" },
        { label: "Insights", href: "/blog" },
      ]}
      title={loaded.meta.title}
      summary={loaded.meta.summary}
      authors={authors}
      /* Insight articles intentionally do NOT render the "Mantle
         Official" chip — the author's name + role under the title
         already attributes the piece. The verified badge belongs
         on workflows + templates where it signals "this recipe is
         a Mantle-endorsed pattern, not community-submitted." */
      metaLine={metaLine}
      rail="toc"
      rightRailLabel="Table of contents"
      rightRail={<TableOfContents headings={loaded.headings} />}
      bodyClassName="max-w-[60ch]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <MDXRemote
        source={loaded.source}
        components={insightMdxComponents}
        options={compassMdxOptions}
      />
      {/* Newsletter signup pinned to the end of every insight
          article — readers who finish a piece are the warmest
          subscribe-prospects on Compass. `mt-16` gives breathing
          room below the article close so the form reads as a
          distinct CTA, not a continuation of body copy. */}
      <div className="not-prose mt-16 -mx-4 sm:-mx-6 md:-mx-8">
        <CompassNewsletter />
      </div>
    </CompassDetailShell>
  );
}
