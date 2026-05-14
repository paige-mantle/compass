/**
 * Inline SVG dictionary for the 7 manual covers on /compass/manuals.
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
  return (
    <svg
      className="block h-full w-full"
      viewBox="0 0 320 370"
      fill="none"
      aria-hidden="true"
    >
      <line x1="-30" y1="345" x2="350" y2="345" stroke="currentColor" strokeWidth="2.5" opacity="0.95" />
      <line x1="-10" y1="300" x2="330" y2="300" stroke="currentColor" strokeWidth="2.25" opacity="0.85" />
      <line x1="4" y1="265" x2="316" y2="265" stroke="currentColor" strokeWidth="1.85" opacity="0.7" />
      <line x1="22" y1="234" x2="298" y2="234" stroke="currentColor" strokeWidth="1.55" opacity="0.57" />
      <line x1="40" y1="206" x2="280" y2="206" stroke="currentColor" strokeWidth="1.3" opacity="0.45" />
      <line x1="56" y1="181" x2="264" y2="181" stroke="currentColor" strokeWidth="1.05" opacity="0.34" />
      <line x1="69" y1="159" x2="251" y2="159" stroke="currentColor" strokeWidth="0.85" opacity="0.24" />
      <line x1="81" y1="141" x2="239" y2="141" stroke="currentColor" strokeWidth="0.65" opacity="0.15" />
      {[
        [-30, 345], [24, 345], [78, 345], [132, 345],
        [188, 345], [242, 345], [296, 345], [350, 345],
      ].map(([x2, y2], i) => (
        <line
          key={i}
          x1="160"
          y1="60"
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.55"
        />
      ))}
      <circle cx="160" cy="60" r="6" fill="currentColor" />
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
      <circle cx="100" cy="25" r="4" fill="currentColor" />
      <circle cx="160" cy="25" r="4" fill="currentColor" />
      <circle cx="220" cy="25" r="4" fill="currentColor" />
      <circle cx="100" cy="345" r="4" fill="currentColor" />
      <circle cx="160" cy="345" r="4" fill="currentColor" />
      <circle cx="220" cy="345" r="4" fill="currentColor" />
    </svg>
  );
}

function CircuitPath() {
  return (
    <svg
      className="block h-full w-full"
      viewBox="0 0 320 370"
      fill="none"
      aria-hidden="true"
    >
      <line x1="-2" y1="185" x2="60" y2="185" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="185" x2="60" y2="80" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="80" x2="260" y2="80" stroke="currentColor" strokeWidth="2.5" />
      <line x1="260" y1="80" x2="260" y2="290" stroke="currentColor" strokeWidth="2.5" />
      <line x1="260" y1="290" x2="60" y2="290" stroke="currentColor" strokeWidth="2.5" />
      <line x1="60" y1="290" x2="60" y2="185" stroke="currentColor" strokeWidth="2.5" />
      <line x1="160" y1="80" x2="160" y2="290" stroke="currentColor" strokeWidth="1.75" opacity="0.5" />
      <line x1="60" y1="185" x2="260" y2="185" stroke="currentColor" strokeWidth="1.75" opacity="0.45" />
      <line x1="110" y1="80" x2="110" y2="290" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <line x1="210" y1="80" x2="210" y2="290" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <line x1="60" y1="132" x2="260" y2="132" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <line x1="60" y1="237" x2="260" y2="237" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <line x1="60" y1="80" x2="60" y2="48" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <line x1="260" y1="290" x2="260" y2="322" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <line x1="260" y1="185" x2="322" y2="185" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="60" cy="185" r="6.5" fill="currentColor" />
      <circle cx="260" cy="185" r="6.5" fill="currentColor" />
      <circle cx="60" cy="80" r="5.5" fill="currentColor" />
      <circle cx="260" cy="80" r="5.5" fill="currentColor" />
      <circle cx="60" cy="290" r="5.5" fill="currentColor" />
      <circle cx="260" cy="290" r="5.5" fill="currentColor" />
      <circle cx="160" cy="80" r="5" fill="currentColor" />
      <circle cx="160" cy="185" r="5" fill="currentColor" />
      <circle cx="160" cy="290" r="5" fill="currentColor" />
      <circle cx="110" cy="132" r="3" fill="currentColor" opacity="0.7" />
      <circle cx="210" cy="132" r="3" fill="currentColor" opacity="0.7" />
      <circle cx="110" cy="237" r="3" fill="currentColor" opacity="0.7" />
      <circle cx="210" cy="237" r="3" fill="currentColor" opacity="0.7" />
      <circle cx="60" cy="48" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="260" cy="322" r="3" fill="currentColor" opacity="0.6" />
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
      <circle cx="2" cy="38" r="4.5" fill="currentColor" />
      <circle cx="2" cy="88" r="4.5" fill="currentColor" />
      <circle cx="2" cy="135" r="5" fill="currentColor" />
      <circle cx="2" cy="185" r="5.5" fill="currentColor" />
      <circle cx="2" cy="235" r="5" fill="currentColor" />
      <circle cx="2" cy="282" r="4.5" fill="currentColor" />
      <circle cx="2" cy="332" r="4.5" fill="currentColor" />
      <circle cx="322" cy="185" r="8" fill="currentColor" />
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
      <circle cx="8" cy="185" r="14" fill="currentColor" />
      <circle cx="312" cy="185" r="14" fill="currentColor" />
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
      <circle cx="160" cy="185" r="6" fill="currentColor" />
      <circle cx="322" cy="185" r="5" fill="currentColor" />
      <circle cx="80" cy="302" r="5.5" fill="currentColor" />
      <circle cx="240" cy="68" r="5.5" fill="currentColor" />
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
      <circle cx="60" cy="85" r="4" fill="currentColor" />
      <circle cx="156" cy="85" r="4" fill="currentColor" />
      <circle cx="252" cy="85" r="4" fill="currentColor" />
      <circle cx="60" cy="285" r="4" fill="currentColor" />
      <circle cx="156" cy="285" r="4" fill="currentColor" />
      <circle cx="252" cy="285" r="4" fill="currentColor" />
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
