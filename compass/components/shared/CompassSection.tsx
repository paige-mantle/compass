import type { ReactNode } from "react";

/**
 * Compass section — light-mirror of Mantle's marketing `Section.astro`.
 *
 * Full API parity with the parent system. Provides the standard
 * wrapper for any page-level content band: surface color, vertical
 * padding rhythm, max-width measure, optional dividers, optional
 * full-bleed height.
 *
 *   • `color`      → surface tier ("highest" → "lowest") → bg fill
 *   • `topPadding` / `bottomPadding`
 *                  → "none" | "slim" | "default" | "loose"
 *   • `narrow` / `extraNarrow`
 *                  → switches inner width:
 *                      default     = max-w-330 (1320px)
 *                      narrow      = max-w-240 (960px)
 *                      extraNarrow = max-w-190 (760px)
 *   • `divider`    → "top" | "bottom" | "both"
 *                  → OR `{ position, width: "inner" | "full" }`
 *                  → `inner` draws an absolute-positioned line that
 *                    respects the section's horizontal padding;
 *                    `full` puts the border on the outer wrapper so
 *                    it spans the full viewport
 *   • `textCenter` → toggles `text-center` on the inner container
 *   • `flush`      → switches inner padding to `px-2` (almost edge-
 *                    to-edge) instead of `px-4 sm:px-6 md:px-8`
 *   • `height`     → "full" → adds `min-h-screen` to the wrapper
 *   • `hideOverflow` → toggles `overflow-hidden` on the wrapper
 *   • `wrapperClassName` / `className` → escape hatches
 */

type Color = "highest" | "higher" | "high" | "medium" | "low" | "lower" | "lowest";
type Padding = "none" | "slim" | "default" | "loose";
type Width = "default" | "narrow" | "extraNarrow";
type DividerPosition = "top" | "bottom" | "both";
type DividerWidth = "inner" | "full";

type DividerProp =
  | DividerPosition
  | { position: DividerPosition; width?: DividerWidth };

const BG_CLASS: Record<Color, string> = {
  highest: "bg-surface-highest",
  higher: "bg-surface-higher",
  high: "bg-surface-high",
  medium: "bg-surface-medium",
  low: "bg-surface-low",
  lower: "bg-surface-lower",
  lowest: "bg-surface-lowest",
};

const TOP_PAD_CLASS: Record<Padding, string> = {
  none: "pt-0 sm:pt-0",
  slim: "pt-8 sm:pt-12",
  default: "pt-16 sm:pt-24",
  loose: "pt-16 sm:pt-24 md:pt-32",
};

const BOTTOM_PAD_CLASS: Record<Padding, string> = {
  none: "pb-0 sm:pb-0",
  slim: "pb-8 sm:pb-12",
  default: "pb-16 sm:pb-24",
  loose: "pb-16 sm:pb-24 md:pb-32",
};

const WIDTH_CLASS: Record<Width, string> = {
  default: "max-w-[1320px]",
  narrow: "max-w-[960px]",
  extraNarrow: "max-w-[760px]",
};

type CompassSectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  wrapperClassName?: string;
  color?: Color;
  divider?: DividerProp;
  narrow?: boolean;
  extraNarrow?: boolean;
  height?: "full";
  hideOverflow?: boolean;
  topPadding?: Padding;
  bottomPadding?: Padding;
  textCenter?: boolean;
  flush?: boolean;
};

function resolveDivider(
  value: DividerProp | undefined,
): { position: DividerPosition; width: DividerWidth } | undefined {
  if (!value) return undefined;
  if (typeof value === "string") {
    return { position: value, width: "inner" };
  }
  if (typeof value === "object" && value.position) {
    return { position: value.position, width: value.width ?? "inner" };
  }
  return undefined;
}

export function CompassSection({
  children,
  id,
  className,
  wrapperClassName,
  color,
  divider,
  narrow,
  extraNarrow,
  height,
  hideOverflow,
  topPadding = "default",
  bottomPadding = "default",
  textCenter,
  flush = false,
}: CompassSectionProps) {
  const width: Width = extraNarrow ? "extraNarrow" : narrow ? "narrow" : "default";

  const colorBgClass = color ? BG_CLASS[color] : "";
  const resolvedDivider = resolveDivider(divider);

  const wrapperDividerClass = resolvedDivider?.width === "full"
    ? resolvedDivider.position === "top"
      ? "border-t"
      : resolvedDivider.position === "bottom"
      ? "border-b"
      : "border-y"
    : "";

  const wrapperClasses = [
    "relative",
    hideOverflow ? "overflow-hidden" : "",
    height === "full" ? "min-h-screen" : "",
    colorBgClass,
    wrapperDividerClass,
    wrapperClassName ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const innerPaddingClass = flush ? "px-2" : "px-4 sm:px-6 md:px-8";

  const innerClasses = [
    "relative z-10 mx-auto",
    TOP_PAD_CLASS[topPadding],
    BOTTOM_PAD_CLASS[bottomPadding],
    WIDTH_CLASS[width],
    textCenter ? "text-center" : "",
    innerPaddingClass,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  // Inner dividers — absolute lines that respect the section's
  // horizontal padding (offset from the inner edges, not the
  // viewport). Mirrors Mantle's `innerFlushOffset` recipe.
  const innerFlushOffset = flush
    ? "left-2 right-2"
    : "left-6 md:left-8 right-6 md:right-8";

  const showTopInnerDivider =
    resolvedDivider?.width === "inner" &&
    (resolvedDivider.position === "top" || resolvedDivider.position === "both");
  const showBottomInnerDivider =
    resolvedDivider?.width === "inner" &&
    (resolvedDivider.position === "bottom" ||
      resolvedDivider.position === "both");

  return (
    <div id={id} className={wrapperClasses}>
      <div className={innerClasses}>
        {showTopInnerDivider ? (
          <div
            className={`absolute top-0 ${innerFlushOffset} border-t border-edge-medium`}
            aria-hidden="true"
          />
        ) : null}
        {children}
        {showBottomInnerDivider ? (
          <div
            className={`absolute bottom-0 ${innerFlushOffset} border-b border-edge-medium`}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  );
}
