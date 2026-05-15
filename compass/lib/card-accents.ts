/**
 * Compass card accent palette — single source of truth.
 *
 * Every Compass card surface — manual covers, workflow blocks,
 * template blocks — draws from this one palette. The palette is
 * sourced from Mantle canonical `--color-*` tokens defined in
 * `app/globals.css` `@theme`, so the same hex appears nowhere else
 * in code.
 *
 * **Naming aligned to next-gen Mantle** — the single-tone color
 * names (`orange`, `purple`, `teal`, `green`) mirror the
 * `--color-*-high` tokens in `next-gen/src/styles/global.css`. The
 * saturated mids (`mac-red`, `mac-yellow`, `mac-green`) mirror the
 * `--color-mac-*` tokens. The `accent` and `accent-alt` slots map
 * to the canonical Mantle brand-accent ramps. Two Compass-only
 * neutrals (`graphite`, `gray`) are hardcoded because they don't
 * exist in the next-gen palette.
 *
 * **Palette (ordered: brand → named single-tone → mac mids →
 * neutrals)**:
 *
 *   Mantle brand
 *     • accent       — #FFBB53 (--color-accent)              Mantle gold (medium, official)
 *     • accent-alt   — #6637FF (--color-accent-alt-medium)    deep purple, brand alt
 *
 *   Named single-tone colors (next-gen --color-*-high)
 *     • orange       — #FFC66E (--color-orange-high)          light warm gold
 *     • purple       — #9676FF (--color-purple-high)          medium purple
 *     • teal         — #76E8FF (--color-teal-high)            bright cyan-teal
 *     • green        — #98FF76 (--color-green-high)           electric lime-green
 *
 *   Mac-themed saturated mids (next-gen --color-mac-*)
 *     • mac-red      — #EE5249 (--color-mac-red)              alert red
 *     • mac-yellow   — #EFC62A (--color-mac-yellow)           deep yellow
 *     • mac-green    — #5CD055 (--color-mac-green)            spring green
 *
 *   Neutrals
 *     • white        — #FFFFFF (--color-fg-high)              pure white
 *     • black        — #1E1C23 (--color-surface-highest)      Mantle dark surface
 *     • graphite     — #2A606B                                Compass-only deep teal-grey
 *     • gray         — #d8d8d6                                Compass-only soft grey
 *
 * **Migration notes (vs. earlier Compass palette)**:
 *   • `gold` removed — was a duplicate of `orange` (both #FFC66E).
 *     Use `orange` for the lighter gold plate, `accent` for the
 *     darker official Mantle gold plate.
 *   • `accent` added — Mantle Official workflow cards use this
 *     instead of `orange` so the plate reads as the official brand
 *     gold (#FFBB53) rather than a generic light gold.
 *   • `lilac` → `purple`, `cyan` → `teal`, `warm` → `mac-yellow`,
 *     `red` → `mac-red`, `green` → `mac-green`, `lime` → `green`,
 *     `deepPurple` → `accent-alt`. Names now match next-gen tokens
 *     1:1.
 */

export type CardAccent =
  // Mantle brand accents
  | "accent"
  | "accent-alt"
  // Named single-tone colors (mirror next-gen --color-*-high)
  | "orange"
  | "purple"
  | "teal"
  | "green"
  // Mac-themed saturated mids (mirror next-gen --color-mac-*)
  | "mac-red"
  | "mac-yellow"
  | "mac-green"
  // Neutrals
  | "white"
  | "black"
  | "graphite"
  | "gray";

/**
 * Background color (the block fill behind a card's title).
 * Workflow + Template cards render the title inside a 16:9 colored
 * block with this background. Each value is a Tailwind arbitrary
 * class pointing at a Mantle canonical token so the source of
 * truth is `app/globals.css` `@theme`.
 */
