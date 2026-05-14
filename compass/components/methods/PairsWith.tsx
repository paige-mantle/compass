import Link from "next/link";
import type { ReactNode } from "react";

/**
 * "Pairs well with" — a lightweight grid of related Compass frameworks
 * that complement the current one in a workflow. Renders inside the
 * .framework-content body and is styled by .framework-pairs in
 * compass-content.css.
 *
 * Use in MDX with children-based API (more reliable across MDX versions
 * than array props):
 *
 *   <PairsWith>
 *     <PairItem slug="landing-page-roast" title="Landing page roast"
 *               summary="…" />
 *     …
 *   </PairsWith>
 */
export function PairsWith({ children }: { children: ReactNode }) {
  return <ul className="framework-pairs">{children}</ul>;
}

export function PairItem({
  slug,
  title,
  summary,
}: {
  slug: string;
  title: string;
  summary?: string;
}) {
  return (
    <li>
      <Link href={`/compass/methods/${slug}`}>
        <span className="framework-pairs-eyebrow">Framework</span>
        <span className="framework-pairs-title">{title}</span>
        {summary ? (
          <span className="framework-pairs-summary">{summary}</span>
        ) : null}
      </Link>
    </li>
  );
}
