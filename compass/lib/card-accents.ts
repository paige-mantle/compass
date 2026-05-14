/**
 * Compass card accent palette — single source of truth.
 *
 * Every Compass card surface — manual covers, method blocks,
 * template blocks — draws from this one palette. The palette is
 * sourced from Mantle canonical `--color-*` tokens defined in
 * `app/globals.css` `@theme`, so the same hex appears nowhere else
 * in code. Two Compass-specific shades (`graphite`, `gray`) are
 * hardcoded because they don't exist in the canonical Mantle
 * palette — they're declared inline below.
 *
 * Palette:
 *   • gold        — #FFC66E (--color-accent-high)      Mantle warm gold
 *   • cyan        — #76E8FF (--color-teal-high)        Mantle bright cyan
 *   • lilac       — #9676FF (--color-purple-high)      Mantle mid-purple
 *   • warm        — #EFC62A (--color-mac-yellow)       Mantle deep yellow
 *   • red         — #EE5249 (--color-mac-red)          Mantle bright red
 *   • green       — #5CD055 (--color-mac-green)        Mantle spring green
 *   • lime        — #98FF76 (--color-green-high)       Mantle electric lime
 *   • deepPurple  — #6637FF (--color-accent-alt-medium) saturated purple
 *   • white       — #FFFFFF (--color-fg-high)          pure white
 *   • black       — #1E1C23 (--color-surface-highest)  Mantle dark surface
 *   • graphite    — #2A606B                            Compass-specific
 *   • gray        — #d8d8d6                            Compass-specific
 *
 * Two manual-cover accents that previously duplicated other slots
 * have been remapped to keep each of the 7 manuals visually
 * distinct: Monetize → red (was "orange" = #FFC66E, same as gold);
 * Grow → green (was "cyan", same as Build).
 */

export type CardAccent =
  | "gold"
  | "cyan"
  | "lilac"
  | "warm"
  | "red"
  | "green"
  | "lime"
  | "deepPurple"
  | "white"
  | "black"
  | "graphite"
  | "gray";

/**
 * Background color (the block fill behind a card's title).
 * Method + Template cards render the title inside a 16:9 colored
 * block with this background. Each value is a Tailwind arbitrary
 * class pointing at a Mantle canonical token so the source of
 * truth is `app/globals.css` `@theme`.
 */
export const CARD_BG_CLASS: Record<CardAccent, string> = {
  gold:       "bg-[var(--color-accent-high)]",        // #FFC66E
  cyan:       "bg-[var(--color-teal-high)]",          // #76E8FF
  lilac:      "bg-[var(--color-purple-high)]",        // #9676FF
  warm:       "bg-[var(--color-mac-yellow)]",         // #EFC62A
  red:        "bg-[var(--color-mac-red)]",            // #EE5249
  green:      "bg-[var(--color-mac-green)]",          // #5CD055
  lime:       "bg-[var(--color-green-high)]",         // #98FF76
  deepPurple: "bg-[var(--color-accent-alt-medium)]",  // #6637FF
  white:      "bg-[var(--color-fg-high)]",            // #FFFFFF (white on dark theme)
  black:      "bg-[var(--color-surface-highest)]",    // #1E1C23
  graphite:   "bg-[#2A606B]",                         // Compass-specific
  gray:       "bg-[#d8d8d6]",                         // Compass-specific
};

/**
 * Foreground (text) color that reads on each card background.
 * Light backgrounds get near-black text; dark backgrounds get
 * white. Picked once per accent so contrast pairing can't drift.
 */
export const CARD_TEXT_CLASS: Record<CardAccent, string> = {
  gold:       "text-[#0a0810]",   // dark on warm gold
  cyan:       "text-[#0a0810]",   // dark on cyan
  lilac:      "text-white",       // white on mid-purple
  warm:       "text-[#0a0810]",   // dark on yellow
  red:        "text-white",       // white on red
  green:      "text-[#0a0810]",   // dark on spring green
  lime:       "text-[#0a0810]",   // dark on electric lime
  deepPurple: "text-white",       // white on deep purple
  white:      "text-[#0a0810]",   // dark on white
  black:      "text-white",       // white on dark surface
  graphite:   "text-white",       // white on deep teal-grey
  gray:       "text-[#0a0810]",   // dark on soft grey
};

/**
 * Unified pill recipe — the single source of truth for any small
 * label-style chip rendered on a colored card surface.
 *
 * Used by:
 *   • "Works with" tag pills inside method + template card blocks
 *   • Tag pills on insight + answer cards
 *   • "Coming Soon" badge on manual covers
 *   • Any future pill rendered on a colored Compass card
 *
 * Two variants:
 *   • `PILL_CLASS.light`  — dark text + dark hairline on light-alpha bg.
 *                           For cards whose body text is dark
 *                           (gold / cyan / warm / white / gray / green / lime).
 *   • `PILL_CLASS.dark`   — white text + light hairline on white-alpha bg.
 *                           For cards whose body text is white
 *                           (lilac / red / black / graphite / deepPurple).
 *
 * The `CARD_PILL_CLASS` map below maps each accent to its correct
 * variant so callers don't have to think about it. Just write
 * `className={CARD_PILL_CLASS[accent]}`.
 */
export const PILL_CLASS = {
  light: "border border-black/15 bg-black/5 text-[#0a0810]",
  dark:  "border border-white/20 bg-white/10 text-white",
} as const;

export const CARD_PILL_CLASS: Record<CardAccent, string> = {
  gold:       PILL_CLASS.light,
  cyan:       PILL_CLASS.light,
  lilac:      PILL_CLASS.dark,
  warm:       PILL_CLASS.light,
  red:        PILL_CLASS.dark,
  green:      PILL_CLASS.light,
  lime:       PILL_CLASS.light,
  deepPurple: PILL_CLASS.dark,
  white:      PILL_CLASS.light,
  black:      PILL_CLASS.dark,
  graphite:   PILL_CLASS.dark,
  gray:       PILL_CLASS.light,
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
  gold:       "[--cover-accent:var(--color-accent-high)]",
  cyan:       "[--cover-accent:var(--color-teal-high)]",
  lilac:      "[--cover-accent:var(--color-purple-high)]",
  warm:       "[--cover-accent:var(--color-mac-yellow)]",
  red:        "[--cover-accent:var(--color-mac-red)]",
  green:      "[--cover-accent:var(--color-mac-green)]",
  lime:       "[--cover-accent:var(--color-green-high)]",
  deepPurple: "[--cover-accent:var(--color-accent-alt-medium)]",
  white:      "[--cover-accent:var(--color-fg-high)]",
  black:      "[--cover-accent:var(--color-surface-highest)]",
  graphite:   "[--cover-accent:#2A606B]",
  gray:       "[--cover-accent:#d8d8d6]",
};

/** Backwards-compat alias — older code used `CARD_TAG_CLASS`. */
export const CARD_TAG_CLASS = CARD_PILL_CLASS;

/**
 * Default accent when MDX frontmatter doesn't specify one.
 * The canonical Mantle gold reads well on the standard dark page
 * surface.
 */
export const DEFAULT_CARD_ACCENT: CardAccent = "gold";
