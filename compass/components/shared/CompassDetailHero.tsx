import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ShareCluster } from "./ShareCluster";
import { COMPASS_H1_CLASS } from "./compass-h1";
import { Breadcrumb } from "./Breadcrumb";
import { MetaDot } from "./MetaDot";

/**
 * Shared detail-page hero — recipe used on every Compass detail
 * surface (`/workflows/[slug]`, `/templates/[slug]`, `/blog/[slug]`).
 *
 * Two layouts available, controlled by `metaLayout`:
 *
 *   • `"split"` (default) — insights / long-form editorial.
 *     Title + verified + byline on the left; summary + works-with +
 *     meta-line on the right.
 *
 *   • `"card"` — workflows + templates. Title + summary + verified
 *     + byline stack in the left column. A bordered meta card on
 *     the right gathers every structured signal:
 *
 *        Tags        →   chips
 *        Works with  →   chips
 *        Updated     →   meta line
 *        Share       →   social + copy-link cluster
 *
 *     Each row carries a label above the value (Geist 14px regular,
 *     no decoration) so the card reads as a structured meta panel,
 *     not a free-form column.
 *
 * Every colour / typography decision resolves through canonical
 * Mantle tokens declared in `app/globals.css`. Nothing bespoke.
 */

export interface CompassDetailHeroAuthor {
  name: string;
  /** Optional author profile link. When set, the author name is a
   *  `<Link>` that hovers from fg-medium → fg-high. */
  href?: string;
  role?: string;
  /** Optional avatar image URL. When set, renders a 32×32 circle
   *  next to the byline. When absent, falls back to a circle with
   *  the author's first initial in the accent ramp. */
  avatar?: string;
}

export interface CompassDetailHeroProps {
  /** Breadcrumb segments rendered as a gold mono eyebrow above the
   *  title. Pass one segment (`[{label: "Workflows", href: "/workflows"}]`)
   *  for a single-label eyebrow with chevron prefix; pass multiple
   *  for a full breadcrumb trail. */
  breadcrumb: Array<{ label: string; href: string }>;
  title: string;
  summary?: string;
  /** Authors rendered as "By A", "By A & B", or "By A, B, and C". */
  authors?: CompassDetailHeroAuthor[];
  /** Renders the "🛡 Mantle Official" verification badge. */
  verified?: boolean;
  /** Label used inside the verification badge. Default
   *  "Mantle Official". */
  verifiedLabel?: string;
  /** Right-column "Works with" chips — AI tools the workflow runs
   *  inside (e.g. Mantle AI, Claude, ChatGPT). */
  worksWith?: string[];
  /** Surface-level taxonomy rendered as chips in the card's
   *  "Categories" row (e.g. Shopify, Lifecycle, Reviews). */
  tags?: string[];
  /** Mantle product modules this workflow touches — rendered as
   *  chips in the card's "Systems" row (e.g. Customers,
   *  Email + messaging, Automations, Analytics). */
  systems?: string[];
  /** Free-form "Estimated time" meta — rendered in its own labelled
   *  row in the card (e.g. "15 min"). */
  estimatedTime?: string;
  /** Optional last-updated / published meta line shown beneath the
   *  works-with chips. */
  metaLine?: string;
  /** Canonical share URL — passed to the `<ShareCluster>` inside
   *  the meta card. Card layout only. */
  shareUrl?: string;
  /** Layout variant.
   *    "split" — summary on right (insights, editorial).
   *    "card"  — summary under title; meta in bordered card on right
   *              (workflows, templates, recipe pages).
   *  Default `"split"`. */
  metaLayout?: "split" | "card";
}

