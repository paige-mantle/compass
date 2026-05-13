import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { InsightShell } from "@/compass/components/insights/InsightShell";
import { insightMdxComponents } from "@/compass/components/insights/mdx-components";
import { listInsights, loadInsight } from "@/compass/lib/insights/content";

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
  const path = `/compass/insights/${slug}`;
  return {
    title: loaded.meta.title,
    description: loaded.meta.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: loaded.meta.title,
      description: loaded.meta.summary,
      url: path,
      publishedTime: loaded.meta.date,
      authors: [loaded.meta.author],
    },
    twitter: {
      card: "summary_large_image",
      title: loaded.meta.title,
      description: loaded.meta.summary,
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

  const url = `https://mantle-chi.vercel.app/compass/insights/${slug}`;
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
      url: "https://mantle-chi.vercel.app",
    },
    mainEntityOfPage: url,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Mantle Compass", item: "https://mantle-chi.vercel.app/compass" },
      { "@type": "ListItem", position: 2, name: "Insights", item: "https://mantle-chi.vercel.app/compass/insights" },
      { "@type": "ListItem", position: 3, name: loaded.meta.title, item: url },
    ],
  };

  return (
    <InsightShell meta={loaded.meta} headings={loaded.headings} shareUrl={url}>
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
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </InsightShell>
  );
}
