import Link from "next/link";
import type { TemplateMeta } from "../../lib/templates/content";
import {
  CARD_BG_CLASS,
  CARD_TEXT_CLASS,
  CARD_TAG_CLASS,
  DEFAULT_CARD_ACCENT,
} from "../../lib/card-accents";

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
      className="grid grid-cols-1 gap-8 pb-20 sm:grid-cols-2 lg:grid-cols-3"
    >
      {templates.map((t) => (
        <TemplateCard key={t.slug} template={t} />
      ))}
    </section>
  );
}

function TemplateCard({ template }: { template: TemplateMeta }) {
  const accent = template.blockColor ?? DEFAULT_CARD_ACCENT;

  return (
    <Link
      href={`/templates/${template.slug}`}
      className="group flex flex-col gap-4 no-underline text-fg-high"
    >
      {/* Block — 16:9 aspect, dot grid bg, colored fill, lifts on hover */}
      <div
        className={[
          "relative aspect-[16/9] overflow-hidden rounded-xl",
          "flex flex-col justify-between p-7",
          "transition-transform duration-200 ease-out",
          "group-hover:-translate-y-[3px]",
          CARD_BG_CLASS[accent],
          CARD_TEXT_CLASS[accent],
        ].join(" ")}
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      >
        <h3 className="m-0 font-heading text-[28px] font-medium leading-[1.1] tracking-tight">
          {template.title}
        </h3>
        {template.tags && template.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {template.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={[
                  "inline-flex items-center rounded-md",
                  "px-2.5 py-1 text-[12.5px] font-medium",
                  CARD_TAG_CLASS[accent],
                ].join(" ")}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {template.description ? (
        <p className="m-0 max-w-[44ch] font-sans text-base leading-[1.45] text-fg-medium">
          {template.description}
        </p>
      ) : null}

      {template.lastUpdated ? (
        <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-fg-low">
          <span>Added</span>
          <time>{template.lastUpdated}</time>
        </div>
      ) : null}
    </Link>
  );
}
