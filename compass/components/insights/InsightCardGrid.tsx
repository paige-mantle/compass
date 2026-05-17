import Link from "next/link";
import type { InsightMeta } from "../../lib/insights/content";
import { CARD_LABEL_BOX_CLASS } from "../../lib/card-accents";
import { formatShortDate, truncateSentences } from "../../lib/format-date";

/**
 * Insight card grid — listing surface for `/blog`.
 *
 * Recipe redesigned to match the editorial card spec (transparent
 * plate + hairline border, no colored hero block):
 *
 *   • Outer card — `bg-transparent` + `border border-edge-medium`
 *     (hover steps to `border-edge-high`). The card reads as a
 *     framed editorial unit on the page surface; no per-card hero
 *     plate competing with the article content.
 *   • Body — `font-heading` title at the top, 2-sentence excerpt
 *     beneath, then a bottom meta row pinned to the card bottom.
 *   • Meta row — pill on the left (canonical
 *     `CARD_LABEL_BOX_CLASS` shape, dark-surface tone), date on
 *     the right (mono uppercase eyebrow at `--color-fg-low`).
 *
 * Excerpts are clamped to two sentences via `truncateSentences`.
 * Dates render as `MAY 13, 2026` via the existing date helper
 * (the mono uppercase recipe carries that case naturally).
 */
export function InsightCardGrid({ insights }: { insights: InsightMeta[] }) {
  return (
    <section
      aria-label="Insights"
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {insights.map((i) => (
        <InsightCard key={i.slug} insight={i} />
      ))}
    </section>
  );
}

function InsightCard({ insight }: { insight: InsightMeta }) {
  const excerpt = truncateSentences(insight.summary, 2);
  const shortDate = formatShortDate(insight.date);
  return (
    <Link
      href={`/blog/${insight.slug}`}
      className="
        group flex flex-col gap-4
        rounded-xl border border-edge-medium
        bg-transparent
        p-6
        no-underline text-fg-high
        transition-[border-color,transform] duration-200 ease-out
        hover:border-edge-high hover:-translate-y-[2px]
      "
    >
      <h3 className="m-0 font-heading text-2xl md:text-3xl font-medium leading-[1.15] tracking-tight text-fg-high">
        {insight.title}
      </h3>
      {excerpt ? (
        <p className="m-0 font-sans text-base leading-[1.5] text-fg-medium line-clamp-3">
          {excerpt}
        </p>
      ) : null}
      {/* Bottom meta row — pinned to the card bottom via `mt-auto`
          so cards in the same row align even when the excerpt is
          1 vs 3 lines. Pill (left) uses the canonical
          `CARD_LABEL_BOX_CLASS` shape + a dark-on-darker tone
          (`bg-surface-high text-fg-high` with the same hairline
          recipe used on other dark-page card pills). Date (right)
          is the mono uppercase eyebrow recipe — `formatShortDate`
          already renders "MAY 13, 2026" friendly. */}
      <div className="mt-auto flex items-center justify-between gap-3">
        {insight.ribbon ? (
          <span
            className={`${CARD_LABEL_BOX_CLASS} border border-edge-high/60 bg-surface-high text-fg-high`}
          >
            {insight.ribbon}
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
        {shortDate ? (
          <time className="font-mono text-xxs uppercase tracking-wider text-fg-low">
            {shortDate.toUpperCase()}
          </time>
        ) : null}
      </div>
    </Link>
  );
}
