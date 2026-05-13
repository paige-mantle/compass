import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
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

type Params = { manual: string; section: string };

export async function generateStaticParams() {
  const slugs = await listManuals();
  const all: Params[] = [];
  for (const manual of slugs) {
    const manifest = await getManualManifest(manual);
    if (!manifest) continue;
    for (const s of manifest.sections) {
      if (!s.slug) continue; // intro is handled by /[manual]/page.tsx
      all.push({ manual, section: s.slug });
    }
  }
  return all;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { manual, section } = await params;
  const loaded = await loadSection(manual, section);
  if (!loaded) return {};
  return buildSectionMetadata(loaded);
}

export default async function ManualSectionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { manual, section } = await params;
  const loaded = await loadSection(manual, section);
  if (!loaded) notFound();

  const [articleLd, breadcrumbLd] = buildSectionJsonLd(loaded);

  return (
    <ManualShell
      manifest={loaded.manifest}
      current={loaded.section}
      currentIndex={loaded.index}
      prev={loaded.prev}
      next={loaded.next}
      lastUpdated={(loaded.frontmatter as { lastUpdated?: string }).lastUpdated}
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
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </ManualShell>
  );
}
