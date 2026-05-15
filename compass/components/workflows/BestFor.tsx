import { MetaDot } from "../shared/MetaDot";

/**
 * `<BestFor>` — dot-separated line of audiences / use-cases that
 * sits beneath the canonical "Best for" section heading on workflow
 * and template detail pages.
 *
 * Replaces the previous unordered list ("• Shopify app teams • …")
 * with a single editorial line of text. The bullets read as
 * checklist noise in the right column when the body copy is
 * already itself a scannable list of sections; the dot-separated
 * line keeps the same scannability at half the vertical footprint
 * and pairs with the canonical Compass meta-row recipe used in
 * card grids and detail-hero bylines.
 *
 * MDX:
 *
 *   ## Best for
 *
 *   <BestFor items={["Shopify app teams", "Lifecycle marketing"]} />
 *
 * Sourced from the same `<MetaDot />` recipe so every dot separator
 * across Compass — card meta, byline, DotList rows, this row —
 * renders at one shape, size, and color.
 */
export function BestFor({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <p className="m-0 font-sans text-base leading-snug text-fg-medium not-prose">
      {items.map((item, i) => (
        <span key={item}>
          {i > 0 ? <MetaDot /> : null}
          <span>{item}</span>
        </span>
      ))}
    </p>
  );
}
