import type { ReactNode } from "react";

/**
 * Styled wrapper for MDX-rendered ` ``` ` code fences inside Compass
 * detail-page prose (workflows, templates, insights).
 *
 * Plain markdown code fences (e.g. ` ```bash`) render as
 * `<pre><code>...</code></pre>` by default. Without an MDX override,
 * those blocks come through with the browser's default `<pre>`
 * styling — black text, no background, ignored by the prose
 * stylesheet. This component plugs into the MDX `pre` slot and gives
 * code fences the canonical Compass code-tile chrome:
 *
 *   • `rounded-lg border border-edge-medium bg-surface-higher`
 *   • `font-mono text-xs leading-loose text-fg-medium`
 *   • `overflow-x-auto` so long lines scroll horizontally
 *
 * Recipe pulled directly from the next-gen design spec (same frame
 * the right-rail `<CodeBlocks>` panel uses for AI prompts) so every
 * code surface across Compass shares one chrome.
 *
 * The component preserves the inner `<code>` element MDX provides
 * so the language class (`language-bash`, `language-ts`, etc.) lands
 * on it for any future syntax highlighting pass.
 */
export function CodeFence({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <pre
      className={[
        "my-6 overflow-x-auto rounded-lg border border-edge-medium",
        "bg-surface-higher px-4 py-3",
        "font-mono text-xs leading-loose text-fg-medium",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </pre>
  );
}
