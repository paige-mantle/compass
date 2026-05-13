import { CompassButton } from "./CompassButton";
import { CompassPromptHeading } from "./CompassPromptHeading";

/**
 * Compass footer CTA — light-mirror of Mantle's `Footer.astro`
 * CTA section. Same recipe:
 *
 *   <Section color="low">
 *     <Stack>
 *       <PromptHeading text="30-day free trial..." />
 *       <div class="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
 *         <Stack>
 *           <Text headingXl as="h1">Grow your business with Mantle</Text>
 *           <Text size="lg" color="low">{description}</Text>
 *         </Stack>
 *         <Button>Get started for free</Button>
 *       </div>
 *     </Stack>
 *   </Section>
 *
 * Light theme deltas (vs the Mantle dark version that uses
 * `bg-surface-low` = near-black):
 *   • surface       → `bg-surface-high` (#F5F5F5, subtle gray
 *     band that reads as "footer area" on the white page)
 *   • headline      → `text-fg-high` (dark)
 *   • description   → `text-fg-medium` (mid)
 *   • PromptHeading → `color="accent"` (deep amber on light)
 *
 * Drop this above the eventual Mantle footer; it stops being a
 * standalone "footer" and becomes the closing CTA band that
 * every Compass page ends with.
 */
export function CompassFooterCta({
  eyebrow = "30-day free trial. No credit card required",
  heading = "Grow your business with Mantle",
  description = "Mantle Core is free for new apps. Pay only when your app makes over $5k MRR.",
  ctaText = "Get started for free",
  ctaHref = "https://app.heymantle.com",
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  return (
    <section
      id="footerCtaContainer"
      aria-label="Get started with Mantle"
      className="relative overflow-hidden bg-surface-high border-y border-edge-medium"
    >
      <div className="mx-auto w-full max-w-[1320px] px-4 py-16 sm:px-6 sm:py-24 md:px-8">
        <div className="flex flex-col gap-6">
          <CompassPromptHeading text={eyebrow} color="accent" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4">
              <h2 className="m-0 font-heading text-5xl md:text-7xl font-normal leading-tightest tracking-tight text-fg-high">
                {heading}
              </h2>
              <p className="m-0 max-w-[60ch] font-sans text-lg font-normal leading-loose text-fg-medium">
                {description}
              </p>
            </div>
            <div className="shrink-0">
              <CompassButton
                primary
                size="large"
                href={ctaHref}
                icon={{ icon: "ArrowRight", size: 16, position: "right" }}
              >
                {ctaText}
              </CompassButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
