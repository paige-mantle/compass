import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "compass", "content", "templates");

/* ─── Allowed tag values ──────────────────────────────────────
   Authored as readonly arrays so the TS type system can narrow
   string literals at the frontmatter level. */

export const TEMPLATE_CATEGORIES = [
  "App Store",
  "Billing",
  "Launch",
  "Growth",
  "UX",
  "Product Marketing",
  "Components",
] as const;
export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export const TEMPLATE_FORMATS = [
  "Template",
  "Component",
  "Screen System",
  "AI Workflow",
  "Copy System",
  "Checklist",
  "Code Starter",
] as const;
export type TemplateFormat = (typeof TEMPLATE_FORMATS)[number];

export const TEMPLATE_TOOLS = [
  "Claude Code",
  "Cursor",
  "Codex",
  "Paper",
  "Lovable",
  "Figma",
  "Shopify",
  "Mantle",
] as const;
export type TemplateTool = (typeof TEMPLATE_TOOLS)[number];

/* ─── Types ────────────────────────────────────────────────── */

export type TemplateCodeBlock = {
  filename: string;
  language: string;
  code: string;
};

export type TemplateFrontmatter = {
  title: string;
  slug: string;
  /* Renamed from `description` → `summary` to match the rest of the
     Compass content models (workflows, insights, manual sections all
     use `summary`). Reduces the "which field do I use?" cognitive
     load when authoring new content. Old MDX files using
     `description:` need to be migrated — there are only 2 today. */
  summary: string;
  /* SEO overrides — when set, override auto-generated meta in
     `app/templates/[slug]/page.tsx`. Same shape as
     `WorkflowFrontmatter`'s SEO block; populated from the May SEO
     spreadsheet ("Recommended meta title" / "Meta description" /
     "OG title" / "OG description"). */
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  /** Listing card eyebrow — usually the manual / collection name. */
  ribbon?: string;
  /** Card-block accent — one of the Compass canonical accent names.
   *  Source of truth in `compass/lib/card-accents.ts`. Shared with
   *  method cards + manual covers — same name = same color. */
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

  category?: TemplateCategory;
  format?: TemplateFormat;
  tools?: TemplateTool[];

  /** Free-text tags surfaced on the detail meta strip + listing
      pills. Distinct from category/format/tools because templates
      often want a denser content-label list. */
  tags?: string[];

  /** Mantle product modules this template touches — rendered as
      chips in the hero meta card's "Systems" row (e.g. Customers,
      Email + messaging, Automations, Analytics). Mirrors the
      `systems` field on workflows so the two surfaces share one
      meta schema. */
  systems?: string[];

  /** Free-form "Estimated time" meta — rendered in its own
      labelled row in the hero meta card (e.g. "15 min"). */
  estimatedTime?: string;

  /** Authoring + provenance (mirrors frameworks). */
  author?: string;
  authorRole?: string;
  authorAvatar?: string;
  lastUpdated?: string;

  published?: boolean;

  /** Optional structured sections rendered by the shell above the
      MDX body. Each is a simple bulleted list. */
  bestFor?: string[];
  includes?: string[];
  pairsWellWith?: string[];

  /** Optional code blocks shown in the right-rail of the detail
      page. Same shape as `WorkflowCodeBlock`. */
  codeBlocks?: TemplateCodeBlock[];

  /** Optional preview image rendered above the code blocks in the
      right rail — used by template detail pages that pair a visual
      mockup with the prompt block(s).
      LEGACY: single-image form. Prefer the array variant `previewImages`
      below — it renders the new tabbed gallery block. When both are
      present the array wins; the single field is kept for backwards
      compat with templates that haven't migrated yet. */
  previewImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
  /** Optional gallery of preview images rendered as a tabbed block
      ABOVE the code-blocks panel in the right rail. Each entry is
      one tab in the gallery; `label` shows on the tab strip and
      `alt` carries the screen-reader description. Use this when
      a template ships multiple screens / mockups / variants — the
      tab strip gives the reader one click between them.
      The companion `codeBlocks` array still renders BELOW this
      gallery on template detail pages, so authors can pair visual
      previews with the prompt code one stack down. */
  previewImages?: Array<{
    label: string;
    src: string;
    alt: string;
    caption?: string;
  }>;
};

export type TemplateMeta = TemplateFrontmatter & {
  file: string;
};

export type LoadedTemplate = {
  meta: TemplateMeta;
  source: string;
};

/* ─── Loaders ──────────────────────────────────────────────── */

/* Memoized via `cache()` so `generateStaticParams` + `loadTemplate`
   don't double-scan the filesystem per render. Matches the workflows
   + insights loaders. */
export const listTemplates = cache(async (): Promise<TemplateMeta[]> => {
  let entries: string[];
  try {
    entries = await fs.readdir(CONTENT_ROOT);
  } catch {
    return [];
  }
  const files = entries.filter((f) => f.endsWith(".mdx"));
  const items: TemplateMeta[] = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(CONTENT_ROOT, file), "utf8");
    const { data } = matter(raw);
    const fm = data as TemplateFrontmatter;
    if (fm.published === false) continue;
    items.push({ ...fm, file });
  }
  items.sort((a, b) => a.title.localeCompare(b.title));
  return items;
});

export async function loadTemplate(
  slug: string
): Promise<LoadedTemplate | null> {
  const items = await listTemplates();
  const meta = items.find((i) => i.slug === slug);
  if (!meta) return null;
  const raw = await fs.readFile(path.join(CONTENT_ROOT, meta.file), "utf8");
  const parsed = matter(raw);
  return { meta, source: parsed.content };
}
