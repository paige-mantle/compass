import { ChevronRight } from "lucide-react";

/**
 * Compass prompt-heading — direct port of Mantle's
 * `shared/PromptHeading.astro`.
 *
 * Visual:  > EYEBROW TEXT     (chevron-right icon · small mono label)
 *
 * Used as the "terminal-prompt" eyebrow above CTAs and section
 * headings in the Mantle marketing system. The icon color resolves
 * to a CSS variable so it tracks the chosen color tone exactly
 * (Mantle does `var(--color-${color}-high)` — same trick here).
 *
 *   • `color`: "fg" | "accent" | "accent-alt"   (default "accent")
 *   • `text`:  the eyebrow label                 (default "Explore Mantle")
 *   • `className`: passthrough for wrapper       (default "")
 *
 * Text recipe: font-mono · font-medium · text-xs · tracking-wider ·
 * uppercase · leading-loose · color from the chosen tone. NOTE — in the
 * Compass Tailwind theme, `text-xs` resolves to 14px (not the default
 * 12px); the type ramp is bumped one step throughout. 14px matches the
 * manual callout labels exactly.
 *
 * The Compass accent tone resolves to `--color-accent-fg-high`
 * (a deeper amber) so it has AA contrast on the light Compass
 * surface — see globals.css for that fg-accent ramp.
 */

type PromptColor = "fg" | "accent" | "accent-alt";

const ICON_COLOR: Record<PromptColor, string> = {
  fg: "var(--color-fg-medium)",
  // Light-theme override: use the foreground-accent ramp added to
  // globals.css so the icon contrasts on a light surface. Falls
  // back to --color-accent-high if the fg-accent token isn't
  // defined (e.g. running inside the dark Mantle parent).
  accent: "var(--color-accent-fg-high, var(--color-accent-high))",
  "accent-alt": "var(--color-accent-alt-high)",
};

const TEXT_COLOR_CLASS: Record<PromptColor, string> = {
  fg: "text-fg-medium",
  accent: "text-accent-high",
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
      className={`flex items-center ${className}`}
      style={{ gap: "calc(var(--spacing) * 3)" }}
    >
      <ChevronRight
        width={16}
        height={16}
        color={ICON_COLOR[color]}
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
          //   leading-loose (1.5) · text-left · text-accent-high
          "m-0 font-mono font-medium text-xs tracking-wider uppercase",
          "text-left leading-loose",
          TEXT_COLOR_CLASS[color],
        ].join(" ")}
      >
        {text}
      </p>
    </div>
  );
}
