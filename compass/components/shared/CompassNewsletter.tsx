"use client";

import { useState } from "react";
import { CompassButton } from "./CompassButton";
import { COMPASS_H1_COMPACT_CLASS } from "./compass-h1";

/**
 * Compass newsletter — the canonical footer used at the bottom of
 * every Compass index page (Compass home, Manuals, Methods,
 * Templates, Insights, Answers). Mirrors the `<section
 * class="compass-connect">` block from the static pages
 * byte-for-byte:
 *
 *   <section class="compass-connect">
 *     <div class="compass-news">
 *       <h3>Subscribe to our newsletter to receive monthly updates</h3>
 *       <mantle-newsletter />  <!-- renders the form via JS -->
 *     </div>
 *   </section>
 *
 * The form markup is inlined here (instead of the
 * `<mantle-newsletter>` custom element) so the React version is
 * self-contained — no external JS dependency, same visual output.
 *
 * Submit handler is a no-op stub for now. Wire it up to the real
 * subscribe endpoint when that's ready.
 */
export function CompassNewsletter({
  heading = "Subscribe to our newsletter to receive monthly updates",
  className = "",
}: {
  heading?: string;
  className?: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire to actual subscribe endpoint
    setSubmitted(true);
  }

  return (
    <section
      aria-label="Newsletter signup"
      className={[
        "block py-14 border-b border-edge-medium",
        className,
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-page px-6 max-[720px]:px-5">
        {/* Subscribe heading shares the canonical Compass display
            recipe — same `font-heading font-normal tracking-tight
            leading-tighter` family as every other Compass top-level
            heading. The compact `text-4xl md:text-6xl` ramp is the
            right register for a footer-section heading: visually
            consequential but one step under the marketing-hero
            scale on `/compass`. Hand-rolled `text-6xl font-medium
            leading-[1.15]` retired so this surface stops drifting
            from the rest of the system. */}
        <h3 className={`m-0 mb-6 max-w-[540px] ${COMPASS_H1_COMPACT_CLASS}`}>
          {heading}
        </h3>
        {submitted ? (
          <p className="m-0 max-w-[540px] font-sans text-sm text-fg-high">
            Thanks — you&rsquo;re on the list. Look for the next monthly
            update in your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            <div className="flex gap-2.5 max-[640px]:flex-col">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                aria-label="Email address"
                /* Height + radius match the canonical CompassButton
                   medium recipe (h-9 = 36px, rounded-2xl = 10px).
                   `hover:border-edge-high` (default), `focus:border-...`
                   progressive states: edge-medium (resting) →
                   edge-high (hover, slightly stronger) → accent-high
                   (focus, gold border). Smooth color transition. */
                className="
                  h-9 w-[400px] max-w-full flex-none rounded-2xl
                  border border-edge-medium bg-[var(--color-surface-higher)]
                  px-4 font-sans text-sm text-fg-high outline-none
                  transition-colors duration-150
                  placeholder:text-fg-low
                  hover:border-edge-high
                  focus:border-[var(--color-accent-high)]
                  focus:ring-2 focus:ring-[var(--color-accent-high)]/30
                "
              />
              {/* Canonical CompassButton (primary tone) — same recipe
                  as every other primary action across Compass. h-9
                  (= 36px), rounded-2xl (= 10px), bg-accent-medium,
                  hover bg-accent-low, text-black. */}
              <CompassButton primary size="medium" type="submit">
                Submit
              </CompassButton>
            </div>
            <div className="font-sans text-xs text-fg-low">
              We respect your privacy.
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
