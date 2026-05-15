/**
 * Inline SVG dictionary for the 7 manual covers on /manuals.
 * Each motif is a 320×370 viewBox stroked in `currentColor`, which the
 * parent `ManualCover` paints via the per-cover `--cover-accent`
 * token (mapped through the `acc-*` className). Adding a new manual
 * means: drop a new entry here keyed off `ManualCoverEntry.motif`,
 * then update the union in `compass/lib/manuals/content.ts`.
 *
 * Every primitive uses `pointer-events: none` (set on the parent
 * `.cover-art` wrapper) so clicks always reach the wrapping `<a>`
 * and trigger navigation — see ManualCover for the click-through
 * guard.
 */
export type CoverMotif =
  | "vanishing-grid"
  | "nested-ovals"
  | "circuit-path"
  | "funnel-paths"
  | "magnetic-field"
  | "sine-wave"
  | "helix-coil";

export function CoverArt({ motif }: { motif: CoverMotif }) {
  const Art = ART[motif];
  return <Art />;
}

/* ─────────────────────────────────────────────────────────────────
 * Individual motifs
 * Each is an `<svg>` returning currentColor-stroked geometry, sized
 * 320×370 (matches the cover-grid v1 spec). Coordinates are kept
 * verbatim from the static page port so visual output is identical.
 * ──────────────────────────────────────────────────────────────── */

function VanishingGrid() {
  // Clarity — one-point perspective floor grid converging on a
  // vanishing-point dot near the top center. Horizontal rules
  // recede toward the apex; a radial fan splits the floor into
  // proportional cells whose intersections read as squares in the
  // projected perspective.
  //
  // Tuning vs the previous version:
  //   • viewBox grown 320×370 → 320×420 so the floor has more
  //     vertical real estate. The cover slot is 16:9-ish, but
  //     `preserveAspectRatio="xMidYMid meet"` (SVG default) scales
  //     the art to fit — the taller canvas gives the grid more room
  //     to fan out without compression.
  //   • All line endpoints pulled INSIDE the canvas (was x=-30 /
  //     x=350, now x=12 / x=308) so nothing reads as "cut off" at
  //     the edges. The bottom-edge radial endpoints are within the
  //     visible frame.
  //   • Horizontal-rule spacing follows the canonical perspective
  //     formula (y = vp_y + k/(near + n·step)) so each row's
  //     foreshortening compounds smoothly — the cells visibly
  //     match the perspective convergence of the radial fan.
  //   • Radial fan widened to 9 lines anchored on 9 evenly-spaced
  //     points along the bottom edge, plus the two side anchors at
  //     (12, 400) and (308, 400). Combined with the 8 horizontal
  //     rules, the floor reads as a regular 8×8 perspective grid
  //     of "squares."
  //   • Stroke + opacity ramp preserved from the previous version
  //     so the warm gold fan still feels like editorial perspective
  //     ink, not a CAD drawing.
  return (
    <svg
      className="block h-full w-full"
      viewBox="0 0 320 420"
      fill="none"
      aria-hidden="true"
    >
      {/* Horizontal floor rules — closer together as they approach
          the horizon at y=80. x-extent contracts proportionally so
          each rule sits "above" the rule below it in the perspective
          projection. */}
      <line x1="12"  y1="398" x2="308" y2="398" stroke="currentColor" strokeWidth="2.4" opacity="0.95" />
      <line x1="36"  y1="346" x2="284" y2="346" stroke="currentColor" strokeWidth="2.0" opacity="0.8" />
      <line x1="56"  y1="302" x2="264" y2="302" stroke="currentColor" strokeWidth="1.7" opacity="0.65" />
      <line x1="74"  y1="265" x2="246" y2="265" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
      <line x1="90"  y1="233" x2="230" y2="233" stroke="currentColor" strokeWidth="1.15" opacity="0.38" />
      <line x1="104" y1="206" x2="216" y2="206" stroke="currentColor" strokeWidth="0.95" opacity="0.28" />
      <line x1="116" y1="183" x2="204" y2="183" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <line x1="126" y1="163" x2="194" y2="163" stroke="currentColor" strokeWidth="0.65" opacity="0.13" />
      {/* Radial fan — 9 lines from the vanishing point at (160, 80)
          to 9 endpoints evenly distributed along the bottom rule
          (y=398, x ∈ [12, 308]). Together with the 8 horizontals
          above, the intersections form an 8×8 perspective grid of
          square-projected cells. */}
      {[
        [12, 398],
        [49, 398],
        [86, 398],
        [123, 398],
        [160, 398],
        [197, 398],
        [234, 398],
        [271, 398],
        [308, 398],
      ].map(([x2, y2], i) => (
        <line
          key={i}
          x1="160"
          y1="80"
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.5"
        />
      ))}
      {/* Vanishing-point dot — anchors the apex of the fan. */}
      <circle cx="160" cy="80" r="5" fill="currentColor" />
    </svg>
  );
}

