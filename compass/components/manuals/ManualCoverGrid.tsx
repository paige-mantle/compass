import Link from "next/link";
import { CoverArt } from "./CoverArt";
import type { ManualCoverEntry } from "../../lib/manuals/content";
import { CARD_ACCENT_VAR_CLASS, CARD_PILL_CLASS } from "../../lib/card-accents";

/**
 * Manual cover grid — the visual centerpiece of /manuals.
 * Each cover is a 320 × 440 portrait poster on a dark `--cover-canvas`
 * surface with white-noise grain, full-bleed SVG art in the top 75%,
 * a hairline divider, and a numeral + title label at the bottom.
 *
 * All sizing & spacing values resolve through the global design-token
 * scale (`text-7xl`, `text-xl`, `text-xs`, `leading-tighter`,
 * `leading-loose`, `tracking-wider`, etc.) so future changes to
 * `app/globals.css` propagate without touching this file.
 *
 * Coming-soon cards are rendered as a non-navigating `<div>` instead
 * of an `<a>`, so the JS notify-modal pattern from the legacy static
 * page doesn't need to be reproduced — the badge tells the user
 * "this isn't live yet" on its own.
 */
export function ManualCoverGrid({ covers }: { covers: ManualCoverEntry[] }) {
  return (
    <section
      aria-label="Operating manuals"
      /* Column ramp:
           <640px  — 1 col (stacked)
           640px+  — 2 cols
           768px+  — 4 cols (most laptop viewports)
         The earlier `lg:grid-cols-4` (≥1024px) was leaving viewports
         between 768-1023px at 2 cols, which read as "the grid is
         broken" on a typical 13" laptop with devtools open. Dropping
         the 4-col threshold to `md` covers the whole laptop-and-above
         range. With 7 manuals total the last row naturally holds 3 —
         that's just the 7÷4 remainder, not a layout bug. */
      className="grid grid-cols-1 gap-5 pb-20 sm:grid-cols-2 md:grid-cols-4"
    >
      {covers.map((cover) => (
        <ManualCover key={cover.slug} cover={cover} />
      ))}
    </section>
  );
}

/* Shared shell classes. Uses canonical `--color-surface-highest`
   (= #1E1C23 in the Mantle dark theme) for the card surface, and
   the canonical `rounded-xl` (= 8px) card radius from the Mantle
   rounded scale — same radius used across every Compass card
   (templates, frameworks, blog items, insights). */
const SHELL_CLASSES = [
  "group relative block overflow-hidden rounded-xl",
  "aspect-[320/440]",
  "bg-[var(--color-surface-highest)]",
  // Transform-only transition; color stays pinned.
  "transition-transform duration-200 ease-out hover:-translate-y-[3px]",
];

function ManualCover({ cover }: { cover: ManualCoverEntry }) {
  /* `CARD_ACCENT_VAR_CLASS[accent]` sets `--cover-accent` on the
     card container to the chapter's accent color (sourced from the
     Mantle canonical palette). The inline <CoverArt> SVG inherits
     this via `text-[color:var(--cover-accent)]` since the SVG uses
     `currentColor`. Source of truth is `compass/lib/card-accents.ts`
     — no parallel cover-accent map here. */
  const className = [
    ...SHELL_CLASSES,
    CARD_ACCENT_VAR_CLASS[cover.accent],
  ].join(" ");

  const inner = (
    <>
      {/* Grain — same SVG-turbulence recipe as compass-base.css
          `.card-grain`. White noise on overlay blend; sits BELOW the
          art and label so it can never affect text rendering on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] mix-blend-overlay opacity-[0.18]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundSize: "200px 200px",
        }}
      />
      {cover.comingSoon ? (
        /* Coming-soon pill — uses the canonical Compass pill recipe
           from `compass/lib/card-accents.ts`. The cover surface is
           always dark (--color-surface-highest), so all manual cover
           pills use the `dark` variant directly rather than going
           through `CARD_PILL_CLASS[accent]`. Single source of truth
           shared with method tag pills, template tag pills, and
           insight ribbons. */
        <span
          className={[
            "absolute right-3 top-3 z-10",
            "inline-flex items-center rounded-md",
            "px-2.5 py-1",
            "font-mono text-[10px] font-medium uppercase",
            "tracking-[0.1em] leading-none",
            CARD_PILL_CLASS.black,
          ].join(" ")}
        >
          Coming soon
        </span>
      ) : null}

      {/* Art block — top 75% of card, full bleed, pointer-events: none
          so clicks reach the wrapping <a>. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[75%] text-[color:var(--cover-accent)]">
        <CoverArt motif={cover.motif} />
      </div>

      {/* Hairline divider, full bleed, using the global --border-soft
          token (re-scoped to the dark-theme rgba above). */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-[75%] z-[3] h-px bg-[var(--border-soft)]"
      />

      {/* Label block — bottom 25%. Eyebrow numeral sits just above
          the title, the title anchors to the bottom edge of the card.
          `justify-end` pushes both to the bottom of the label box;
          `pb-[22px]` matches the horizontal `px-[22px]` so the inset
          reads as a single uniform margin from the card edge. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex h-1/4 flex-col justify-end gap-1.5 px-[22px] pb-[22px]">
        <span
          className="
            self-start font-mono text-xs font-medium uppercase
            tracking-wider leading-none text-[var(--cover-accent)]
          "
        >
          {cover.ordinal}
        </span>
        <span
          className="font-normal uppercase leading-none text-[var(--cover-accent)]"
          style={{
            fontFamily:
              '"Geist Pixel Circle", "Geist Pixel Square", "Geist Pixel Line", var(--font-heading)',
            fontSize: "50px",
            letterSpacing: 0,
          }}
        >
          {cover.coverTitle}
        </span>
      </div>
    </>
  );

  if (cover.comingSoon) {
    return (
      <div
        className={`${className} cursor-default`}
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
      className={`${className} cursor-pointer no-underline`}
      aria-label={`${cover.coverTitle} — ${cover.ordinal}`}
    >
      {inner}
    </Link>
  );
}
