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

/** Cover-card display data — extends each manifest with the
    display order, ordinal label, hero cover title (which may differ
    from the manifest title, e.g. Foundation → "Zero"), the per-cover
    accent class, and a `comingSoon` flag for the manuals not yet
    shipped. Used by the `/compass/manuals` index. */
export type ManualCoverEntry = {
  slug: string;
  href: string;
  /** Manifest title (e.g. "Foundation"). */
  manifestTitle: string;
  /** Display title on the cover card (e.g. "Zero"). */
  coverTitle: string;
  /** Three-digit ordinal, "001"–"007". */
  ordinal: string;
  /** Maps to `.acc-*` class in compass-base.css `--cover-accent-*`. */
  accent: "gold" | "lilac" | "cyan" | "warm" | "orange" | "white";
  /** Used to map to the inline SVG graphic in `CoverArt`. */
  motif:
    | "vanishing-grid"
    | "nested-ovals"
    | "circuit-path"
    | "funnel-paths"
    | "magnetic-field"
    | "sine-wave"
    | "helix-coil";
  comingSoon: boolean;
};

/**
 * Canonical cover-grid order for `/compass/manuals`. Loaded from a
 * hard-coded list rather than `listManuals()` because the index
 * page needs a specific ordering (001 → 007) and per-cover display
 * metadata (motif, accent, "coming soon" flag) that doesn't belong
 * in each manual's manifest.json.
 */
export const MANUAL_COVERS: ManualCoverEntry[] = [
  {
    slug: "foundation",
    href: "/compass/foundation",
    manifestTitle: "Foundation",
    coverTitle: "Zero",
    ordinal: "001",
    accent: "gold",
    motif: "vanishing-grid",
    comingSoon: false,
  },
  {
    slug: "shape",
    href: "/compass/shape",
    manifestTitle: "Shape",
    coverTitle: "Shape",
    ordinal: "002",
    accent: "lilac",
    motif: "nested-ovals",
    comingSoon: false,
  },
  {
    slug: "build",
    href: "/compass/build",
    manifestTitle: "Build",
    coverTitle: "Build",
    ordinal: "003",
    accent: "cyan",
    motif: "circuit-path",
    comingSoon: false,
  },
  {
    slug: "launch",
    href: "/compass/launch",
    manifestTitle: "Launch",
    coverTitle: "Launch",
    ordinal: "004",
    accent: "warm",
    motif: "funnel-paths",
    comingSoon: true,
  },
  {
    slug: "monetize",
    href: "/compass/monetize",
    manifestTitle: "Monetize",
    coverTitle: "Monetize",
    ordinal: "005",
    accent: "orange",
    motif: "magnetic-field",
    comingSoon: true,
  },
  {
    slug: "grow",
    href: "/compass/grow",
    manifestTitle: "Grow",
    coverTitle: "Grow",
    ordinal: "006",
    accent: "cyan",
    motif: "sine-wave",
    comingSoon: true,
  },
  {
    slug: "operate",
    href: "/compass/operate",
    manifestTitle: "Operate",
    coverTitle: "Operate",
    ordinal: "007",
    accent: "white",
    motif: "helix-coil",
    comingSoon: true,
  },
];

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
