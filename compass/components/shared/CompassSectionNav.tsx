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
  { href: "/compass/manuals", label: "Manuals", count: 7 },
  { href: "/compass/methods", label: "Methods", count: 7 },
  { href: "/templates", label: "Templates", count: 2 },
  { href: "/compass/insights", label: "Insights", count: 2 },
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
              "px-[18px] py-[18px] no-underline",
              "border-r border-edge-medium last:border-r-0",
              /* Tracking-tight (-0.025em) matches every other Compass
                 hero / section title. Use the named utility instead of
                 an arbitrary value so any tracking-scale change in the
                 @theme block propagates here. */
              "font-heading text-[28px] font-medium tracking-tight leading-none",
              "transition-colors duration-150",
              active
                ? "text-fg-high"
                : "text-fg-high hover:text-accent-fg-medium",
            ].join(" ")}
          >
            <span>{item.label}</span>
            {item.count != null ? (
              <span className="mt-1 self-start font-mono text-[11px] text-accent-fg-medium">
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
