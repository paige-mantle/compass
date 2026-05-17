import Link from "next/link";
import { CoverArt } from "./CoverArt";
import {
  CARD_ACCENT_VAR_CLASS,
  COMING_SOON_LABEL_ON_COVER_CLASS,
} from "../../lib/card-accents";
import type { ManualCoverEntry } from "../../lib/manuals/content";
import { CompassPromptHeading } from "../shared/CompassPromptHeading";
import { CompassButton } from "../shared/CompassButton";

/**
 * `<ManualsHomeSection />` — manuals showcase on the `/compass` home.
 *
 * Layout mirrors the next-gen "Dive into more collections" pattern
 * (left-side editorial header + right-side stacked product rows):
 *   • LEFT column — pill eyebrow + section H2.
 *   • RIGHT column — stacked horizontal rows, one per featured
 *     manual. Each row carries a landscape cover plate on the left
 *     and a text block on the right (ordinal eyebrow + title +
 *     description).
 *
 * Cover plate recipe is the canonical Compass `ManualCoverGrid`
 * treatment, just reframed to landscape: dark `surface-higher` fill
 * + per-cover ambient bloom + 6px white dot-grid + the manual's
 * `<CoverArt>` motif rendered in `--cover-accent`. Same plate the
 * `/manuals` posters use — readers recognise the manual visually
 * across the home + the catalog.
 *
 * Coming-soon manuals render the same cover treatment with a
 * `"Coming soon"` pill overlay (`COMING_SOON_LABEL_ON_COVER_CLASS`)
 * and a non-link wrapper, so the row is visible but not navigable.
 */
