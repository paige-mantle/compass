import Link from "next/link";
import type { ReactNode } from "react";
import { CompassPromptHeading } from "./CompassPromptHeading";
import { COMPASS_H1_COMPACT_CLASS } from "./compass-h1";

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
    /* Top padding pinned to `pt-14 md:pt-20` (56/80px) — matches the
       canonical Compass hero recipe (`CompassHero`) so every hero
       across the site sits on the same vertical rhythm. This is
       intentionally tighter than the next-gen Mantle marketing
       `Section topPadding="default"` (`pt-16 sm:pt-24`, 64/96px):
       Compass is a content hub — content-forward, so users reach
       the hero+grid faster without a big editorial breath above.
       Bottom padding stays minimal (`pb-6 md:pb-8` = 24/32px) because
       the section nav directly follows the hero. */
    <section className="pt-14 md:pt-20 pb-6 md:pb-8">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
        {/* Eyebrow → h1 gap is `gap-4` (16px) — verified against
            the next-gen Mantle `Stack` default (`gap: "md"` →
            `gap-4`) used inside `HeroSection.astro` to space the
            `<PromptHeading>` above the `<h1>`. Earlier turns
            pinned this at `gap-3` thinking that was the spec; it
            wasn't. Holding at `gap-4` so every Compass eyebrow +
            h1 cluster lines up with the marketing site. */}
        <div className="flex flex-col gap-4 lg:col-span-7">
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
          {/* Compact H1 — see `shared/compass-h1.ts`. One Tailwind
              step down from the marketing-hero scale; listing pages
              read as quieter editorial headers next to `/compass`. */}
          <h1 className={`m-0 ${COMPASS_H1_COMPACT_CLASS}`}>{heading}</h1>
        </div>
        {description ? (
          /* Description recipe pulled from the next-gen Mantle
             `<Text bodyXl>` slot inside `HeroSection.astro`:
             `text-left text-xl leading-loose pb-2 max-w-170`. Note
             `max-w-170` resolves to `170 * --spacing` = 680px under
             Compass's 4px spacing base. */
          <p className="m-0 max-w-[680px] font-sans text-left text-lg leading-loose text-fg-high pb-2 lg:col-span-5 lg:justify-self-end">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
