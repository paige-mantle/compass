import Link from "next/link";
import type { ReactNode } from "react";

/**
 * `<RelatedCards>` — intentional related-content cards for the
 * Method/Template page footer. Each card is a small content surface
 * with an eyebrow (Method / Template / Manual), a title, and an
 * optional one-line summary, replacing the looser "plain markdown
 * link list" pattern.
 *
 * Used in MDX:
 *
 *   <RelatedCards>
 *     <RelatedCard
 *       kind="Method"
 *       href="/compass/methods/reddit-research-report"
 *       title="Reddit research report"
 *       summary="Pull demand signal out of niche subreddits."
 *     />
 *     <RelatedCard kind="Template" href="/templates/billing-components" ... />
 *   </RelatedCards>
 *
 * Reuses the `.framework-pairs` CSS family (compass-content.css) so
 * the cards inherit the same chrome as `<PairsWith>`. The only
 * difference is the eyebrow label — `<PairsWith>` hard-codes
 * "Framework" while this one lets each card declare its own kind.
 */
export function RelatedCards({ children }: { children: ReactNode }) {
  return <ul className="framework-pairs">{children}</ul>;
}

export function RelatedCard({
  kind,
  href,
  title,
  summary,
}: {
  kind: string;
  href: string;
  title: string;
  summary?: string;
}) {
  return (
    <li>
      <Link href={href}>
        <span className="framework-pairs-eyebrow">{kind}</span>
        <span className="framework-pairs-title">{title}</span>
        {summary ? (
          <span className="framework-pairs-summary">{summary}</span>
        ) : null}
      </Link>
    </li>
  );
}
