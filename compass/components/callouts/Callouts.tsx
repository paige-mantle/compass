import { Children, type ReactNode } from "react";
import { MoveRight } from "lucide-react";

/**
 * Shared props for the whole semantic-callout family (Field Note ·
 * Reality Check · Common Failure · Decision Point · Founder Shift).
 * Semantic uniformity matters more than per-component flexibility —
 * writers pass `title` only to override the default label (rare),
 * `dataIndex` for the optional typed designator that renders in the
 * card's bottom-right (e.g. "F-01", "R-02"), and `children` for body.
 *
 * Markup follows Mantle next-gen "Top 10 callouts" v2 spec
 * (public/mantle-callouts-v2.html):
 *
 *   <aside class="callout callout-<type>" data-index="X-NN">
 *     <header class="callout-header">
 *       <h3 class="callout-label">Type Name</h3>
 *     </header>
 *     <div class="callout-body">...</div>
 *   </aside>
 *
 * Styling lives in `app/globals.css` `@layer components`
 * (`.manual-section .callout` family) and per-chapter accent
 * overrides via `.accent-foundation` / `.accent-shape` etc. on any
 * ancestor element flip `--gold` to the chapter color, which the
 * callout shell + tag + accents all consume.
 */
interface CalloutProps {
  title?: string;
  /** Bottom-right designator (renders via CSS `content: attr(data-index)`). */
  dataIndex?: string;
  children: ReactNode;
}

/* ─────────────────────────────────────────────────────────────────────────
 * The semantic callout family — Field Note · Reality Check · Common Failure
 * · Decision Point · Founder Shift — all share the SAME chrome now:
 *
 *   ▸ Same outer shell (background, border, radius, padding).
 *   ▸ Same header: a CompassPromptHeading-style eyebrow — chevron-right
 *     icon + uppercase mono label in `fg-medium` ink. No pill background,
 *     no per-callout color treatment, no per-callout icon.
 *
 * Differentiation now lives in the label text alone, plus the internal
 * body layout for DecisionPoint (two-column fork) and FounderShift
 * (three-column before/arrow/after).
 *
 * The chevron and label markup is identical to CompassPromptHeading so the
 * eyebrow reads as a continuation of the same typographic system used
 * elsewhere in Compass — eyebrows above CTAs, above section heads, etc.
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Shared header — bare floating tag with just the label. No icon
 * (chevron was retired in v2). CSS positions the header absolutely
 * at the top-left of the card so it half-overlaps the border.
 */
function CalloutHeader({ title }: { title: string }) {
  return (
    <header className="callout-header">
      <h3 className="callout-label">{title}</h3>
    </header>
  );
}

export function FieldNote({
  title = "Field Note",
  dataIndex,
  children,
}: CalloutProps) {
  return (
    <aside className="callout callout-field-note" data-index={dataIndex}>
      <CalloutHeader title={title} />
      <div className="callout-body">{children}</div>
    </aside>
  );
}

export function RealityCheck({
  title = "Reality Check",
  dataIndex,
  children,
}: CalloutProps) {
  return (
    <aside className="callout callout-reality-check" data-index={dataIndex}>
      <CalloutHeader title={title} />
      <div className="callout-body">{children}</div>
    </aside>
  );
}

export function CommonFailure({
  title = "Common Failure",
  dataIndex,
  children,
}: CalloutProps) {
  return (
    <aside className="callout callout-common-failure" data-index={dataIndex}>
      <CalloutHeader title={title} />
      <div className="callout-body">{children}</div>
    </aside>
  );
}

/**
 * DecisionPoint — two-column fork inside the shared shell. Writers
 * pass two children (one per option); each renders into its own
 * column with a vertical hairline divider between them on tablet+.
 */
export function DecisionPoint({
  title = "Decision Point",
  dataIndex,
  children,
}: CalloutProps) {
  const options = Children.toArray(children);
  return (
    <aside className="callout callout-decision-point" data-index={dataIndex}>
      <CalloutHeader title={title} />
      <div className="callout-body">
        {options.map((option, i) => (
          <div
            key={i}
            className={
              "callout-fork-option " +
              (i === 0 ? "callout-fork-option-a" : "callout-fork-option-b")
            }
          >
            {option}
          </div>
        ))}
      </div>
    </aside>
  );
}

/**
 * FounderShift — from | arrow | to inside the shared shell. The arrow
 * sits as its own column on desktop and rotates 90° on stacked
 * mobile (CSS handles the orientation flip).
 */
export function FounderShift({
  title = "Founder Shift",
  dataIndex,
  children,
}: CalloutProps) {
  const [from, to] = Children.toArray(children);
  return (
    <aside className="callout callout-founder-shift" data-index={dataIndex}>
      <CalloutHeader title={title} />
      <div className="callout-body grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start gap-5">
        <div className="callout-shift-from">{from}</div>
        <MoveRight
          className="callout-shift-arrow"
          strokeWidth={1.25}
          size={28}
          aria-hidden
        />
        <div className="callout-shift-to">{to}</div>
      </div>
    </aside>
  );
}
