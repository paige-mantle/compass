import type { ReactNode } from "react";

/**
 * Quote — Mantle next-gen "Top 10 callouts" v2 spec
 * (public/mantle-callouts-v2.html, callout #07).
 *
 * Pull-quote inside the canonical Compass callout shell. 3px gold
 * left bar gives the editorial pull-quote feel without losing the
 * bordered-card identity. The quote itself renders in the Geist
 * Pixel display face at `text-2xl`; the attribution sits below as
 * mono uppercase in `fg-low`.
 *
 * Use in MDX:
 *
 *   <Quote attribution="— Mark Zuckerberg, on Stratechery, 2011">
 *   The biggest risk is not taking any risk. In a world that's
 *   changing really quickly, the only strategy that is guaranteed
 *   to fail is not taking risks.
 *   </Quote>
 *
 *   <Quote attribution="— Jane Doe" dataIndex="Q-01">
 *   ...
 *   </Quote>
 *
 * Styling lives in `app/globals.css` `@layer components` →
 * `.manual-section .callout-quote`. Mirrors the v2 spec line-for-line.
 */
export function Quote({
  title = "Quote",
  attribution,
  dataIndex,
  children,
}: {
  /** Filled-accent tag at top-left. Defaults to "Quote". */
  title?: string;
  /** Attribution line below the quote (e.g. "— Author, Source, Year").
   *  Renders inside a `<cite>` so screen readers pick up the
   *  citation semantics. */
  attribution?: string;
  /** Optional bottom-right designator (e.g. "Q-01"). */
  dataIndex?: string;
  children: ReactNode;
}) {
  return (
    <aside className="callout callout-quote" data-index={dataIndex}>
      <header className="callout-header">
        <h3 className="callout-label">{title}</h3>
      </header>
      <div className="callout-body">
        <blockquote>{children}</blockquote>
        {attribution ? <cite>{attribution}</cite> : null}
      </div>
    </aside>
  );
}
