import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { compassMdxOptions } from "@/compass/lib/mdx-options";
import { CompassLayout } from "@/compass/components/shared/CompassLayout";
import { ManualShell } from "@/compass/components/manuals/ManualShell";
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
        /* Shape chapters use the v2 white-article-column layout —
           see `ManualShell.tsx` for the full recipe. Keep this
           filter in lockstep with the intro-page filter in
           `app/manuals/[slug]/page.tsx`. */
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