function NestedOvals() {
  return (
    <svg
      className="block h-full w-full"
      viewBox="0 0 320 370"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="100" cy="185" rx="72" ry="160" stroke="currentColor" strokeWidth="2.25" fill="none" />
      <ellipse cx="160" cy="185" rx="72" ry="160" stroke="currentColor" strokeWidth="2.25" fill="none" />
      <ellipse cx="220" cy="185" rx="72" ry="160" stroke="currentColor" strokeWidth="2.25" fill="none" />
      <circle cx="130" cy="40" r="5" fill="currentColor" />
      <circle cx="130" cy="330" r="5" fill="currentColor" />
      <circle cx="190" cy="40" r="5" fill="currentColor" />
      <circle cx="190" cy="330" r="5" fill="currentColor" />
      <circle cx="100" cy="25" r="5" fill="currentColor" />
      <circle cx="160" cy="25" r="5" fill="currentColor" />
      <circle cx="220" cy="25" r="5" fill="currentColor" />
      <circle cx="100" cy="345" r="5" fill="currentColor" />
      <circle cx="160" cy="345" r="5" fill="currentColor" />
      <circle cx="220" cy="345" r="5" fill="currentColor" />
    </svg>
  );
}

function CircuitPath() {
  // Build — nested square framework that sits centered on the canvas
  // with a 36px inset all around so the top edge of the outer rect
  // clears the "Coming soon" pill at top-right (~36px from the
  // canvas top once card-aspect / viewBox scaling is factored in).
  // Two concentric stroked rectangles with connector stubs breaking
  // out left/right/top/bottom; an internal cross divides each
  // rectangle into quadrants. Reads as "modular assembly,
  // scaffolding, structure."
  //
  // Geometry:
  //   Outer rect:  (38, 72) → (282, 316)  — 244 × 244, centered with
  //                inset that clears the coming-soon pill at top-right
  //   Inner rect:  (96, 116) → (224, 272) — 128 × 156, centered
  //   Connectors:  4 short stubs extending OUT 18px from each outer
  //                rect edge midpoint, suggesting external interfaces
  //                without breaking the canvas bounds and crowding
  //                the pill.
  //   Internal:    Vertical + horizontal midlines on the outer rect,
  //                a single horizontal midline on the inner rect.
  //   Strokes:     Dialed down from 2.5/2.0/1.75 to 2.0/1.5/1.5 so
  //                the rectangle border reads as scaffolding, not as
  //                a heavy frame competing with the cover label.
  return (
    <svg
      className="block h-full w-full"
      viewBox="0 0 320 370"
      fill="none"
      aria-hidden="true"
    >
      {/* Outer rect — primary stroke, full presence. */}
      <rect x="38" y="72" width="244" height="244" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Inner rect — secondary stroke, slightly lighter. */}
      <rect x="96" y="116" width="128" height="156" stroke="currentColor" strokeWidth="1.5" opacity="0.75" fill="none" />
      {/* Internal cross on the outer rect. */}
      <line x1="38" y1="194" x2="282" y2="194" stroke="currentColor" strokeWidth="1.25" opacity="0.45" />
      <line x1="160" y1="72" x2="160" y2="316" stroke="currentColor" strokeWidth="1.25" opacity="0.45" />
      {/* Inner-rect quadrant divider — horizontal only. */}
      <line x1="96" y1="194" x2="224" y2="194" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Outer connectors — short 18px stubs extending out from each
          outer-rect edge midpoint. Was full-bleed to the canvas
          edges; that ran the top stub into the coming-soon pill at
          top-right. Stubs keep the "interfaces outward" read without
          crowding the badge. */}
      <line x1="160" y1="54" x2="160" y2="72" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <line x1="160" y1="316" x2="160" y2="334" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <line x1="20" y1="194" x2="38" y2="194" stroke="currentColor" strokeWidth="2" />
      <line x1="282" y1="194" x2="300" y2="194" stroke="currentColor" strokeWidth="2" />
      {/* Anchor dots at every node of the outer rect + the four
          midpoints. r=4 — one step smaller than the cover-wide r=5
          since the rect itself is smaller; keeps relative proportion. */}
      <circle cx="38" cy="72" r="4" fill="currentColor" />
      <circle cx="282" cy="72" r="4" fill="currentColor" />
      <circle cx="38" cy="316" r="4" fill="currentColor" />
      <circle cx="282" cy="316" r="4" fill="currentColor" />
      <circle cx="38" cy="194" r="4" fill="currentColor" />
      <circle cx="282" cy="194" r="4" fill="currentColor" />
      <circle cx="160" cy="72" r="4" fill="currentColor" />
      <circle cx="160" cy="316" r="4" fill="currentColor" />
      {/* Inner rect dots — corners only, lighter so the visual
          hierarchy reads (outer = primary, inner = supporting). */}
      <circle cx="96" cy="116" r="4" fill="currentColor" opacity="0.7" />
      <circle cx="224" cy="116" r="4" fill="currentColor" opacity="0.7" />
      <circle cx="96" cy="272" r="4" fill="currentColor" opacity="0.7" />
      <circle cx="224" cy="272" r="4" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function FunnelPaths() {
  return (
    <svg
      className="block h-full w-full"
      viewBox="0 0 320 370"
      fill="none"
      aria-hidden="true"
    >
      <path d="M -2,38 C 80,38 140,185 322,185" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M -2,88 C 80,88 148,185 322,185" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M -2,135 C 80,135 155,185 322,185" stroke="currentColor" strokeWidth="2.25" fill="none" />
      <path d="M -2,185 C 80,185 160,185 322,185" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M -2,235 C 80,235 155,185 322,185" stroke="currentColor" strokeWidth="2.25" fill="none" />
      <path d="M -2,282 C 80,282 148,185 322,185" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M -2,332 C 80,332 140,185 322,185" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="2" cy="38" r="5" fill="currentColor" />
      <circle cx="2" cy="88" r="5" fill="currentColor" />
      <circle cx="2" cy="135" r="5" fill="currentColor" />
      <circle cx="2" cy="185" r="5" fill="currentColor" />
      <circle cx="2" cy="235" r="5" fill="currentColor" />
      <circle cx="2" cy="282" r="5" fill="currentColor" />
      <circle cx="2" cy="332" r="5" fill="currentColor" />
      <circle cx="322" cy="185" r="5" fill="currentColor" />
    </svg>
  );
}