export function ManualsHomeSection({ covers }: { covers: ManualCoverEntry[] }) {
  /* Featured slice — first three manuals. Clarity + Shape are live;
     Build is the next-up coming-soon entry. Pulling the slice from
     `MANUAL_COVERS` (the source of truth) means the section auto-
     updates when manuals are promoted from coming-soon → live or
     re-ordered in the catalog. */
  const featured = covers.slice(0, 3);

  return (
    <section className="grid grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
      {/* Left column — section header. Sticky on lg+ so the heading
          stays in view while the reader scrolls the manual rows on
          the right; on mobile the column collapses to normal flow
          above the rows.
          Staggered entrance: `data-compass-enter` keys into the
          shared keyframes recipe in `globals.css` — eyebrow lands
          first, H2 lands at the 80ms step, the right-column rows
          continue the stagger from index 3 onward. Honours
          `prefers-reduced-motion`. */}
      <div className="lg:col-span-5 lg:sticky lg:top-[calc(var(--header-h,44px)+24px)] lg:self-start">
        {/* Compact eyebrow pill — sits above the H2 as a small
            editorial label. Matches the canonical
            `<CompassPromptHeading>` recipe so it lines up with
            every other Compass eyebrow on the page. */}
        <div className="mb-4" data-compass-enter="1">
          <CompassPromptHeading text="Operating Manuals" color="accent" />
        </div>
        <h2
          data-compass-enter="2"
          className="m-0 font-heading text-4xl md:text-5xl font-normal leading-[1.05] tracking-tight text-fg-high max-w-[22ch]"
        >
          Manuals for sharper product decisions
        </h2>
        <p
          data-compass-enter="2"
          className="m-0 mt-4 max-w-[48ch] font-sans text-base leading-loose text-fg-medium"
        >
          Deep-dive manuals for product, growth, and operations
          decisions that get harder as your app scales.
        </p>
        {/* "Browse all manuals →" CTA sits directly under the
            subhead inside the left column (was a separate row
            below the section). Subhead → button stays on one
            editorial vertical rhythm. */}
        <div data-compass-enter="2" className="mt-6">
          <CompassButton
            href="/manuals"
            icon={{ icon: "ArrowRight", position: "right" }}
          >
            Browse all manuals
          </CompassButton>
        </div>
      </div>

      {/* Right column — stacked manual rows. Each row continues the
          staggered entrance from index 3 onward so the eye travels
          left → right → down the stack. */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {featured.map((cover, i) => (
          <div key={cover.slug} data-compass-enter={String(i + 3)}>
            <ManualRow cover={cover} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ManualRow({ cover }: { cover: ManualCoverEntry }) {
  /* `CARD_ACCENT_VAR_CLASS[accent]` sets `--cover-accent` on the
     row container; the cover plate's ambient bloom + dot-grid + the
     inline `<CoverArt>` SVG all inherit through this var. */
  const inner = (
    <div
      className={[
        "group/manual-row relative grid grid-cols-1 gap-6 overflow-hidden rounded-xl",
        "border border-edge-medium",
        "transition-[transform,border-color] duration-200 ease-out",
        cover.comingSoon
          ? ""
          : "hover:border-edge-high hover:-translate-y-[2px]",
        "sm:grid-cols-12 sm:gap-8",
        CARD_ACCENT_VAR_CLASS[cover.accent],
      ].join(" ")}
    >
      {/* Cover plate — landscape 5:4 inside the row, dark fill +
          ambient bloom + dot grid + accent-tinted motif. Matches the
          cover-grid poster recipe at landscape proportions. */}
      <div
        className="
          relative overflow-hidden bg-[var(--color-surface-higher)]
          sm:col-span-5 aspect-[5/4]
        "
        style={{
          backgroundImage:
            "radial-gradient(circle at 22% 18%, color-mix(in oklch, var(--cover-accent) 7%, transparent), transparent 55%), " +
            "radial-gradient(circle at 80% 82%, color-mix(in oklch, var(--cover-accent) 4%, transparent), transparent 60%), " +
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 6px 6px",
        }}
      >
        {/* `<CoverArt>` inherits the cover accent via the
            `text-[color:var(--cover-accent)]` wrapper so every line
            + dot paints in the manual's identity color. */}
        <div className="pointer-events-none absolute inset-0 text-[color:var(--cover-accent)]">
          <CoverArt motif={cover.motif} />
        </div>
        {/* Coming-soon pill — same `COMING_SOON_LABEL_ON_COVER_CLASS`
            recipe the cover grid uses, top-right of the plate. Only
            renders for manuals not yet shipped. */}
        {cover.comingSoon ? (
          <span
            className={`absolute right-3 top-3 z-10 ${COMING_SOON_LABEL_ON_COVER_CLASS}`}
          >
            Coming soon
          </span>
        ) : null}
      </div>

      {/* Text block — ordinal inline with H3 + description. The
          ordinal sits LEFT of the title on the same line (was an
          eyebrow above) so the row reads "00 Clarity" as one
          editorial header. Ordinal is rendered in the manual's
          `--cover-accent` for identity, with a slightly muted
          opacity so the title still leads. */}
      <div className="flex flex-col justify-center gap-3 px-6 pb-6 pt-2 sm:col-span-7 sm:px-0 sm:py-8 sm:pr-8">
        <h3
          className={[
            "m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1",
            "font-heading text-3xl font-medium leading-[1.1] tracking-tight md:text-4xl",
            cover.comingSoon ? "text-fg-medium" : "text-fg-high group-hover/manual-row:text-[var(--cover-accent)]",
            "transition-colors duration-150",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className="font-display font-normal tabular-nums text-[var(--cover-accent)] opacity-90"
          >
            {cover.ordinal}
          </span>
          <span>{cover.coverTitle}</span>
        </h3>
        {cover.summary ? (
          <p className="m-0 max-w-[60ch] font-sans text-base leading-[1.5] text-fg-medium line-clamp-3">
            {cover.summary}
          </p>
        ) : null}
      </div>
    </div>
  );

  /* Coming-soon manuals are rendered as a static `<div>` (no link).
     Live manuals link to `/manuals/[slug]`. */
  if (cover.comingSoon) {
    return (
      <div
        aria-disabled="true"
        aria-label={`${cover.coverTitle} — coming soon`}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={cover.href}
      className="block no-underline text-fg-high"
      aria-label={`${cover.coverTitle} manual`}
    >
      {inner}
    </Link>
  );
}
