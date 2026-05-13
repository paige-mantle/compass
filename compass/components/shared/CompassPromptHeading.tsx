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
 * Text recipe matches `<Text mono size="xs">` on the Mantle side:
 *   font-mono · font-medium · text-xs (14px) · tracking-wider ·
 *   uppercase · leading-loose · color from the chosen tone.
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
  accent: "text-accent-fg-medium",
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
          "m-0 font-mono font-medium text-xs tracking-wider uppercase leading-loose",
          TEXT_COLOR_CLASS[color],
        ].join(" ")}
      >
        {text}
      </p>
    </div>
  );
}
