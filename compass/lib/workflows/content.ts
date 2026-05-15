import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

// Reads from `compass/content/workflows/` — directory was renamed
// from `methods/` (and originally `frameworks/`) to match the
// `/workflows/[slug]` URL during the IA refactor.
const CONTENT_ROOT = path.join(process.cwd(), "compass", "content", "workflows");

export type WorkflowCodeBlock = {
  filename: string;
  language: string;
  code: string;
};

/** A recommended-resources row in the Method right rail. `label` is the
    human label ("Shopify App Store URL", "Help center URL", etc.). `url`
    is optional — when absent, the row renders as a static placeholder
    (e.g. "Product screenshots", "Internal notes" that the user fills in
    themselves before running the prompt). */
export type WorkflowRecommendedResource = {
  label: string;
  url?: string;
};

export type WorkflowFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  ribbon?: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  /* SEO overrides — when set, these override the auto-generated
     `<title>` / meta description / OG fields in
     `app/workflows/[slug]/page.tsx`. `title` + `summary` continue
     to drive the visible H1 + subheading; the SEO fields are for
     search/social only.
       • metaTitle       — full `<title>` (typically "X | Mantle Compass")
       • metaDescription — meta description + Twitter description
       • ogTitle         — Open Graph title (shorter, share-card friendly)
       • ogDescription   — Open Graph description (share-card body)
     Source of truth: the May SEO spreadsheet (column → field):
       `Recommended meta title` → metaTitle
       `Meta description`       → metaDescription
       `OG title`               → ogTitle
       `OG description`         → ogDescription */
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  /** Card-block accent — one of the Compass canonical accent names.
   *  Source of truth in `compass/lib/card-accents.ts`. The palette
   *  is shared across method cards, template cards, and manual
   *  covers so the same name maps to the same color everywhere. */
  blockColor?:
    | "accent"
    | "accent-alt"
    | "orange"
    | "purple"
    | "teal"
    | "green"
    | "mac-red"
    | "mac-yellow"
    | "mac-green"
    | "white"
    | "black"
    | "graphite"
    | "gray";
  /** Categories rendered as chips in the hero meta card's
      "Categories" row. Free-form (e.g. "Shopify", "Lifecycle",
      "Reviews"). Surface-level taxonomy — what kind of recipe is
      this. */
  tags?: string[];
  /** Mantle product modules this workflow touches — rendered as
      chips in the hero meta card's "Systems" row. Free-form
      (e.g. "Customers", "Email + messaging", "Automations",
      "Analytics"). Helps readers see at a glance which parts of
      Mantle the recipe orchestrates. */
  systems?: string[];
  codeBlocks?: WorkflowCodeBlock[];
  published?: boolean;
  /** Mantle Official flag. Defaults to `true` — every workflow on
   *  Compass is Mantle-authored unless this is explicitly set to
   *  `false`. Community-submitted recipes opt out by setting
   *  `mantleOfficial: false` in their frontmatter.
   *
   *  Drives two surfaces:
   *    • Listing card plate — official cards use the `orange`
   *      accent (shared Mantle plate). Non-official cards fall back
   *      to the per-grid alternating rotation.
   *    • Detail hero — official workflows render the
   *      "Mantle Official" verified chip beneath the byline. */
  mantleOfficial?: boolean;
  /** Human-readable last-updated date, e.g. "May 11, 2026". */
  lastUpdated?: string;

  /** AI tools the method is built to run inside — rendered as a
      "Works with" row in the meta strip. */
  tools?: string[];
  /** Estimated time to complete (free-form: "10 min", "30–60 min"). */
  estimatedTime?: string;
  /** Optional "Open in Mantle AI" CTA target. When present the method
      page renders a primary button next to "Copy prompt" that deep-links
      into Mantle AI with the prompt pre-loaded. */
  openInMantleAiUrl?: string;
  /** Optional preview image rendered above the code blocks in the
      right rail. Used by templates that pair a visual (App Store
      screen mockup, component shot, etc.) with the prompt blocks
      that generate or accompany it. */
  previewImage?: {
    src: string;
    alt: string;
    /** Optional caption shown below the image. */
    caption?: string;
  };
  /** Right-rail "Recommended resources" block — quick-reference list of
      docs/URLs the prompt expects. */
  recommendedResources?: WorkflowRecommendedResource[];
  /** Right-rail "Expected outputs" block — bullet list of artifacts the
      method generates. */
  outputs?: string[];
};

export type WorkflowMeta = WorkflowFrontmatter & {
  file: string;
};

export type LoadedWorkflow = {
  meta: WorkflowMeta;
  source: string;
};

/* `cache()` from React memoizes within a single server render so
   `generateStaticParams` + `loadWorkflow` (which both call this
   loader) only hit the filesystem once per build pass instead of
   twice. Same pattern landed on the templates + insights loaders
   for parity. Cheap to apply, measurable build-time speedup at
   scale. */
export const listWorkflows = cache(async (): Promise<WorkflowMeta[]> => {
  let entries: string[];
  try {
    entries = await fs.readdir(CONTENT_ROOT);
  } catch {
    return [];
  }
  const files = entries.filter((f) => f.endsWith(".mdx"));
  const items: WorkflowMeta[] = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(CONTENT_ROOT, file), "utf8");
    const { data } = matter(raw);
    const fm = data as WorkflowFrontmatter;
    if (fm.published === false) continue;
    items.push({ ...fm, file });
  }
  items.sort((a, b) => a.title.localeCompare(b.title));
  return items;
});

export async function loadWorkflow(
  slug: string
): Promise<LoadedWorkflow | null> {
  const items = await listWorkflows();
  const meta = items.find((i) => i.slug === slug);
  if (!meta) return null;
  const raw = await fs.readFile(path.join(CONTENT_ROOT, meta.file), "utf8");
  const parsed = matter(raw);
  return { meta, source: parsed.content };
}