export const CARD_BG_CLASS: Record<CardAccent, string> = {
  // Brand
  accent:       "bg-[var(--color-accent)]",             // #FFBB53 — Mantle Official plate
  "accent-alt": "bg-[var(--color-accent-alt-medium)]",  // #6637FF
  // Named single-tone
  orange:       "bg-[var(--color-orange-high)]",        // #FFC66E
  purple:       "bg-[var(--color-purple-high)]",        // #9676FF
  teal:         "bg-[var(--color-teal-high)]",          // #76E8FF
  green:        "bg-[var(--color-green-high)]",         // #98FF76
  // Mac mids
  "mac-red":    "bg-[var(--color-mac-red)]",            // #EE5249
  "mac-yellow": "bg-[var(--color-mac-yellow)]",         // #EFC62A
  "mac-green":  "bg-[var(--color-mac-green)]",          // #5CD055
  // Neutrals
  white:        "bg-[var(--color-fg-high)]",            // #FFFFFF
  black:        "bg-[var(--color-surface-highest)]",    // #1E1C23
  graphite:     "bg-[#2A606B]",                         // Compass-specific
  gray:         "bg-[#d8d8d6]",                         // Compass-specific
};

/**
 * Raw CSS color values per accent — same contrast pairings as
 * `CARD_TEXT_CLASS` below, but returned as plain CSS values
 * (`var(--color-card-fg-dark)` or `#FFFFFF`) so callers can pass
 * them to inline `style={{ color }}` props.
 *
 * **Why two maps for the same data**: Tailwind v4 mis-generates the
 * important-suffix variant of arbitrary text-color utilities when
 * the inner value contains a CSS variable, so utility classes get
 * beat by selector rules like the prose-content h3 color rule in
 * prose.css. Inline styles bypass class-specificity entirely — they
 * win against any class rule without important on either side. The
 * card title h3 sits inside compass-content on listing pages, so it
 * needs inline styles to render the right ink.
 *
 * NB: the source comments in this file deliberately do NOT include
 * any "text-bracket-value-bang" string literal. Tailwind's content
 * scanner picks up class candidates from comments too, and the
 * mis-generation cycle re-triggers on every recompile, breaking the
 * dev build with a CSS parse error.
 */
export const CARD_TEXT_COLOR: Record<CardAccent, string> = {
  // Brand
  accent:       "var(--color-card-fg-dark)",
  "accent-alt": "#FFFFFF",
  // Named single-tone
  orange:       "var(--color-card-fg-dark)",
  purple:       "#FFFFFF",
  teal:         "var(--color-card-fg-dark)",
  green:        "var(--color-card-fg-dark)",
  // Mac mids
  "mac-red":    "#FFFFFF",
  "mac-yellow": "var(--color-card-fg-dark)",
  "mac-green":  "var(--color-card-fg-dark)",
  // Neutrals
  white:        "var(--color-card-fg-dark)",
  black:        "#FFFFFF",
  graphite:     "#FFFFFF",
  gray:         "var(--color-card-fg-dark)",
};

/**
 * Foreground (text) color that reads on each card background.
 * Light backgrounds get near-black text; dark backgrounds get
 * white. Picked once per accent so contrast pairing can't drift.
 */
export const CARD_TEXT_CLASS: Record<CardAccent, string> = {
  // Brand
  accent:       "text-[var(--color-card-fg-dark)]",  // dark on Mantle gold
  "accent-alt": "text-white",                         // white on deep purple
  // Named single-tone
  orange:       "text-[var(--color-card-fg-dark)]",  // dark on light gold
  purple:       "text-white",                         // white on mid-purple
  teal:         "text-[var(--color-card-fg-dark)]",  // dark on cyan
  green:        "text-[var(--color-card-fg-dark)]",  // dark on electric lime
  // Mac mids
  "mac-red":    "text-white",                         // white on red
  "mac-yellow": "text-[var(--color-card-fg-dark)]",  // dark on yellow
  "mac-green":  "text-[var(--color-card-fg-dark)]",  // dark on spring green
  // Neutrals
  white:        "text-[var(--color-card-fg-dark)]",  // dark on white
  black:        "text-white",                         // white on near-black
  graphite:     "text-white",                         // white on deep teal-grey
  gray:         "text-[var(--color-card-fg-dark)]",  // dark on soft grey
};

/**
 * Unified pill recipe — the single source of truth for any small
 * label-style chip rendered on a colored card surface.
 *
 * Used by:
 *   • "Works with" tag pills inside workflow + template card blocks
 *   • Tag pills on insight + answer cards
 *   • "Coming Soon" badge on manual covers
 *   • Any future pill rendered on a colored Compass card
 *
 * Two variants:
 *   • `PILL_CLASS.light`  — dark text + dark hairline on light-alpha bg.
 *                           For cards whose body text is dark (accent,
 *                           orange, teal, green, mac-yellow, white,
 *                           gray).
 *   • `PILL_CLASS.dark`   — white text + light hairline on white-alpha bg.
 *                           For cards whose body text is white
 *                           (accent-alt, purple, mac-red, black,
 *                           graphite).
 *
 * The `CARD_PILL_CLASS` map below maps each accent to its correct
 * variant so callers don't have to think about it. Just write
 * `className={CARD_PILL_CLASS[accent]}`.
 */
