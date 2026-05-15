import { ChevronRight } from "lucide-react";

/**
 * Compass prompt-heading — direct port of Mantle's
 * `shared/PromptHeading.astro`.
 *
 * Visual:  > EYEBROW TEXT     (chevron-right icon · small mono label)
 *
 * Used as the "terminal-prompt" eyebrow above CTAs and section
 * headings in the Mantle marketing system.
 *
 *   • `color`: "fg" | "accent" | "accent-alt"   (default "accent")
 *   • `text`:  the eyebrow label                 (default "Explore Mantle")
 *   • `className`: passthrough for wrapper       (default "")
 *
 * Text recipe: font-mono · font-medium · text-xs · tracking-wider ·
 * uppercase · leading-loose. NOTE — in the Compass Tailwind theme,
 * `text-xs` resolves to 14px (not the default 12px); the type ramp
 * is bumped one step throughout. 14px matches the manual callout
 * labels exactly.
 *
 * Icon and label always render in the SAME color: the icon uses
 * `currentColor`, which inherits from the wrapper `<div>` set to the
 * chosen tone via `text-*`. Earlier the icon and text were resolved
 * through two different token chains (`--color-accent-fg-high` for
 * the icon vs `--color-accent-medium` for the text) and could drift
 * out of sync — particularly on dark surfaces where the fg-accent
 * ramp reads as a deep amber.
 */

type PromptColor = "fg" | "accent" | "accent-alt";

const COLOR_CLASS: Record<PromptColor, string> = {
  fg: "text-fg-medium",
  /* Gold #FFBB53 — `text-accent` resolves through `--color-accent`
     → `--color-accent-medium` and matches the next-gen `var(--gold)`
     value used on every Mantle marketing-page eyebrow
     (.mm-card-kicker, .nav-trigger hover, etc.). Previously
     `text-accent-high` (#FFC66E) was a half-shade lighter than the
     canonical Mantle gold; aligned here so Compass + Mantle eyebrows
     read identically. */
  accent: "text-accent",
  "accent-alt": "text-accent-alt-high",
};

export function CompassPromptHeading({
  text = "Explore Mantle",
  color = "accent",
  className = "",
}: {
  text?: string;
  color?: PromptColor;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center ${COLOR_CLASS[color]} ${className}`}
      style={{ gap: "calc(var(--spacing) * 3)" }}
    >
      <ChevronRight
        width={16}
        height={16}
        color="currentColor"
        strokeWidth={2}
        aria-hidden
        className="shrink-0"
      />
      <p
        className={[
          // The canonical Compass eyebrow recipe — must match
          // `.compass-hero-eyebrow` (static pages), `.callout-label`
          // (manual callouts) and `.compass-manual-kicker` (manual
          // cover cards) byte-for-byte. Any drift here will look like
          // a typography bug because the same eyebrow appears on every
          // Compass surface.
          //
          //   chevron-right (16px) + gap 12px + label
          //   font-mono · font-medium · text-xs (14px) ·
          //   tracking-wider (0.05em) · uppercase ·
          //   leading-loose (1.5) · text-left · inherits wrapper color
          //
          // `text-inherit!` is a deliberate guard: the eyebrow often
          // renders inside `.compass-content` / `.workflow-content`
          // / `.insight-content`, all of which carry a prose
          // `p { color: var(--color-fg-medium) }` rule. Without the
          // inherit, that rule would override the wrapper's
          // `text-accent` color on the `<p>` while the chevron
          // (which uses `currentColor`) stays accent — readers saw
          // white text + orange icon. The bang carries
          // !important so the inherit beats the prose rule.
          "m-0 font-mono font-medium text-xs tracking-wider uppercase",
          "text-left leading-loose text-inherit!",
        ].join(" ")}
      >
        {text}
      </p>
    </div>
  );
}
