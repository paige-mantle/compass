import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ManualManifest, ManualSection } from "../../lib/manuals/content";
import { MANUAL_COVERS } from "../../lib/manuals/content";
import { CARD_ACCENT_VALUE, CARD_TEXT_COLOR } from "../../lib/card-accents";
import { CoverArt } from "./CoverArt";
import { Breadcrumb } from "../shared/Breadcrumb";
import { COMPASS_PIXEL_LABEL_CLASS } from "../shared/compass-pixel-label";

function hrefFor(manualSlug: string, s: ManualSection) {
  return `/manuals/${manualSlug}/${s.slug ? s.slug + "/" : ""}`;
}

/**
 * `<ManualShellV2 />` — boxed manual layout, modelled on the
 * Fin.ai/blueprint reference:
 *
 *   • Sits on the dark Compass canvas as a centered CARD
 *     (`max-w-page` + `rounded-2xl` + `border-edge-medium`).
 *   • Card has a HERO strip at the top (white surface, dark ink,
 *     accent-tinted cover illustration on the right) running the
 *     full card width.
 *   • BELOW the hero, a 2-column grid inside the same card:
 *       - LEFT — dark sidebar TOC (chapter list, progress bar at
 *         the bottom). Sticky inside the card so the TOC travels
 *         with the reader as they scroll the article.
 *       - RIGHT — WHITE article column. Body content wraps in
 *         `.compass-light-theme` (the existing scope in
 *         `app/globals.css`) so every surface / fg / edge token
 *         flips to its light-theme value — white plates, dark
 *         editorial ink, low-alpha black hairlines.
 *
 * The vertical brand rail used in v1 is dropped — the card itself
 * is the brand surface here, with the hero carrying the manual
 * identity. The article column re-uses the existing
 * `.manual-section` prose recipe (typography rules from
 * `compass/styles/prose.css` + callouts from
 * `compass/styles/callouts.css`); the light-theme scope simply
 * re-binds the color tokens so prose ink renders correctly on the
 * white surface.
 *
 * Mobile (`max-[1024px]`): the sidebar collapses to a horizontal
 * scroller above the article so the card stays single-column
 * without a fixed-width left rail.
 */
