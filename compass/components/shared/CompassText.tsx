import type { ReactNode, ElementType } from "react";

/**
 * Compass text primitive — light-mirror of Mantle's `Text.astro`.
 *
 * Centralizes the type ramp so every Compass surface composes
 * headings/body the same way. Mirrors Mantle's variant matrix 1:1:
 *
 *   • `type`     → "heading" | "headingMono" | "body" (inferred from
 *                  size flags / props or set explicitly)
 *   • `size`     → "headingXl" | "headingLg" | "headingMd" |
 *                  "headingSm" | "headingXs" | "bodyXxl" | "bodyXl" |
 *                  "bodyLg" | raw scale "7xl" → "xxs"
 *   • `color`    → fg-high / medium / low / lower (with shorthand
 *                  aliases) / accent / accent-alt
 *   • `align`    → left / center / right
 *   • `weight`   → thin → black
 *   • `tracking` → tighter → widest
 *   • `leading`  → none / tightest → loosest
 *   • `transform`→ uppercase / lowercase / capitalize / normal
 *   • `italic`
 *   • `as`       → element tag (default `<p>`)
 *
 * Convenience boolean flags (`heading`, `headingXl`, `bodyXl`, etc.)
 * are honored exactly as in Mantle so callers from either codebase
 * can use the same JSX without changes.
 *
 * Default leading + tracking are derived from `type` / `size` so the
 * common case (just pick a size) Just Works:
 *   • heading      → leading-tighter, tracking-tight
 *   • headingXl    → leading-tightest (overrides heading default)
 *   • headingMono  → leading-loose, uppercase, tracking-wider (from
 *                    the type class itself)
 *   • body         → leading-loose
 */

type Type = "heading" | "headingMono" | "body";
type Align = "left" | "center" | "right";
type Size =
  | "headingXl"
  | "headingLg"
  | "headingMd"
  | "headingSm"
  | "headingXs"
  | "bodyXxl"
  | "bodyXl"
  | "bodyLg"
  | "7xl"
  | "6xl"
  | "5xl"
  | "4xl"
  | "3xl"
  | "2xl"
  | "xl"
  | "lg"
  | "base"
  | "md"
  | "sm"
  | "xs"
  | "xxs";
type Color =
  | "fg-high"
  | "fg-medium"
  | "fg-low"
  | "fg-lower"
  | "high"
  | "medium"
  | "low"
  | "lower"
  | "accent"
  | "accent-alt";
type Tracking = "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
type Weight =
  | "thin"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";
type Leading =
  | "none"
  | "tightest"
  | "tighter"
  | "tight"
  | "normal"
  | "loose"
  | "looser"
  | "loosest";
type Transform = "uppercase" | "lowercase" | "capitalize" | "normal";

const TYPE_CLASS: Record<Type, string> = {
  heading: "font-heading font-normal",
  headingMono: "font-mono font-medium tracking-wider uppercase",
  body: "",
};

const SIZE_CLASS: Record<Size, string> = {
  headingXl: "text-5xl md:text-7xl text-fg-high",
  headingLg: "text-3xl md:text-6xl text-fg-high",
  headingMd: "text-2xl sm:text-4xl text-fg-high",
  headingSm: "text-base",
  headingXs: "text-sm",
  bodyXxl: "text-lg md:text-xl",
  bodyXl: "text-xl",
  bodyLg: "text-lg",
  "7xl": "text-7xl",
  "6xl": "text-6xl",
  "5xl": "text-5xl",
  "4xl": "text-4xl",
  "3xl": "text-3xl",
  "2xl": "text-2xl",
  xl: "text-xl",
  lg: "text-lg",
  base: "text-base",
  md: "text-md",
  sm: "text-sm",
  xs: "text-xs",
  xxs: "text-xxs",
};

const COLOR_CLASS: Record<Color, string> = {
  "fg-high": "text-fg-high",
  "fg-medium": "text-fg-medium",
  "fg-low": "text-fg-low",
  "fg-lower": "text-fg-lower",
  high: "text-fg-high",
  medium: "text-fg-medium",
  low: "text-fg-low",
  lower: "text-fg-lower",
  accent: "text-accent-high",
  "accent-alt": "text-accent-alt-high",
};

const ALIGN_CLASS: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const WEIGHT_CLASS: Record<Weight, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

const TRACKING_CLASS: Record<Tracking, string> = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

