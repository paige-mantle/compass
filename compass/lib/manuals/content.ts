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
  /** Optional H1 override for the manual hero. When set, the
   *  `ManualShell` hero renders `heroTitle` as the H1 instead of
   *  falling back to `manifest.title` (intro) / `section.title`
   *  (chapters). Sidebar nav + breadcrumb keep the canonical
   *  `title` so wayfinding doesn't drift. Used for intro sections
   *  whose hero wants a longer editorial phrase
   *  ("Shape your app idea") while the sidebar entry stays
   *  compact ("Overview"). */
  heroTitle?: string;
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
 *
 * **`comingSoon` semantics (all three surfaces must agree)**:
 *
 *   1. UI: both `ManualCoverGrid` (poster grid on `/manuals`) and
 *      `ManualRowList` (editorial rows on `/compass`) render
 *      coming-soon entries as a non-clickable `<div aria-disabled=
 *      "true">` with a "Coming soon" badge. No `<Link>` wrapper, so
 *      hover, focus, and click affordances are all suppressed.
 *
 *   2. Routing: a typed URL like `/manuals/build` would 404 because
 *      no content folder exists at `compass/content/manuals/build/`.
 *      `next.config.ts` redirects all coming-soon manual roots +
 *      their child chapters to `/manuals` with `permanent: false`
 *      (302). When `comingSoon` flips to false on a manual, remove
 *      the matching redirect block so the real content takes over.
 *
 *   3. Sitemap (`app/sitemap.ts`): already excludes coming-soon
 *      manuals automatically because it enumerates from
 *      `listManuals()` — which reads the filesystem — and
 *      coming-soon manuals have no content folder on disk.
 *
 *   4. Search index (when the spawned search-bar task lands):
 *      filter on `entry.comingSoon === false` when building the
 *      `SearchDoc[]` array so coming-soon manuals don't appear in
 *      Cmd-K palette results. Same flag, same source of truth.
 *
 * Updating one surface and not the others creates a discoverability
 * leak (e.g., card non-clickable but search palette returns it →
 * search click 404s). Keep this list and the redirects in lockstep.
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
    ordinal: "00",
    /* Clarity wears the canonical Mantle brand gold (`accent` →
       `--color-accent` = #FFBB53, the darker "Mantle Official"
       hue). Was `accent: "orange"` (= `--color-orange-high` =
       #FFC66E, a lighter warm gold) which read as muted next to
       the brand gold on Mantle marketing. Promoting to `accent`
       lines the first manual up with the brand mark visually —
       same gold as the Mantle logo + the canonical eyebrow ramp
       across Compass. (The Mantle Official workflow plate also
       uses this hue; that's a feature, not a conflict — Clarity
       is the brand's flagship manual, so the gold reinforces the
       primary identity surface.) */
    accent: "accent",
    motif: "vanishing-grid",
    comingSoon: false,
    summary:
      "Understand what AI has changed, what it did not fix, and what it takes to build an app people actually use, trust, and pay for.",
  },
  {
    slug: "shape",
    href: "/manuals/shape",
    manifestTitle: "Shape",
    coverTitle: "Shape",
    ordinal: "01",
    accent: "purple",
    motif: "nested-ovals",
    comingSoon: false,
    summary:
      "Turn a rough direction into a clear product strategy: problem, customer, demand, positioning, and a useful MVP.",
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
    ordinal: "02",
    accent: "teal",
    motif: "circuit-path",
    comingSoon: true,
    summary:
      "Make better build decisions across stack, workflows, scope, and systems without adding unnecessary complexity.",
  },
  {
    slug: "launch",
    href: "/manuals/launch",
    manifestTitle: "Launch",
    coverTitle: "Launch",
    ordinal: "03",
    accent: "mac-yellow",
    motif: "funnel-paths",
    comingSoon: true,
  },
  {
    /* Monetize maps to the canonical Mantle red (`mac-red` =
       `--color-mac-red` = #EE5249), unambiguous against Clarity's
       light gold. Was `accent: "red"` before the card-accent rename
       that moved next-gen-style `mac-*` prefixes onto the
       saturated mid-tone colors. */
    slug: "monetize",
    href: "/manuals/monetize",
    manifestTitle: "Monetize",
    coverTitle: "Monetize",
    ordinal: "04",
    accent: "mac-red",
    motif: "magnetic-field",
    comingSoon: true,
  },
  {
    /* Grow uses the canonical Mantle spring green (`mac-green` =
       `--color-mac-green` = #5CD055), distinct from Build's teal.
       Was `accent: "green"` before the rename moved the bright
       electric `--color-green-high` (#98FF76) onto the `green` slot
       to match next-gen, and the saturated mid-green onto
       `mac-green`. */
    slug: "grow",
    href: "/manuals/grow",
    manifestTitle: "Grow",
    coverTitle: "Grow",
    ordinal: "05",
    accent: "mac-green",
    motif: "sine-wave",
    comingSoon: true,
  },
  {
    slug: "operate",
    href: "/manuals/operate",
    manifestTitle: "Operate",
    coverTitle: "Operate",
    ordinal: "06",
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