export const PILL_CLASS = {
  light: "border border-black/15 bg-black/5 text-[var(--color-card-fg-dark)]",
  /* `dark` is the white-text recipe. Border + backplate opacities
     are slightly stronger than a naive `bg-white/10` so the pill
     stays readable on the brightest covers (accent, orange, teal,
     mac-yellow) where a 10%-white plate would wash into the cover
     color. 25% / 15% keeps the pill visible on every cover in the
     palette while still reading as a translucent label, not a solid
     chip. */
  dark:  "border border-white/25 bg-white/15 text-white",
} as const;

/**
 * Canonical "article card label" box recipe — the SHAPE every
 * Compass card pill shares: rounded-md (6px), px-2, py-0.5, text-xxs
 * (10px), font-medium. Mix-in the tone from `PILL_CLASS` /
 * `CARD_PILL_CLASS` / a bespoke `border + bg + text` triple
 * depending on the surface (dark page / colored cover / etc.).
 *
 * Padding tightened from `px-2.5 py-1` to `px-2 py-0.5` so the pill
 * reads as a compact label, not a button — every pill across
 * Compass (insight tag, workflow/template tag pill, Mantle pill in
 * the meta card, "Coming soon" badge) shares this footprint so
 * scale + radius can't drift between surfaces.
 *
 * Used by every article-card label across Compass. Before this
 * constant existed each call-site rebuilt the recipe by hand and
 * they drifted (font-mono 10px tracked vs sans 12.5px regular).
 * One source of truth here keeps them in lockstep.
 */
export const CARD_LABEL_BOX_CLASS =
  "inline-flex items-center rounded-md px-2 py-0.5 text-xxs font-medium";

/**
 * "Coming soon" pill — full recipe, pre-mixed for use on the dark
 * page surface (manual row list).
 */
export const COMING_SOON_LABEL_CLASS =
  `${CARD_LABEL_BOX_CLASS} border border-edge-high/60 bg-surface-high text-fg-high`;

/**
 * "Coming soon" pill — variant for use ON a colored manual cover
 * (poster grid). White-alpha treatment that reads on every cover
 * color without a bg fill that would clash with the cover color.
 */
export const COMING_SOON_LABEL_ON_COVER_CLASS =
  `${CARD_LABEL_BOX_CLASS} ${PILL_CLASS.dark}`;

export const CARD_PILL_CLASS: Record<CardAccent, string> = {
  // Brand
  accent:       PILL_CLASS.light,
  "accent-alt": PILL_CLASS.dark,
  // Named single-tone
  orange:       PILL_CLASS.light,
  purple:       PILL_CLASS.dark,
  teal:         PILL_CLASS.light,
  green:        PILL_CLASS.light,
  // Mac mids
  "mac-red":    PILL_CLASS.dark,
  "mac-yellow": PILL_CLASS.light,
  "mac-green":  PILL_CLASS.light,
  // Neutrals
  white:        PILL_CLASS.light,
  black:        PILL_CLASS.dark,
  graphite:     PILL_CLASS.dark,
  gray:         PILL_CLASS.light,
};

/**
 * Scoped CSS-variable class — sets `--cover-accent` on the card
 * container to the chapter's accent color. Used by
 * `ManualCoverGrid` + `ManualRowList` so the inline `<CoverArt>`
 * SVG inherits the accent via `text-[color:var(--cover-accent)]`
 * (the SVG uses `currentColor`).
 *
 * Source of truth is still the same Mantle canonical tokens above —
 * this just exposes the color as a scoped variable for the SVG
 * paths to read.
 */