export function CompassDetailHero({
  breadcrumb,
  title,
  summary,
  authors,
  verified = false,
  verifiedLabel = "Mantle Official",
  worksWith,
  tags,
  systems,
  estimatedTime,
  metaLine,
  shareUrl,
  metaLayout = "split",
}: CompassDetailHeroProps) {
  const isCard = metaLayout === "card";

  return (
    <header className="relative bg-surface-medium text-fg-high border-b border-edge-medium">
      {/* Share cluster is absolutely positioned in the hero's
          top-right so it never contributes to the breadcrumb-row
          height. Previously the cluster's `h-8` inflated the row to
          32px, leaving ~11px of dead space below the breadcrumb
          baseline that compounded with the `gap-4` below — visible
          eyebrow → H1 distance read as ~27px instead of the
          canonical 16px the next-gen `HeroSection.astro` produces
          (its `<Stack>` puts the eyebrow + H1 as direct siblings
          with no extra row in between). Pulling share out of the
          flow restores the byte-for-byte next-gen rhythm. */}
      {isCard && shareUrl ? (
        /* Top offsets track the hero's `pt-14 md:pt-20` so the
            share cluster's top edge aligns with the breadcrumb
            row's top edge across breakpoints. */
        <div
          className="
            absolute top-14 md:top-20 right-4 sm:right-6 md:right-8
            z-10
          "
        >
          <ShareCluster url={shareUrl} title={title} />
        </div>
      ) : null}

      {/* Top padding pinned to `pt-14 md:pt-20` (56/80px) to match
          `CompassHero` + `CompassIndexHero`. Tighter than the
          marketing site's `pt-16 sm:pt-24` since Compass is a
          content-forward hub. Bottom padding keeps the existing
          `pb-12 md:pb-14` rhythm (the detail hero has more meta
          below the title than a listing hero does). */}
      <div
        className="
          mx-auto max-w-page
          px-4 sm:px-6 md:px-8
          pt-14 md:pt-20 pb-12 md:pb-14
          max-[720px]:pb-8
        "
      >
        {/* Outer column wrapper — owns the canonical `gap-4` (16px)
            between the eyebrow row and the title grid below. Value
            matches the next-gen Mantle `<Stack>` default
            (`gap: "md"` → `gap-4`) used inside `HeroSection.astro`
            for the eyebrow → H1 cluster. */}
        <div className="flex flex-col gap-4">
          {/* Breadcrumb row — share cluster is hoisted to absolute
              positioning above so the row collapses to the
              breadcrumb's natural line-height and the eyebrow → H1
              gap reads as exactly 16px. */}
          <div className="flex items-start">
            <Breadcrumb segments={breadcrumb} />
          </div>

          {/* Main hero grid — 7/5 split at lg+, single column on
              mobile. Both columns top-aligned. */}
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* ───── Left column ─────────────────────────────────
              The column uses per-child margin instead of a single
              `gap-*` so the H1 → subheading and subheading → meta
              gaps can be set independently. Per the latest spec:
                • H1 → subheading:  gap-4 (16px, `mt-4` on subheading)
                • subheading → meta: gap-6 (24px, `mt-6` on meta)
                • H1 → meta (no subheading): gap-6 (`mt-6` on meta)
              The `m-0` on the H1 keeps the heading flush so the
              child margins compose without doubling up. */}
          <div className="flex flex-col lg:col-span-7">
            <h1 className={`m-0 max-w-[18ch] ${COMPASS_H1_CLASS}`}>
              {title}
            </h1>

            {/* Card layout — summary sits below the title as a
                subheading. Split layout keeps summary on the right. */}
            {isCard && summary ? (
              <p className="m-0 mt-4 max-w-[680px] font-sans text-left text-lg leading-loose text-fg-high pb-2">
                {summary}
              </p>
            ) : null}

            {/* Verified + byline cluster — lives in the LEFT column
                for BOTH layouts. The byline picks up the first
                author's `avatar` (or initials fallback) and renders
                a 32px circle next to the "By Name · Updated DATE"
                line. The `metaLine` is folded inline with the byline
                in card layout so the author + last-updated date
                read as one editorial line; the meta card below no
                longer surfaces a separate "Updated" row. */}
            {(verified || (authors && authors.length > 0)) ? (
              <div className="mt-6 space-y-3">
                {verified ? <VerifiedBadge label={verifiedLabel} /> : null}
                {authors && authors.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <AuthorAvatar author={authors[0]} />
                    <Byline
                      authors={authors}
                      trailing={isCard ? metaLine : undefined}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* ───── Right column ──────────────────────────────── */}
          {/* `estimatedTime` is intentionally NOT forwarded to the
              meta card — the recipe pages no longer surface duration
              as a meta row (it added noise without earning its row).
              The prop is kept on the hero API for future use.

              `metaLine` is folded into the byline above in card
              layout, so the meta card no longer renders it as a
              footer row. `shareUrl` is rendered in the breadcrumb
              row above the grid, not inside the card. */}
          {isCard ? (
            <MetaCard
              tags={tags}
              systems={systems}
              worksWith={worksWith}
            />
          ) : (
            <div className="lg:col-span-5 mt-6 lg:mt-0 space-y-6">
              {summary ? (
                <p className="m-0 max-w-[680px] font-sans text-left text-lg leading-loose text-fg-high pb-2">
                  {summary}
                </p>
              ) : null}
              {worksWith && worksWith.length > 0 ? (
                <WorksWithBlock items={worksWith} />
              ) : null}
              {metaLine ? <MetaLine text={metaLine} /> : null}
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
 * MetaCard — bordered meta block for the `card` hero layout
 * ─────────────────────────────────────────────────────────────
 *
 * Used by workflows + templates. Gathers every structured signal
 * (tags, works-with, updated date, share buttons) into one panel
 * on the right. Border-only chrome (no fill) so the card reads as
 * a structured side-panel against the dark hero canvas.
 *
 * Each row has a labelled header (`<MetaRow label="Tags">`) so the
 * card reads as a form-style meta panel rather than a free-form
 * column. Labels use Geist 14px regular per the design spec.
 */
function MetaCard({
  tags,
  systems,
  worksWith,
}: {
  tags?: string[];
  systems?: string[];
  worksWith?: string[];
}) {
  /* Layout:
       AI models → AI tools as accent-gold PILLS
       Systems   → Mantle product modules (dot-separated)
       Tags      → surface-level categories (dot-separated)
     Share cluster + last-updated meta were hoisted OUT of this
     card (share lives in the hero breadcrumb row; updated date
     folds into the byline). The card is now a focused recipe
     spec sheet with three rows. */
  return (
    <aside
      aria-label="Recipe details"
      className="
        lg:col-span-5 mt-6 lg:mt-0
        rounded-lg border border-edge-medium
        p-6 space-y-4
        leading-tight
      "
    >
      {worksWith && worksWith.length > 0 ? (
        <MetaRow label="AI models">
          <PillRow items={worksWith} />
        </MetaRow>
      ) : null}

      {systems && systems.length > 0 ? (
        <MetaRow label="Systems">
          <DotList items={systems} />
        </MetaRow>
      ) : null}

      {tags && tags.length > 0 ? (
        <MetaRow label="Tags">
          <DotList items={tags} />
        </MetaRow>
      ) : null}
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────
 * MetaRow — labelled row inside the meta card
 * ─────────────────────────────────────────────────────────────
 * Label sits above the value with a fixed 8px gap. Label recipe is
 * Geist 14px regular (text-xs in the Compass scale = 14px),
 * `text-fg-low`, no underline, no uppercase, no tracking — reads
 * as a form-style field label, not an editorial eyebrow.
 */
function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    /* Tighter row rhythm: label → value gap drops from `space-y-2`
       (8px) to `space-y-1.5` (6px), and the label line-height is
       pinned to `leading-tight` so each row reads as a compact
       spec entry rather than a paragraph. */
    <div className="space-y-1.5">
      <span className="block font-sans text-xs font-normal leading-tight text-fg-low no-underline">
        {label}
      </span>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Sub-components
 * ─────────────────────────────────────────────────────────────
 */

function ChipRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center px-3 py-1.5 rounded-md border border-edge-medium bg-surface-higher text-sm text-fg-medium"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * DotList — values rendered as dot-separated inline text
 * ─────────────────────────────────────────────────────────────
 * Used inside the workflow / template hero meta card for
 * Works-with, Systems-used, and Tags rows. Replaces the older
 * `<ChipRow>` chip pills with a more editorial spec-sheet feel.
 *
 * Tones:
 *   "fg"     (default) — values in `text-fg-medium`, separators in
 *                        `text-fg-lower`. Used by Systems + Tags.
 *   "accent" — values in `text-accent` (Mantle gold #FFBB53) for
 *              the "Works with" row so the AI-tool attribution
 *              stands out as the primary meta signal. Was
 *              `text-accent-high` (#FFC66E, lighter) — aligned to
 *              the canonical Mantle gold so every accent-colored
 *              eyebrow / chip / badge across Compass uses one
 *              shade.
 */
function DotList({
  items,
  tone = "fg",
}: {
  items: string[];
  tone?: "fg" | "accent";
}) {
  const valueClass =
    tone === "accent" ? "text-accent" : "text-fg-medium";
  /* `leading-tight` (1.25) drops the inherited prose line-height
     so the meta card values sit at the same compact rhythm as the
     row labels above them. */
  return (
    <p className={`m-0 font-sans text-sm leading-tight ${valueClass}`}>
      {items.map((item, i) => (
        <span key={item}>
          {i > 0 ? <MetaDot /> : null}
          <span>{item}</span>
        </span>
      ))}
    </p>
  );
}

/* ─────────────────────────────────────────────────────────────
 * PillRow — filled pill chips, per-item tone
 * ─────────────────────────────────────────────────────────────
 * Used by the "AI models" row inside the meta card. Only the
 * Mantle-authored tool ("Mantle") wears the accent-gold plate; every
 * third-party model ("Claude", "ChatGPT", etc.) gets a muted
 * surface chip with a thin edge-medium border. The single bright
 * pill anchors the row to the first-party recommendation while the
 * supporting tools read as compatible-with metadata.
 *
 * Pill text recipe: Geist (`font-sans`), regular (`font-normal`),
 * sentence case (no `uppercase`, no `tracking-wider`). Reads as a
 * compact label, not an editorial eyebrow.
 */
const ACCENT_PILL_ITEMS = new Set(["Mantle", "Mantle AI"]);

function PillRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isAccent = ACCENT_PILL_ITEMS.has(item);
        /* Mantle pill — `--color-accent` (#FFBB53, the canonical
           Mantle Official gold). Was previously `--color-accent-
           high` (#FFC66E, a lighter warm gold) which read as a
           half-shade off from the marketing-site brand color +
           every other accent eyebrow on Compass. Single shade
           across every Mantle-branded surface keeps the gold from
           drifting between half-tones. */
        const pillClass = isAccent
          ? "bg-[var(--color-accent)] text-[var(--color-card-fg-dark)]"
          : "bg-surface-higher text-fg-medium border border-edge-medium";
        return (
          <span
            key={item}
            className={`inline-flex items-center rounded-md px-2 py-0.5 font-sans text-xxs font-medium ${pillClass}`}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
}

function WorksWithBlock({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      <span className="block font-mono text-xs uppercase tracking-wider text-fg-low">
        Works with
      </span>
      <ChipRow items={items} />
    </div>
  );
}

function MetaLine({ text }: { text: string }) {
  /* Sans-serif, case-preserved — pairs with the canonical Compass
     date format ("May 13, 2026") and reads as quiet body chrome
     beneath the title. Was previously `font-mono uppercase
     tracking-wider`, which forced "UPDATED MAY 13, 2026" — too
     loud once the date was no longer compact mono. */
  return (
    <p className="m-0 font-sans text-sm text-fg-low">
      {text}
    </p>
  );
}

/* `Breadcrumb` extracted to `./Breadcrumb` so manual chapter
 * routes can reuse the same chrome — see top-of-file import. */

/* ─────────────────────────────────────────────────────────────
 * Verified badge — "🛡 Mantle Official"
 * ─────────────────────────────────────────────────────────────
 * Mono-uppercase eyebrow with the ShieldCheck icon inline. No chip
 * background — reads as an editorial label, not a button. Color is
 * `text-accent` (#FFBB53, the canonical Mantle gold) so the badge
 * stands out against the white title without competing for
 * attention. Was `text-accent-high` (#FFC66E, half a shade lighter);
 * pulled to `text-accent` so the brand-gold appears at exactly one
 * value across the whole site.
 */
function VerifiedBadge({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2 font-mono font-medium text-xs uppercase tracking-wider leading-loose text-accent">
      <ShieldCheck width={16} height={16} color="currentColor" strokeWidth={2} aria-hidden />
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
 * AuthorAvatar — 32×32 circle next to the byline
 * ─────────────────────────────────────────────────────────────
 * When the first author has an `avatar` URL, renders it as a
 * round image. When absent, falls back to a circle with the
 * author's first initial in the accent ramp — same recipe as
 * the old insight-hero avatar fallback. Keeps the byline grounded
 * visually so the editorial attribution sits as one cluster.
 */
function AuthorAvatar({ author }: { author: CompassDetailHeroAuthor }) {
  const initial = author.name?.trim().charAt(0).toUpperCase() ?? "";
  /* Mantle Team default — when the author is "Mantle Team" /
     "Mantle" and no per-author avatar is set, fall back to the
     gold logomark. Renders as a rounded-square plate (matching the
     mark's native 8px-radius shape) instead of a circle so the
     brand identity reads correctly. */
  const trimmed = author.name?.trim() ?? "";
  const isMantleTeam = /^mantle(\s|$)/i.test(trimmed);
  const src = author.avatar ?? (isMantleTeam ? "/mantle-logomark.svg" : undefined);
  const isLogomark = !author.avatar && isMantleTeam;
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={author.name}
        className={[
          "h-8 w-8 flex-none border border-edge-medium object-cover bg-surface-higher",
          isLogomark ? "rounded-md" : "rounded-full",
        ].join(" ")}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="
        flex h-8 w-8 flex-none items-center justify-center rounded-full
        border border-edge-medium bg-accent/[0.18]
        font-heading text-sm font-medium text-accent
      "
    >
      {initial}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Byline — "By Author A & Author B · Updated DATE"
 * ─────────────────────────────────────────────────────────────
 * "By" rendered in fg-low; author names in fg-medium and (when an
 * `href` is provided) linkified so they hover to fg-high. Renders
 * inline as a single sentence so multi-author attributions read
 * editorially.
 *
 * `trailing` is the optional inline meta segment appended after the
 * authors with a dot separator. Used by the card-layout hero to fold
 * the last-updated date ("Updated May 14, 2026") into the byline
 * line — the meta card no longer carries a separate "Updated" row.
 */
function Byline({
  authors,
  trailing,
}: {
  authors: CompassDetailHeroAuthor[];
  trailing?: string;
}) {
  return (
    <p className="m-0 text-sm text-fg-low">
      By{" "}
      {authors.map((a, i) => {
        const node = a.href ? (
          <Link
            href={a.href}
            className="text-fg-medium hover:text-fg-high transition-colors duration-150 no-underline"
          >
            {a.name}
          </Link>
        ) : (
          <span className="text-fg-medium">{a.name}</span>
        );
        const joiner = joinerFor(i, authors.length);
        return (
          <span key={`${a.name}-${i}`}>
            {node}
            {joiner}
          </span>
        );
      })}
      {trailing ? (
        <>
          <MetaDot />
          <span className="text-fg-medium">{trailing}</span>
        </>
      ) : null}
    </p>
  );
}

/** Punctuation between author entries: nothing before the first,
 *  " & " between exactly two, ", " between middle entries, and
 *  ", and " before the last when there are 3+. */
function joinerFor(i: number, total: number): string {
  const isLast = i === total - 1;
  if (isLast) return "";
  if (total === 2) return " & ";
  if (i === total - 2) return ", and ";
  return ", ";
}
