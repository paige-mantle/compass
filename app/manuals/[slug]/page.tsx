import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { compassMdxOptions } from "@/compass/lib/mdx-options";
import { CompassLayout } from "@/compass/components/shared/CompassLayout";
import { ManualShell } from "@/compass/components/manuals/ManualShell";
import { ManualShellV2 } from "@/compass/components/manuals/ManualShellV2";
import { mdxComponents } from "@/compass/components/manuals/mdx-components";
import { listManuals, loadSection } from "@/compass/lib/manuals/content";
import {
  buildSectionJsonLd,
  buildSectionMetadata,
} from "@/compass/lib/seo";

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await listManuals();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const loaded = await loadSection(slug, "");
  if (!loaded) return {};
  return buildSectionMetadata(loaded);
}

export default async function ManualIntroPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const loaded = await loadSection(slug, "");
  if (!loaded) notFound();

  const [articleLd, breadcrumbLd] = buildSectionJsonLd(loaded);

  /* Shape manual demos the boxed v2 layout — a centered card on
     the dark Compass canvas, dark sidebar TOC + white article
     column inside the card. Every other manual stays on the
     edge-to-edge v1 layout. Switch additional manuals over by
     adding their slug to the comparison below. */
  const useV2 = loaded.manifest.slug === "shape";
  const Shell = useV2 ? ManualShellV2 : ManualShell;
  return (
    <CompassLayout
      surface="manual"
      /* v2 shows the global Compass header above the card; v1
         hides the header (the brand rail at the left viewport
         edge is the manual's chrome). */
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