export const CARD_ACCENT_VAR_CLASS: Record<CardAccent, string> = {
  // Brand
  accent:       "[--cover-accent:var(--color-accent)]",
  "accent-alt": "[--cover-accent:var(--color-accent-alt-medium)]",
  // Named single-tone
  orange:       "[--cover-accent:var(--color-orange-high)]",
  purple:       "[--cover-accent:var(--color-purple-high)]",
  teal:         "[--cover-accent:var(--color-teal-high)]",
  green:        "[--cover-accent:var(--color-green-high)]",
  // Mac mids
  "mac-red":    "[--cover-accent:var(--color-mac-red)]",
  "mac-yellow": "[--cover-accent:var(--color-mac-yellow)]",
  "mac-green":  "[--cover-accent:var(--color-mac-green)]",
  // Neutrals
  white:        "[--cover-accent:var(--color-fg-high)]",
  black:        "[--cover-accent:var(--color-surface-highest)]",
  graphite:     "[--cover-accent:#2A606B]",
  gray:         "[--cover-accent:#d8d8d6]",
};

/** Backwards-compat alias — older code used `CARD_TAG_CLASS`. */
export const CARD_TAG_CLASS = CARD_PILL_CLASS;

/**
 * Raw CSS value for each accent — same color the `CARD_BG_CLASS`
 * Tailwind class resolves to, returned as a plain `var(--color-…)`
 * (or raw hex for the two Compass-bespoke neutrals) so callers can
 * pass it to `style={{ backgroundColor }}`, set a custom CSS
 * variable (`--manual-accent: …`), or feed it into a `color-mix()`
 * expression.
 *
 * Use this when a Tailwind class can't reach the property you need
 * (custom var defs, JSON-LD output, inline `<style>` blocks, etc.).
 * For straightforward backgrounds prefer `CARD_BG_CLASS` so the
 * class scanner has a single home for the values.
 */
export const CARD_ACCENT_VALUE: Record<CardAccent, string> = {
  // Brand
  accent:       "var(--color-accent)",            // #FFBB53 — Mantle Official plate
  "accent-alt": "var(--color-accent-alt-medium)", // #6637FF
  // Named single-tone
  orange:       "var(--color-orange-high)",       // #FFC66E
  purple:       "var(--color-purple-high)",       // #9676FF
  teal:         "var(--color-teal-high)",         // #76E8FF
  green:        "var(--color-green-high)",        // #98FF76
  // Mac mids
  "mac-red":    "var(--color-mac-red)",           // #EE5249
  "mac-yellow": "var(--color-mac-yellow)",        // #EFC62A
  "mac-green":  "var(--color-mac-green)",         // #5CD055
  // Neutrals
  white:        "var(--color-fg-high)",           // #FFFFFF
  black:        "var(--color-surface-highest)",   // #1E1C23
  graphite:     "#2A606B",                        // Compass-bespoke
  gray:         "#d8d8d6",                        // Compass-bespoke
};

/**
 * Card-grid accent rotation — when a grid renders many cards with
 * the same or no `blockColor` in frontmatter, the cards read as a
 * monochromatic wall. This rotation cycles through seven visually
 * distinct accents (orange → purple → teal → mac-green → mac-yellow
 * → mac-red → gray) by grid index so the grid feels alive without
 * authors having to set a per-card color.
 *
 * Order alternates warm/cool/warm so adjacent cards in the grid
 * never share a hue family. `accent` is intentionally NOT in the
 * rotation — it's reserved for Mantle Official cards so the brand
 * gold plate stays a deliberate signal, not visual noise.
 *
 * Frontmatter `blockColor` still wins when explicitly set —
 * `resolveCardAccent(meta.blockColor, i)` returns the explicit
 * value if present, otherwise falls back to the rotation.
 */
export const GRID_ACCENT_ROTATION: CardAccent[] = [
  "orange",
  "purple",
  "teal",
  "mac-green",
  "mac-yellow",
  "mac-red",
  "gray",
];

/** Pick the accent for a card at grid position `index`. If the card
 *  declares `blockColor` in its frontmatter that wins; otherwise the
 *  rotation gives the grid an alternating-colour rhythm. */
export function resolveCardAccent(
  blockColor: CardAccent | undefined,
  index: number,
): CardAccent {
  if (blockColor) return blockColor;
  return GRID_ACCENT_ROTATION[index % GRID_ACCENT_ROTATION.length];
}

/**
 * Default accent when MDX frontmatter doesn't specify one.
 * `orange` (the light warm gold) is the default for non-Mantle-
 * Official cards; `accent` is reserved for the Mantle Official
 * plate.
 */
export const DEFAULT_CARD_ACCENT: CardAccent = "orange";
