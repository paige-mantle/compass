import Link from "next/link";
import type { TemplateMeta } from "../../lib/templates/content";
import {
  CARD_BG_CLASS,
  CARD_TEXT_CLASS,
  CARD_TEXT_COLOR,
  CARD_TAG_CLASS,
  CARD_LABEL_BOX_CLASS,
  resolveCardAccent,
} from "../../lib/card-accents";
import { formatShortDate, truncateSentences } from "../../lib/format-date";
import { MetaDot } from "../shared/MetaDot";

/**
 * Template card grid — listing surface for `/templates`.
 *
 * Shares the recipe byte-for-byte with `WorkflowCardGrid`: 16:9
 * colored block with a subtle dot-grid texture, title at the top,
 * tag pills at the bottom, then description + "Added <date>" line
 * below the block. The two grids are paired on purpose — if you
 * change one, change the other.
 *
 * Accent palette is unified with manual covers via
 * `compass/lib/card-accents.ts` — same names, same color values.
 */
export function TemplateCardGrid({ templates }: { templates: TemplateMeta[] }) {
  return (
    <section
      aria-label="Templates"
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {templates.map((t, i) => (
        <TemplateCard key={t.slug} template={t} index={i} />
      ))}
    </section>
  );
}

function TemplateCard({ template, index }: { template: TemplateMeta; index: number }) {
  /* Frontmatter `blockColor` wins when explicitly set; otherwise
     `resolveCardAccent` rotates through `GRID_ACCENT_ROTATION`
     (lilac → cyan → warm → red → green → gold) by grid index so
     the templates page reads as alternating colours instead of a
     monochromatic wall. */
  const accent = resolveCardAccent(template.blockColor, index);

  return (
    <Link
      href={`/templates/${template.slug}`}
      className="
        group flex flex-col no-underline text-fg-high
        rounded-xl overflow-hidden
        border border-edge-medium hover:border-edge-high
        transition-colors duration-200
      "
    >
      {/* Colored hero block — 16:9 aspect, dot grid bg, colored fill.
          Edge-to-edge inside the framed card; inner `rounded-xl`
          stripped because the outer `overflow-hidden` clips to the
          card's radius. */}
      <div
        className={[
          "relative aspect-[16/9]",
          "flex flex-col justify-between p-7",
          CARD_BG_CLASS[accent],
          CARD_TEXT_CLASS[accent],
        ].join(" ")}
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      >
        {/* INLINE `style={{ color }}` — same reason as
            `WorkflowCardGrid`. Tailwind v4 doesn't generate
            `!important` variants for arbitrary text values, so the
            `text-[var(--color-card-fg-dark)]` utility loses to the
            `.compass-content h3 { color: var(--color-fg-high) }`
            rule in `prose.css`. Inline `style` bypasses
            class-specificity and renders the right ink. */}
        <h3
          className="m-0 font-heading text-3xl font-medium leading-[1.1] tracking-tight"
          style={{ color: CARD_TEXT_COLOR[accent] }}
        >
          {template.title}
        </h3>
        {template.tags && template.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {template.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`${CARD_LABEL_BOX_CLASS} ${CARD_TAG_CLASS[accent]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Card body — excerpt + author/date meta. Mirrors
          `WorkflowCardGrid` + `InsightCardGrid` recipe. `line-clamp-2`
          is the safety net beneath `truncateSentences` so a long
          authored `summary` can't blow up card height. */}
      <div className="flex flex-col gap-3 p-5">
        {template.summary ? (
          <p className="m-0 max-w-[44ch] font-sans text-base leading-[1.45] text-fg-medium line-clamp-2">
            {truncateSentences(template.summary, 2)}
          </p>
        ) : null}

        {/* Meta row — sans-serif, case-preserved. Mirrors the
            insight + workflow grids; one recipe across surfaces. */}
        {(template.author || template.lastUpdated) ? (
          <div className="flex items-center font-sans text-sm text-fg-low">
            {template.author ? <span>{template.author}</span> : null}
            {template.author && template.lastUpdated ? <MetaDot /> : null}
            {template.lastUpdated ? (
              <time>{formatShortDate(template.lastUpdated)}</time>
            ) : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
