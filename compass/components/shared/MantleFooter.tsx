import { CompassButton } from "./CompassButton";
import { CompassPromptHeading } from "./CompassPromptHeading";
import { COMPASS_H1_CLASS } from "./compass-h1";
import { MantleLogoText } from "./MantleLogoText";
import { FOOTER_CATEGORIES, footerLinkHref } from "../../lib/footer-data";

/**
 * Mantle footer — direct port of the live heymantle.com footer
 * (`next-gen/src/components/Footer.astro`). Replaces the old
 * `CompassFooterCta` which only rendered the closing CTA band; this
 * adds the 5-column link grid + decorative LogoText watermark + warm
 * ambient wash + gradient surface transition that closes every page
 * on the marketing site.
 *
 * Anatomy (top → bottom):
 *
 *   1. Surface transition strip (`surface-medium` → `surface-low`)
 *      — replaces the animated `<WavyDivider>` from next-gen with a
 *      gradient bleed. Visually closes the dark hero canvas into the
 *      slightly darker footer plate.
 *
 *   2. `[data-footer-ambient]` — warm radial wash anchored bottom-
 *      left, gives the footer the same amber glow Mantle marketing
 *      pages have.
 *
 *   3. Closing CTA band — gold eyebrow ("30-day free trial...") +
 *      H1-scale heading ("Run the business behind your app with
 *      Mantle") + supporting body + primary button. Aligned to
 *      Compass's editorial voice — the marketing site uses a
 *      slightly different "Grow your business with Mantle"
 *      phrasing; if these diverge further, sync via this file.
 *
 *   4. 5-column link grid (Mantle Core / Advanced / Pro / Resources /
 *      Legal) — sourced from `compass/lib/footer-data.ts`. External
 *      links (Docs, SASI) open in new tabs; path-relative links
 *      prefix the marketing origin so they navigate out to
 *      heymantle.com.
 *
 *   5. Giant LogoText watermark — `opacity: 0.02` full-bleed Mantle
 *      wordmark behind the link grid, exactly as on heymantle.com.
 *
 * Rendered once in `CompassLayout`. No per-route props; the footer
 * is the same on every Compass surface.
 */
export function MantleFooter() {
  // Mantle marketing's sign-up URL. The next-gen `Footer.astro` uses
  // `appSigninUrlWithBrochureRef(Astro.url.pathname)` to track which
  // brochure page the user came from. Compass doesn't have that
  // helper, so the canonical sign-up URL is hardcoded. Update here
  // if Mantle re-points the trial flow.
  const signupHref = "https://heymantle.com/signup";

  return (
    <div className="relative overflow-hidden">
      {/* Warm radial ambient — anchored bottom-left, bleeds upward
          through the CTA band + link grid. Matches the
          `[data-footer-ambient]` recipe in `globals.css`. */}
      <div data-footer-ambient aria-hidden="true"></div>

      {/* Surface transition — gradient bleed from the page body
          (`surface-medium`) into the footer plate (`surface-low`).
          Height tuned tighter (`h-12 md:h-16`, was `h-20 md:h-28`)
          so the gap between end-of-content and the CTA band reads
          as a deliberate close, not dead space. The 48-64px is
          still enough breath for the gradient to ramp cleanly
          without a hard surface step. */}
      <div
        aria-hidden="true"
        className="h-12 md:h-16 w-full bg-gradient-to-b from-[var(--color-surface-medium)] to-[var(--color-surface-low)]"
      />

      {/* CTA band — `surface-low`, py-12 sm:py-16 matches next-gen's
          `Section topPadding="slim"`. Border-bottom separates from
          the link grid. */}
      <section
        id="footerCtaContainer"
        className="relative bg-surface-low border-b border-edge-medium"
      >
        <div className="mx-auto w-full max-w-page px-4 sm:px-6 md:px-8 py-12 sm:py-16">
          <div className="flex flex-col gap-6">
            <CompassPromptHeading
              text="30-day free trial. No credit card required"
              color="accent"
            />
            <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
              <div className="flex flex-col gap-4">
                {/* H1-scale heading (rendered as `<h2>` because the
                    page already has its own `<h1>` above). */}
                <h2 className={`m-0 ${COMPASS_H1_CLASS}`}>
                  Run the business behind your app with Mantle
                </h2>
                <p className="m-0 max-w-[60ch] font-sans text-lg leading-loose text-fg-low">
                  Mantle Core is free for new apps. Pay only when your app
                  makes over $5k MRR.
                </p>
              </div>
              <div>
                <CompassButton
                  primary
                  href={signupHref}
                  icon={{ icon: "ArrowRight", size: 16, position: "right" }}
                >
                  Get started for free
                </CompassButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Link grid — `surface-low` with the decorative LogoText
          watermark layered behind. `pb-30` (120px on the 4px spacing
          base) reserves space below the columns so the watermark's
          bottom edge isn't clipped. */}
      <section id="footerLinkContainer" className="relative bg-surface-low">
        {/* Decorative full-bleed wordmark — `opacity 0.02`, anchored
            to the bottom, bleeds outside the page max-width
            (`w-screen` + negative margins) for the full-bleed
            effect from heymantle.com. */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="relative top-2 sm:top-5 md:top-6 lg:top-8 xl:top-10">
            <div className="relative left-1/2 right-1/2 -mx-[50vw] block w-screen">
              <MantleLogoText
                className="block h-auto w-full"
                decorative
                opacity={0.02}
              />
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-page px-4 sm:px-6 md:px-8 pt-12 sm:pt-16 pb-30">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
            {FOOTER_CATEGORIES.map((category) => (
              <div key={category.title} className="flex flex-col gap-3 md:gap-4">
                <p className="m-0 font-sans text-xs text-fg-lower">
                  {category.title}
                </p>
                <ul className="m-0 list-none p-0">
                  {category.links.map((link) => (
                    <li key={`${category.title}-${link.title}`} className="m-0">
                      <a
                        href={footerLinkHref(link)}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="block leading-9 text-fg-low hover:text-fg-medium no-underline transition-colors duration-150"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
