"use client";

import Link from "next/link";
import { CompassButton } from "./CompassButton";

/**
 * Compass site header — single source of truth across Compass.
 *
 * Renders the exact same DOM as the static `<header class="site-header">`
 * markup used by the five static Compass index pages
 * (/compass, /compass/manuals, /compass/methods, etc.). The
 * shared styling lives in /public/compass-base.css under the
 * `.site-header`, `.site-brand`, `.site-search`, `.site-actions`,
 * `.sign-in-link`, and `.site-cta` class rules, so both surfaces
 * render visually identical.
 *
 * Structure (matches static):
 *
 *   <header class="site-header">
 *     <a class="site-brand" href="/compass">
 *       <img class="site-logo" src="/compass-logo-color-black.svg">
 *     </a>
 *     <form class="site-search" role="search">
 *       <svg class="site-search-icon">…</svg>
 *       <input class="site-search-input" type="search" placeholder="Search Compass">
 *     </form>
 *     <div class="site-actions">
 *       <a class="sign-in-link" href="/">Back to Mantle</a>
 *       <a class="site-cta" href="https://heymantle.com/signup">Start for free</a>
 *     </div>
 *   </header>
 *
 * No mobile drawer / hamburger — matches the canonical Compass
 * home design where the bar always shows brand + search + actions.
 * On narrow viewports the per-page CSS hides the search and tightens
 * spacing (see `.site-search { display: none }` at <860px in the
 * static-page styles).
 */
export function CompassHeader() {
  return (
    <header className="site-header" id="header">
      <Link className="site-brand" href="/compass" aria-label="Mantle Compass">
        <img
          className="site-logo"
          src="/compass-logo-color-black.svg"
          alt="Mantle Compass"
        />
      </Link>
      {/* Site search intentionally not rendered. The previous
          `<form class="site-search">` had no action, no submit
          handler, and no search index behind it — a non-functional
          control reads worse than no control. Re-enable when a real
          search backend (Pagefind / Algolia / a client-side index)
          is wired up. Markup is preserved in the static HTML
          pages for visual continuity until Compass migrates to
          Astro. */}
      <div className="site-actions">
        <Link className="sign-in-link" href="/">
          Back to Mantle
        </Link>
        {/* Canonical CompassButton (primary tone) instead of the
            legacy `.site-cta` class. Same recipe as every other
            primary action across Compass — h-9 (36px), rounded-2xl
            (10px), bg-accent-medium, hover bg-accent-low. */}
        <CompassButton primary href="https://heymantle.com/signup">
          Start for free
        </CompassButton>
      </div>
    </header>
  );
}
