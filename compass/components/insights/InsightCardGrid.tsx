import Link from "next/link";
import type { InsightMeta } from "../../lib/insights/content";
import { CARD_LABEL_BOX_CLASS } from "../../lib/card-accents";
import { formatShortDate, truncateSentences } from "../../lib/format-date";
import { MetaDot } from "../shared/MetaDot";

/**
 * Insight card grid — listing surface for `/blog`.
 *
 * Layout standardised with `WorkflowCardGrid` + `TemplateCardGrid`:
 * each card has a hero block (16:9) at top with title + tag, then a
 * body block below with the excerpt + meta row (author · date).
 * Insight cards keep the dark warm-glow hero (insights don't carry
 * per-card accent colors) but otherwise share the recipe so the
 * three listing grids feel like one family of cards.
 *
 * Excerpts on the listing are clamped to two sentences via
 * `truncateSentences` so a long authored `summary` doesn't blow up
 * a card's height. Dates render in short-form ("MAR 3 24") via
 * `formatShortDate`. Author name comes from frontmatter and is
 * always shown when set — readers want a byline at first glance.
 */
export function InsightCardGrid({ insights }: { insights: InsightMeta[] }) {
  return (
    <section
      aria-label="Insights"
      /* Trailing `pb` removed — was `pb-20`, which stacked an 80px
         gap above the MantleFooter gradient transition on every
         listing surface. Pages own their own bottom rhythm now via
         the closing section / footer-transition combo. */
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
        group flex flex-col no-underline text-fg-high
        rounded-xl overflow-hidden
        border border-edge-medium hover:border-edge-high
        transition-colors duration-200
      "
    >
      {/* Hero block — edge-to-edge inside the framed card.
          `rounded-xl` is stripped from the inner since the outer
          `overflow-hidden` already clips to the card's radius. */}
      <div
        className={[
          "relative aspect-[16/9]",
          "flex flex-col justify-between p-7",
          "bg-[var(--color-surface-higher)] text-fg-high",
        ].join(" ")}
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(255,187,83,0.10), transparent 55%), radial-gradient(circle at 75% 75%, rgba(150,118,255,0.18), transparent 55%)",
        }}
      >
        <h3 className="m-0 font-heading text-3xl font-medium leading-[1.1] tracking-tight text-fg-high">
          {insight.title}
        </h3>
        {insight.ribbon ? (
          <div className="flex flex-wrap gap-2">
            {/* Insight tag — canonical card-label box recipe + the
                dark-surface tone (hairline + surface-high bg + high
                ink). Same recipe shared with every other card pill
                across Compass. Frontmatter `ribbon` doubles as the
                tag — insights only ship one tag per piece. */}
            <span
              className={`${CARD_LABEL_BOX_CLASS} border border-edge-high/60 bg-surface-high text-fg-high`}
            >
              {insight.ribbon}
            </span>
          </div>
        ) : null}
      </div>

      {/* Card body — excerpt + author/date meta. Padding matches the
          workflow + template grids (`p-5`) so the three listing
          surfaces share the same gutter rhythm. `line-clamp-2` on
          the excerpt caps any leftover overflow at two visual lines
          so a too-long authored `summary` can't blow up card height
          even if `truncateSentences` missed it. */}
      <div className="flex flex-col gap-3 p-5">
        {excerpt ? (
          <p className="m-0 max-w-[44ch] font-sans text-base leading-[1.45] text-fg-medium line-clamp-2">
            {excerpt}
          </p>
        ) : null}

        {/* Meta row — author + date on a single sans-serif line.
            Separator dot ("·") sits between the two tokens; renders
            only when both are present so a missing author doesn't
            leave an orphan dot before the date. Sans-serif +
            case-preserved so the canonical "May 13, 2026" date
            format reads correctly. Was uppercase mono — forced
            "MANTLE TEAM · MAY 13, 2026", which felt over-loud once
            the date stopped being a compact code. */}
        {(insight.author || shortDate) ? (
          <div className="flex items-center font-sans text-sm text-fg-low">
            {insight.author ? <span>{insight.author}</span> : null}
            {insight.author && shortDate ? <MetaDot /> : null}
            {shortDate ? <time>{shortDate}</time> : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
