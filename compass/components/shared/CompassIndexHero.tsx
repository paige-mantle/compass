import Link from "next/link";
import type { ReactNode } from "react";
import { CompassPromptHeading } from "./CompassPromptHeading";

/**
 * Compass index hero — the eyebrow + h1 + summary recipe used on
 * every listing page (Compass home, Manuals, Methods, Templates,
 * Insights, Answers).
 *
 * Differs from `<CompassHero>` (the marketing hero with CTAs and
 * 7/5 split) in two ways:
 *   1. No CTA buttons — index pages don't have a primary action.
 *   2. Layout is a clean 7/5 grid at lg+: title block left, summary
 *      right (self-aligned to the title block's baseline).
 *
 * Typography matches the canonical Compass spec exactly:
 *   • Eyebrow — `<CompassPromptHeading>` (mono / medium / text-xs /
 *     uppercase / tracking-wider / leading-loose / text-accent-high)
 *   • H1     — font-heading / font-normal / text-5xl md:text-7xl /
 *              tracking-tight / leading-tighter / text-fg-high
 *   • Summary — text-xl / leading-tight / text-fg-high
 *
 * `eyebrow` defaults to "Compass" wrapped in a `<Link>` to /compass.
 * Pass `eyebrow={null}` to omit. Pass a string for a custom label,
 * or a ReactNode for full control.
 */
export function CompassIndexHero({
  heading,
  description,
  eyebrow = "Compass",
  eyebrowHref = "/compass",
}: {
  heading: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode | null;
  eyebrowHref?: string;
}) {
  return (
    // Top padding clears the 64px sticky `.site-header`:
    //   • mobile  pt-16 (64px) — exactly clears the header height
    //   • desktop md:pt-24 (96px) — extra breathing room so the
    //     eyebrow doesn't sit right under the header rule
    // Matches the canonical `<CompassHero>` spacing pattern
    // (pt-14 md:pt-20) but a notch larger because index pages
    // don't have a hero CTA-row underneath to balance the visual
    // weight.
    <section className="pt-16 pb-12 md:pt-24 md:pb-14">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="flex flex-col gap-3 lg:col-span-7">
          {eyebrow === null ? null : typeof eyebrow === "string" ? (
            <Link
              href={eyebrowHref}
              aria-label={`Back to ${eyebrow}`}
              className="no-underline"
            >
              <CompassPromptHeading text={eyebrow} color="accent" />
            </Link>
          ) : (
            eyebrow
          )}
          <h1
            className="
              m-0 font-heading font-normal text-left text-fg-high
              text-5xl md:text-7xl tracking-tight leading-tighter
            "
          >
            {heading}
          </h1>
        </div>
        {description ? (
          <p className="m-0 max-w-[60ch] font-sans text-xl leading-tight text-fg-high lg:col-span-5 lg:justify-self-end">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
