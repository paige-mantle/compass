import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { compassMdxOptions } from "@/compass/lib/mdx-options";
import { CompassDetailShell } from "@/compass/components/shared/CompassDetailShell";
import { Cmd } from "@/compass/components/shared/Cmd";
import { CodeFence } from "@/compass/components/shared/CodeFence";
import { CodeBlocks } from "@/compass/components/workflows/CodeBlocks";
import { PreviewTabs } from "@/compass/components/workflows/PreviewTabs";
import { PairsWith, PairItem } from "@/compass/components/workflows/PairsWith";
import { Chips, Chip } from "@/compass/components/workflows/Chips";
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
import { listWorkflows, loadWorkflow } from "@/compass/lib/workflows/content";
import { SITE_ORIGIN } from "@/compass/lib/seo";
import { formatShortDate } from "@/compass/lib/format-date";

/**
 * MDX components available inside workflow / recipe MDX files.
 *
 * Includes:
 *   • Workflow-specific: PairsWith, Chips, RelatedCards (recipe glue)
 *   • Shared: Cmd, CodeFence (shell commands + code-fence chrome)
 *   • Full callout family: Note (Callout), FieldNote, RealityCheck,
 *     CommonFailure, DecisionPoint, FounderShift, Checklist
 *
 * Same callouts as manual chapters — workflows are recipe pages
 * that benefit from the same `<RealityCheck>` ("here's the trap")
 * and `<Checklist>` ("did you do all the steps") patterns.
 */
const frameworkMdxComponents = {
  Cmd,
  pre: CodeFence,
  PairsWith,
  PairItem,
  Chips,
  Chip,
  RelatedCards,
  RelatedCard,
  // Callout family — same recipes available across every Compass
  // long-form surface (manuals, workflows, templates, insights).
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
  const items = await listWorkflows();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const loaded = await loadWorkflow(slug);
  if (!loaded) return {};
  /* SEO-sheet overrides win over the auto-generated title/summary
     pair. `metaTitle` etc. come from frontmatter (see
     `WorkflowFrontmatter` in `compass/lib/workflows/content.ts`).
     Canonical resolves to an absolute URL via `SITE_ORIGIN` so
     preview deploys don't leak preview-host canonicals. */
  const url = `${SITE_ORIGIN}/workflows/${slug}`;
  const m = loaded.meta;
  /* When `metaTitle` is set, the CSV already includes the
     "| Mantle Compass" suffix — pass it through as `absolute` so
     the root-layout template doesn't double-append it. When only
     the auto-generated `m.title` is used (no SEO override), the
     template appends the brand suffix normally. */
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
      authors: [m.author],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}

export default async function FrameworkPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const loaded = await loadWorkflow(slug);
  if (!loaded) notFound();

  /* All JSON-LD URLs resolve through the canonical `SITE_ORIGIN`
     (`https://heymantle.com`). Previously hardcoded to the preview
     deploy (`mantle-chi.vercel.app`) which leaked into every social
     share + every Google indexing result. */
  const url = `${SITE_ORIGIN}/workflows/${slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: loaded.meta.title,
    description: loaded.meta.summary,
    author: { "@type": "Person", name: loaded.meta.author },
    publisher: { "@type": "Organization", name: "Mantle", url: SITE_ORIGIN },
    mainEntityOfPage: url,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Mantle Compass", item: `${SITE_ORIGIN}/compass` },
      /* Section renamed Frameworks → Methods → Workflows. Breadcrumb
         label matches the live URL + nav copy so Google indexes the
         correct category name. */
      { "@type": "ListItem", position: 2, name: "Workflows", item: `${SITE_ORIGIN}/workflows` },
      { "@type": "ListItem", position: 3, name: loaded.meta.title, item: url },
    ],
  };

  const blocks = loaded.meta.codeBlocks ?? [];
  const authors = loaded.meta.author
    ? [{
        name: loaded.meta.author,
        role: loaded.meta.authorRole,
        avatar: loaded.meta.authorAvatar,
      }]
    : undefined;

  return (
    <CompassDetailShell
      breadcrumb={[{ label: "Workflows", href: "/workflows" }]}
      title={loaded.meta.title}
      summary={loaded.meta.summary}
      authors={authors}
      /* Mantle Official chip is retired on the detail hero. The
         `mantleOfficial` frontmatter flag still drives the listing
         card plate (orange for official, rotation for community) —
         it just no longer renders a hero chip. */
      worksWith={loaded.meta.tools}
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
        components={frameworkMdxComponents}
        options={compassMdxOptions}
      />
    </CompassDetailShell>
  );
}
