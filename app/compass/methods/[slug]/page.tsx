import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { FrameworkShell } from "@/compass/components/methods/FrameworkShell";
import { PairsWith, PairItem } from "@/compass/components/methods/PairsWith";
import { Chips, Chip } from "@/compass/components/methods/Chips";
import {
  RelatedCards,
  RelatedCard,
} from "@/compass/components/methods/RelatedCards";
import { listFrameworks, loadFramework } from "@/compass/lib/methods/content";

// Components available inside framework MDX files. Keep tight — frameworks
// render as editorial recipe pages, not full UI surfaces.
const frameworkMdxComponents = {
  PairsWith,
  PairItem,
  Chips,
  Chip,
  RelatedCards,
  RelatedCard,
};

type Params = { slug: string };

export async function generateStaticParams() {
  const items = await listFrameworks();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const loaded = await loadFramework(slug);
  if (!loaded) return {};
  const path = `/compass/methods/${slug}`;
  return {
    title: loaded.meta.title,
    description: loaded.meta.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: loaded.meta.title,
      description: loaded.meta.summary,
      url: path,
      authors: [loaded.meta.author],
    },
    twitter: {
      card: "summary_large_image",
      title: loaded.meta.title,
      description: loaded.meta.summary,
    },
  };
}

export default async function FrameworkPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const loaded = await loadFramework(slug);
  if (!loaded) notFound();

  const url = `https://mantle-chi.vercel.app/compass/methods/${slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: loaded.meta.title,
    description: loaded.meta.summary,
    author: { "@type": "Person", name: loaded.meta.author },
    publisher: { "@type": "Organization", name: "Mantle", url: "https://mantle-chi.vercel.app" },
    mainEntityOfPage: url,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Mantle Compass", item: "https://mantle-chi.vercel.app/compass" },
      { "@type": "ListItem", position: 2, name: "Frameworks", item: "https://mantle-chi.vercel.app/compass/methods" },
      { "@type": "ListItem", position: 3, name: loaded.meta.title, item: url },
    ],
  };

  return (
    <FrameworkShell meta={loaded.meta} shareUrl={url} showFooterCta={false}>
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
        components={frameworkMdxComponents}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </FrameworkShell>
  );
}
