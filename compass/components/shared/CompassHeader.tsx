"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CompassButton } from "./CompassButton";

/**
 * Compass site header — modelled byte-for-byte on the next-gen Mantle
 * marketing-site header (`Header.astro` + `NavLinksUnified.astro`).
 * Same DOM scaffold, same Tailwind classes, same scroll-driven
 * hide/show behaviour, same desktop/mobile breakpoints. Only the
 * content differs:
 *
 *   • Brand logo → /compass-logo-color-white.svg
 *   • Nav items → Compass section nav (flat — no megamenus)
 *   • Right-hand CTA → "Sign up" via CompassButton (matches the
 *     desktop primary on heymantle.com so the ecosystem ships one
 *     consistent verb)
 *
 * Behaviour mirrored from the next-gen Astro implementation:
 *
 *   • Fixed to top, full-bleed (max-w-none), z-50.
 *   • Transitions translate-y; on scroll past 80px down, hides
 *     (translate-y of −100%). Scrolling back up brings it back.
 *   • Adds `scrolled-past-threshold` and `scrolled-down` body
 *     classes so global CSS (in `compass/styles/index.css`) can swap
 *     the header background.
 *   • Mobile uses `<details>/<summary>` for the hamburger drawer —
 *     no extra JS state, browser handles the open/close.
 */

type NavPage = { title: string; href: string; external?: boolean };

/**
 * Primary nav — mirrors the live heymantle.com header
 * (Products / Resources / Pricing / Experiences). Earlier this row
 * held the Compass-specific section links (Compass / Manuals /
 * Workflows / Templates / Insights); those moved to the SECONDARY
 * row below this one so Compass users see one ecosystem nav at the
 * top and a Compass-section switcher right beneath it.
 *
 * `Products` and `Resources` are dropdown menus on heymantle.com.
 * Until the dropdown UI lands here, they link to the marketing home
 * with the relevant section anchor so the user lands somewhere
 * useful. Pricing + Experiences are direct page links.
 *
 * `external: true` so the renderer can add `target="_blank"` —
 * users navigating from Compass `/workflows` to `/pricing` are
 * leaving Compass for marketing; treat it as an outbound nav.
 */
const MANTLE_NAV_PAGES: NavPage[] = [
  { title: "Products", href: "https://heymantle.com/#products", external: true },
  { title: "Resources", href: "https://heymantle.com/#resources", external: true },
  { title: "Pricing", href: "https://heymantle.com/pricing", external: true },
  { title: "Experiences", href: "https://heymantle.com/experiences", external: true },
];

/**
 * Secondary nav — Compass-specific section links rendered in a row
 * directly below the primary marketing nav. Counts reflect the
 * current content library; update as new manuals / workflows /
 * templates / insights ship.
 *
 * `Manuals` count includes coming-soon entries (7 total in
 * `MANUAL_COVERS`) because the cover grid renders all of them; the
 * 5 coming-soon manuals just aren't clickable.
 */
const COMPASS_NAV_ITEMS: Array<{ href: string; label: string; count: number }> = [
  { href: "/manuals", label: "Manuals", count: 7 },
  /* Workflows count synced to actual MDX file count
     (`compass/content/workflows/`): shopify-app-review-campaign,
     onboarding-flow-planner, reddit-research-report,
     ai-ready-app-context = 4 files. Was 5 (stale). */
  { href: "/workflows", label: "Workflows", count: 4 },
  { href: "/templates", label: "Templates", count: 2 },
  { href: "/blog", label: "Insights", count: 2 },
];

const normalizePath = (path: string) =>
  path === "/" ? "/" : path.replace(/\/$/, "");

