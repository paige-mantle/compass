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
    shipped. Used by the `/manuals` index. */
export type ManualCoverEntry = {
  slug: string;
  href: string;
  /** Manifest title (e.g. "Foundation"). */
  manifestTitle: string;
  /** Display title on the cover card (e.g. "Zero"). */
  coverTitle: string;
  /** Three-digit ordinal, "001"–"007". */
  ordinal: string;
  /** Compass canonical accent — one of the `CardAccent` palette
   *  names defined in `compass/lib/card-accents.ts`. The same
   *  palette is shared with method + template cards so the same
   *  name = the same color across every Compass surface. */
  accent: import("../card-accents").CardAccent;
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
  /**
   * One- or two-sentence summary shown on the row-stacked manual list
   * (Compass home). Cover-grid `/manuals` doesn't render this
   * — it's specifically for the home-page row layout where each manual
   * gets editorial breathing room. Coming-soon manuals can omit it
   * (the row will show "Coming soon" eyebrow instead).
   */
  summary?: string;
};

/**
 * Canonical cover-grid order for `/manuals`. Loaded from a
 * hard-coded list rather than `listManuals()` because the index
 * page needs a specific ordering (001 → 007) and per-cover display
 * metadata (motif, accent, "coming soon" flag) that doesn't belong
 * in each manual's manifest.json.
 */
export const MANUAL_COVERS: ManualCoverEntry[] = [
  {
    /* Manual 0 — renamed Foundation → Clarity per the IA spec.
       One-word stage name. URL slug + folder + cover title all use
       "clarity" now; redirects from /manuals/foundation/* live in
       `next.config.ts`. */
    slug: "clarity",
    href: "/manuals/clarity",
    manifestTitle: "Clarity",
    coverTitle: "Clarity",
    ordinal: "000",
    accent: "gold",
    motif: "vanishing-grid",
    comingSoon: false,
    summary:
      "Get clear on what deserves to be built before you start building. The first manual — builder identity, real markets, and the founder posture the rest of Compass assumes.",
  },
  {
    slug: "shape",
    href: "/manuals/shape",
    manifestTitle: "Shape",
    coverTitle: "Shape",
    ordinal: "001",
    accent: "lilac",
    motif: "nested-ovals",
    comingSoon: false,
    summary:
      "Turn a fuzzy idea into a sharp product thesis. Position the problem, validate real demand, and decide what the first version should be before you build anything.",
  },
  {
    /* The next four manuals (Build through Operate) are roadmap
       placeholders. The earlier draft MDX was removed because it
       wasn't going forward, but the cover slots stay in the grid so
       visitors can see the full Compass arc — flip `comingSoon` to
       false + author chapters under `compass/content/manuals/<slug>/`
       as each manual is written. Summaries are intentionally short
       (one line) — long-form descriptions live on the home row-list
       only after the chapters exist. */
    slug: "build",
    href: "/manuals/build",
    manifestTitle: "Build",
    coverTitle: "Build",
    ordinal: "002",
    accent: "cyan",
    motif: "circuit-path",
    comingSoon: true,
    summary:
      "How to actually ship the first version — opinionated guidance on scope, stack choices, and the AI-native workflows that make a small team feel like ten.",
  },
  {
    slug: "launch",
    href: "/manuals/launch",
    manifestTitle: "Launch",
    coverTitle: "Launch",
    ordinal: "003",
    accent: "warm",
    motif: "funnel-paths",
    comingSoon: true,
  },
  {
    /* `accent: "red"` (was `"orange"`, which resolved to the same
       #FFC66E as Foundation's gold — visually identical). Mapped to
       the canonical Mantle red (#EE5249) so Monetize is unambiguous
       in the cover grid. */
    slug: "monetize",
    href: "/manuals/monetize",
    manifestTitle: "Monetize",
    coverTitle: "Monetize",
    ordinal: "004",
    accent: "red",
    motif: "magnetic-field",
    comingSoon: true,
  },
  {
    /* `accent: "green"` (was `"cyan"`, which duplicated Build's
       accent). Mapped to the canonical Mantle spring green (#5CD055)
       so Grow has its own slot in the visual ramp. */
    slug: "grow",
    href: "/manuals/grow",
    manifestTitle: "Grow",
    coverTitle: "Grow",
    ordinal: "005",
    accent: "green",
    motif: "sine-wave",
    comingSoon: true,
  },
  {
    slug: "operate",
    href: "/manuals/operate",
    manifestTitle: "Operate",
    coverTitle: "Operate",
    ordinal: "006",
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
