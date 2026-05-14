import { Children, type ReactNode } from "react";
import { ChevronRight, MoveRight } from "lucide-react";

// One props shape for the whole family — semantic uniformity matters more
// than per-component flexibility. Writers pass `title` only to override the
// default label (rare); `children` is the body.
interface CalloutProps {
  title?: string;
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

function CalloutHeader({ title }: { title: string }) {
  // No Tailwind gap utility — `gap` is owned by compass-callouts.css
  // (`.callout-header { gap: calc(var(--spacing) * 3); }`) so it stays
  // pinned to the exact PromptHeading value and can't drift.
  return (
    <header className="callout-header flex items-center">
      <ChevronRight
        className="callout-icon"
        width={16}
        height={16}
        strokeWidth={2}
        aria-hidden
      />
      <h3 className="callout-label">{title}</h3>
    </header>
  );
}

export function FieldNote({ title = "Field Note", children }: CalloutProps) {
  return (
    <aside className="callout callout-field-note">
      <CalloutHeader title={title} />
      <div className="callout-body">{children}</div>
    </aside>
  );
}

export function RealityCheck({
  title = "Reality Check",
  children,
}: CalloutProps) {
  return (
    <aside className="callout callout-reality-check">
      <CalloutHeader title={title} />
      <div className="callout-body">{children}</div>
    </aside>
  );
}

export function CommonFailure({
  title = "Common Failure",
  children,
}: CalloutProps) {
  return (
    <aside className="callout callout-common-failure">
      <CalloutHeader title={title} />
      <div className="callout-body">{children}</div>
    </aside>
  );
}

/**
 * DecisionPoint — two-column fork inside the shared shell. Writers pass two
 * children (one per option); each renders into its own column with a
 * vertical hairline divider between them on tablet+.
 */
export function DecisionPoint({
  title = "Decision Point",
  children,
}: CalloutProps) {
  const options = Children.toArray(children);
  return (
    <aside className="callout callout-decision-point">
      <CalloutHeader title={title} />
      <div className="callout-body grid grid-cols-1 md:grid-cols-2">
        {options.map((option, i) => (
          <div
            key={i}
            className={
              "callout-fork-option " +
              (i === 0
                ? "callout-fork-option-a"
                : "callout-fork-option-b")
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
 * FounderShift — before → arrow → after inside the shared shell. The arrow
 * sits as its own column on desktop and rotates 90° on stacked mobile.
 */
export function FounderShift({
  title = "Founder Shift",
  children,
}: CalloutProps) {
  const [from, to] = Children.toArray(children);
  return (
    <aside className="callout callout-founder-shift">
      <CalloutHeader title={title} />
      <div className="callout-body grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-5">
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
