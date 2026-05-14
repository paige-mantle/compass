import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { ManualManifest, ManualSection } from "../../lib/manuals/content";
import { ManualCopyLink } from "./ManualCopyLink";
import { ManualShareButton } from "./ManualShareButton";
import { ManualShareSection } from "./ManualShareSection";
import { ManualMobileNav } from "./ManualMobileNav";
import { CompassPromptHeading } from "../shared/CompassPromptHeading";

/**
 * Pretty-print a frontmatter date string (`YYYY-MM-DD`) as
 * `MONTH DD, YYYY` (e.g. `MAY 12, 2026`). Used in the top bar
 * PromptHeading. Falls back to the raw input on parse failure.
 */
function formatPublishDate(raw: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!m) return raw.toUpperCase();
  const [, y, mo, d] = m;
  const date = new Date(`${y}-${mo}-${d}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return raw.toUpperCase();
  const month = date.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  return `${month.toUpperCase()} ${parseInt(d, 10)}, ${y}`;
}

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
      <span
        className={[
          "inline-flex items-baseline gap-2",
          "font-heading text-xl font-medium leading-snug tracking-tight",
          "text-fg-high transition-colors duration-150",
          "group-hover:text-accent",
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
  lastUpdated,
  summary,
  children,
}: {
  manifest: ManualManifest;
  current: ManualSection;
  currentIndex: number;
  prev: ManualSection | null;
  next: ManualSection | null;
  lastUpdated?: string;
  /** Hero subheading — pulled from chapter MDX frontmatter
      (`summary` field). Falls back to a placeholder. */
  summary?: string;
  children: ReactNode;
}) {
  const accent = manifest.accent ?? "#9676FF";
  return (
    // `manual-shell` is preserved on the root because:
    // (1) ManualMobileNav's effect targets it via querySelector to set
    //     data-mobile-nav-open, which the sidebar reads to slide in/out;
    // (2) `body:has(.manual-shell)` in manual.css applies the page-level
    //     paper-grain background, and bumping `html` font-size to 14px.
    <main
      className="manual-shell relative max-w-none overflow-visible"
      data-manual={manifest.slug}
      data-section={current.slug || "intro"}
      style={
        {
          "--gold": accent,
          "--gold-high": accent,
          "--gold-soft": `color-mix(in srgb, ${accent} 18%, transparent)`,
          "--gold-glow": `color-mix(in srgb, ${accent} 30%, transparent)`,
        } as CSSProperties
      }
    >
      <div className="block ml-[370px] max-[860px]:ml-0">
        {/* Vertical brand rail — accent-colored strip pinned to far left. */}
        <aside
          aria-hidden="true"
          className="
            fixed left-0 top-0 z-[1] flex h-screen w-[50px] flex-col
            items-center border-r border-fg-medium/25
            max-[860px]:hidden
          "
          style={{ background: "var(--gold)" }}
        >
          <Link
            href="/manuals"
            aria-label="Back to Manuals"
            className="block h-12 w-12 flex-none"
            style={{ background: "var(--gold)" }}
          >
            <img
              src="/mantle-logo-dark.svg"
              alt=""
              className="block h-full w-full object-cover"
            />
          </Link>
          <span
            className="
              mt-10 mb-6 whitespace-nowrap font-heading text-2xl font-medium
              tracking-tight text-fg-high
            "
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {manifest.title}
          </span>
        </aside>

        <ManualMobileNav />

        {/* Dark TOC sidebar — fixed to viewport, scrolls internally. On
            mobile slides off-canvas; ManualMobileNav toggles
            data-mobile-nav-open on the shell to slide it in. */}
        <aside
          aria-label="Manual sections"
          className="
            fixed left-[50px] top-0 z-[65] flex h-screen w-[320px] flex-col
            overflow-y-auto bg-surface-lowest
            transition-transform duration-200 ease-out
            max-[860px]:left-0 max-[860px]:max-w-[86vw] max-[860px]:-translate-x-[105%]
            [[data-mobile-nav-open=true]_&]:translate-x-0
            [[data-mobile-nav-open=true]_&]:shadow-[0_0_0_1px_rgba(255,255,255,0.1),30px_0_60px_-10px_rgba(0,0,0,0.6)]
          "
        >
          <div
            className="
              flex h-[50px] flex-none flex-row items-center gap-2 border-b
              border-white/10 px-[22px]
            "
          >
            <h2 className="m-0 font-heading text-lg font-medium leading-tight tracking-tight text-white">
              Manual contents
            </h2>
          </div>

          <nav className="flex flex-col">
            {manifest.sections.map((s, i) => {
              const active = s.slug === current.slug;
              // Numbering — Reality=0, Shape=1, etc. Intro is X.0 and
              // chapters are X.1, X.2, ... (i is the section index in
              // the manifest; intro lives at index 0, so the math
              // `${manifest.number}.${i}` produces X.0, X.1, X.2 …).
              const sectionNumber = `${manifest.number}.${i}`;
              return (
                <Link
                  key={s.slug || "intro"}
                  href={hrefFor(manifest.slug, s)}
                  className={[
                    // Lower-contrast row divider (was /10 → /5) so the
                    // sidebar reads as one continuous surface; active
                    // row contrast bumped (was /[0.04] → /[0.08]) so
                    // the current section reads at a glance.
                    "flex items-baseline gap-2 border-b border-white/5",
                    "px-5 py-3 text-sm no-underline",
                    "transition-colors duration-150",
                    active
                      ? "bg-white/[0.08] text-white"
                      : "text-white/70 hover:bg-white/[0.04] hover:text-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex-none font-mono text-sm font-normal tracking-wider tabular-nums",
                      active ? "" : "text-white/45",
                    ].join(" ")}
                    style={active ? { color: "var(--gold)" } : undefined}
                  >
                    {sectionNumber}
                  </span>
                  <span className="flex-1 text-base">{s.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Progress module — quieter than the rest of the sidebar:
              dimmer divider, lighter ink, lower bar-track opacity. The
              module is informational, not navigational, so it
              shouldn't compete with the section links above it. */}
          <div
            className="
              mt-auto flex-none border-t border-white/5 bg-surface-lowest
              px-[22px] pb-6 pt-5 opacity-70
            "
          >
            <div
              className="
                mb-3 flex items-baseline justify-between font-mono text-xxs
                font-medium uppercase tracking-wider text-white/40
              "
            >
              <span>Progress</span>
              <span className="text-white/60">
                {currentIndex + 1} / {manifest.sections.length}
              </span>
            </div>
            <div className="h-1 overflow-hidden bg-white/5">
              <div
                className="h-full transition-[width] duration-200"
                style={{
                  background: "var(--gold)",
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

            `compass-light-theme` re-scopes fg/surface/edge tokens to
            light values for the article subtree (defined in
            app/globals.css @layer base): `--color-fg-high` → near-
            black, `--color-surface-medium` → white. The hero title
            number prefix, h1, subheading, and the prose below all
            consume `text-fg-high` / `text-fg-medium` utilities which
            now resolve to dark text on a light surface. The dark
            sidebar (TOC + brand rail) is a SIBLING of <article>, not
            a descendant, so the scope doesn't bleed into it — its
            own `bg-surface-lowest` + explicit `text-white` classes
            keep it dark. */}
        <article className="compass-light-theme flex min-h-[calc(100vh-50px)] flex-col">
          {/* Hero header — no background tint; blends into the page
              surface so the hero reads as a continuation of the body
              content rather than an inset panel. Single bottom hairline
              still separates it from the prose below. We deliberately
              skip `manual-hero--light` here — that class in
              compass-manual.css applies a cream tint, which we now
              suppress so the hero stays flat with the content. */}
          <header className="relative border-b border-fg-medium/20">
            {/* Top bar — PromptHeading-style date on the left, Copy /
                Share docked on the right. Lower contrast than the body
                hairlines so the eye lands on the title cluster first. */}
            <div className="relative z-[1] flex h-12 items-center justify-between border-b border-fg-medium/10 px-6 text-fg-medium/70">
              {lastUpdated ? (
                <CompassPromptHeading
                  text={formatPublishDate(lastUpdated)}
                  color="fg"
                />
              ) : (
                <span aria-hidden="true" />
              )}
              <span className="inline-flex items-center gap-2">
                <ManualCopyLink />
                <ManualShareButton />
              </span>
            </div>

            {/* Hero — both intro and chapters share the same template:
                number prefix (X.0 for intro, X.Y for chapters) plus a
                big h1. Same type scale across the board (text-5xl →
                text-7xl) so the cover and the chapters look like the
                same family — the manifest title sits in place of a
                chapter title on the intro. 7/5 split at lg+ (Section
                hero recipe): number + title cluster on left col-span-7,
                subheading on right col-span-5. Top-aligned
                (lg:items-start) so the subheading reads at the top of
                its column. Stacks on mobile. */}
            <div className="relative z-[1] block px-12 py-12 max-[720px]:px-8 max-[720px]:py-10">
              <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
                <div className="flex items-baseline gap-12 max-[720px]:gap-6 lg:col-span-7">
                  <span
                    aria-hidden="true"
                    className="font-display text-5xl md:text-7xl font-normal leading-tightest tracking-tight text-fg-high/40 tabular-nums"
                  >
                    {`${manifest.number}.${currentIndex}`}
                  </span>
                  <h1 className="m-0 font-display text-5xl md:text-7xl font-normal leading-tightest tracking-tight text-fg-high">
                    {current.isIntro ? manifest.title : current.title}
                  </h1>
                </div>

                {/* Subheading — reads from chapter frontmatter
                    `summary` field. Top-aligned at lg+ (no
                    self-end), stacks below on mobile. */}
                <p className="m-0 font-sans text-lg font-normal leading-snug text-fg-medium lg:col-span-5 max-w-[40ch]">
                  {summary ??
                    "A short two-line subheading that sets up what this chapter is about and why it matters in this part of the manual."}
                </p>
              </div>
            </div>
          </header>

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
    </main>
  );
}