export function CompassHeader({
  variant = "default",
  hideSecondaryNav = false,
}: {
  /** Reserved for future per-surface tweaks. Today every variant
      renders the same chrome — the prop exists so manual pages can
      flip their treatment later without touching every consumer. */
  variant?: "default" | "manual";
  /** Suppress the secondary section-nav row. Detail-page surfaces
   *  (workflow / template / insight slug pages) pass `true` because
   *  the reader is already inside a content piece — the section
   *  switcher reads as clutter at the top of a long article. The
   *  breadcrumb inside the article handles wayfinding back to the
   *  section listing. Listings + the home + manuals index keep the
   *  secondary row visible. */
  hideSecondaryNav?: boolean;
} = {}) {
  // Silence unused-prop lint until variant differentiation lands.
  void variant;
  const pathname = usePathname() ?? "/";
  const currentPath = normalizePath(pathname);

  // Scroll-driven header behaviour — direct port of the next-gen
  // marketing-site `scripts.js` `handleScroll`. Toggles two body
  // classes that global CSS uses to:
  //   • Swap header bg-surface to bg-surface-low past 80px.
  //   • Hide the header (translate-y −100%) when scrolling down,
  //     reveal it again when scrolling up.
  useEffect(() => {
    const SCROLL_THRESHOLD = 80;
    let lastScrollY = 0;

    function handleScroll() {
      const scrollTop = window.scrollY;
      const body = document.body;

      body.classList.toggle("scrolled-past-threshold", scrollTop > SCROLL_THRESHOLD);

      if (scrollTop > SCROLL_THRESHOLD) {
        if (scrollTop > lastScrollY) {
          body.classList.add("scrolled-down");
        } else {
          body.classList.remove("scrolled-down");
        }
      } else {
        body.classList.remove("scrolled-down");
      }

      lastScrollY = scrollTop <= 0 ? 0 : scrollTop;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("scrolled-past-threshold");
      document.body.classList.remove("scrolled-down");
    };
  }, []);

  return (
    <div
      id="header"
      className="fixed z-50 top-0 w-full max-w-none"
    >
      {/* PRIMARY ROW — Mantle marketing nav. Hides on scroll-down via
          the global `body.scrolled-down [data-primary-row]` rule in
          `globals.css`. Once a reader is in content (scrolling down),
          the marketing nav slides up and out; the secondary row
          (Compass sections) stays sticky as the wayfinding strip. On
          scroll-up the body class clears and this row slides back
          into view. Docs-site pattern (Vercel / Stripe / Cloudflare
          docs use the same model). */}
      {/* Primary row carries the divider between primary + secondary
          on its bottom edge. Tied to the primary row (not the
          secondary's top) so the border translates up with the row
          when `body.scrolled-down` fires — once the primary slides
          out, its border goes with it, and the secondary lands at
          the top of the viewport with a single clean hairline below
          it. The reverse (border-t on the secondary) leaves a
          stranded hairline at the top of the viewport when the
          secondary "catches" the primary's slot. */}
      {/* Primary row carries the divider between primary + secondary
          on its bottom edge. Tied to the primary row (not the
          secondary's top) so the border translates up with the row
          when `body.scrolled-down` fires.
          Transition tuned long-and-smooth: `duration-500
          cubic-bezier(0.16,1,0.3,1)` so the slide reads as a
          deliberate motion (matches the Compass logomark's open-
          direction reveal in the secondary row). Was `duration-200
          ease-out`, which felt clipped at the start of the curve. */}
      <div
        data-primary-row
        className="bg-surface-medium border-b border-edge-medium transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <nav
          className="mx-auto w-full max-w-page px-4 py-4 sm:px-6 md:px-8 lg:py-0"
          aria-label="Global"
        >
          {/* Desktop primary row */}
          <div className="hidden lg:flex items-center w-full">
            <div className="flex grow basis-0 items-center justify-start">
              {/* PRIMARY logo — Mantle ecosystem mark, linking to the
                  marketing site. The primary nav is the Hey Mantle
                  nav (Products / Resources / Pricing / Experiences);
                  the logo here should match that. The Compass mark
                  lives on the SECONDARY row instead so it slides in
                  alongside the section switcher when the primary
                  scrolls away. `target="_blank"` because clicking it
                  navigates the user OUT of Compass to marketing —
                  same convention as the Mantle nav links above. */}
              <a
                href="https://heymantle.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
                aria-label="Mantle"
              >
                <img
                  src="/mantle-logo-color-white.svg"
                  alt="Mantle"
                  className="w-auto"
                />
              </a>
            </div>
            <div className="shrink-0 flex items-center justify-center">
              <ul className="flex flex-col md:flex-row px-1 sm:px-0">
                {MANTLE_NAV_PAGES.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      target={page.external ? "_blank" : undefined}
                      rel={page.external ? "noopener noreferrer" : undefined}
                      className="flex items-center no-underline sm:px-3 py-2 md:py-[26px] text-sm cursor-pointer list-none text-fg-medium hover:text-fg-high"
                    >
                      <span className="leading-5">{page.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex grow basis-0 gap-4 items-center justify-end">
              <CompassButton primary href="https://heymantle.com/signup">
                Sign up
              </CompassButton>
            </div>
          </div>

          {/* Mobile primary row */}
          <div className="flex lg:hidden items-center justify-between w-full">
          {/* Mobile primary logo — Mantle mark, matching the desktop
              primary. Links out to heymantle.com because the primary
              nav is the ecosystem nav, not the Compass section nav. */}
          <a
            href="https://heymantle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3"
            aria-label="Mantle"
          >
            <img
              src="/mantle-logo-color-white.svg"
              alt="Mantle"
              className="w-auto"
            />
          </a>
          <details className="group/details lg:hidden">
            <summary className="cursor-pointer list-none">
              <svg
                className="block w-6 h-6 group-open/details:hidden"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              </svg>
            </summary>
            <div className="mobile-nav bg-surface-medium fixed z-[100] inset-x-0 bottom-0 top-0 flex flex-col min-h-0 overscroll-y-contain">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                {/* Mobile drawer header logo — Mantle mark to match
                    the closed-state primary logo. Links out to
                    heymantle.com same as the primary row. */}
                <a
                  href="https://heymantle.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                  aria-label="Mantle"
                >
                  <img
                    src="/mantle-logo-color-white.svg"
                    alt="Mantle"
                    className="w-auto"
                  />
                </a>
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={(e) => {
                    const details = (e.currentTarget as HTMLButtonElement).closest("details");
                    if (details) details.open = false;
                  }}
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6 opacity-60 hover:opacity-100"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
                {/* Mobile drawer renders BOTH nav groups, separated
                    by a section heading. Compass section nav comes
                    first (most relevant — users tap "Workflows" to
                    jump between sections within Compass); Mantle
                    marketing nav follows below. */}
                <p className="m-0 pt-2 pb-1 font-mono text-xxs uppercase tracking-wider text-fg-lower">
                  Compass
                </p>
                <ul className="divide-y divide-fg-100/10">
                  {COMPASS_NAV_ITEMS.map((item) => {
                    const isActive =
                      currentPath === normalizePath(item.href) ||
                      currentPath.startsWith(normalizePath(item.href) + "/");
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={[
                            "cursor-pointer flex gap-2 items-center justify-between no-underline py-3 text-xl",
                            isActive ? "text-fg-high" : "text-fg-medium hover:text-fg-high",
                          ].join(" ")}
                        >
                          <span>{item.label}</span>
                          {/* Mobile count badge — plain mono digit
                              in accent gold, matching the desktop
                              secondary-row recipe. No pill backplate. */}
                          <span className="font-mono text-xxs leading-none text-accent">
                            {item.count}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <p className="m-0 pt-6 pb-1 font-mono text-xxs uppercase tracking-wider text-fg-lower">
                  Mantle
                </p>
                <ul className="divide-y divide-fg-100/10">
                  {MANTLE_NAV_PAGES.map((page) => (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        target={page.external ? "_blank" : undefined}
                        rel={page.external ? "noopener noreferrer" : undefined}
                        className="cursor-pointer flex gap-2 items-center justify-between no-underline py-3 text-xl text-fg-medium hover:text-fg-high"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shrink-0 px-4 sm:px-6 pt-4 pb-[max(calc(var(--spacing)*4),env(safe-area-inset-bottom))]">
                <CompassButton primary fullWidth href="https://heymantle.com/signup">
                  Sign up
                </CompassButton>
              </div>
            </div>
          </details>
        </div>
        </nav>
      </div>

      {/* SECONDARY ROW — Compass section nav. Hidden entirely when
          `hideSecondaryNav` is set (detail-page surfaces). On
          listings, the row lives inside the `fixed` header wrapper.
          As the user scrolls DOWN, the global
          `body.scrolled-down #header [data-secondary-row]` rule in
          `globals.css` translates this row up by the primary row's
          height (72px on desktop) so it slides into primary's slot
          at the top of the viewport — Vercel Docs / Stripe Docs
          pattern. Scrolling back UP returns both rows to their
          original positions. Hidden on mobile (≤lg) since the
          mobile drawer surfaces the same items in a stacked list.
          Recipe per the latest spec:
            • Outer container carries the divider (`border-b
              border-edge-medium`) — a single hairline that sits
              under the row.
            • Inner nav uses `-mb-px` so the active tab's `border-b-2
              border-accent` underline OVERLAPS the container's
              hairline, visually replacing it for the active tab.
              Inactive tabs render `border-transparent`, so the
              container hairline shows through cleanly.
            • Mono uppercase label + small accent-colored count
              digit (no pill backplate — the count is intentionally
              quiet, just enough to signal depth without competing
              with the tab label). */}
      <div
        data-secondary-row
        className={[
          "bg-surface-medium border-b border-edge-medium",
          /* Matches the primary row's `duration-500 cubic-bezier`
             so both rows travel in lockstep on scroll-down — the
             secondary lands at primary's slot at exactly the same
             frame the primary leaves it. */
          "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          hideSecondaryNav ? "hidden" : "hidden lg:block",
        ].join(" ")}
      >
        <div className="max-w-page mx-auto px-4 sm:px-6 md:px-8">
          <nav
            aria-label="Compass sections"
            className="flex items-center gap-8 overflow-x-auto -mb-px"
          >
            {/* Compass logomark — hidden by default. The closed-state
                width is `w-0 overflow-hidden`, so the logo occupies
                zero horizontal space and the section tabs sit flush
                with the row's left edge as before. When the user
                scrolls past the threshold (the secondary row reaches
                the top of the viewport), the `body.scrolled-down`
                recipe in `globals.css` expands the slot to a fixed
                width — the logo SVG inside (clipped by overflow-
                hidden while the slot is narrower than the art)
                reveals as a slide-in from the left, and the tabs to
                the right slide along with it.
                Lives on the LEFT of the section tabs so once the row
                reaches the top of the viewport, Compass branding
                anchors the wayfinding strip visually. Links to the
                Compass home so a reader scrolling through a chapter
                can always click back to `/compass`. */}
            <Link
              href="/compass"
              aria-label="Mantle Compass"
              data-compass-mark
              className={[
                "flex-none flex items-center no-underline overflow-hidden",
                /* `-mr-8` cancels the parent's `gap-8` so the closed
                   state takes no horizontal space at all (otherwise
                   the flex gap would leave a phantom 2rem slot
                   beside the first tab even with `w-0`). The scrolled
                   state below clears the negative margin so the
                   logomark sits with a normal `gap-8` from the
                   first tab. Transition tuned long-and-smooth (350ms
                   cubic-bezier) so the slide-in reads as a deliberate
                   reveal, not an instant pop. Default `transition-
                   delay: 0` so the reverse direction (scrolling back
                   up) hides the mark immediately — only the OPEN
                   direction is delayed (handled in globals.css). */
                "w-0 -mr-8 opacity-0 pointer-events-none",
                "transition-[width,margin,opacity] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
              ].join(" ")}
            >
              {/* Logo SVG is 192×36 (5.33:1). `h-8` = 32px tall →
                  ~171px wide. Stepped down from `h-9` (36px) per
                  design pass — the secondary row is the
                  wayfinding strip, not the primary brand surface,
                  so the wordmark sits a notch quieter than the
                  Mantle mark in the primary row above (which stays
                  at the next-gen-canonical 36px). The scrolled-
                  down slot in `globals.css` opens to 11rem (176px)
                  to fit `h-8` + trailing margin. */}
              <img
                src="/compass-logo-color-white.svg"
                alt=""
                className="block h-8 w-auto max-w-none"
              />
            </Link>
            {COMPASS_NAV_ITEMS.map((item) => {
              const isActive =
                currentPath === normalizePath(item.href) ||
                currentPath.startsWith(normalizePath(item.href) + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "inline-flex items-center gap-1.5",
                    "font-mono text-xs uppercase tracking-wider py-4",
                    "border-b-2 transition-colors whitespace-nowrap no-underline",
                    isActive
                      ? "text-fg-high border-accent"
                      : "text-fg-low border-transparent hover:text-fg-high",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                  {/* Count — small mono digit in the accent gold,
                      no backplate. The earlier `bg-accent/10`
                      rounded pill was retired so the count reads
                      as a quiet meta signal next to the label, not
                      a competing chip. */}
                  <span className="font-mono text-xxs leading-none text-accent">
                    {item.count}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
