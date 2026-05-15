import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { ManualManifest, ManualSection } from "../../lib/manuals/content";
import { MANUAL_COVERS } from "../../lib/manuals/content";
import { CARD_ACCENT_VALUE, CARD_TEXT_COLOR } from "../../lib/card-accents";
import { ManualShareSection } from "./ManualShareSection";
import { ManualMobileNav } from "./ManualMobileNav";
import { CoverArt } from "./CoverArt";
import { COMPASS_PIXEL_LABEL_CLASS } from "../shared/compass-pixel-label";
import { Breadcrumb } from "../shared/Breadcrumb";

function hrefFor(manualSlug: string, s: ManualSection) {
  return `/manuals/${manualSlug}/${s.slug ? s.slug + "/" : ""}`;
}

/**
 * Prev/Next chapter nav link — refined recipe.
 *
 * Layout: each link occupies its own column inside a 2-col grid (no
 * more `flex-1 basis-1/2` which let one link bleed into the empty
 * slot when the other was missing). Direction-pinned alignment
 * (left for prev / right for next) so they read as bookends. The
 * label row uses font-mono `Previous · Next` micro-caps; the title
 * sits below as a smaller font-heading line (text-xl → text-2xl)
 * instead of the previous text-3xl display face, because the prev/
 * next nav is wayfinding, not headline content. Chevron sits
 * outboard of the title for both directions and translates 2px on
 * hover. Inactive end (no prev or no next) renders a quiet
 * placeholder so the grid stays balanced.
 *
 * Mobile (≤720px): the grid collapses to a single column, prev
 * stacks above next, both align left.
 */
