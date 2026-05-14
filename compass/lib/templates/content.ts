import fs from "node:fs/promises";
import path from "node:path";
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
  description: string;
  /** Listing card eyebrow — usually the manual / collection name. */
  ribbon?: string;
  /** Listing card block color (matches FrameworkShell's variant set). */
  blockColor?: "yellow" | "gray" | "black" | "orange" | "blue" | "graphite";

  category?: TemplateCategory;
  format?: TemplateFormat;
  tools?: TemplateTool[];

  /** Free-text tags surfaced on the detail meta strip + listing
      pills. Distinct from category/format/tools because templates
      often want a denser content-label list. */
  tags?: string[];

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
      page. Same shape as `FrameworkCodeBlock`. */
  codeBlocks?: TemplateCodeBlock[];

  /** Optional preview image rendered above the code blocks in the
      right rail — used by template detail pages that pair a visual
      mockup with the prompt block(s). */
  previewImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
};

export type TemplateMeta = TemplateFrontmatter & {
  file: string;
};

export type LoadedTemplate = {
  meta: TemplateMeta;
  source: string;
};

/* ─── Loaders ──────────────────────────────────────────────── */

export async function listTemplates(): Promise<TemplateMeta[]> {
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
}

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
