import type { ReactNode } from "react";
import { CompassButton } from "./CompassButton";
import { CompassPromptHeading } from "./CompassPromptHeading";
import { COMPASS_H1_CLASS } from "./compass-h1";

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
      <div className="mx-auto w-full max-w-page px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-12 gap-6">
          <div className={`col-span-12 flex flex-col gap-4 ${contentColSpan}`}>
            {/* Heading row — 7/5 split at lg+, stacked on mobile. */}
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7 flex flex-col gap-4">
                {subheading ? (
                  <CompassPromptHeading text={String(subheading)} />
                ) : null}
                {/* Canonical Compass H1 recipe — see
                    `shared/compass-h1.ts`. Every page-level heading
                    across Compass uses the same byte-for-byte class
                    string. */}
                <h1 className={`m-0 ${COMPASS_H1_CLASS}`}>{heading}</h1>
              </div>

              {description ? (
                /* Description recipe ported from the next-gen
                   `<Text bodyXl>` slot inside `HeroSection.astro`:
                   `text-xl leading-loose text-fg-medium max-w-170
                   pb-2`. The previous Compass version used
                   `text-fg-low` + `leading-tight` + `max-w-[42ch]`
                   which read as lower-contrast + a tighter line +
                   a narrower column than the marketing site.
                   Aligned here so the marketing-hero description
                   reads identically across heymantle.com and
                   Compass. */
                <div className="lg:col-span-5 lg:self-end lg:flex lg:justify-end">
                  <p className="m-0 pb-2 max-w-[680px] font-sans text-xl leading-loose text-fg-medium">
                    {description}
                  </p>
                </div>
              ) : null}
            </div>

            {!hideButtons ? (
              <div className="flex flex-row gap-2 sm:gap-4 w-full pt-4">
                {/* Icon config matches the Mantle header
                    `Button.astro` recipe byte-for-byte:
                    `{ icon: "ArrowRight", size: 16, position: "right" }`.
                    Without `position: "right"` the icon resolves as
                    a left-icon and the button picks `pl-3 pr-4`;
                    worse, the previous kebab string "arrow-right"
                    didn't resolve against the Lucide namespace
                    (`ArrowRight`) so no icon rendered at all and the
                    button fell back to `px-4` (32px total horizontal
                    padding). PascalCase icon name + `position:
                    "right"` gives the canonical `pl-4 pr-3` (28px). */}
                <CompassButton
                  primary
                  href={href}
                  icon={{ icon: "ArrowRight", size: 16, position: "right" }}
                >
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
