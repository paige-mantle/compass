import Link from "next/link";
import type { InsightMeta } from "../../lib/insights/content";

/**
 * Insight card grid — listing surface for `/compass/insights`.
 *
 * Same shape as `TemplateCardGrid` / `MethodCardGrid` but without
 * the `blockColor` variant — insight cards all use a neutral dark
 * surface (`--color-surface-higher`) with a subtle accent glow.
 * Title sits at top, ribbon tag bottom, then summary + date below.
 */
export function InsightCardGrid({ insights }: { insights: InsightMeta[] }) {
  return (
    <section
      aria-label="Insights"
      className="grid grid-cols-1 gap-8 pb-20 sm:grid-cols-2 lg:grid-cols-3"
    >
      {insights.map((i) => (
        <InsightCard key={i.slug} insight={i} />
      ))}
    </section>
  );
}

function InsightCard({ insight }: { insight: InsightMeta }) {
  return (
    <Link
      href={`/compass/insights/${insight.slug}`}
      className="group flex flex-col gap-4 no-underline text-fg-high"
    >
      <div
        className={[
          "relative aspect-[16/9] overflow-hidden rounded-xl",
          "flex flex-col justify-between p-7",
          "transition-transform duration-200 ease-out",
          "group-hover:-translate-y-[3px]",
          "bg-[var(--color-surface-higher)] text-fg-high",
        ].join(" ")}
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(255,187,83,0.10), transparent 55%), radial-gradient(circle at 75% 75%, rgba(150,118,255,0.18), transparent 55%)",
        }}
      >
        <h3 className="m-0 font-heading text-[28px] font-medium leading-[1.1] tracking-tight text-fg-high">
          {insight.title}
        </h3>
        {insight.ribbon ? (
          <div className="flex flex-wrap gap-2">
            {/* Tag pill — same recipe as the "Works with" tags on
                method/template detail pages. */}
            <span className="inline-flex items-center rounded-md border border-edge-high/60 bg-surface-high px-2.5 py-1 text-[12.5px] font-medium text-fg-high">
              {insight.ribbon}
            </span>
          </div>
        ) : null}
      </div>

      {insight.summary ? (
        <p className="m-0 max-w-[44ch] font-sans text-base leading-[1.45] text-fg-medium">
          {insight.summary}
        </p>
      ) : null}

      {insight.date ? (
        <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-fg-low">
          <span>Added</span>
          <time>{insight.date}</time>
        </div>
      ) : null}
    </Link>
  );
}
