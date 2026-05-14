import type { ReactNode } from "react";
import * as Lucide from "lucide-react";

/**
 * Compass button — light-mirror of Mantle's marketing `Button.astro`.
 *
 * API parity with the parent system (translated from tailwind-variants
 * + Astro slots to a TS prop signature + children):
 *
 *   • `size`: "small" | "medium" | "large" (default "medium")
 *   • `tone` flags: `primary` | `secondary` | `insight` | (none → outline)
 *   • `icon`: `string` (Lucide name, default position = left) OR
 *     `{ icon, position?, size?, color?, gap? }`
 *   • `fullWidth`, `href`, `onClick`, `type`, `className`, `style`
 *   • Right-aligned icon on a `fullWidth` button uses `ml-auto` so
 *     the label sits left and the icon hugs the right edge
 *
 * Tone recipes match Mantle 1:1:
 *   primary   → bg-accent-medium, text-black, hover bg-accent-low
 *   insight   → bg-accent-alt-medium, text-white, hover bg-accent-alt-low
 *   secondary → bg-fg-high, text-surface-lower
 *   outline   → border-fg-lower/70, hover swaps to filled fg-high
 *
 * Sizes match Mantle:
 *   small  → h-7,  rounded-lg
 *   medium → h-9,  rounded-2xl   (default; 10px on Mantle's scale)
 *   large  → h-10, rounded-2xl
 *
 * Gap tokens (small icon-to-label spacing) — same numbers Mantle
 * exposes: xs=1, sm=1.5, md=2, lg=2.5, xl=3, where 1 unit = 4px
 * (the --spacing token). Passed in via a CSS custom property
 * `--button-icon-gap` so the gap can be tweaked per call without
 * blowing out the variant matrix.
 */

type IconGapToken = "xs" | "sm" | "md" | "lg" | "xl";
const ICON_GAP_TOKENS: Record<IconGapToken, number> = {
  xs: 1,
  sm: 1.5,
  md: 2,
  lg: 2.5,
  xl: 3,
};

function resolveIconGap(value: number | string | undefined): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `calc(var(--spacing) * ${value})`;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return `calc(var(--spacing) * ${ICON_GAP_TOKENS.md})`;
    if (trimmed in ICON_GAP_TOKENS) {
      return `calc(var(--spacing) * ${ICON_GAP_TOKENS[trimmed as IconGapToken]})`;
    }
    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
      return `calc(var(--spacing) * ${numeric})`;
    }
    return trimmed; // pass-through if caller wants a literal CSS value
  }
  return `calc(var(--spacing) * ${ICON_GAP_TOKENS.md})`;
}

type IconObject = {
  /** Lucide icon name, e.g. "ArrowRight", "Heart", "Search". */
  icon?: string;
  position?: "left" | "right";
  size?: number;
  color?: string;
  /** Token ("xs".."xl"), spacing-unit number, or raw CSS length. */
  gap?: number | string;
};

type ButtonSize = "small" | "medium" | "large";

type CompassButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  primary?: boolean;
  secondary?: boolean;
  insight?: boolean;
  fullWidth?: boolean;
  size?: ButtonSize;
  /** Lucide icon name (string) or full config object. */
  icon?: string | IconObject;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  target?: string;
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  small: "h-7 rounded-lg",
  medium: "h-9 rounded-2xl",
  large: "h-10 rounded-2xl",
};

/* Tone recipes — byte-for-byte match of Mantle Button.astro
   `variants.tone`. Primary / insight / secondary intentionally
   carry NO border (the filled background is the only edge).
   Explicit `hover:text-*` is added on top of the canonical recipe
   because compass-base.css `a:hover { color: var(--gold) }` was
   bleeding gold/purple text into buttons rendered as `<a href>`
   (especially on manual pages where `--gold` = manifest accent). */
const TONE_CLASSES = {
  primary:
    "bg-accent-medium hover:bg-accent-low text-black hover:text-black",
  insight:
    "bg-accent-alt-medium hover:bg-accent-alt-low text-white hover:text-white",
  secondary:
    "bg-fg-high text-surface-lower hover:text-surface-lower",
  outline:
    "bg-transparent border border-fg-lower/70 text-fg-high hover:border-transparent hover:bg-fg-high hover:text-surface-lower",
} as const;

