import Link from "next/link";
import { CoverArt } from "./CoverArt";
import type { ManualCoverEntry } from "../../lib/manuals/content";
import {
  CARD_ACCENT_VAR_CLASS,
  COMING_SOON_LABEL_CLASS,
} from "../../lib/card-accents";
import { COMPASS_PIXEL_LABEL_CLASS } from "../shared/compass-pixel-label";

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
      {/* Media panel — 16:10 plate that mirrors the `ManualCoverGrid`
          recipe so home rows and the cover-grid posters read as one
          family. Background-image stacks two soft `--cover-accent`
          radial blooms over a 6px-pitch white dot grid; opacities
          tuned down to ~7% / 4% bloom + 5% white dots so the surface
          reads as quiet warm light rather than a wash. The previous
          hardcoded orange/lilac blooms didn't track the per-row
          accent — every row got the same colors. */}
      <div
        className="
          relative aspect-[16/10] overflow-hidden rounded-xl
          border border-edge-medium
          bg-[var(--color-surface-higher)]
          text-[color:var(--cover-accent)]
          transition-transform duration-200 ease-out
          group-hover:-translate-y-[2px]
        "
        style={{
          backgroundImage:
            "radial-gradient(circle at 22% 18%, color-mix(in oklch, var(--cover-accent) 7%, transparent), transparent 55%), " +
            "radial-gradient(circle at 80% 82%, color-mix(in oklch, var(--cover-accent) 4%, transparent), transparent 60%), " +
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 6px 6px",
        }}
      >
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
        {/* Ordinal kicker — canonical pixel-label recipe, but with
            `leading-none` override so the kicker baseline aligns with
            the adjacent "Coming soon" pill on the same row. Color
            tracks the per-row `--cover-accent` so the kicker matches
            the manual's accent on the cover art beside it. */}
        <span
          className={`${COMPASS_PIXEL_LABEL_CLASS} leading-none text-[color:var(--cover-accent)]`}
        >
          Manual {cover.ordinal}
          {cover.comingSoon ? (
            /* Coming-soon pill — uses the canonical Compass article-
               card label recipe (`CARD_LABEL_BOX_CLASS` + dark-page
               tone) from `lib/card-accents.ts`. Same shape and
               chrome as Insight ribbons + Workflow / Template tag
               pills, so every "label on a card" reads as the same
               typographic object. */
            <span className={`ml-3 ${COMING_SOON_LABEL_CLASS}`}>
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

        {/* "Open manual" arrow link — canonical pixel-label recipe
            with the gold accent color. Bumped from the old
            `text-xxs` to the canonical `text-xs` so manual-cover
            eyebrows + card-grid eyebrows sit on the same scale. */}
        {!cover.comingSoon ? (
          <span
            className={[
              "mt-2 inline-flex items-center gap-1.5",
              COMPASS_PIXEL_LABEL_CLASS,
              "text-accent",
              "transition-transform duration-200 ease-out",
              "group-hover:translate-x-1",
            ].join(" ")}
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
