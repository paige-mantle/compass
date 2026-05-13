import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { FrameworkShell } from "@/compass/components/frameworks/FrameworkShell";
import { PairsWith, PairItem } from "@/compass/components/frameworks/PairsWith";
import { listTemplates, loadTemplate } from "@/compass/lib/templates/content";
import type { FrameworkMeta } from "@/compass/lib/frameworks/content";

// Template detail pages reuse `FrameworkShell` exactly so the
// layout, typography, sticky right rail, share controls, meta
// strip, and prev/next nav stay byte-for-byte consistent between
// `/compass/frameworks/[slug]` and `/templates/[slug]`. We adapt
// the template frontmatter into the `FrameworkMeta` shape the
// shell expects.

const templateMdxComponents = {
  PairsWith,
  PairItem,
};

type Params = { slug: string };

export async function generateStaticParams() {
  const items = await listTemplates();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const loaded = await loadTemplate(slug);
  if (!loaded) return {};
  const path = `/templates/${slug}`;
  return {
    title: loaded.meta.title,
    description: loaded.meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: loaded.meta.title,
      description: loaded.meta.description,
      url: path,
      authors: loaded.meta.author ? [loaded.meta.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: loaded.meta.title,
      description: loaded.meta.description,
    },
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const loaded = await loadTemplate(slug);
  if (!loaded) notFound();

  const url = `https://mantle-chi.vercel.app/templates/${slug}`;

  // Adapt TemplateMeta → FrameworkMeta. Only the field names that
  // differ between the two systems need mapping (`description` →
  // `summary`); the rest pass through verbatim. The shell uses:
  // title, summary, tags, author, authorRole, authorAvatar,
  // codeBlocks, lastUpdated.
  const shellMeta: FrameworkMeta = {
    title: loaded.meta.title,
    slug: loaded.meta.slug,
    summary: loaded.meta.description,
    ribbon: loaded.meta.ribbon ?? "Templates",
    author: loaded.meta.author ?? "Mantle Team",
    authorRole: loaded.meta.authorRole,
    authorAvatar: loaded.meta.authorAvatar,
    blockColor: loaded.meta.blockColor,
    tags: loaded.meta.tags,
    codeBlocks: loaded.meta.codeBlocks,
    published: loaded.meta.published,
    lastUpdated: loaded.meta.lastUpdated,
    file: loaded.meta.file,
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: loaded.meta.title,
    description: loaded.meta.description,
    author: { "@type": "Person", name: loaded.meta.author ?? "Mantle Team" },
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Templates",
        item: "https://mantle-chi.vercel.app/templates",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: loaded.meta.title,
        item: url,
      },
    ],
  };

  return (
    <FrameworkShell
      meta={shellMeta}
      shareUrl={url}
      backHref="/templates"
      backLabel="Templates"
      showFooterCta={false}
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
        components={templateMdxComponents}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </FrameworkShell>
  );
}
