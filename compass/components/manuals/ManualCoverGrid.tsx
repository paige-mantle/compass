import Link from "next/link";
import { CoverArt } from "./CoverArt";
import type { ManualCoverEntry } from "../../lib/manuals/content";
import {
  CARD_ACCENT_VAR_CLASS,
  COMING_SOON_LABEL_ON_COVER_CLASS,
} from "../../lib/card-accents";

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

/* Shared shell classes. Canonical Compass card chrome:
     • `--color-surface-higher` (#16141A) — one notch below
       `surface-highest` in the dark ramp; gives a quieter lift that
       lets the colored SVG art motif and the per-cover accent glow
       carry the visual presence rather than the surface fill.
     • `rounded-xl` (8px) — same radius every Compass card uses.
     • `border border-edge-medium` + `hover:border-edge-high` —
       shared with InsightCard, WorkflowCard, TemplateCard so every
       Compass card reads as part of the same framed family. The
       cover-grid difference is that manual covers fill the frame
       too; article cards leave it transparent.
     • Ambient glow — a per-cover radial gradient (two soft
       blooms in the cover's `--cover-accent`) applied as the card's
       background-image. Same recipe as InsightCard but driven from
       the chapter's accent token so each manual has its own warm
       haze. The fill underneath stays `surface-higher` so the glow
       reads as accent-coloured light, not flat colour. */
const SHELL_CLASSES = [
  "group relative block overflow-hidden rounded-xl",
  "aspect-[320/440]",
  "bg-[var(--color-surface-higher)]",
  "border border-edge-medium hover:border-edge-high",
  "transition-[transform,border-color] duration-200 ease-out hover:-translate-y-[3px]",
];

/* Per-cover ambient glow — two soft radial blooms in the chapter
   accent, positioned at the top-left and bottom-right of the card.
   Opacities tuned down (was 14% / 8% peak; now 7% / 4%) so the glow
   reads as warm light + visible-but-quiet, letting the dot-grid
   texture below carry the surface and the SVG motif carry the
   visual centerpiece. Composes with the dot-grid background layer
   beneath via `background-image` stacking — both render on the same
   element, dot grid first (bottom) and the two radial blooms on top. */
const COVER_AMBIENT_BG_IMAGE =
  "radial-gradient(circle at 22% 18%, color-mix(in oklch, var(--cover-accent) 7%, transparent), transparent 55%), " +
  "radial-gradient(circle at 80% 82%, color-mix(in oklch, var(--cover-accent) 4%, transparent), transparent 60%), " +
  // Dot-grid texture — matches the workflow + template card plate
  // recipe (6px pitch, 1px dots) but uses a low-alpha WHITE dot
  // since manual covers run on the dark `surface-higher` fill. The
  // black-on-light dots from the listing cards would disappear here.
  "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)";

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
        /* Coming-soon pill — uses `COMING_SOON_LABEL_ON_COVER_CLASS`
           (white text + 15%-white backplate + 25%-white hairline)
           on EVERY cover so the badge reads consistently across the
           grid. Earlier the call site picked per-accent tone via
           `CARD_PILL_CLASS[cover.accent]`, which switched to
           dark-text on bright covers (gold, cyan, warm) and white
           on dark covers (lilac, red, black) — the visual mismatch
           the user flagged. White-on-all is the cleaner read.
           `z-20` puts the pill above every layered cover element —
           grain (z-1), art (z-2), divider + label (z-3) — and gives
           headroom for any future overlay without a stacking war.
           The backplate opacities on `PILL_CLASS.dark` were bumped
           (white/15 + white/25 border) so the pill stays readable
           on the brightest covers in the palette. */
        <span
          className={`absolute right-3 top-3 z-20 ${COMING_SOON_LABEL_ON_COVER_CLASS}`}
        >
          Coming soon
        </span>
      ) : null}

      {/* Art block — top 75% of card, full bleed, pointer-events: none
          so clicks reach the wrapping <a>. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[75%] text-[color:var(--cover-accent)]">
        <CoverArt motif={cover.motif} />
      </div>

      {/* Hairline divider, full bleed. Uses canonical
          `--color-edge-medium` (Mantle token, available everywhere via
          globals.css) instead of legacy `--border-soft` from
          compass-globals.css, which isn't loaded on /manuals. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-[75%] z-[3] h-px bg-edge-medium"
      />

      {/* Label block — bottom 25%. Eyebrow numeral sits just above
          the title, the title anchors to the bottom edge of the card.
          `justify-end` pushes both to the bottom of the label box;
          `pb-[22px]` matches the horizontal `px-[22px]` so the inset
          reads as a single uniform margin from the card edge. */}
      {/* Label block — bottom 25%. `justify-end` + `pb-[22px]`
          anchors the title to the visible bottom edge of the cover
          with a uniform 22px inset matching the horizontal gutters.
          Title runs in title case (not uppercase) so the Geist Pixel Grid
          glyphs read as a proper noun — "Clarity", "Shape", "Build"
          — rather than as label text. `leading-none` keeps the
          glyph box tight to the visual bounds. */}
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
          className="block font-normal leading-none text-[var(--cover-accent)]"
          style={{
            /* Geist Pixel Grid is the canonical Compass display
               face — picks the grid variant from the family so the
               cover title reads as one consistent pixel-grid mark
               across every cover. Was a stack of (Circle, Square,
               Line) which gave each cover a slightly different
               glyph rhythm depending on which variant loaded first;
               pinned to a single variant here. */
            fontFamily: '"Geist Pixel Grid", var(--font-heading)',
            fontSize: "50px",
            letterSpacing: 0,
          }}
        >
          {cover.coverTitle}
        </span>
      </div>
    </>
  );

  // `backgroundImage` carries three stacked layers in z-order
  // (first = topmost): two radial blooms in `--cover-accent`, then
  // the dot-grid texture. `backgroundSize` follows the same comma-
  // separated layer order — the first two layers stay at `auto`
  // (full size) for the radial gradients; the third (`6px 6px`)
  // tiles the dot pattern across the plate.
  const styleWithAmbient = {
    backgroundImage: COVER_AMBIENT_BG_IMAGE,
    backgroundSize: "auto, auto, 6px 6px",
  };

  if (cover.comingSoon) {
    return (
      <div
        className={`${className} cursor-default`}
        style={styleWithAmbient}
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
      style={styleWithAmbient}
      aria-label={`${cover.coverTitle} — ${cover.ordinal}`}
    >
      {inner}
    </Link>
  );
}
