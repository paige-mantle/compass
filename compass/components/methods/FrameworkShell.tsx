import Link from "next/link";
import type { ReactNode } from "react";
import { CompassLayout } from "../shared/CompassLayout";
import { CompassPromptHeading } from "../shared/CompassPromptHeading";
import type { FrameworkMeta } from "../../lib/methods/content";
import { CodeBlocks } from "./CodeBlocks";
import { CopyLinkButton } from "./CopyLinkButton";
import { PreviewTabs } from "./PreviewTabs";

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
/* Container padding ramp matches `InsightShell`:
   px-6 → px-8 at ≤1100px → px-5 at ≤720px. The intermediate step
   gives the article body breathing room between the desktop max
   and the mobile breakpoint so the content doesn't crash into the
   edge as the viewport shrinks. */
const containerInner =
  "mx-auto max-w-[1320px] px-6 max-[1100px]:px-8 max-[720px]:px-5";


export function FrameworkShell({
  meta,
  shareUrl,
  children,
  backHref = "/compass/methods",
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
      {/* `compass-light-theme` re-scopes canonical surface/fg/edge
          tokens to LIGHT-theme values for this detail-page subtree
          (defined in app/globals.css @layer base). Prompt blocks
          inside use `--color-code-*` which stays dark in both themes. */}
      <div className="compass-light-theme text-fg-high pb-32 max-[720px]:pb-20">
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
          {/* Hero — matches the static `.compass-hero` recipe used on
              /compass and /compass/manuals so detail pages and index
              pages render the same hero treatment:
                · 48px h1 (not text-5xl/text-7xl which scaled to ~72px)
                · Manrope at font-medium (500), tight tracking
                · 19px summary at line-height 1.55 in text-primary
                · 12-col grid at lg+, title col-span-7, summary col-
                  span-5 (justify-self-end)
                · Items top-aligned (lg:items-start) per a prior brief
                · 48px vertical padding via py-12 */}
          <header className="border-b border-edge-high/60">
            {/* Hero — `pt-16 md:pt-24` clears the 64px sticky header
                with breathing room (mirrors `CompassIndexHero`).
                Bottom keeps the original 48px so the hero → meta
                strip gap stays consistent. */}
            <div className={`${containerInner} pt-16 pb-12 md:pt-24 md:pb-14 max-[720px]:pt-12 max-[720px]:pb-8`}>
              <Link
                href={backHref}
                aria-label={`Back to ${backLabel}`}
                className="no-underline"
              >
                <CompassPromptHeading text={backLabel} color="accent" />
              </Link>
              <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start mt-4">
                <h1
                  className="
                    m-0 max-w-[18ch] font-heading font-normal text-left
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
            </div>
          </header>

          {/* Meta strip — just tags, time, updated, and the share
              button now. "Works with" moved into the body, above the
              Description, where it reads as a label/tag list instead
              of dot-separated metadata. */}
          <section
            aria-label="Article meta"
            className="border-b border-edge-high/60"
          >
            <div
              className={`${containerInner} flex items-center justify-between gap-6 py-5 max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-3 max-[720px]:py-4`}
            >
              <div className="flex items-center gap-5 max-[720px]:flex-wrap max-[720px]:gap-3">
                {/* "Added <date>" — quieter than the old "Updated"
                    framing; estimatedTime intentionally not rendered
                    here (we used to surface it but it crowded the
                    strip without adding much). */}
                {/* "Added <date>" — same recipe as the "Works with"
                    label below: font-mono text-xs font-medium
                    uppercase tracking-wider. Every article-meta
                    label across the shell reads as one family. */}
                {meta.lastUpdated ? (
                  <span className={`${eyebrow} text-fg-medium/70 max-[720px]:hidden`}>
                    Added {meta.lastUpdated}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-5 max-[720px]:flex-wrap max-[720px]:gap-4">
                {/* Tags — quiet, max 4 visible, dot-separated text.
                    Subject-matter labels only (Shopify · AI Workflows
                    · Messaging · Positioning). Softer opacity + smaller
                    type so the row reads as supporting metadata, not
                    as primary nav. */}
                {meta.tags && meta.tags.length > 0 ? (
                  <ul
                    aria-label="Tags"
                    /* Tags row — eyebrow recipe (same as "Works with"
                       label) so every article-meta label matches:
                       font-mono text-xs font-medium uppercase
                       tracking-wider. */
                    className={`${eyebrow} m-0 flex list-none flex-wrap items-center gap-x-2.5 gap-y-1.5 p-0 text-fg-medium/70`}
                  >
                    {meta.tags.slice(0, 4).map((t, i) => (
                      <li key={t} className="flex items-center gap-2.5">
                        {i > 0 ? (
                          <span aria-hidden className="text-fg-medium/25">•</span>
                        ) : null}
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <CopyLinkButton url={shareUrl} />
              </div>
            </div>
          </section>

          {/* Body grid — article body on the left (45%), sticky code rail
              on the right (55%). Items align to the top so the content
              column starts flush with the meta strip's bottom border. */}
          <div>
            {/* Body grid — Tailwind v4 was splitting
                `grid-cols-[minmax(0,45fr)_minmax(0,55fr)]` on the
                commas inside `minmax(...)` and emitting THREE
                column tracks (≈413px × 3). Switched to an inline
                `gridTemplateColumns` style so the 45/55 split
                renders correctly regardless of arbitrary-value
                parser quirks. */}
            <div
              className={`${containerInner} grid items-start gap-32 pt-0 pb-12 max-[1100px]:!grid-cols-1 max-[1100px]:gap-12 max-[720px]:pb-8`}
              style={{ gridTemplateColumns: "minmax(0, 45fr) minmax(0, 55fr)" }}
            >
              <div className="insight-content framework-content pt-6 max-[720px]:pt-6 [&>*:first-child]:mt-0">
                {/* "Works with" — label on its own row, pills stacked
                    below. Pills are plain `<span>`s (not `<li>` items)
                    so no list-marker styling can leak in from
                    compass-content.css. Quiet light-grey fill with a
                    hairline border so they read as labels, not
                    interactive controls. */}
                {meta.tools && meta.tools.length > 0 ? (
                  <div className="mb-8 flex flex-col gap-2">
                    <span className={`${eyebrow} text-fg-medium/70`}>
                      Works with
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {meta.tools.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-md border border-edge-high/60 bg-surface-high px-2.5 py-1 text-[12.5px] font-medium text-fg-high"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {children}
              </div>
              <aside
                aria-label="Prompt tool panel"
                className="
                  sticky top-[calc(var(--header-h,64px)+16px)] self-start pt-6
                  flex flex-col gap-3
                  max-[1100px]:static max-[720px]:pt-0
                "
              >
                {/* Right-rail panel:
                    · If a preview image is declared (templates), render
                      a single tabbed container that toggles between
                      "Preview" (the mockup) and "Code" (the prompt
                      blocks). Both panels stay mounted so the user's
                      edits inside the code aren't lost when they
                      switch tabs.
                    · Otherwise (methods without a mockup), fall back
                      to the bare `<CodeBlocks>` accordion panel. */}
                {meta.previewImage ? (
                  <PreviewTabs
                    previewImage={meta.previewImage}
                    blocks={blocks}
                  />
                ) : (
                  <CodeBlocks blocks={blocks} />
                )}
                {meta.openInMantleAiUrl ? (
                  <a
                    href={meta.openInMantleAiUrl}
                    className="
                      mt-1 inline-flex items-center justify-center gap-2
                      rounded-md border border-fg-high bg-fg-high
                      px-5 py-3 text-sm font-medium text-white no-underline
                      transition-opacity duration-150 hover:opacity-90
                    "
                  >
                    Open in Mantle AI
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </a>
                ) : null}
              </aside>
            </div>
          </div>
        </article>
      </div>
    </CompassLayout>
  );
}
