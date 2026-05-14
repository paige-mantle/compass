import type { ReactNode } from "react";
import { CompassButton } from "./CompassButton";
import { CompassPromptHeading } from "./CompassPromptHeading";

/**
 * Compass hero — light-mirror of Mantle's marketing `Hero.astro`.
 *
 * Same structural choices ported from the parent system:
 *
 *   • `<section>` shell with topPadding / bottomPadding variants
 *     (default | none) — Mantle's Section spacing model
 *   • 12-column grid; content occupies 7/12 (md+) when not narrow,
 *     full 12 when narrow / extraNarrow
 *   • Inside the content cell, a 7/5 split at lg+ puts the heading
 *     on the left (7 cols) and the description on the right (5
 *     cols), with the description self-aligned to the baseline of
 *     the heading
 *   • `PromptHeading` equivalent — mono uppercase eyebrow above
 *     the h1
 *   • Two-button row: primary gold CTA (with right-aligned arrow)
 *     + optional secondary outline button
 *   • Mobile: everything stacks single-column
 *
 * Light-theme deltas: surfaces, fg, edges resolve to the LIGHT
 * mirror tokens (already defined in globals.css). The hero CTA's
 * `bg-accent-medium` renders the same gold on both themes; only
 * the surrounding canvas flips.
 */

type SecondaryCta = { href: string; label: string };

export function CompassHero({
  subheading,
  heading,
  description,
  cta = "Get started",
  ctaResponsiveSuffix = "for free",
  href = "#",
  secondaryCta,
  hideButtons = false,
  narrow = false,
  extraNarrow = false,
  topPadding = "default",
  bottomPadding = "none",
  className = "",
}: {
  subheading?: ReactNode;
  heading: ReactNode;
  description?: ReactNode;
  cta?: ReactNode;
  /** Text appended to the CTA on `sm+` only (hidden on mobile). */
  ctaResponsiveSuffix?: string;
  href?: string;
  secondaryCta?: SecondaryCta;
  hideButtons?: boolean;
  narrow?: boolean;
  extraNarrow?: boolean;
  topPadding?: "default" | "none" | "lg";
  bottomPadding?: "default" | "none" | "lg";
  className?: string;
}) {
  const topPadClass =
    topPadding === "none" ? "" :
    topPadding === "lg" ? "pt-24 md:pt-32" :
    "pt-14 md:pt-20";
  const bottomPadClass =
    bottomPadding === "none" ? "" :
    bottomPadding === "lg" ? "pb-24 md:pb-32" :
    "pb-14 md:pb-20";

  // Content cell spans matched to Mantle's narrow / extraNarrow
  // semantics — narrow grids stay full 12 cols at md+, default
  // grids step down to 7/12 to leave breathing room on the right.
  const contentColSpan =
    narrow || extraNarrow ? "md:col-span-12" : "md:col-span-7";

  return (
    <section
      className={[
        "overflow-hidden sm:overflow-visible",
        topPadClass,
        bottomPadClass,
        className,
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-12 gap-6">
          <div className={`col-span-12 flex flex-col gap-4 ${contentColSpan}`}>
            {/* Heading row — 7/5 split at lg+, stacked on mobile. */}
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7 flex flex-col gap-3">
                {subheading ? (
                  <CompassPromptHeading text={String(subheading)} />
                ) : null}
                <h1
                  className={[
                    /* Canonical Compass hero recipe — matches Mantle
                       Hero.astro. text-5xl (32px) on mobile →
                       text-7xl (48px) at md+. font-normal, leading-
                       tighter, tracking-tight, text-fg-high. */
                    "m-0 font-heading font-normal text-left text-fg-high",
                    "text-5xl md:text-7xl",
                    "tracking-tight leading-tighter",
                  ].join(" ")}
                >
                  {heading}
                </h1>
              </div>

              {description ? (
                <div className="lg:col-span-5 lg:self-end lg:flex lg:justify-end">
                  <p className="m-0 pb-2 max-w-[42ch] font-sans text-xl leading-tight text-fg-low">
                    {description}
                  </p>
                </div>
              ) : null}
            </div>

            {!hideButtons ? (
              <div className="flex flex-row gap-2 sm:gap-4 w-full pt-4">
                <CompassButton primary href={href} icon="arrow-right">
                  {cta}
                  {ctaResponsiveSuffix ? (
                    <span className="hidden sm:inline">
                      {" "}
                      {ctaResponsiveSuffix}
                    </span>
                  ) : null}
                </CompassButton>
                {secondaryCta ? (
                  <CompassButton href={secondaryCta.href}>
                    {secondaryCta.label}
                  </CompassButton>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

// Local PromptHeading function removed — Hero now uses the
// shared `<CompassPromptHeading>` component (port of Mantle's
// `shared/PromptHeading.astro`).
