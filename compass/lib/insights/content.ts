import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "compass", "content", "insights");

export type InsightFrontmatter = {
  title: string;
  slug: string;
  date: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  ribbon?: string;
  readTime?: string;
  summary: string;
  published?: boolean;
};

export type InsightMeta = InsightFrontmatter & {
  file: string;
};

export type LoadedInsight = {
  meta: InsightMeta;
  source: string;
  headings: Array<{ depth: 2 | 3; id: string; text: string }>;
};

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractHeadings(source: string): LoadedInsight["headings"] {
  const headings: LoadedInsight["headings"] = [];
  const lines = source.split("\n");
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const depth = m[1].length === 2 ? 2 : 3;
    const text = m[2].replace(/[*_`]/g, "");
    headings.push({ depth, id: slugifyHeading(text), text });
  }
  return headings;
}

export async function listInsights(): Promise<InsightMeta[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(CONTENT_ROOT);
  } catch {
    return [];
  }
  const files = entries.filter((f) => f.endsWith(".mdx"));
  const items: InsightMeta[] = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(CONTENT_ROOT, file), "utf8");
    const { data } = matter(raw);
    const fm = data as InsightFrontmatter;
    if (fm.published === false) continue;
    items.push({ ...fm, file });
  }
  items.sort((a, b) => (a.date < b.date ? 1 : -1));
  return items;
}

export async function loadInsight(slug: string): Promise<LoadedInsight | null> {
  const items = await listInsights();
  const meta = items.find((i) => i.slug === slug);
  if (!meta) return null;
  const raw = await fs.readFile(path.join(CONTENT_ROOT, meta.file), "utf8");
  const parsed = matter(raw);
  return {
    meta,
    source: parsed.content,
    headings: extractHeadings(parsed.content),
  };
}
