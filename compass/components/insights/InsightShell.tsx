import Link from "next/link";
import type { ReactNode } from "react";
import type { InsightMeta } from "../../lib/insights/content";
import { CompassLayout } from "../shared/CompassLayout";
import { CompassPromptHeading } from "../shared/CompassPromptHeading";
import { TableOfContents } from "./TableOfContents";
// `ShareLinks` (Twitter / LinkedIn / Email cluster) was retired —
// readers can share via the URL bar. The import is intentionally
// dropped so the dock at top-right of the hero collapses.

/**
 * Shared "eyebrow / meta" text style — Geist Mono, 14px, medium, uppercase,
 * 0.05em tracking. Used by breadcrumbs, the author name, the publish date,
 * and the framework tags. Kept as a constant so a single edit flows to
 * every meta element on the page.
 */
/** Shared "eyebrow / meta" text style — matches the Mantle
    `<Text headingMono />` recipe: font-mono font-medium text-xs
    uppercase tracking-wider (0.05em). */
const eyebrow =
  "font-mono text-xs font-medium uppercase tracking-wider";

function authorInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function InsightShell({
  meta,
  headings,
  children,
}: {
  meta: InsightMeta;
  headings: Array<{ depth: 2 | 3; id: string; text: string }>;
  children: ReactNode;
}) {
  const formattedDate = new Date(meta.date)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();

  return (
    // Insights detail pages share the no-CTA pattern with Methods and
    // Templates — the closing "Grow your business with Mantle" band
    // was creating noise at the bottom of every article. Pass
    // `showFooterCta={false}` to suppress it.
    <CompassLayout showFooterCta={false}>
      <div
        className="
          mx-auto max-w-[1320px] text-fg-high
          px-6 pt-16 pb-32
          max-[1100px]:px-8
          max-[720px]:px-5 max-[720px]:pt-12 max-[720px]:pb-20
        "
      >
        <article>
          {/* Hero — matches `FrameworkShell` byte-for-byte so insight,
              method, and template detail pages all open with the same
              vertical rhythm. `pt-16 pb-12 md:pt-24 md:pb-14` clears
              the 64px sticky header with the same breathing room
              `CompassIndexHero` uses; mobile collapses to pt-12/pb-8.
              Share buttons (Twitter / LinkedIn / Email) intentionally
              removed; readers can copy the URL if they want to
              share. */}
          <header className="relative pt-16 pb-12 md:pt-24 md:pb-14 max-[720px]:pt-12 max-[720px]:pb-8">
            <Link
              href="/compass/insights"
              aria-label="Back to Insights"
              className="no-underline"
            >
              <CompassPromptHeading text="Insights" color="accent" />
            </Link>
            {/* Hero recipe shared with FrameworkShell + static
                `.compass-hero` so methods, templates, insights, and
                the static compass index pages all render the same
                hero: 48px h1, font-medium, items-start at lg+. */}
            <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
              <h1
                className="
                  m-0 max-w-[20ch] font-heading font-normal text-left
                  text-5xl md:text-7xl tracking-tight leading-tighter
                  text-fg-high lg:col-span-7
                "
              >
                {meta.title}
              </h1>
              <p className="m-0 max-w-[60ch] font-sans text-xl font-normal leading-tight text-fg-high lg:col-span-5 lg:justify-self-end">
                {meta.summary}
              </p>
            </div>
          </header>

          {/* Author + publish date row — borders top/bottom, ~32px inner
              padding. `border-edge-high/60` matches the section-divider
              opacity FrameworkShell uses on its article + meta strip
              borders so insight, method, and template detail pages all
              render the same hairline weight. */}
          <section
            aria-label="Article meta"
            className="
              mt-10 mb-10 flex items-center justify-between gap-6
              border-y border-edge-high/60 py-8
              max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-3
            "
          >
            <div className="flex items-center gap-3.5">
              {meta.authorAvatar ? (
                <img
                  src={meta.authorAvatar}
                  alt={meta.author}
                  className="h-11 w-11 flex-none rounded-full border border-edge-high object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-edge-high bg-accent/[0.18] font-heading text-[16px] font-medium tracking-wide text-accent"
                >
                  {authorInitials(meta.author)}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className={`${eyebrow} text-fg-high`}>
                  {meta.author}
                </span>
                {meta.authorRole ? (
                  <span className="font-sans text-[14px] font-normal text-fg-medium">
                    {meta.authorRole}
                  </span>
                ) : null}
              </div>
            </div>
            <div className={`${eyebrow} text-fg-medium`}>
              <span>PUBLISHED </span>
              <time dateTime={meta.date} className="text-fg-high">
                {formattedDate}
              </time>
              {meta.readTime ? (
                <span className="ml-2">· {meta.readTime}</span>
              ) : null}
            </div>
          </section>

          {/* Body grid — article body on the left, sticky TOC on the
              right. Inline `gridTemplateColumns` because Tailwind v4's
              arbitrary-value parser was splitting the commas inside
              `minmax(...)` and emitting three column tracks instead of
              two (same bug we hit on FrameworkShell). The responsive
              collapse to one column at ≤980px still rides on the
              Tailwind class with `!` so it overrides the inline
              style. */}
          <div
            className="
              grid items-start gap-16
              max-[980px]:!grid-cols-1 max-[980px]:gap-8
            "
            style={{ gridTemplateColumns: "minmax(0, 1fr) 340px" }}
          >
            <div className="insight-content max-w-[60ch]">{children}</div>
            <aside
              aria-label="Table of contents"
              className="
                sticky top-[calc(var(--header-h,64px)+24px)] self-start
                max-[980px]:static max-[980px]:order-first
              "
            >
              <TableOfContents headings={headings} />
            </aside>
          </div>
        </article>
      </div>
    </CompassLayout>
  );
}

