import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { compassMdxOptions } from "@/compass/lib/mdx-options";
import { CompassLayout } from "@/compass/components/shared/CompassLayout";
import { ManualShell } from "@/compass/components/manuals/ManualShell";
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

  return (
    <CompassLayout
      surface="manual"
      showHeader={false}
      showBackgroundFx={false}
      showFooterCta={false}
    >
      <ManualShell
        manifest={loaded.manifest}
        current={loaded.section}
        currentIndex={loaded.index}
        prev={loaded.prev}
        next={loaded.next}
        summary={(loaded.frontmatter as { summary?: string }).summary}
        /* Shape manual demos the v2 layout — white article column
           on dark Compass canvas (see `ManualShell.tsx` for the
           full v2 recipe). Every other manual keeps the default
           v1 dark column. Switch additional manuals over by
           adding their slug to the comparison below. */
        variant={loaded.manifest.slug === "shape" ? "v2" : "v1"}
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
      </ManualShell>
    </CompassLayout>
  );
}
