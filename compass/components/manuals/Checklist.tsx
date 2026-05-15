"use client";

import { useState, type ReactNode } from "react";

/**
 * Checklist — Mantle next-gen "Top 10 callouts" v2 spec
 * (public/mantle-callouts-v2.html, callout #08).
 *
 * Interactive list inside the canonical Compass callout shell. Each
 * row is a `<button>` for keyboard + screenreader affordance; clicking
 * toggles a `.done` class + flips `aria-pressed`. Done rows get a
 * filled chapter-accent box + line-through text. State is purely
 * local (in-memory) — there's no persistence; this is a reading
 * affordance for "I've worked through this," not a save-able TODO list.
 *
 * Use in MDX:
 *
 *   <Checklist>
 *     <CheckItem>You can describe the problem in one sentence.</CheckItem>
 *     <CheckItem>You know one person who is paying you, or would.</CheckItem>
 *     <CheckItem>You can articulate what you're explicitly not building.</CheckItem>
 *   </Checklist>
 *
 *   <Checklist title="Ready to ship?" dataIndex="L-02">
 *     <CheckItem>...</CheckItem>
 *   </Checklist>
 *
 * Styling lives in `app/globals.css` `@layer components` →
 * `.manual-section .callout-checklist`. Mirrors the v2 spec
 * line-for-line.
 */
export function Checklist({
  title = "Checklist",
  dataIndex,
  children,
}: {
  /** Filled-accent tag at top-left. Defaults to "Checklist". */
  title?: string;
  /** Optional bottom-right designator (e.g. "L-01"). */
  dataIndex?: string;
  children: ReactNode;
}) {
  return (
    <aside className="callout callout-checklist" data-index={dataIndex}>
      <header className="callout-header">
        <h3 className="callout-label">{title}</h3>
      </header>
      <div className="callout-body">{children}</div>
    </aside>
  );
}

/**
 * Individual checklist row. `defaultDone` lets a writer pre-check
 * items that are already completed in the chapter narrative (e.g. a
 * "by this point you should have…" review). Clicking toggles between
 * checked + unchecked; state isn't persisted across reloads.
 */
export function CheckItem({
  children,
  defaultDone = false,
}: {
  children: ReactNode;
  /** Pre-check this item on initial render (uncontrolled). */
  defaultDone?: boolean;
}) {
  const [done, setDone] = useState(defaultDone);

  return (
    <button
      type="button"
      className={`check-item${done ? " done" : ""}`}
      aria-pressed={done}
      onClick={() => setDone((prev) => !prev)}
    >
      <span className="check-box" aria-hidden="true" />
      <span>{children}</span>
    </button>
  );
}
