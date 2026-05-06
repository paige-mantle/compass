import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "compass", "content", "frameworks");

export type FrameworkCodeBlock = {
  filename: string;
  language: string;
  code: string;
};

export type FrameworkFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  ribbon?: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  /** Color of the listing card block. */
  blockColor?: "yellow" | "gray" | "black" | "orange" | "blue" | "graphite";
  tags?: string[];
  codeBlocks?: FrameworkCodeBlock[];
  published?: boolean;
};

export type FrameworkMeta = FrameworkFrontmatter & {
  file: string;
};

export type LoadedFramework = {
  meta: FrameworkMeta;
  source: string;
};

export async function listFrameworks(): Promise<FrameworkMeta[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(CONTENT_ROOT);
  } catch {
    return [];
  }
  const files = entries.filter((f) => f.endsWith(".mdx"));
  const items: FrameworkMeta[] = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(CONTENT_ROOT, file), "utf8");
    const { data } = matter(raw);
    const fm = data as FrameworkFrontmatter;
    if (fm.published === false) continue;
    items.push({ ...fm, file });
  }
  items.sort((a, b) => a.title.localeCompare(b.title));
  return items;
}

export async function loadFramework(
  slug: string
): Promise<LoadedFramework | null> {
  const items = await listFrameworks();
  const meta = items.find((i) => i.slug === slug);
  if (!meta) return null;
  const raw = await fs.readFile(path.join(CONTENT_ROOT, meta.file), "utf8");
  const parsed = matter(raw);
  return { meta, source: parsed.content };
}
