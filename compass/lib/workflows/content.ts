import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

// Reads from `compass/content/methods/` — directory renamed from
// `frameworks/` to match the `/workflows/[slug]` URL. The
// exported TypeScript types (`WorkflowMeta`, `WorkflowFrontmatter`,
// `WorkflowCodeBlock`) keep their `Framework*` names for now to
// avoid a breaking churn across every consumer; filesystem only.
const CONTENT_ROOT = path.join(process.cwd(), "compass", "content", "methods");

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
  /** Card-block accent — one of the Compass canonical accent names.
   *  Source of truth in `compass/lib/card-accents.ts`. The palette
   *  is shared across method cards, template cards, and manual
   *  covers so the same name maps to the same color everywhere. */
  blockColor?:
    | "gold"
    | "cyan"
    | "lilac"
    | "warm"
    | "red"
    | "white"
    | "black"
    | "graphite"
    | "gray";
  tags?: string[];
  codeBlocks?: WorkflowCodeBlock[];
  published?: boolean;
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

export async function listWorkflows(): Promise<WorkflowMeta[]> {
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
}

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
