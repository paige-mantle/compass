import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ManualShell } from "@/compass/components/manuals/ManualShell";
import { mdxComponents } from "@/compass/components/manuals/mdx-components";
import { listManuals, loadSection } from "@/compass/lib/manuals/content";
import {
  buildSectionJsonLd,
  buildSectionMetadata,
} from "@/compass/lib/seo";

type Params = { manual: string };

export async function generateStaticParams() {
  const slugs = await listManuals();
  return slugs.map((manual) => ({ manual }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { manual } = await params;
  const loaded = await loadSection(manual, "");
  if (!loaded) return {};
  return buildSectionMetadata(loaded);
}

export default async function ManualIntroPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { manual } = await params;
  const loaded = await loadSection(manual, "");
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
