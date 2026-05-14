/**
 * Compass card accent palette — single source of truth.
 *
 * Every Compass card surface (Method blocks, Template blocks, and the
 * accent slot on manual covers) draws from this one palette. Before
 * this file existed the palette was duplicated across
 * `MethodCardGrid.tsx` + `TemplateCardGrid.tsx` with different names
 * AND different color values from the manual covers
 * (manual-cover-"orange" = #FFC66E, method-"orange" = #EE5249 — same
 * word, completely different color). That's now collapsed.
 *
 * Names match the manual cover accents (`gold / cyan / lilac / warm /
 * red / white`) where the cards can adopt the bright Mantle accent
 * palette, plus three darker neutrals (`black / graphite / gray`)
 * for cards that need a dark base surface instead of a bright fill.
 *
 * Color tokens resolve through the canonical Mantle palette in
 * `app/globals.css` `@theme` so a change at the source propagates
 * here automatically. Hardcoded hex values are only used for two
 * card-specific shades (`graphite`, `gray`) that don't exist in the
 * canonical palette.
 */

export type CardAccent =
  | "gold"
  | "cyan"
  | "lilac"
  | "warm"
  | "red"
  | "white"
  | "black"
  | "graphite"
  | "gray";

/**
 * Background color (the block fill behind a card's title).
 * Methods + Templates render their title inside a 16:9 colored block
 * with this background. Each value is a Tailwind arbitrary class so
 * the token name is visible inline at the call site.
 */
export const CARD_BG_CLASS: Record<CardAccent, string> = {
  gold:     "bg-[var(--cover-accent-gold)]",       // #FFC66E — warm gold
  cyan:     "bg-[var(--cover-accent-cyan)]",       // #76E8FF — bright cyan
  lilac:    "bg-[var(--cover-accent-lilac)]",      // #9676FF — purple
  warm:     "bg-[var(--cover-accent-warm)]",       // #EFC62A — deep golden-yellow
  red:      "bg-[var(--color-mac-red)]",           // #EE5249 — bright red (was method "orange")
  white:    "bg-[var(--cover-accent-white)]",      // #FFFFFF — pure white
  black:    "bg-[var(--color-surface-highest)]",   // #1E1C23 — Mantle dark surface
  graphite: "bg-[#2A606B]",                        // deep teal-grey (card-specific shade)
  gray:     "bg-[#d8d8d6]",                        // soft warm grey
};

/**
 * Foreground (text) color that reads on each card background.
 * Light backgrounds get near-black text; dark backgrounds get white.
 * Picked once per accent so the contrast pairing can't drift.
 */
export const CARD_TEXT_CLASS: Record<CardAccent, string> = {
  gold:     "text-[#0a0810]",   // dark on light gold
  cyan:     "text-[#0a0810]",   // dark on cyan
  lilac:    "text-white",       // white on lilac (mid-dark purple)
  warm:     "text-[#0a0810]",   // dark on yellow
  red:      "text-white",       // white on red
  white:    "text-[#0a0810]",   // dark on white
  black:    "text-white",       // white on dark
  graphite: "text-white",       // white on deep teal-grey
  gray:     "text-[#0a0810]",   // dark on soft grey
};

/**
 * Tag pill classes for the inline "Works with" tags inside the
 * colored block. Adapts: dark backgrounds get a white-tinted pill,
 * light backgrounds get a dark-tinted pill. Same recipe as the
 * "Works with" tags on method/template detail pages (rounded-md,
 * px-2.5 py-1, text-[12.5px] font-medium, 1px border).
 */
export const CARD_TAG_CLASS: Record<CardAccent, string> = {
  // Light backgrounds → dark-tinted pill
  gold:     "border border-black/15 bg-black/5 text-[#0a0810]",
  cyan:     "border border-black/15 bg-black/5 text-[#0a0810]",
  warm:     "border border-black/15 bg-black/5 text-[#0a0810]",
  white:    "border border-black/15 bg-black/5 text-[#0a0810]",
  gray:     "border border-black/15 bg-black/5 text-[#0a0810]",
  // Dark backgrounds → light-tinted pill
  lilac:    "border border-white/20 bg-white/10 text-white",
  red:      "border border-white/20 bg-white/10 text-white",
  black:    "border border-white/20 bg-white/10 text-white",
  graphite: "border border-white/20 bg-white/10 text-white",
};

/**
 * Default accent when MDX frontmatter doesn't specify one. Picked
 * because it's the canonical Mantle gold and reads well against the
 * standard dark page surface.
 */
export const DEFAULT_CARD_ACCENT: CardAccent = "gold";
