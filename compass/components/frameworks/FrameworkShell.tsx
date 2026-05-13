import Link from "next/link";
import type { ReactNode } from "react";
import { CompassLayout } from "../shared/CompassLayout";
import { CompassPromptHeading } from "../shared/CompassPromptHeading";
import type { FrameworkMeta } from "../../lib/frameworks/content";
import { CodeBlocks } from "./CodeBlocks";
import { ShareLinks } from "../insights/ShareLinks";
import { Feedback } from "./Feedback";

/** Shared "eyebrow / meta" text style — matches the Mantle
    `<Text headingMono />` recipe: font-mono font-medium text-xs
    uppercase tracking-wider (0.05em). */
const eyebrow =
  "font-mono text-xs font-medium uppercase tracking-wider";

/**
 * Centered content wrapper. Each article section is full-viewport-width
 * so its border can touch the edges of the screen, while the content
 * inside the section is still centered and capped at the article max.
 *
 * Matches the Compass hero / insight article container: max-w 1320px,
 * 24px horizontal padding on desktop, 20px on mobile.
 */
const containerInner =
  "mx-auto max-w-[1320px] px-6 max-[720px]:px-5";


export function FrameworkShell({
  meta,
  shareUrl,
  children,
  backHref = "/compass/frameworks",
  backLabel = "Methods",
  showFooterCta = true,
}: {
  meta: FrameworkMeta;
  shareUrl: string;
  children: ReactNode;
  /** Parent listing URL for the hero back-link. Defaults to the
      Methods (frameworks) index; pass `/templates` etc. for other
      surfaces that reuse this shell. */
  backHref?: string;
  /** Label shown next to the chevron in the hero PromptHeading. */
  backLabel?: string;
  /** Toggle the closing CompassFooterCta band. Pass `false` on
      surfaces (e.g. Templates) where the CTA isn't wanted. */
  showFooterCta?: boolean;
}) {
  const blocks = meta.codeBlocks ?? [];
  return (
    <CompassLayout showFooterCta={showFooterCta}>
      <div className="text-fg-high pb-32 max-[720px]:pb-20">
        <article className="border-y border-edge-high/60">
          {/* Hero — breadcrumb + title + summary on the left, share
              controls + Feedback docked top-right. Full-width bottom
              border. */}
          {/* Hero — matches Mantle Hero.astro recipe:
                · PromptHeading eyebrow + h1 (text-5xl md:text-7xl) on
                  the left col-span-7 at lg+
                · summary (bodyXl) on the right col-span-5 at lg+,
                  self-end aligned
                · stacked on mobile
                · 48px uniform padding around the text content */}
          <header className="border-b border-edge-high/60">
            <div className={`${containerInner} py-12 max-[720px]:py-8`}>
              <Link
                href={backHref}
                aria-label={`Back to ${backLabel}`}
                className="no-underline"
              >
                <CompassPromptHeading text={backLabel} color="accent" />
              </Link>
              <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-end mt-4">
                <h1
                  className="
                    m-0 max-w-[18ch] font-heading text-5xl md:text-7xl font-normal
                    leading-tightest tracking-tight text-fg-high
                    lg:col-span-7
                  "
                >
                  {meta.title}
                </h1>
                <p className="m-0 max-w-[56ch] font-sans text-xl font-normal leading-[1.55] text-fg-medium lg:col-span-5 lg:justify-self-end">
                  {meta.summary}
                </p>
              </div>
            </div>
          </header>

          {/* Meta strip — author + last-updated on the left, tag pills
              in the middle, share + feedback docked on the right.
              Full-width bottom border. */}
          <section
            aria-label="Article meta"
            className="border-b border-edge-high/60"
          >
            <div
              className={`${containerInner} flex items-center justify-between gap-6 py-6 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-4 max-[720px]:py-5`}
            >
              {/* Author info was removed from frameworks per design.
                  Left side now shows just "Last updated" timestamp. */}
              <div className="flex items-center gap-4">
                {meta.lastUpdated ? (
                  <span className={`${eyebrow} text-fg-medium`}>
                    Last updated {meta.lastUpdated}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-6 max-[720px]:flex-wrap max-[720px]:gap-4">
                {meta.tags && meta.tags.length > 0 ? (
                  <ul
                    aria-label="Tags"
                    className="m-0 flex list-none flex-wrap items-center gap-2 p-0"
                  >
                    {meta.tags.map((t) => (
                      <li key={t}>
                        <span
                          className={`${eyebrow} inline-flex items-center rounded-md border border-edge-high/70 bg-transparent px-3.5 py-2 text-fg-medium`}
                        >
                          {t}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {/* Share + Feedback docked at the far right of the
                    meta strip — moved here from the hero. */}
                <div className="flex items-center gap-6 max-[720px]:w-full max-[720px]:justify-between">
                  <ShareLinks title={meta.title} url={shareUrl} />
                  <Feedback labelClassName={eyebrow} />
                </div>
              </div>
            </div>
          </section>

          {/* Body grid — article body on the left (45%), sticky code rail
              on the right (55%). Items align to the top so the content
              column starts flush with the meta strip's bottom border. */}
          <div>
            <div
              className={`${containerInner} grid items-start gap-16 grid-cols-[minmax(0,45fr)_minmax(0,55fr)] pt-0 pb-12 max-[1100px]:grid-cols-1 max-[1100px]:gap-10 max-[720px]:pb-8`}
            >
              <div className="insight-content framework-content pt-6 max-[720px]:pt-6 [&>*:first-child]:mt-0">
                {children}
              </div>
              <aside
                aria-label="Code"
                className="
                  sticky top-[calc(var(--header-h,64px)+16px)] self-start pt-6
                  max-[1100px]:static max-[720px]:pt-0
                "
              >
                <CodeBlocks blocks={blocks} />
              </aside>
            </div>
          </div>
        </article>
      </div>
    </CompassLayout>
  );
}
