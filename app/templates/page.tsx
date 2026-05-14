import { CompassLayout } from "@/compass/components/shared/CompassLayout";
import { CompassIndexHero } from "@/compass/components/shared/CompassIndexHero";
import { CompassSectionNav } from "@/compass/components/shared/CompassSectionNav";
import { CompassNewsletter } from "@/compass/components/shared/CompassNewsletter";
import { TemplateCardGrid } from "@/compass/components/templates/TemplateCardGrid";
import { listTemplates } from "@/compass/lib/templates/content";

export const metadata = {
  title: "Templates — Mantle Compass",
  description:
    "Practical templates, components, and AI-assisted workflows for turning product ideas into clearer pages, flows, screens, and systems.",
  alternates: { canonical: "/templates" },
};

/**
 * /templates — listing index for the templates section.
 * Migrates the static page (`public/mantle-compass-templates.html`)
 * to the next-gen React pattern. Same chrome, hero, and section nav
 * as the other Compass index pages — only the grid is unique.
 *
 * Content is loaded via `listTemplates()` which scans the
 * `compass/content/templates/` MDX files. Order is alphabetical by
 * default; sort by `lastUpdated` desc once we have more than two.
 */
export default async function TemplatesIndexPage() {
  const templates = await listTemplates();

  return (
    // `showFooterCta={false}` swaps the default "Grow your business with
    // Mantle" CTA band for the canonical newsletter footer used across
    // every static Compass index page.
    <CompassLayout showFooterCta={false}>
      <div className="mx-auto w-full max-w-[1320px] px-6 max-[720px]:px-5">
        <CompassIndexHero
          heading="Templates"
          description="Practical templates, components, and AI-assisted workflows for turning product ideas into clearer pages, flows, screens, and systems."
        />
        <CompassSectionNav currentPath="/templates" />
        <div className="mt-14 max-[720px]:mt-10">
          <TemplateCardGrid templates={templates} />
        </div>
      </div>
      <CompassNewsletter />
    </CompassLayout>
  );
}