// Compound padding by size × icon position — matches Mantle's
// `compoundVariants` array so the icon-side padding is tighter
// than the label-side.
function paddingClass(size: ButtonSize, iconPadding: "none" | "left" | "right"): string {
  if (size === "small") {
    if (iconPadding === "left") return "pl-2.5 pr-3.5";
    if (iconPadding === "right") return "pl-3.5 pr-2.5";
    return "px-3.5";
  }
  if (size === "medium") {
    if (iconPadding === "left") return "pl-3 pr-4";
    if (iconPadding === "right") return "pl-4 pr-3";
    return "px-4";
  }
  // large
  if (iconPadding === "left") return "pl-4 pr-5";
  if (iconPadding === "right") return "pl-5 pr-4";
  return "px-5";
}

export function CompassButton({
  children,
  href,
  onClick,
  type,
  primary,
  secondary,
  insight,
  fullWidth,
  size = "medium",
  icon,
  className = "",
  style,
  id,
  target,
}: CompassButtonProps) {
  // Resolve tone — first flag wins, fall through to outline.
  const tone =
    primary ? "primary" :
    secondary ? "secondary" :
    insight ? "insight" :
    "outline";

  // Normalize icon config.
  const iconConfig: IconObject | null =
    typeof icon === "string"
      ? { icon }
      : icon && typeof icon === "object"
      ? icon
      : null;
  const iconName = iconConfig?.icon;
  const iconPosition = iconConfig?.position === "right" ? "right" : "left";
  const iconSize = typeof iconConfig?.size === "number" ? iconConfig.size : 16;
  const iconColor = iconConfig?.color || "currentColor";
  const iconPadding: "none" | "left" | "right" = iconName
    ? (iconPosition === "right" ? "right" : "left")
    : "none";

  // Resolve a Lucide icon component by name. We look it up lazily on
  // the namespace so callers can pass any name without us pre-listing
  // each one. Falls back to `null` if the name doesn't resolve.
  const LucideIcon = iconName
    ? (Lucide as unknown as Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }>>)[iconName] ?? null
    : null;

  // Base class string — byte-for-byte match of Mantle Button.astro
  // `tv({ base: ... })`. `no-underline!` carries `!important` so it
  // beats any global `a:hover` underline rule when Tag is `<a>`.
  const classes = [
    "inline-flex items-center text-xs transition-colors cursor-pointer",
    "no-underline! font-medium leading-none text-center",
    "gap-x-[var(--button-icon-gap)] whitespace-nowrap",
    fullWidth ? "w-full" : "",
    SIZE_CLASSES[size],
    TONE_CLASSES[tone],
    paddingClass(size, iconPadding),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: React.CSSProperties = {
    ...style,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ["--button-icon-gap" as any]: resolveIconGap(iconConfig?.gap ?? "3"),
  };

  // Right-aligned icon on a fullWidth button — push to far right.
  const fullWidthRightIcon = Boolean(fullWidth) && iconName && iconPosition === "right";
  const rightIconClassName = fullWidthRightIcon ? "ml-auto shrink-0" : undefined;

  const inner = (
    <>
      {LucideIcon && iconPosition === "left" ? (
        <LucideIcon size={iconSize} color={iconColor} strokeWidth={2} aria-hidden />
      ) : null}
      <span className="inline-block">{children}</span>
      {LucideIcon && iconPosition === "right" ? (
        <LucideIcon
          size={iconSize}
          color={iconColor}
          strokeWidth={2}
          aria-hidden
          className={rightIconClassName}
        />
      ) : null}
    </>
  );

  if (href) {
    return (
      <a
        id={id}
        href={href}
        target={target}
        className={classes}
        style={mergedStyle}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      id={id}
      type={type ?? "button"}
      onClick={onClick}
      className={classes}
      style={mergedStyle}
    >
      {inner}
    </button>
  );
}
