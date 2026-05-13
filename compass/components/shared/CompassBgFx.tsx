import type { CSSProperties } from "react";

/**
 * Compass background-effects layer — light-mirror of Mantle's
 * marketing `BgFx.astro`.
 *
 *   <div
 *     class={`pointer-events-none absolute inset-0 z-0 ${className}`}
 *     aria-hidden="true"
 *     data-bg-fx
 *   >
 *     {showAmbient && <div data-bg-ambient></div>}
 *   </div>
 *
 * Two layers, both styled by globals.css via the data-attributes:
 *
 *   • `data-bg-fx`      → the wrapper. Pages that want a scoped
 *                         tint set `--bg-ambient-color` here, and
 *                         the wrapper inherits via the
 *                         `[data-bg-fx-scope]` selector.
 *   • `data-bg-ambient` → the giant rotating radial-gradient
 *                         ellipse anchored to the top-right
 *                         corner. Color comes from
 *                         `--bg-ambient-color` (defaults to
 *                         `--color-ambient`). Animation:
 *                         `bg-shaft-1` (18s, ease-in-out, infinite).
 *
 * `showNoise` is preserved from the Astro API for parity; if
 * `/seismic/noise.png` exists in /public it will be painted via the
 * `.bg-noise` utility class. Otherwise the layer renders empty and
 * does no harm.
 *
 * Usage — drop as the first child of a relative-positioned section:
 *
 *   <section className="relative overflow-hidden">
 *     <CompassBgFx />
 *     <div className="relative z-10">…content…</div>
 *   </section>
 *
 * The wrapper is `absolute inset-0 z-0`, so any sibling that lifts
 * itself with `relative z-10` (or higher) renders above the ambient
 * glow without further plumbing.
 */
export function CompassBgFx({
  className = "",
  showNoise = false,
  showAmbient = true,
  ambientColor,
}: {
  className?: string;
  showNoise?: boolean;
  showAmbient?: boolean;
  /**
   * Optional override for `--bg-ambient-color`. Lets a section tint
   * the glow without touching globals — e.g. accent tone on the
   * Compass hero, alt-accent on a sub-surface.
   */
  ambientColor?: string;
}) {
  const style: CSSProperties | undefined = ambientColor
    ? ({ ["--bg-ambient-color" as string]: ambientColor } as CSSProperties)
    : undefined;

  return (
    <div
      data-bg-fx
      data-bg-fx-scope={ambientColor ? "" : undefined}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={style}
    >
      {showAmbient ? <div data-bg-ambient /> : null}
      {showNoise ? (
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.04]" />
      ) : null}
    </div>
  );
}
