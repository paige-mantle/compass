/**
 * Canonical Compass `<h1>` recipes.
 *
 * Two recipes share every typography token *except* the size ramp.
 * Both resolve through canonical Compass tokens so the typography
 * never drifts when one surface is edited.
 *
 *   `COMPASS_H1_CLASS`         → marketing-hero scale (`CompassHero`).
 *                                `text-5xl md:text-7xl` — the largest
 *                                display ramp Compass ships.
 *   `COMPASS_H1_COMPACT_CLASS` → listing + detail hero scale
 *                                (`CompassIndexHero` — used on
 *                                `/compass`, `/manuals`, `/workflows`,
 *                                `/templates`, `/blog`). Bumped one
 *                                Tailwind step UP to
 *                                `text-5xl md:text-7xl` so the
 *                                `/compass` H1 reads at full display
 *                                weight again. The "compact" name
 *                                is retained for API stability —
 *                                callers don't need to change to pick
 *                                up the new size. The recipe is
 *                                currently identical to
 *                                `COMPASS_H1_CLASS`; if listings need
 *                                to drop back down to `text-4xl
 *                                md:text-6xl` later, only this line
 *                                changes.
 *
 * Shared recipe (both variants):
 *   font-heading        Manrope (the brand display face)
 *   font-normal         400 weight — editorial, not bold
 *   text-left           left-aligned headline (no centred variants)
 *   text-fg-high        canonical heading ink
 *   tracking-tight      tightened letter-spacing for a display feel
 *   leading-tighter     compact line height for the giant scale
 *
 * Margin-reset (`m-0`) is intentionally NOT part of either recipe —
 * each caller controls outer spacing through its own layout.
 */
const SHARED =
  "font-heading font-normal text-left text-fg-high tracking-tight leading-tighter";

export const COMPASS_H1_CLASS = `${SHARED} text-5xl md:text-7xl`;
export const COMPASS_H1_COMPACT_CLASS = `${SHARED} text-5xl md:text-7xl`;