function MagneticField() {
  return (
    <svg
      className="block h-full w-full"
      viewBox="0 0 320 370"
      fill="none"
      aria-hidden="true"
    >
      <path d="M 8,185 C 8,-10 312,-10 312,185" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.32" />
      <path d="M 8,185 C 8,380 312,380 312,185" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.32" />
      <path d="M 8,185 C 8,28 312,28 312,185" stroke="currentColor" strokeWidth="1.75" fill="none" opacity="0.5" />
      <path d="M 8,185 C 8,342 312,342 312,185" stroke="currentColor" strokeWidth="1.75" fill="none" opacity="0.5" />
      <path d="M 8,185 C 8,70 312,70 312,185" stroke="currentColor" strokeWidth="2.25" fill="none" />
      <path d="M 8,185 C 8,300 312,300 312,185" stroke="currentColor" strokeWidth="2.25" fill="none" />
      <path d="M 8,185 C 8,108 312,108 312,185" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M 8,185 C 8,262 312,262 312,185" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M 8,185 C 8,138 312,138 312,185" stroke="currentColor" strokeWidth="1.75" fill="none" opacity="0.5" />
      <path d="M 8,185 C 8,232 312,232 312,185" stroke="currentColor" strokeWidth="1.75" fill="none" opacity="0.5" />
      <path d="M 8,185 C 8,160 312,160 312,185" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.32" />
      <path d="M 8,185 C 8,210 312,210 312,185" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.32" />
      <circle cx="8" cy="185" r="5" fill="currentColor" />
      <circle cx="312" cy="185" r="5" fill="currentColor" />
    </svg>
  );
}