function PrevNextLink({
  href,
  direction,
  label,
  title,
  number,
}: {
  href: string;
  direction: "prev" | "next";
  label: string;
  title: string;
  number?: string;
}) {
  const chevron = direction === "prev" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6";
  const isPrev = direction === "prev";

  return (
    <Link
      href={href}
      className={[
        "group flex flex-col gap-3 rounded-xl px-6 py-6 no-underline",
        "border border-edge-medium bg-transparent",
        "transition-colors duration-150",
        "hover:border-edge-high hover:bg-white/[0.02]",
        /* On desktop, "next" aligns right; on mobile both columns
           collapse to a single column so titles stay left-aligned. */
        isPrev ? "items-start text-left" : "items-end text-right",
        "max-[720px]:items-start max-[720px]:text-left",
      ].join(" ")}
    >
      {/* Micro-label row — "Previous chapter" / "Next chapter" in
          uppercase mono, with the chevron sitting outboard so the
          direction reads at a glance. Translates 2px on hover. */}
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
            <Chevron path={chevron} />
            <span>{label}</span>
          </>
        ) : (
          <>
            <span>{label}</span>
            <Chevron path={chevron} />
          </>
        )}
      </span>

      {/* Title row — font-heading at text-xl (md: text-2xl). Smaller
          than the chapter h1 (display 5xl/7xl) on purpose: this nav
          is wayfinding, not headline content. Optional `number`
          ordinal renders ahead of (prev) / after (next) the title
          in muted ink so the chapter index reads quietly. */}
      {/* Title row — hover swaps text to `--manual-accent` so the
          prev/next cards advertise the manual's identity color.
          Was hardcoded to `text-accent` (Mantle gold) which clashed
          on cool-accented manuals (Shape = purple, future Build =
          teal). Reads the same CSS var the rail + active chapter
          + progress bar use, so every manual-accent surface stays
          in lockstep. */}
      <span
        className={[
          "inline-flex items-baseline gap-2",
          "font-heading text-xl font-medium leading-snug tracking-tight",
          "text-fg-high transition-colors duration-150",
          "group-hover:text-[var(--manual-accent)]",
          "md:text-2xl",
          isPrev ? "" : "justify-end max-[720px]:justify-start",
        ].join(" ")}
      >
        {number && isPrev ? (
          <span className="font-mono text-xs font-medium tracking-wider text-fg-low leading-none">
            {number}
          </span>
        ) : null}
        <span className="line-clamp-2">{title}</span>
        {number && !isPrev ? (
          <span className="font-mono text-xs font-medium tracking-wider text-fg-low leading-none">
            {number}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

/**
 * Placeholder column when there's no `prev` (first chapter) or
 * `next` (last chapter). Keeps the 2-col grid balanced so the
 * remaining link stays anchored to its side of the row. Renders an
 * empty bordered card with a muted "Start of manual" / "End of
 * manual" label so the slot doesn't read as broken.
 */
function PrevNextPlaceholder({ label, align }: { label: string; align: "left" | "right" }) {
  return (
    <div
      aria-hidden="true"
      className={[
        "hidden md:flex flex-col gap-3 rounded-xl px-6 py-6",
        "border border-dashed border-edge-medium",
        align === "right" ? "items-end text-right" : "items-start text-left",
      ].join(" ")}
    >
      <span className="font-mono text-xs font-medium uppercase tracking-wider text-fg-lower">
        {label}
      </span>
    </div>
  );
}

function Chevron({ path }: { path: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5 flex-none"
    >
      <path d={path} />
    </svg>
  );
}

export function ManualShell({
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
  /** Hero subheading — pulled from chapter MDX frontmatter
      (`summary` field). Falls back to a placeholder. */
  summary?: string;
  children: ReactNode;
}) {
  /* Look up the cover-grid entry for this manual to get the SVG
     motif + canonical CardAccent name. The motif drives the cover
     illustration rendered in the hero; the CardAccent name maps to
     `CARD_TEXT_COLOR` so the hero title picks the right
     dark-on-light / light-on-dark ink for the colored plate. */
  const cover = MANUAL_COVERS.find((c) => c.slug === manifest.slug);
  /* Manual accent is driven by `cover.accent` (the canonical
     CardAccent name) — NOT `manifest.accent` (hex). Two reasons:
     (1) the cover-grid plate and the manual rail must read as one
     surface, and the rail color drifts if the manifest's hex
     doesn't match the cover's resolved color; (2) the
     dark-on-light / light-on-dark ink pairing comes from
     `CARD_TEXT_COLOR[cover.accent]`, which is keyed by the same
     CardAccent name — sharing that key keeps the rail background
     and the rail label color in lockstep across every manual. */
  const accent = cover
    ? CARD_ACCENT_VALUE[cover.accent]
    : manifest.accent ?? "#9676FF";
  const heroTextColor = cover
    ? CARD_TEXT_COLOR[cover.accent]
    : "var(--color-card-fg-dark)";
  return (
    // `manual-shell` is preserved on the root because:
    // (1) ManualMobileNav's effect targets it via querySelector to set
    //     data-mobile-nav-open, which the sidebar reads to slide in/out;
    // (2) `body:has(.manual-shell)` in manual.css applies the page-level
    //     paper-grain background, and bumping `html` font-size to 14px.
    //
    // Rendered as a `<div>` (not `<main>`) because the consuming page
    // now wraps it in `<CompassLayout>`, which already provides the
    // outer `<main>`. Two nested mains would break landmark semantics.
    <div
      className="manual-shell relative max-w-none overflow-visible"
      data-manual={manifest.slug}
      data-section={current.slug || "intro"}
      style={
        {
          // Canonical Compass name — every callout, prose treatment,
          // and table style in `compass/styles/{prose,callouts}.css`
          // reads `var(--manual-accent)` and inherits the current
          // chapter colour automatically.
          "--manual-accent": accent,
          "--manual-accent-soft": `color-mix(in srgb, ${accent} 18%, transparent)`,
          "--manual-accent-glow": `color-mix(in srgb, ${accent} 30%, transparent)`,
          // Legacy aliases — consumed by `/public/compass-base.css`
          // and `/public/compass-manual-base.css` (site-header,
          // mega-menu, manual chrome). Drop these when those legacy
          // stylesheets are retired in the Astro migration.
          "--gold": accent,
          "--gold-high": accent,
          "--gold-soft": `color-mix(in srgb, ${accent} 18%, transparent)`,
          "--gold-glow": `color-mix(in srgb, ${accent} 30%, transparent)`,
        } as CSSProperties
      }
    >
      {/* Article column — left-margin matches the combined width
          of the brand rail (56px = w-14) + the TOC sidebar
          (288px = w-72) = 344px. Collapses on mobile when the
          sidebar slides off-canvas. */}
      <div className="block ml-[344px] max-[860px]:ml-0">
        {/* Vertical brand rail — accent-colored strip pinned to far
            left. Manual pages now suppress the global `<CompassHeader />`
            (passed `showHeader={false}` on `<CompassLayout>`), so the
            rail starts at `top-0` and runs the full viewport height.
            The manual's TOC sidebar to its right IS the navigation;
            adding a top bar on top would be double-chrome. */}
        {/* Brand rail — fills with the manual's `--manual-accent`
            (sourced from `cover.accent` — Clarity = orange, Shape =
            purple, etc.) so each manual's chrome shares its cover
            plate's color. Label text picks dark-on-light or
            light-on-dark ink via `CARD_TEXT_COLOR[cover.accent]`
            (same map the hero plate uses) so contrast can't drift.
            Previously this was a single Mantle purple across every
            manual; that decoupled the chrome from the cover plate
            and made the rail feel detached from the page identity. */}
        <aside
          aria-hidden="true"
          className="
            fixed left-0 top-0 z-[1] flex w-14 flex-col h-screen
            items-center border-r border-edge-medium
            bg-[var(--manual-accent)]
            max-[860px]:hidden
          "
        >
          <Link
            href="/manuals"
            aria-label="Back to Manuals"
            className="block h-12 w-12 flex-none"
          >
            <img
              src="/mantle-logo-dark.svg"
              alt=""
              className="block h-full w-full object-cover"
            />
          </Link>
          {/* Brand-rail title — Geist Pixel Square display face,
              uppercase, at `text-4xl`. Matches the cover-grid
              poster + the chapter ordinal so the rail / cover /
              hero number share one pixel-grid identity across
              every manual surface. Previously cycled through
              `text-2xl pixel` → `text-4xl Manrope`; the pixel
              face is the canonical rail recipe — the size step
              up to 4xl carries through from the Manrope pass. */}
          <span
            className="
              mt-10 mb-6 whitespace-nowrap font-display uppercase
              text-4xl font-normal tracking-tight leading-none
            "
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              color: heroTextColor,
            }}
          >
            {manifest.title}
          </span>
        </aside>

        <ManualMobileNav />

        {/* Manual TOC sidebar — fixed to viewport, scrolls internally.
            Starts at `top-0` since manual pages don't render the
            global `<CompassHeader />`. New chrome recipe:
              • `bg-surface-high` (#110F14) for the panel surface
              • `border-r border-edge-medium` for the right edge
              • `w-72` (288px) width
            Nav rows are pill-shaped (`rounded-md`) inside a padded
            `px-3 space-y-1` container so each row reads as a discrete
            link rather than a full-bleed table row.
            On mobile the sidebar slides off-canvas; `ManualMobileNav`
            toggles `data-mobile-nav-open` on `.manual-shell` to slide
            it back in. */}
        <aside
          aria-label="Manual sections"
          className="
            fixed left-14 top-0 z-[65] flex w-72 flex-col h-screen
            overflow-y-auto
            bg-surface-high border-r border-edge-medium
            transition-transform duration-200 ease-out
            max-[860px]:left-0 max-[860px]:max-w-[86vw] max-[860px]:-translate-x-[105%]
            [[data-mobile-nav-open=true]_&]:translate-x-0
            [[data-mobile-nav-open=true]_&]:shadow-[0_0_0_1px_var(--color-edge-high),30px_0_60px_-10px_rgba(0,0,0,0.6)]
          "
        >
          {/* Sidebar header — "Manual contents" eyebrow. Sits flush
              at the top of the panel with a hairline divider below
              that lines up with the manual content column's first
              border-row. */}
          <div className="flex h-14 flex-none flex-row items-center border-b border-edge-medium px-6">
            <h2 className="m-0 font-heading text-base font-medium leading-tight tracking-tight text-fg-high">
              Manual contents
            </h2>
          </div>

          {/* ─────────────────────────────────────────────────────
              Sidebar chapter links — design intent (LOCKED).
              ─────────────────────────────────────────────────────
              The ONLY allowed transition is `transition-colors`
              (~150ms default). Hover swaps `bg` → `surface-higher`
              and `text` → `fg-high`. That's it.

              Do not add:
                • scale / transform on hover (`hover:scale-*`,
                  `hover:translate-*`)
                • underline on hover (this is an editorial nav,
                  not a body link)
                • a leading icon, chevron, or status dot
                • a left-border or pseudo-element indicator bar on
                  the active row
                • an enter / exit animation on the active row

              Active row is a filled `bg-surface-higher` rectangle
              + purple chapter number (`text-accent-alt-high`,
              #9676FF). The fill IS the indicator — nothing else
              needed.
              ───────────────────────────────────────────────────── */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {manifest.sections.map((s, i) => {
              const active = s.slug === current.slug;
              /* Section numbering — intro lives at index 0 and renders
                 as X.0; subsequent chapters render as X.1, X.2, …
                 (X = `manifest.number`). */
              const sectionNumber = `${manifest.number}.${i}`;
              return (
                <Link
                  key={s.slug || "intro"}
                  href={hrefFor(manifest.slug, s)}
                  className={[
                    "flex items-center gap-3 px-3 py-2 rounded-md no-underline",
                    "transition-colors duration-150",
                    active
                      ? "bg-surface-higher text-fg-high"
                      : "text-fg-medium hover:bg-surface-higher hover:text-fg-high",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex-none font-mono text-xs tracking-wider tabular-nums",
                      active ? "text-[var(--manual-accent)]" : "text-fg-low",
                    ].join(" ")}
                  >
                    {sectionNumber}
                  </span>
                  <span className="flex-1 text-sm">{s.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Progress module — quiet footer showing where the reader
              is in the manual. Fill reads `--manual-accent` so the
              bar shares the manual's identity color (Clarity =
              orange, Shape = purple, etc.), matching the active
              chapter number above and the rail at the far left. */}
          <div className="flex-none border-t border-edge-medium px-6 pt-5 pb-6">
            <div className={`mb-3 flex items-baseline justify-between ${COMPASS_PIXEL_LABEL_CLASS} text-fg-lower`}>
              <span>Progress</span>
              <span className="text-fg-medium">
                {currentIndex + 1} / {manifest.sections.length}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-edge-medium">
              <div
                className="h-full bg-[var(--manual-accent)] transition-[width] duration-200"
                style={{
                  width: `${((currentIndex + 1) / manifest.sections.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </aside>

        {/* Article is a flex column so the prev/next nav anchors at
            the bottom of the viewport when a chapter is shorter than
            the screen. min-h-[calc(100vh-...)] gives the column at
            least the visible viewport so the nav can be pushed down;
            the body section grows via `flex-1` to fill any slack.

            Article column runs on the canonical Mantle DARK
            surface (`bg-surface-medium` = #0C0A0E) — same dark mode
            as the rest of Compass. The previous `compass-light-theme`
            paper canvas was retired so manual chapters read as one
            visual identity with the workflow / template / insight
            surfaces. Prose / fg / edge tokens stay on their
            dark-theme values; the hero gets the colored cover plate
            on top of that dark canvas as a deliberate accent. */}
        <article className="relative bg-surface-medium flex min-h-[calc(100vh-50px)] flex-col">
          {/* Chapter title + subheading.
              Was a wrapping `<header>` element that also carried a
              date + copy/share top-bar — removed in the cleanup pass.
              The page-level `<header>` is now `<CompassHeader />`
              rendered by `<CompassLayout>`; date/share affordances
              live at the bottom of the chapter via
              `<ManualShareSection />` so they don't compete with the
              page chrome at the top. We keep the title + subheading
              block as a plain `<div>` so the chapter still leads with
              its name + summary, but it semantically belongs to the
              article body, not the page header.
              7/5 split at lg+ (Section hero recipe): number + title
              cluster on left col-span-7, subheading on right
              col-span-5. Stacks on mobile. */}
          {/* Chapter hero — DARK surface with a 6px white dot-grid
              texture only. Ambient `--manual-accent` blooms were
              retired per design pass: the two faded color washes
              were reading as a tinted vignette rather than warm
              light, which muddied the legibility of the title
              column on the left + made the dark plate feel
              uncommitted. The dot grid + the accent-tinted cover
              illustration on the right carry the manual identity
              now. Hero padding `pt-8 md:pt-10 pb-6 md:pb-8` (mobile
              `pt-6 pb-5`). */}
          <div
            className="
              relative z-[1] block overflow-hidden
              border-b border-edge-medium
              bg-surface-medium
              px-4 sm:px-6 md:px-8 pt-8 md:pt-10 pb-6 md:pb-8
              max-[720px]:pt-6 max-[720px]:pb-5
            "
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "6px 6px",
            }}
          >
            <div className="relative z-[2] mx-auto flex max-w-page flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
              {/* Title cluster — breadcrumb + optional chapter-number
                  eyebrow + h1 + summary. Text sizes match the other
                  Compass detail heros via `COMPASS_H1_COMPACT_CLASS`
                  (font-heading Manrope, `text-5xl md:text-7xl`,
                  tracking-tight, leading-tighter, text-fg-high) so
                  every hero across Compass reads at one ramp. */}
              <div className="flex flex-col gap-4 max-[720px]:gap-3 lg:col-span-7">
                {/* Breadcrumb — same `<Breadcrumb>` recipe used on
                    workflow / template / insight detail pages.
                    Trail stops at "Manuals" for the manual intro,
                    extends to the manual's title for chapter pages
                    so the reader can climb back to the manual home
                    one click away. */}
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

                {/* Title row — chapter number sits to the LEFT of
                    the H1 with a flex gap. The number renders on
                    EVERY manual page including the intro/overview:
                    intros show `X.0` (manifest number + section
                    index 0), chapters show `X.1`, `X.2`, …
                    The number wears the manual's accent via
                    `text-[var(--manual-accent)]`; the H1 wears
                    `text-fg-high` (white). Both use the same
                    `font-display` (Geist Pixel Square) at
                    `text-4xl md:text-6xl` so they share one glyph
                    box. Title runs in NORMAL CASE (no `uppercase`)
                    — uppercase reads as label text on a long
                    chapter title; the proper-noun case is the
                    editorial register manual chapters want. */}
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 max-[720px]:gap-x-4">
                  {/* Chapter number + H1 share the same `text-5xl
                      md:text-7xl` ramp — the canonical Compass hero
                      H1 scale (`COMPASS_H1_CLASS`). Was `text-4xl
                      md:text-6xl`; bumped one step so every hero
                      across the site hits text-7xl at md+. */}
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
                    {/* H1 priority:
                          1. `section.heroTitle` (optional manifest
                             override — e.g. Shape's intro renders
                             "Shape your app idea" while the sidebar
                             entry stays compact "Overview").
                          2. Intro fallback: `manifest.title`
                             ("Clarity" / "Shape").
                          3. Chapter fallback: `current.title`. */}
                    {current.heroTitle
                      ?? (current.isIntro ? manifest.title : current.title)}
                  </h1>
                </div>

                {/* Subheading — pulled from chapter frontmatter
                    `summary`. Sans-serif, leading-loose, same body
                    recipe as the detail-hero summary in
                    `CompassDetailHero` (text-lg leading-loose
                    text-fg-high) so heros share the typography. */}
                <p className="m-0 mt-2 max-w-[680px] font-sans text-lg leading-loose text-fg-high">
                  {summary ??
                    "A short two-line subheading that sets up what this chapter is about and why it matters in this part of the manual."}
                </p>
              </div>

              {/* Cover illustration — rendered in the manual's
                  `--manual-accent` color via currentColor. The SVG
                  motif uses `stroke="currentColor"` / `fill="
                  currentColor"` everywhere, so setting `color`
                  recolors every line + dot to the accent. Against
                  the dark hero plate, the accent-colored linework
                  is the visual focal point. Hidden when no matching
                  cover entry exists. On mobile the illustration
                  stacks below the title cluster. */}
              {cover ? (
                /* Illustration sized up — was `max-h-[320px]` (mobile
                   `220px`). The illustration is the focal point of
                   the manual hero now that the surface is dark and
                   the text cluster sits to the left; giving it more
                   room lets the motif read as a deliberate hero
                   centerpiece rather than a small accent. Mobile
                   max-h bumped too so the motif stays substantial
                   when the layout collapses to a single column. */
                <div
                  className="
                    lg:col-span-5 flex items-center justify-center
                    aspect-[4/3] max-h-[440px] w-full overflow-hidden
                    max-[720px]:max-h-[260px]
                  "
                  style={{ color: "var(--manual-accent)" }}
                  aria-hidden="true"
                >
                  <CoverArt motif={cover.motif} />
                </div>
              ) : null}
            </div>
          </div>

          {/* Article body — `.manual-section` carries the editorial
              typography rules from compass-content.css + manual.css.
              max-w-[56ch] keeps line length tight for comfortable
              editorial reading. 48px top padding; reduced bottom
              padding (was 40px → 16px) so the prev/next nav sits
              closer to the body content. `flex-1` lets the section
              grow to push prev/next to the article column bottom
              when a chapter is shorter than the viewport. */}
          <section className="manual-section mx-auto w-full max-w-[56ch] flex-1 px-6 pt-12 pb-4 max-[720px]:px-5 max-[720px]:pt-8 max-[720px]:pb-4">
            {children}

            {/* Share section — sits at the end of the chapter body
                inside the same 56ch column as the prose, so the
                buttons align with the editorial measure. Light-theme
                bordered icon recipe (matches the next-gen share
                pattern). Built from the chapter's path + title for
                pre-filled tweet / email / clipboard. */}
            <ManualShareSection
              title={current.isIntro ? manifest.title : `${manifest.title} — ${current.title}`}
              href={`/manuals/${manifest.slug}${current.slug ? `/${current.slug}` : ""}`}
            />
          </section>

          {/* Prev/Next nav — 2-col grid at md+, single col on mobile.
              Each column is bordered (or dashed when empty). When
              there's no prev (first chapter) the placeholder column
              keeps the next link anchored to the right edge; when
              there's no next (last chapter) we fall through to a
              "Back to all manuals" card so the journey has a defined
              end. Padding gives breathing room below the share
              section. */}
          <nav
            aria-label="Section navigation"
            className="
              mx-auto mt-10 grid w-full max-w-[840px] grid-cols-1 gap-4
              px-6 pb-12
              md:grid-cols-2
              max-[720px]:px-5 max-[720px]:pb-8
            "
          >
            {prev ? (
              <PrevNextLink
                href={hrefFor(manifest.slug, prev)}
                direction="prev"
                label="Previous chapter"
                title={prev.title}
              />
            ) : (
              <PrevNextPlaceholder label="Start of manual" align="left" />
            )}
            {next ? (
              <PrevNextLink
                href={hrefFor(manifest.slug, next)}
                direction="next"
                label="Next chapter"
                title={next.title}
              />
            ) : (
              <PrevNextLink
                href="/manuals"
                direction="next"
                label="Manual complete"
                title="Back to all manuals"
              />
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}
