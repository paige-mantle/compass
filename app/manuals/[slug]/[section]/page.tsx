import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { compassMdxOptions } from "@/compass/lib/mdx-options";
import { CompassLayout } from "@/compass/components/shared/CompassLayout";
import { ManualShell } from "@/compass/components/manuals/ManualShell";
import { ManualShellV2 } from "@/compass/components/manuals/ManualShellV2";
import { mdxComponents } from "@/compass/components/manuals/mdx-components";
import {
  getManualManifest,
  listManuals,
  loadSection,
} from "@/compass/lib/manuals/content";
import {
  buildSectionJsonLd,
  buildSectionMetadata,
} from "@/compass/lib/seo";

type Params = { slug: string; section: string };

export async function generateStaticParams() {
  const slugs = await listManuals();
  const all: Params[] = [];
  for (const manual of slugs) {
    const manifest = await getManualManifest(manual);
    if (!manifest) continue;
    for (const s of manifest.sections) {
      if (!s.slug) continue; // intro is handled by /[manual]/page.tsx
      all.push({ slug: manual, section: s.slug });
    }
  }
  return all;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, section } = await params;
  const loaded = await loadSection(slug, section);
  if (!loaded) return {};
  return buildSectionMetadata(loaded);
}

export default async function ManualSectionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, section } = await params;
  const loaded = await loadSection(slug, section);
  if (!loaded) notFound();

  const [articleLd, breadcrumbLd] = buildSectionJsonLd(loaded);

  /* See `app/manuals/[slug]/page.tsx` for the v2 routing
     rationale — keep this filter in lockstep with the intro
     page so a chapter never accidentally switches layouts. */
  const useV2 = loaded.manifest.slug === "shape";
  const Shell = useV2 ? ManualShellV2 : ManualShell;
  return (
    <CompassLayout
      surface="manual"
      showHeader={useV2}
      hideSecondaryNav
      showBackgroundFx={false}
      showFooterCta={useV2}
    >
      <Shell
        manifest={loaded.manifest}
        current={loaded.section}
        currentIndex={loaded.index}
        prev={loaded.prev}
        next={loaded.next}
        summary={(loaded.frontmatter as { summary?: string }).summary}
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
          components={mdxComponents}
          options={compassMdxOptions}
        />
      </Shell>
    </CompassLayout>
  );
}
