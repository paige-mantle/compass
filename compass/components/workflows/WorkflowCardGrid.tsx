import Link from "next/link";
import type { WorkflowMeta } from "../../lib/workflows/content";
import {
  CARD_BG_CLASS,
  CARD_TEXT_CLASS,
  CARD_TAG_CLASS,
  DEFAULT_CARD_ACCENT,
} from "../../lib/card-accents";

/**
 * Method card grid — listing surface for `/workflows`.
 *
 * Each card has a 16:9 colored block with a subtle dot-grid texture,
 * the method title at the top, optional tag pills at the bottom.
 * Below the block: short description, then a small mono "Added <date>"
 * line. The colored block is the visual hook — the rest is editorial
 * meta.
 *
 * Visual recipe is shared byte-for-byte with `TemplateCardGrid` —
 * same JSX shape, same imports from `compass/lib/card-accents.ts`.
 * Diverging anything here means also diverging it in the template
 * grid; they're paired on purpose.
 *
 * The accent palette is unified across Compass: method cards use
 * the same color names + values as manual covers (gold / cyan /
 * lilac / warm / red / white / black / graphite / gray). See
 * `compass/lib/card-accents.ts` for the canonical map.
 */
export function WorkflowCardGrid({ methods }: { methods: WorkflowMeta[] }) {
  return (
    <section
      aria-label="Methods"
      className="grid grid-cols-1 gap-8 pb-20 sm:grid-cols-2 lg:grid-cols-3"
    >
      {methods.map((m) => (
        <MethodCard key={m.slug} method={m} />
      ))}
    </section>
  );
}

function MethodCard({ method }: { method: WorkflowMeta }) {
  const accent = method.blockColor ?? DEFAULT_CARD_ACCENT;

  return (
    <Link
      href={`/workflows/${method.slug}`}
      className="group flex flex-col gap-4 no-underline text-fg-high"
    >
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
          {method.title}
        </h3>
        {method.tags && method.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {method.tags.slice(0, 2).map((tag) => (
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

      {method.summary ? (
        <p className="m-0 max-w-[44ch] font-sans text-base leading-[1.45] text-fg-medium">
          {method.summary}
        </p>
      ) : null}

      {method.lastUpdated ? (
        <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-fg-low">
          <span>Added</span>
          <time>{method.lastUpdated}</time>
        </div>
      ) : null}
    </Link>
  );
}