export function ManualShellV2({
  manifest,
  current,
  currentIndex,
  prev,
  next,
  summary,
  children,
}: {
  manifest: ManualManifest;
  current: ManualSection;
  currentIndex: number;
  prev: ManualSection | null;
  next: ManualSection | null;
  summary?: string;
  children: ReactNode;
}) {
  const cover = MANUAL_COVERS.find((c) => c.slug === manifest.slug);
  /* Manual accent driven by `cover.accent` (canonical CardAccent
     name). The `--manual-accent` CSS var is set on the card root
     so every accent-bound element (pill labels, chapter numbers,
     callout tints) inside the card resolves to the same color. */
  const accent = cover
    ? CARD_ACCENT_VALUE[cover.accent]
    : manifest.accent ?? "#9676FF";
  const heroAccentInk = cover ? CARD_TEXT_COLOR[cover.accent] : "#FFFFFF";
  // Silence the unused-var lint until v2 hero adopts the same
  // contrast-ink swap as v1 (currently the hero is always light-
  // theme so the ink stays dark).
  void heroAccentInk;

  return (
    <div
      className="manual-shell relative px-4 sm:px-6 md:px-8 py-8 md:py-12 max-[720px]:py-6"
      data-manual={manifest.slug}
      data-section={current.slug || "intro"}
      style={
        {
          "--manual-accent": accent,
          "--manual-accent-soft": `color-mix(in srgb, ${accent} 18%, transparent)`,
          "--manual-accent-glow": `color-mix(in srgb, ${accent} 30%, transparent)`,
        } as CSSProperties
      }
    >
      {/* Card — rounded border + overflow-hidden so the inner
          two-column grid clips cleanly. The card sits centered on
          the dark Compass canvas; `max-w-page` matches every other
          Compass container. */}
      <article className="mx-auto w-full max-w-page overflow-hidden rounded-2xl border border-edge-medium bg-surface-medium">
        {/* Hero strip — runs the full card width. White surface
            via `.compass-light-theme`, accent-tinted cover
            illustration on the right (col-span-5), breadcrumb +
            chapter number + H1 + summary on the left
            (col-span-7). */}
        <header
          className="
            compass-light-theme relative overflow-hidden
            border-b border-edge-medium
            px-6 sm:px-10 md:px-14 pt-12 md:pt-16 pb-10 md:pb-12
            max-[720px]:pt-8 max-[720px]:pb-8
          "
          style={{
            backgroundImage:
              "radial-gradient(rgba(17,15,20,0.05) 1px, transparent 1px)",
            backgroundSize: "6px 6px",
          }}
        >
          <div className="relative z-[1] flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
            <div className="flex flex-col gap-4 lg:col-span-7">
              <Breadcrumb
                segments={
                  current.isIntro
                    ? [{ label: "Manuals", href: "/manuals" }]
                    : [
                        { label: "Manuals", href: "/manuals" },
                        {
                          label: manifest.title,
                          href: `/manuals/${manifest.slug}`,
                        },
                      ]
                }
              />

              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 max-[720px]:gap-x-4">
                <span
                  aria-hidden="true"
                  className="font-display text-5xl md:text-7xl font-normal leading-tighter tracking-tight tabular-nums text-[var(--manual-accent)]"
                >
                  {`${manifest.number}.${currentIndex}`}
                </span>
                <h1
                  className="
                    m-0 max-w-[18ch]
                    font-display font-normal
                    text-5xl md:text-7xl
                    leading-tighter tracking-tight
                    text-fg-high
                  "
                >
                  {current.heroTitle
                    ?? (current.isIntro ? manifest.title : current.title)}
                </h1>
              </div>

              <p className="m-0 mt-2 max-w-[680px] font-sans text-lg leading-loose text-fg-high">
                {summary ??
                  "A short two-line subheading that sets up what this chapter is about and why it matters."}
              </p>
            </div>

            {cover ? (
              <div
                className="
                  lg:col-span-5 flex items-center justify-center
                  aspect-[4/3] max-h-[360px] w-full overflow-hidden
                  max-[720px]:max-h-[220px]
                "
                style={{ color: "var(--manual-accent)" }}
                aria-hidden="true"
              >
                <CoverArt motif={cover.motif} />
              </div>
            ) : null}
          </div>
        </header>

        {/* Body grid — sidebar TOC (left) + white article (right).
            Sidebar is sticky inside the card so the TOC stays in
            view while the article scrolls past. At `<1024px` the
            sidebar collapses to a horizontal scroller above the
            article so the card stays single-column. */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
          <aside
            aria-label="Manual sections"
            className="
              bg-surface-high
              border-b border-edge-medium
              lg:border-b-0 lg:border-r
              lg:sticky lg:top-[calc(var(--header-h,44px)+24px)] lg:self-start
              lg:max-h-[calc(100dvh-var(--header-h,44px)-48px)] lg:overflow-y-auto
            "
          >
            <div className="px-6 py-6 max-[720px]:px-5 max-[720px]:py-5">
              <h2 className={`m-0 mb-4 ${COMPASS_PIXEL_LABEL_CLASS} text-fg-low`}>
                Manual contents
              </h2>
              <nav className="flex flex-col gap-1 max-[1024px]:flex-row max-[1024px]:flex-wrap">
                {manifest.sections.map((s, i) => {
                  const active = s.slug === current.slug;
                  const sectionNumber = `${manifest.number}.${i}`;
                  return (
                    <Link
                      key={s.slug || "intro"}
                      href={hrefFor(manifest.slug, s)}
                      className={[
                        "flex items-center gap-3 rounded-md px-3 py-2 no-underline",
                        "transition-colors duration-150",
                        active
                          ? "bg-surface-higher text-fg-high"
                          : "text-fg-medium hover:bg-surface-higher hover:text-fg-high",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex-none font-mono text-xs tracking-wider tabular-nums",
                          active
                            ? "text-[var(--manual-accent)]"
                            : "text-fg-lower",
                        ].join(" ")}
                      >
                        {sectionNumber}
                      </span>
                      <span className="flex-1 text-sm">{s.title}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Progress module — matches v1 recipe (mono label,
                  count digits, --manual-accent fill on edge-medium
                  track). Hidden on mobile when the sidebar is the
                  horizontal pill row above the article. */}
              <div className="mt-6 max-[1024px]:hidden">
                <div className={`mb-3 flex items-baseline justify-between ${COMPASS_PIXEL_LABEL_CLASS} text-fg-lower`}>
                  <span>Progress</span>
                  <span className="text-fg-medium">
                    {currentIndex + 1} / {manifest.sections.length}
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-edge-medium">
                  <div
                    className="h-full rounded-full bg-[var(--manual-accent)] transition-[width] duration-200"
                    style={{
                      width: `${((currentIndex + 1) / manifest.sections.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Article column — WHITE surface via `.compass-light-
              theme`. The body wraps the canonical `.manual-section`
              prose recipe; every fg / surface / edge token inside
              the scope resolves to its light-theme value. */}
          <article className="compass-light-theme bg-surface-medium">
            <section className="manual-section mx-auto w-full max-w-[68ch] px-6 pt-10 pb-12 max-[720px]:px-5 max-[720px]:pt-8 max-[720px]:pb-8">
              {children}
            </section>

            {/* Prev/Next nav — bottom of the article column. Light-
                theme inks; the row sits on a subtle top border so
                the nav reads as a separate close even on the same
                white surface. */}
            {(prev || next) ? (
              <nav
                aria-label="Manual navigation"
                className="border-t border-edge-medium px-6 py-6 max-[720px]:px-5 max-[720px]:py-5"
              >
                <div className="mx-auto w-full max-w-[68ch] grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
                  {prev ? (
                    <PrevNextLinkV2
                      href={hrefFor(manifest.slug, prev)}
                      label="Previous chapter"
                      title={prev.title}
                      direction="prev"
                    />
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  {next ? (
                    <PrevNextLinkV2
                      href={hrefFor(manifest.slug, next)}
                      label="Next chapter"
                      title={next.title}
                      direction="next"
                    />
                  ) : (
                    <span aria-hidden="true" />
                  )}
                </div>
              </nav>
            ) : null}
          </article>
        </div>
      </article>
    </div>
  );
}

/* Prev/Next link — light-theme variant. Same shape as v1's
   `PrevNextLink` but drops the wrapping card recipe (the parent
   nav already sits in a bordered card) and tunes colors for the
   light surface. Hover swaps the title color to `--manual-accent`
   matching v1. */
function PrevNextLinkV2({
  href,
  label,
  title,
  direction,
}: {
  href: string;
  label: string;
  title: string;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";
  const Icon = isPrev ? ChevronLeft : ChevronRight;
  return (
    <Link
      href={href}
      className={[
        "group flex flex-col gap-2 no-underline",
        isPrev ? "items-start text-left" : "items-end text-right",
        "max-[720px]:items-start max-[720px]:text-left",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex items-center gap-2",
          "font-mono text-xs font-medium uppercase tracking-wider text-fg-medium",
          "transition-transform duration-200 ease-out",
          isPrev
            ? "group-hover:-translate-x-0.5"
            : "group-hover:translate-x-0.5",
        ].join(" ")}
      >
        {isPrev ? (
          <>
            <Icon width={14} height={14} strokeWidth={2} aria-hidden />
            <span>{label}</span>
          </>
        ) : (
          <>
            <span>{label}</span>
            <Icon width={14} height={14} strokeWidth={2} aria-hidden />
          </>
        )}
      </span>
      <span className="font-heading text-xl font-medium leading-snug tracking-tight text-fg-high transition-colors duration-150 group-hover:text-[var(--manual-accent)] md:text-2xl">
        {title}
      </span>
    </Link>
  );
}
