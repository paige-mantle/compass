import type { ReactNode } from "react";

/**
 * Generic `<Callout>` — Mantle next-gen "Top 10 callouts" v2 spec
 * (public/mantle-callouts-v2.html, callout #06).
 *
 * Use when you want the canonical Compass callout shell — bordered
 * plate with chapter-accent tint, filled-accent tag at top-left,
 * optional typed designator bottom-right via `data-index` — but
 * don't want one of the more specific semantic types (FieldNote,
 * RealityCheck, CommonFailure, DecisionPoint, FounderShift, Quote,
 * Checklist, TLDR). Pass an optional `title` to set the tag label
 * (defaults to "Callout").
 *
 * Use in MDX:
 *
 *   <Callout>
 *   The tools give you leverage. Leverage amplifies whatever you
 *   point it at — point it at the wrong problem and you get a very
 *   efficient path to nowhere.
 *   </Callout>
 *
 *   <Callout title="Note" dataIndex="N-01">
 *   ...
 *   </Callout>
 *
 * Styling lives in `app/globals.css` `@layer components` →
 * `.manual-section .callout`. Mirrors the v2 spec line-for-line.
 *
 * **When to reach for a typed callout instead:** if your block has a
 * specific editorial intent (a warning, a fork, a quote, a TL;DR),
 * prefer the typed component. Typed labels carry meaning across
 * chapters; generic "Callout" is the catch-all when nothing fits.
 */
export function Callout({
  title = "Callout",
  dataIndex,
  children,
}: {
  /** Filled-accent tag at top-left. Defaults to "Callout". */
  title?: string;
  /** Optional bottom-right designator (e.g. "N-01"). Renders via CSS
   *  `content: attr(data-index)` when present. */
  dataIndex?: string;
  children: ReactNode;
}) {
  return (
    <aside className="callout" data-index={dataIndex}>
      <header className="callout-header">
        <h3 className="callout-label">{title}</h3>
      </header>
      <div className="callout-body">{children}</div>
    </aside>
  );
}
