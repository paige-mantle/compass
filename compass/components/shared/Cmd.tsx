import { ChevronRight } from "lucide-react";

/**
 * Inline terminal-command snippet for MDX content. Renders the
 * shell command in a bordered tile with a gold chevron prompt to
 * the left:
 *
 *   ▸ npx sanity blueprints init
 *
 * Recipe (from the next-gen design spec):
 *   my-6 flex items-center gap-3
 *   font-mono text-sm text-fg-medium
 *   bg-surface-higher border border-edge-medium rounded-md
 *   px-4 py-3
 *   + ChevronRight w-4 h-4 text-accent-high (strokeWidth 2.5)
 *
 * Use in MDX like:
 *
 *   <Cmd>npx sanity blueprints init</Cmd>
 *
 * Single inline string; multi-line commands belong in a
 * `<CodeBlock>` instead.
 */
export function Cmd({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex items-center gap-3 font-mono text-sm text-fg-medium bg-surface-higher border border-edge-medium rounded-md px-4 py-3">
      <ChevronRight
        width={16}
        height={16}
        color="currentColor"
        strokeWidth={2.5}
        aria-hidden
        className="shrink-0 text-accent-high"
      />
      <span className="overflow-x-auto whitespace-pre">{children}</span>
    </div>
  );
}
