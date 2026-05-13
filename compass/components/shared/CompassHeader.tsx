"use client";

/**
 * Compass site header — single source of truth across Compass.
 *
 * Renders the exact same DOM as the static `<header class="site-header">`
 * markup used by the five static Compass index pages
 * (/compass, /compass/manuals, /compass/frameworks, etc.). The
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
 *       <a class="site-cta" href="#">Start for free</a>
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
      <a className="site-brand" href="/compass" aria-label="Mantle Compass">
        <img
          className="site-logo"
          src="/compass-logo-color-black.svg"
          alt="Mantle Compass"
        />
      </a>
      <form className="site-search" role="search" action="#">
        <svg
          className="site-search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          className="site-search-input"
          type="search"
          placeholder="Search Compass"
          aria-label="Search Compass"
        />
      </form>
      <div className="site-actions">
        <a className="sign-in-link" href="/">
          Back to Mantle
        </a>
        <a className="site-cta" href="#">
          Start for free
        </a>
      </div>
    </header>
  );
}