const LEADING_CLASS: Record<Leading, string> = {
  none: "leading-none",
  tightest: "leading-tightest",
  tighter: "leading-tighter",
  tight: "leading-tight",
  normal: "leading-normal",
  loose: "leading-loose",
  looser: "leading-looser",
  loosest: "leading-loosest",
};

const TRANSFORM_CLASS: Record<Transform, string> = {
  uppercase: "uppercase",
  lowercase: "lowercase",
  capitalize: "capitalize",
  normal: "normal-case",
};

// Defaults derived from type/size, matching Mantle's
// SIZE_LEADING_DEFAULTS / TYPE_LEADING_DEFAULTS / TYPE_TRACKING_DEFAULTS.
const SIZE_LEADING_DEFAULTS: Partial<Record<Size, Leading>> = {
  headingXl: "tightest",
};
const TYPE_LEADING_DEFAULTS: Record<Type, Leading> = {
  heading: "tighter",
  headingMono: "loose",
  body: "loose",
};
const TYPE_TRACKING_DEFAULTS: Partial<Record<Type, Tracking>> = {
  heading: "tight",
};

type CompassTextProps = {
  children: ReactNode;
  as?: ElementType;
  id?: string;
  className?: string;

  // explicit picks
  type?: Type;
  size?: Size;
  color?: Color;
  align?: Align;
  tracking?: Tracking;
  weight?: Weight;
  leading?: Leading;
  transform?: Transform;
  italic?: boolean;

  // convenience flags — same syntactic sugar Mantle exposes
  heading?: boolean;
  headingXl?: boolean;
  headingLg?: boolean;
  headingMd?: boolean;
  headingSm?: boolean;
  headingXs?: boolean;
  headingMono?: boolean;
  mono?: boolean;
  bodyXxl?: boolean;
  bodyXl?: boolean;
  bodyLg?: boolean;
};

export function CompassText({
  children,
  as,
  id,
  className,

  type: typeProp,
  size: sizeProp,
  color,
  align = "left",
  tracking,
  weight,
  leading,
  transform,
  italic,

  heading,
  headingXl,
  headingLg,
  headingMd,
  headingSm,
  headingXs,
  headingMono,
  mono,
  bodyXxl,
  bodyXl,
  bodyLg,
}: CompassTextProps) {
  // Resolve size: explicit `size` wins, then the boolean flags.
  const size: Size | undefined =
    sizeProp ??
    (headingXl
      ? "headingXl"
      : headingLg
      ? "headingLg"
      : headingMd
      ? "headingMd"
      : headingSm
      ? "headingSm"
      : headingXs
      ? "headingXs"
      : bodyXxl
      ? "bodyXxl"
      : bodyXl
      ? "bodyXl"
      : bodyLg
      ? "bodyLg"
      : undefined);

  // Resolve type: headingMono / mono win, then derive from size,
  // then fall back to body / heading flags or explicit type.
  const isHeadingFlag =
    heading ||
    headingXl ||
    headingLg ||
    headingMd ||
    headingSm ||
    headingXs;
  const isBodyFlag = bodyXxl || bodyXl || bodyLg;
  const type: Type | undefined =
    typeProp ??
    (headingMono || mono
      ? "headingMono"
      : isHeadingFlag
      ? "heading"
      : isBodyFlag
      ? "body"
      : undefined);

  // Defaults derived from type/size if caller didn't pass them.
  const effectiveLeading: Leading | undefined =
    leading ??
    (size ? SIZE_LEADING_DEFAULTS[size] : undefined) ??
    (type ? TYPE_LEADING_DEFAULTS[type] : undefined);

  const effectiveTracking: Tracking | undefined =
    tracking ?? (type ? TYPE_TRACKING_DEFAULTS[type] : undefined);

  const classes = [
    type ? TYPE_CLASS[type] : "",
    size ? SIZE_CLASS[size] : "",
    color ? COLOR_CLASS[color] : "",
    ALIGN_CLASS[align],
    weight ? WEIGHT_CLASS[weight] : "",
    effectiveTracking ? TRACKING_CLASS[effectiveTracking] : "",
    effectiveLeading ? LEADING_CLASS[effectiveLeading] : "",
    transform ? TRANSFORM_CLASS[transform] : "",
    italic ? "italic" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const Tag: ElementType = as ?? "p";

  return (
    <Tag id={id} className={classes}>
      {children}
    </Tag>
  );
}
