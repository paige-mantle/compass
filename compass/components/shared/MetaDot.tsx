/**
 * `<MetaDot />` — canonical dot separator for editorial metadata
 * rows across Compass.
 *
 * Used between tokens in:
 *   • Card meta lines (author · date) on insight / workflow /
 *     template / answer card grids
 *   • Detail-hero byline ("By Author · Updated DATE")
 *   • DotList rows in the meta card (Works with / Systems / Tags)
 *
 * Treatment:
 *   • Character: `·` (U+00B7 middle dot) — same glyph the previous
 *     inline spans used so the visual register doesn't change
 *     beyond the bump in scale.
 *   • Size: `text-base` (16px). A half-step larger than the
 *     surrounding metadata text (`text-sm` = 14px) so the dot
 *     reads as a deliberate separator rather than a stray
 *     punctuation glyph. Requested "a little bit bigger" — this is
 *     that half-step.
 *   • Color: `text-fg-lower` (quietest fg tier) so the dot punctuates
 *     without competing with the surrounding tokens.
 *   • Spacing: `mx-1.5` (6px) on each side — keeps the meta line
 *     compact. The detail-hero Byline previously used `mx-2`; the
 *     half-step bump tightens to `mx-1.5` so the bigger glyph
 *     doesn't push the line wider overall.
 *   • Alignment: `align-middle` + `leading-none` so the larger glyph
 *     sits visually centered on the surrounding text's x-height
 *     rather than dropping to the baseline.
 *   • `aria-hidden` so screen readers don't announce the glyph as
 *     content. The surrounding tokens carry the semantic meaning.
 *
 * Source of truth: when this recipe changes, every meta row across
 * Compass picks up the new value automatically. Before this
 * component existed each call-site rendered a bespoke
 * `<span aria-hidden>·</span>`, and the dot drift problem (some
 * surfaces at 14px, others 16px, some at fg-low, others at
 * fg-lower) showed up immediately.
 */
export function MetaDot() {
  return (
    <span
      aria-hidden="true"
      className="mx-1.5 inline-block align-middle text-base leading-none text-fg-lower"
    >
      ·
    </span>
  );
}
