/**
 * Canonical Compass "pixel label" recipe.
 *
 * Every uppercase mono eyebrow / kicker / breadcrumb across Compass
 * shares this class string so the type drift problem ("which size
 * is the eyebrow on this surface?") can't come back. One recipe,
 * fed by canonical scale tokens:
 *
 *   font-mono              Geist Mono (the "Geist Pixel" face)
 *   text-xs                14px in the Compass scale (`--text-xs`)
 *   font-medium            500 weight — gives the label visual heft
 *                          without breaking the editorial register
 *   uppercase              all-caps display treatment
 *   tracking-wider         0.05em letter-spacing — Mantle eyebrow
 *                          ramp
 *   leading-loose          1.5 line-height — matches the
 *                          PromptHeading recipe in the marketing
 *                          system so eyebrows in Compass + Mantle
 *                          share the same line box
 *
 * Color is intentionally NOT part of the recipe. Callers pick the
 * right color class for their surface:
 *
 *   text-fg-low     — quiet card chrome ("Added MAY 14, 2026")
 *   text-fg-medium  — manual chapter / cover kickers
 *   text-accent     — gold breadcrumbs / hero eyebrows
 *   text-accent-high— verified-badge eyebrow
 *
 * Surface-specific overrides (line-height bumped to `leading-none`
 * for baseline-aligned kickers, or `text-fg-lower` for a quieter
 * tier) are appended at the call site as needed — the constant
 * sets the floor, callers tune from there.
 */
export const COMPASS_PIXEL_LABEL_CLASS =
  "font-mono text-xs font-medium uppercase tracking-wider leading-loose";
