import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { compassMdxOptions } from "@/compass/lib/mdx-options";
import { CompassDetailShell } from "@/compass/components/shared/CompassDetailShell";
import { Cmd } from "@/compass/components/shared/Cmd";
import { CodeFence } from "@/compass/components/shared/CodeFence";
import { CodeBlocks } from "@/compass/components/workflows/CodeBlocks";
import { PreviewTabs } from "@/compass/components/workflows/PreviewTabs";
import { PairsWith, PairItem } from "@/compass/components/workflows/PairsWith";
import { BestFor } from "@/compass/components/workflows/BestFor";
import {
  RelatedCards,
  RelatedCard,
} from "@/compass/components/workflows/RelatedCards";
import { Callout } from "@/compass/components/manuals/Callout";
import { Checklist, CheckItem } from "@/compass/components/manuals/Checklist";
import {
  FieldNote,
  RealityCheck,
  CommonFailure,
  DecisionPoint,
  FounderShift,
} from "@/compass/components/callouts/Callouts";
import { listTemplates, loadTemplate } from "@/compass/lib/templates/content";
import { SITE_ORIGIN } from "@/compass/lib/seo";
import { formatShortDate } from "@/compass/lib/format-date";

// Template detail pages reuse `CompassDetailShell` so the layout,
// hero, sticky right rail, and prev/next nav stay byte-for-byte
// consistent between `/workflows/[slug]` and `/templates/[slug]`.
// Same MDX component map as workflows — including the full callout
// family — so authors can use the same patterns across both
// surfaces.

const templateMdxComponents = {
  Cmd,
  pre: CodeFence,
  PairsWith,
  PairItem,
  BestFor,
  RelatedCards,
  RelatedCard,
  Note: Callout,
  Callout,
  FieldNote,
  RealityCheck,
  CommonFailure,
  DecisionPoint,
  FounderShift,
  Checklist,
  CheckItem,
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
  /* SEO-sheet overrides win over auto-generated title/summary.
     Canonical is absolute via `SITE_ORIGIN` so preview deploys
     never leak preview-host canonicals into search indexes. */
  const url = `${SITE_ORIGIN}/templates/${slug}`;
  const m = loaded.meta;
  /* `absolute` bypass when `metaTitle` is set — the spreadsheet
     title already includes "| Mantle Compass". See workflows page
     for full rationale. */
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
      authors: m.author ? [m.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
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

  /* Resolve through `SITE_ORIGIN` so JSON-LD URLs match the canonical
     domain even when Compass renders under a preview deploy. The old
     hardcoded `https://heymantle.com/templates/...` leaked preview
     URLs into Google's index whenever this page was rebuilt under a
     non-production host. Mirrors the workflows + insights pattern. */
  const url = `${SITE_ORIGIN}/templates/${slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: loaded.meta.title,
    description: loaded.meta.summary,
    author: { "@type": "Person", name: loaded.meta.author ?? "Mantle Team" },
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Templates",
        item: `${SITE_ORIGIN}/templates`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: loaded.meta.title,
        item: url,
      },
    ],
  };

  const blocks = loaded.meta.codeBlocks ?? [];
  const authors = loaded.meta.author
    ? [{
        name: loaded.meta.author,
        role: loaded.meta.authorRole,
        avatar: loaded.meta.authorAvatar,
      }]
    : [{ name: "Mantle Team" }];
  /* Templates use the same "Works with" tag pills as Workflows.
     `tools` lives on TemplateMeta as `string[] | undefined`. */
  const worksWith = loaded.meta.tools as string[] | undefined;

  return (
    <CompassDetailShell
      breadcrumb={[{ label: "Templates", href: "/templates" }]}
      title={loaded.meta.title}
      summary={loaded.meta.summary}
      authors={authors}
      /* `verified` (the "Mantle Official" shield eyebrow) is
         intentionally NOT set right now — we're not surfacing the
         official-template badge on detail pages until the design
         pass lands. Restore by adding `verified` (and optionally
         `verifiedLabel="Mantle Official"`) when ready. */
      worksWith={worksWith}
      systems={loaded.meta.systems}
      estimatedTime={loaded.meta.estimatedTime}
      /* Short-form date — `formatShortDate` returns "MAR 3 24" /
         "DEC 15 24". Matches the card meta line; one date format
         across every Compass surface. */
      metaLine={loaded.meta.lastUpdated ? `Updated ${formatShortDate(loaded.meta.lastUpdated)}` : undefined}
      metaLayout="card"
      tags={loaded.meta.tags}
      /* TODO(share): Re-enable the social share cluster once the
         button recipe is finalized — pass `shareUrl={url}` to
         `CompassDetailShell` and the hero will render `<ShareCluster>`
         in the breadcrumb row again. Temporarily suppressed across
         workflows + templates pending design refresh. The ShareCluster
         component is still mounted in the codebase
         (`compass/components/shared/ShareCluster.tsx`), so restoring
         it is a one-line change. */
      rail="code"
      rightRailLabel="Prompt tool panel"
      rightRail={
        loaded.meta.previewImage ? (
          <PreviewTabs previewImage={loaded.meta.previewImage} blocks={blocks} />
        ) : (
          <CodeBlocks blocks={blocks} />
        )
      }
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
        options={compassMdxOptions}
      />
    </CompassDetailShell>
  );
}