function SineWave() {
  return (
    <svg
      className="block h-full w-full"
      viewBox="0 0 320 370"
      fill="none"
      aria-hidden="true"
    >
      <line x1="-2" y1="185" x2="322" y2="185" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {/* Trough on the left, crest on the right — reads as ascending growth */}
      <path
        d="M -2,185 C 25,185 38,302 80,302 C 122,302 135,185 160,185 C 185,185 198,68 240,68 C 282,68 295,185 322,185"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      <line x1="80" y1="302" x2="80" y2="185" stroke="currentColor" strokeWidth="1.25" opacity="0.35" strokeDasharray="3 4" />
      <line x1="240" y1="68" x2="240" y2="185" stroke="currentColor" strokeWidth="1.25" opacity="0.35" strokeDasharray="3 4" />
      <circle cx="-2" cy="185" r="5" fill="currentColor" />
      <circle cx="160" cy="185" r="5" fill="currentColor" />
      <circle cx="322" cy="185" r="5" fill="currentColor" />
      <circle cx="80" cy="302" r="5" fill="currentColor" />
      <circle cx="240" cy="68" r="5" fill="currentColor" />
    </svg>
  );
}

function HelixCoil() {
  return (
    <svg
      className="block h-full w-full"
      viewBox="0 0 320 370"
      fill="none"
      aria-hidden="true"
    >
      <line x1="-2" y1="185" x2="322" y2="185" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <ellipse cx="60" cy="185" rx="32" ry="100" stroke="currentColor" strokeWidth="2.25" fill="none" />
      <ellipse cx="108" cy="185" rx="32" ry="100" stroke="currentColor" strokeWidth="2.25" fill="none" />
      <ellipse cx="156" cy="185" rx="32" ry="100" stroke="currentColor" strokeWidth="2.25" fill="none" />
      <ellipse cx="204" cy="185" rx="32" ry="100" stroke="currentColor" strokeWidth="2.25" fill="none" />
      <ellipse cx="252" cy="185" rx="32" ry="100" stroke="currentColor" strokeWidth="2.25" fill="none" />
      <circle cx="28" cy="185" r="5" fill="currentColor" />
      <circle cx="284" cy="185" r="5" fill="currentColor" />
      <circle cx="60" cy="85" r="5" fill="currentColor" />
      <circle cx="156" cy="85" r="5" fill="currentColor" />
      <circle cx="252" cy="85" r="5" fill="currentColor" />
      <circle cx="60" cy="285" r="5" fill="currentColor" />
      <circle cx="156" cy="285" r="5" fill="currentColor" />
      <circle cx="252" cy="285" r="5" fill="currentColor" />
    </svg>
  );
}

const ART: Record<CoverMotif, () => React.JSX.Element> = {
  "vanishing-grid": VanishingGrid,
  "nested-ovals": NestedOvals,
  "circuit-path": CircuitPath,
  "funnel-paths": FunnelPaths,
  "magnetic-field": MagneticField,
  "sine-wave": SineWave,
  "helix-coil": HelixCoil,
};
