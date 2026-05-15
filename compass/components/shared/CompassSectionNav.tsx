"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Compass section nav — the horizontal tab strip that appears below
 * the hero on every Compass listing page (Manuals, Methods,
 * Templates, Insights, Answers). Each tab links to the section's
 * index, shows a small count suffix in the accent color, and uses
 * `aria-current="page"` for the active tab.
 *
 * Mirrors the legacy `.compass-nav` recipe in `compass-base.css`
 * (line ~255) byte-for-byte:
 *   • 28px font-heading at medium weight, tracking-tight
 *   • Active tab: accent-medium underline; inactive: text-fg-high
 *   • Tab count rendered as a small mono superscript in the accent
 *   • Full-width strip with top/bottom border via --border-soft
 *
 * `currentPath` selects which tab is active (default: none).
 * `items` defaults to the canonical 4-tab nav (Manuals / Methods /
 * Templates / Insights) — pass a custom array to override.
 *
 * **Why this is a client component**: in `next dev`, App Router
 * routes compile on-demand the first time they're visited, which
 * makes the second-and-later nav clicks fast but the first click
 * to each section feel like a full reload. We `router.prefetch()`
 * all four section URLs as soon as the nav mounts so dev-mode
 * navigation feels closer to production. In production the
 * `<Link prefetch>` default already covers this on viewport entry;
 * the explicit prefetch is harmless there.
 */

export type SectionNavItem = {
  href: string;
  label: string;
  count?: number;
};

const DEFAULT_ITEMS: SectionNavItem[] = [
  { href: "/manuals", label: "Manuals", count: 7 },
  { href: "/templates", label: "Templates", count: 2 },
  /* Section was renamed Frameworks → Methods → Workflows. Public
     label is "Workflows"; route + collection are `/workflows`. */
  { href: "/workflows", label: "Workflows", count: 5 },
  /* Insights keeps its nav label but the public route is `/blog`. */
  { href: "/blog", label: "Insights", count: 2 },
];

export function CompassSectionNav({
  currentPath,
  items = DEFAULT_ITEMS,
}: {
  currentPath?: string;
  items?: SectionNavItem[];
}) {
  const router = useRouter();

  /* Warm up every section route as soon as the nav mounts. In `next
     dev` this is what makes the first click to each tab feel
     instant — without it, Next compiles the route on the click and
     the user waits 1-3s. We skip the current route (already warm)
     and any items that match it. The dependency array is just
     `items` because `currentPath` only filters which items we
     prefetch, and the items list is stable across renders. */
  useEffect(() => {
    for (const item of items) {
      if (currentPath && pathsMatch(currentPath, item.href)) continue;
      router.prefetch(item.href);
    }
  }, [items, currentPath, router]);

  return (
    <nav
      aria-label="Compass sections"
      className="
        flex items-stretch overflow-x-auto
        border-y border-edge-medium
      "
    >
      {items.map((item) => {
        const active =
          currentPath != null && pathsMatch(currentPath, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            aria-current={active ? "page" : undefined}
            className={[
              "inline-flex flex-1 items-start gap-1.5 whitespace-nowrap",
              /* Padding tightened from 18px → 12px vertical / 20px
                 horizontal so the nav row reads as a section divider,
                 not a primary CTA bar. Old recipe gave each tab a
                 ~64px row height which dominated the layout. */
              "px-5 py-3 no-underline",
              "border-r border-edge-medium last:border-r-0",
              /* `text-2xl` (24px) replaces the previous arbitrary
                 `text-[28px]` — uses the canonical theme scale so any
                 future type-ramp change propagates. Tracking-tight
                 matches every other Compass section title; leading-
                 none keeps the row compact. */
              "font-heading text-2xl font-medium tracking-tight leading-none",
              "transition-colors duration-150",
              active
                ? "text-fg-high"
                /* Inactive tabs: white text, hover to gold — matches
                   the next-gen `.site-nav > a { color: #fff }` +
                   `.site-nav > a:hover { color: var(--gold) }` recipe
                   used on every Mantle marketing page. */
                : "text-fg-high hover:text-accent",
            ].join(" ")}
          >
            <span>{item.label}</span>
            {item.count != null ? (
              /* Count badge — mono digit in a soft accent-tinted
                 pill (`bg-accent/10` backplate, `text-accent`
                 number). Earlier the count rendered as a tiny
                 brown-amber superscript using `text-accent-fg-medium`
                 (#8A3E00) which read as nearly invisible on the
                 dark hero canvas. Promoted to the canonical Mantle
                 brand gold (`text-accent` = #FFBB53) with a
                 translucent pill chrome — same visual recipe as the
                 Retool resource-nav count badges. */
              <span
                className="
                  ml-1 inline-flex items-center justify-center
                  min-w-5 h-5 px-1.5
                  rounded-full bg-accent/10
                  font-mono text-xxs leading-none text-accent
                  self-center
                "
              >
                {item.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

/** Active match: exact, or current is a deeper child of the tab path. */
function pathsMatch(current: string, target: string): boolean {
  if (current === target) return true;
  return current.startsWith(`${target}/`);
}
