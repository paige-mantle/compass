import Link from "next/link";
import { CoverArt } from "./CoverArt";
import type { ManualCoverEntry } from "../../lib/manuals/content";
import { CARD_ACCENT_VAR_CLASS, CARD_PILL_CLASS } from "../../lib/card-accents";

/**
 * Manual row list — the "row-stacked vertical card" layout for the
 * Compass home page (`/compass`). Each manual renders as one
 * horizontal row: a 16:9 media panel on the left (480px on desktop,
 * full-width above 860px breakpoint) carrying the manual's
 * cover-art SVG motif, and a stacked text column on the right
 * (kicker / title / summary / arrow link).
 *
 * Intentionally different from `<ManualCoverGrid>` (which lives on
 * `/manuals`): grid uses portrait 320×440 cover posters in
 * a 4-column grid; row list uses landscape media with editorial
 * description copy beside it. Two presentations of the same data
 * for two surfaces with different jobs.
 *
 *   Compass home   → narrative; "here's what these manuals teach"
 *   Compass index  → catalog;   "browse the seven covers"
 *
 * Mirrors the legacy static-page `.compass-manual-row` recipe from
 * compass-manual-base.css (lines ~2090-2170) but uses the canonical
 * Mantle tokens via Tailwind utilities so it tracks the rest of
 * Compass's design system instead of carrying a parallel one.
 *
 * Coming-soon manuals render as a non-navigating `<div>` (not
 * `<Link>`) with a muted treatment + a small "Coming soon" pill,
 * matching the pattern used in `<ManualCoverGrid>`.
 */

export function ManualRowList({ covers }: { covers: ManualCoverEntry[] }) {
  return (
    <section aria-label="Operating manuals" className="flex flex-col">
      {covers.map((cover, i) => (
        <ManualRow key={cover.slug} cover={cover} isFirst={i === 0} />
      ))}
    </section>
  );
}

function ManualRow({
  cover,
  isFirst,
}: {
  cover: ManualCoverEntry;
  isFirst: boolean;
}) {
  /* Row chrome — applied to either <Link> or <div>. Top border on the
     first row + bottom border on every row gives the stacked
     hairline rhythm from the legacy static page. */
  const rowClasses = [
    "group grid items-center gap-8 py-10",
    "lg:grid-cols-[480px_1fr] lg:gap-14 lg:py-12",
    "border-b border-edge-medium",
    isFirst ? "border-t border-edge-medium" : "",
    "transition-colors duration-200 ease-out",
    "no-underline",
    CARD_ACCENT_VAR_CLASS[cover.accent],
    cover.comingSoon
      ? "cursor-default text-fg-medium"
      : "cursor-pointer text-fg-high hover:bg-white/[0.012]",
  ].join(" ");

  const inner = (
    <>
      {/* Media panel — 16:9, dot-grid radial-gradient surface with the
          cover-art motif overlaid. Same color recipe as the manual
          cover cards: dark base + faint accent + lilac wash + dot
          grid. The art tracks the row's `--cover-accent` via the
          ACC_CLASS scope above. */}
      <div
        className="
          relative aspect-[16/10] overflow-hidden rounded-xl
          border border-edge-medium
          bg-[var(--color-surface-highest)]
          text-[color:var(--cover-accent)]
          transition-transform duration-200 ease-out
          group-hover:-translate-y-[2px]
        "
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(255,187,83,0.10), transparent 55%), " +
            "radial-gradient(circle at 80% 70%, rgba(140,95,210,0.22), transparent 55%), " +
            "linear-gradient(135deg, #1d1628 0%, #120d1c 100%)",
        }}
      >
        {/* Dot/cross grid texture overlay — same recipe as the
            cover cards on `/manuals`, keeps the visual
            family consistent. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(255,255,255,0.035) 1px, transparent 1px), " +
              "linear-gradient(-45deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        {/* Cover-art motif — fills the panel, pointer-events: none so
            clicks reach the wrapping link. */}
        <div className="pointer-events-none absolute inset-0">
          <CoverArt motif={cover.motif} />
        </div>
      </div>

      {/* Text column — ordinal kicker (mono uppercase, in the
          row's --cover-accent color), title (Manrope display, large,
          hovers to gold), description, then a small mono arrow link.
          Stacks vertically with 12px gaps. */}
      <div className="flex flex-col gap-3">
        <span
          className="
            font-mono text-xs font-medium uppercase tracking-wider leading-none
            text-[color:var(--cover-accent)]
          "
        >
          Manual {cover.ordinal}
          {cover.comingSoon ? (
            /* Coming-soon pill — canonical Compass pill recipe from
               `card-accents.ts`. Same shape + chrome as method tag
               pills + insight ribbons + every other Compass pill on
               a dark surface. */
            <span
              className={[
                "ml-3 inline-flex items-center rounded-md",
                "px-2 py-0.5",
                "text-[10px] font-medium tracking-[0.08em] leading-none uppercase",
                CARD_PILL_CLASS.black,
              ].join(" ")}
            >
              Coming soon
            </span>
          ) : null}
        </span>

        <h3
          className={[
            "m-0 font-heading font-medium leading-[1.1] tracking-tight",
            "text-4xl md:text-5xl",
            cover.comingSoon ? "text-fg-medium" : "text-fg-high",
            !cover.comingSoon ? "group-hover:text-accent transition-colors duration-150" : "",
          ].join(" ")}
        >
          {cover.manifestTitle}
        </h3>

        {cover.summary ? (
          <p
            className={[
              "m-0 max-w-[60ch] font-sans text-lg leading-[1.5]",
              cover.comingSoon ? "text-fg-low" : "text-fg-medium",
            ].join(" ")}
          >
            {cover.summary}
          </p>
        ) : null}

        {!cover.comingSoon ? (
          <span
            className="
              mt-2 inline-flex items-center gap-1.5
              font-mono text-[11px] font-medium uppercase tracking-wider
              text-accent
              transition-transform duration-200 ease-out
              group-hover:translate-x-1
            "
          >
            <span>Open manual</span>
            <span aria-hidden>→</span>
          </span>
        ) : null}
      </div>
    </>
  );

  if (cover.comingSoon) {
    return (
      <div
        className={rowClasses}
        aria-disabled="true"
        aria-label={`${cover.manifestTitle} — coming soon`}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={cover.href}
      className={rowClasses}
      aria-label={`${cover.manifestTitle} — Manual ${cover.ordinal}`}
    >
      {inner}
    </Link>
  );
}
