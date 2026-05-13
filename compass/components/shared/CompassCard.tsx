import type { ReactNode } from "react";

/**
 * Compass card — light-mirror of Mantle's marketing `Card.astro`.
 *
 * API parity with the parent system:
 *
 *   • `rounded`: "default" | "xl"
 *       default → `rounded-xl`  (= 8px on Mantle's rounded scale)
 *       xl      → `rounded-4xl` (= 16px)
 *
 *   • `padding`: "none" | "default" | "loose" | "extraLoose"
 *       default    → `p-4 md:p-6`
 *       loose      → `p-6 md:p-8`
 *       extraLoose → `p-8 md:p-24`
 *       none       → `p-0`
 *
 *   • `outline`: true | false
 *       true  → `border border-edge-medium` (no surface fill)
 *       false → `bg-surface-high` (filled card — default)
 *
 * Becomes an `<a>` when `href` is set, with the same hover treatment
 * Mantle uses: `group duration-150 hover:bg-surface-higher`.
 *
 * The slot wraps in a `relative z-10 h-full` layer so any decorative
 * fill (the commented-out accent radial in the source) can sit
 * behind without intercepting clicks.
 */

type Rounded = "default" | "xl";
type Padding = "none" | "default" | "loose" | "extraLoose";

const ROUNDED_CLASS: Record<Rounded, string> = {
  default: "rounded-xl",
  xl: "rounded-4xl",
};

const PADDING_CLASS: Record<Padding, string> = {
  none: "p-0",
  default: "p-4 md:p-6",
  loose: "p-6 md:p-8",
  extraLoose: "p-8 md:p-24",
};

export function CompassCard({
  children,
  href,
  target = "_self",
  rounded = "default",
  padding = "default",
  outline = false,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  target?: string;
  rounded?: Rounded;
  padding?: Padding;
  outline?: boolean;
  className?: string;
}) {
  const surfaceClass = outline
    ? "border border-edge-medium"
    : "bg-surface-high";

  const interactiveClass = href ? "group duration-150 hover:bg-surface-higher" : "";

  const classes = [
    "relative overflow-hidden",
    ROUNDED_CLASS[rounded],
    PADDING_CLASS[padding],
    surfaceClass,
    interactiveClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Hover-glow gradient — preserved as a commented-out block in
  // the Mantle source. Uncomment if you want the accent-alt radial
  // halo on hover; the slot above already sits at `z-10` so it
  // layers correctly behind the content.
  // const glow = href ? (
  //   <div
  //     className="pointer-events-none absolute left-1/2 -top-1/6 aspect-square w-full -translate-x-1/4 -translate-y-1/2 rounded-full opacity-0 transition-transform duration-150 ease-out group-hover:opacity-10"
  //     style={{ background: "radial-gradient(ellipse at center, var(--color-accent-alt-low) 0%, transparent 70%)" }}
  //     aria-hidden
  //   />
  // ) : null;

  const inner = (
    <>
      {/* {glow} */}
      <div className="relative z-10 h-full">{children}</div>
    </>
  );

  if (href) {
    return (
      <a href={href} target={target} className={`${classes} no-underline`}>
        {inner}
      </a>
    );
  }

  return <div className={classes}>{inner}</div>;
}
