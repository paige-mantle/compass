import type { ReactNode } from "react";

/**
 * TL;DR — Mantle next-gen "Top 10 callouts" v2 spec
 * (public/mantle-callouts-v2.html, callout #10).
 *
 * Static callout (not a collapsible `<details>`) using the canonical
 * Compass shell — bordered plate w/ chapter-accent tint, filled
 * accent tag at top-left, optional typed designation bottom-right
 * via `data-index`. Body text is `text-lg / leading-loose / fg-medium`
 * so the TL;DR reads as the "stop here if you only have 30 seconds"
 * summary at the top of a chapter, not as a buried collapsed block.
 *
 * Use in MDX:
 *
 *   <TLDR>
 *   CoinTracker's content needs outgrew Ghost, so we migrated
 *   the entire blog stack to Sanity and rebuilt it around
 *   structured, scalable content.
 *   </TLDR>
 *
 *   <TLDR title="The short version" dataIndex="T-01">
 *   ...
 *   </TLDR>
 *
 * Styling lives in `app/globals.css` `@layer components` →
 * `.manual-section .callout-tldr`. Mirrors the v2 spec line-for-line.
 */
export function TLDR({
  title = "TL;DR",
  dataIndex,
  children,
}: {
  /** Filled-accent tag at top-left. Defaults to "TL;DR". */
  title?: string;
  /** Optional bottom-right designator (e.g. "T-01"). Renders via
   *  CSS `content: attr(data-index)` when present; absent when null. */
  dataIndex?: string;
  children: ReactNode;
}) {
  return (
    <aside className="callout callout-tldr" data-index={dataIndex}>
      <header className="callout-header">
        <h3 className="callout-label">{title}</h3>
      </header>
      <div className="callout-body">{children}</div>
    </aside>
  );
}
