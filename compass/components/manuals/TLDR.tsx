import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Collapsible TL;DR — a `<details>` block that hides the chapter summary
 * behind a single-line summary control. Keyboard accessible by default
 * (Enter / Space on the summary toggles the disclosure).
 *
 * Use in MDX:
 *
 *   <TLDR>
 *   Short summary of the chapter, two or three sentences max.
 *   </TLDR>
 *
 * Optional `label` prop overrides the default click-to-expand text.
 */
export function TLDR({
  label = "Click me for the TL;DR (too long; didn't read)",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <details className="manual-tldr">
      <summary className="manual-tldr-summary">
        <span className="manual-tldr-label">{label}</span>
        <span className="manual-tldr-chevron" aria-hidden>
          <ChevronDown strokeWidth={1.5} size={18} />
        </span>
      </summary>
      <div className="manual-tldr-body">{children}</div>
    </details>
  );
}
