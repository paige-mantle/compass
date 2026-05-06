import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "compass", "content", "manuals");

export type ManualSection = {
  slug: string;
  title: string;
  isIntro?: boolean;
  file: string;
  /** Optional one-liner injected under the section heading. */
  summary?: string;
};

export type ManualManifest = {
  slug: string;
  title: string;
  number: string;
  /** Hex accent color for this manual. Falls back to the default purple. */
  accent?: string;
  /** Hero treatment. "light" = dark text, no dot overlay (use on light accents). */
  heroVariant?: "default" | "light";
  sections: ManualSection[];
};

export async function getManualManifest(
  manualSlug: string
): Promise<ManualManifest | null> {
  const manifestPath = path.join(CONTENT_ROOT, manualSlug, "manifest.json");
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    return JSON.parse(raw) as ManualManifest;
  } catch {
    return null;
  }
}

export async function listManuals(): Promise<string[]> {
  try {
    const entries = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

export type LoadedSection = {
  manifest: ManualManifest;
  section: ManualSection;
  /** Section index (0-based). */
  index: number;
  /** Raw MDX source with frontmatter stripped. */
  source: string;
  /** Parsed frontmatter. */
  frontmatter: Record<string, unknown>;
  prev: ManualSection | null;
  next: ManualSection | null;
};

/**
 * Load an MDX section by manual slug + section slug.
 * Pass an empty string for `sectionSlug` to load the manual's introduction.
 * Returns null if the manual or section cannot be found.
 */
export async function loadSection(
  manualSlug: string,
  sectionSlug: string
): Promise<LoadedSection | null> {
  const manifest = await getManualManifest(manualSlug);
  if (!manifest) return null;
  const idx = manifest.sections.findIndex((s) => s.slug === sectionSlug);
  if (idx === -1) return null;
  const section = manifest.sections[idx];
  const filePath = path.join(CONTENT_ROOT, manualSlug, section.file);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
  const parsed = matter(raw);
  return {
    manifest,
    section,
    index: idx,
    source: parsed.content,
    frontmatter: parsed.data,
    prev: idx > 0 ? manifest.sections[idx - 1] : null,
    next: idx < manifest.sections.length - 1 ? manifest.sections[idx + 1] : null,
  };
}
