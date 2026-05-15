import Link from "next/link";
import type { WorkflowMeta } from "../../lib/workflows/content";
import {
  CARD_BG_CLASS,
  CARD_TEXT_CLASS,
  CARD_TEXT_COLOR,
  CARD_TAG_CLASS,
  CARD_LABEL_BOX_CLASS,
  resolveCardAccent,
  type CardAccent,
} from "../../lib/card-accents";
import { formatShortDate, truncateSentences } from "../../lib/format-date";
import { MetaDot } from "../shared/MetaDot";

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
      /* Trailing `pb` removed — was `pb-20`, see `InsightCardGrid`
         for the rationale. */
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {methods.map((m, i) => (
        <MethodCard key={m.slug} method={m} index={i} />
      ))}
    </section>
  );
}

function MethodCard({ method, index }: { method: WorkflowMeta; index: number }) {
  /* Mantle Official recipes — the default — render with the canonical
     `accent` plate (`--color-accent` = #FFBB53, the official Mantle
     gold) so first-party workflows read as a unified set across the
     grid. Community-submitted recipes (frontmatter `mantleOfficial:
     false`) opt out of the brand-gold plate and fall back to
     `resolveCardAccent(blockColor, i)` so the grid still feels alive
     when first-party + community cards are mixed.
     Earlier the Official plate used `orange` (#FFC66E, a lighter
     warm gold). Promoted to `accent` for visual parity with the
     canonical Mantle brand color across heymantle.com. */
  const isMantleOfficial = method.mantleOfficial !== false;
  const accent: CardAccent = isMantleOfficial
    ? "accent"
    : resolveCardAccent(method.blockColor, index);

  return (
    <Link
      href={`/workflows/${method.slug}`}
      className="
        group flex flex-col no-underline text-fg-high
        rounded-xl overflow-hidden
        border border-edge-medium hover:border-edge-high
        transition-colors duration-200
      "
    >
      {/* Colored hero block — edge-to-edge inside the framed card.
          Inner `rounded-xl` is stripped since the outer
          `overflow-hidden` already clips to the card's radius. */}
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
        {/* INLINE `style={{ color }}` — the listing page wraps the
            grid in `.compass-content`, which carries a prose-h3 rule
            (`prose.css`) setting white text at specificity (0,1,1).
            Tailwind v4's important-modifier suffix on arbitrary
            text-color values doesn't generate the !important
            variant cleanly here, so the utility class loses to the
            prose rule and the title renders white on every plate.
            Inline `style` beats any class rule without !important
            on either side — the bulletproof fix. On light plates
            (accent, orange, teal, etc.) the color resolves to
            `var(--color-card-fg-dark)` (#0a0810); on dark plates
            (black, graphite, etc.) it's white. Same pattern in
            `TemplateCardGrid`. */}
        <h3
          className="m-0 font-heading text-3xl font-medium leading-[1.1] tracking-tight"
          style={{ color: CARD_TEXT_COLOR[accent] }}
        >
          {method.title}
        </h3>
        {method.tags && method.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {method.tags.slice(0, 2).map((tag) => (
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

      {/* Card body — excerpt + author/date meta. Layout pairs with
          `TemplateCardGrid` + `InsightCardGrid`: short excerpt on
          top, author · date meta line below. `line-clamp-2` is the
          safety net beneath `truncateSentences` — caps the rendered
          excerpt at two visual lines so cards stay uniform even if
          an authored `summary` is unusually long. */}
      <div className="flex flex-col gap-3 p-5">
        {method.summary ? (
          <p className="m-0 max-w-[44ch] font-sans text-base leading-[1.45] text-fg-medium line-clamp-2">
            {truncateSentences(method.summary, 2)}
          </p>
        ) : null}

        {/* Meta row — sans-serif, case-preserved. Pairs with the
            canonical "May 13, 2026" date format from
            `formatShortDate`. Same recipe across insight + workflow
            + template grids. */}
        {(method.author || method.lastUpdated) ? (
          <div className="flex items-center font-sans text-sm text-fg-low">
            {method.author ? <span>{method.author}</span> : null}
            {method.author && method.lastUpdated ? <MetaDot /> : null}
            {method.lastUpdated ? (
              <time>{formatShortDate(method.lastUpdated)}</time>
            ) : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
