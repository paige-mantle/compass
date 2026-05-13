import { Children, type ReactNode } from "react";
import {
  NotebookPen,
  Crosshair,
  TriangleAlert,
  GitFork,
  ArrowRightLeft,
  MoveRight,
} from "lucide-react";

// One props shape for the whole family — semantic uniformity matters more
// than per-component flexibility. Writers pass `title` only to override the
// default label (rare); `children` is the body.
interface CalloutProps {
  title?: string;
  children: ReactNode;
}

/* ─────────────────────────────────────────────────────────────────────────
 * FIELD NOTE — describes
 *
 * Treatment: a margin note. Thin LEFT border bar, narrower max-width than the
 * surrounding prose, label sits as a small eyebrow above the body. Reads as
 * an aside the reader can choose to lean into, not an interruption.
 *
 * Why: a field note is observational — it should *sit beside* the prose, not
 * stop it. The narrow column is the load-bearing visual cue; even with the
 * label and icon stripped, the constriction alone says "aside."
 * ──────────────────────────────────────────────────────────────────────── */
export function FieldNote({ title = "Field Note", children }: CalloutProps) {
  return (
    <aside className="callout callout-field-note border-l pl-5 py-2 my-6 max-w-[60ch]">
      <header className="callout-header flex items-center gap-2 mb-2">
        <NotebookPen
          className="callout-icon"
          strokeWidth={1.25}
          size={16}
          aria-hidden
        />
        <h3 className="callout-label">{title}</h3>
      </header>
      <div className="callout-body">{children}</div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * REALITY CHECK — confronts
 *
 * Treatment: horizontal rules above AND below, generous vertical padding, the
 * biggest icon of the five. Borders only on top/bottom — no sides — so it
 * reads like a rule pulled all the way across the column. The column STOPS.
 *
 * Why: a reality check confronts. The reader must visually land on it; they
 * cannot scroll past it without registering the interruption. Compare this
 * to FIELD NOTE (which the reader can choose to skim) — opposite job, opposite
 * treatment.
 * ──────────────────────────────────────────────────────────────────────── */
export function RealityCheck({
  title = "Reality Check",
  children,
}: CalloutProps) {
  return (
    <aside className="callout callout-reality-check border-t border-b py-8 my-10">
      <header className="callout-header flex items-center gap-3 mb-5">
        <Crosshair
          className="callout-icon"
          strokeWidth={1.25}
          size={22}
          aria-hidden
        />
        <h3 className="callout-label">{title}</h3>
      </header>
      <div className="callout-body">{children}</div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * COMMON FAILURE — warns
 *
 * Treatment: case-file. A four-sided bordered box with the label perched on
 * the TOP EDGE — overlapping the border like a manila folder's tab. Compact
 * padding compared to RealityCheck; this isn't dramatic, it's clinical.
 *
 * Why: a common failure is a documented pattern, evidence already filed.
 * The case-file metaphor signals "this has been seen before" — the reader
 * is being shown a record, not warned in real time. TriangleAlert reads
 * universally as caution without any color signal at all.
 * ──────────────────────────────────────────────────────────────────────── */
export function CommonFailure({
  title = "Common Failure",
  children,
}: CalloutProps) {
  return (
    <aside className="callout callout-common-failure relative border px-5 pt-6 pb-4 my-6">
      <header className="callout-header absolute -top-3 left-4 inline-flex items-center gap-1.5 px-2">
        <TriangleAlert
          className="callout-icon"
          strokeWidth={1.25}
          size={14}
          aria-hidden
        />
        <h3 className="callout-label">{title}</h3>
      </header>
      <div className="callout-body">{children}</div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * DECISION POINT — prompts
 *
 * Treatment: explicit fork. Two-column grid with a vertical divider between
 * the columns. The writer passes TWO children (one per option) and each is
 * placed in its own slot. GitFork icon — a literal Y-split — sits in the
 * header.
 *
 * Why: a decision point is a choice between two paths. The layout itself —
 * two parallel columns separated by a rule — is the metaphor. Without
 * reading a word, the reader knows: this OR that. If the writer passes only
 * one child, it occupies the left column; the divider degrades gracefully.
 * ──────────────────────────────────────────────────────────────────────── */
export function DecisionPoint({
  title = "Decision Point",
  children,
}: CalloutProps) {
  const options = Children.toArray(children);
  return (
    <aside className="callout callout-decision-point border p-6 my-6">
      <header className="callout-header flex items-center gap-2 mb-5 pb-4 border-b">
        <GitFork
          className="callout-icon"
          strokeWidth={1.25}
          size={18}
          aria-hidden
        />
        <h3 className="callout-label">{title}</h3>
      </header>
      <div className="callout-body grid grid-cols-1 md:grid-cols-2">
        {options.map((option, i) => (
          <div
            key={i}
            className={
              "callout-fork-option " +
              (i === 0
                ? "callout-fork-option-a md:pr-6 pb-6 md:pb-0"
                : "callout-fork-option-b md:pl-6 md:border-l pt-6 md:pt-0 border-t md:border-t-0")
            }
          >
            {option}
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * FOUNDER SHIFT — transforms
 *
 * Treatment: before → arrow → after. Three-column grid where the arrow IS a
 * layout column (not decoration). The writer passes two children — the
 * "from" state and the "to" state — and the arrow renders between them.
 *
 * Why: a mindset shift is directional. The arrow has to feel inevitable, not
 * ornamental — making it a grid column achieves that. This is the most
 * kinetic of the five; the reader's eye moves left-to-right through the
 * transformation. On narrow screens the arrow rotates 90° (CSS handles that
 * via the `callout-shift-arrow` class) so the metaphor survives mobile.
 * ──────────────────────────────────────────────────────────────────────── */
export function FounderShift({
  title = "Founder Shift",
  children,
}: CalloutProps) {
  const [from, to] = Children.toArray(children);
  return (
    <aside className="callout callout-founder-shift border p-6 my-6">
      <header className="callout-header flex items-center gap-2 mb-5">
        <ArrowRightLeft
          className="callout-icon"
          strokeWidth={1.25}
          size={18}
          aria-hidden
        />
        <h3 className="callout-label">{title}</h3>
      </header>
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
