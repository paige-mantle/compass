import Link from "next/link";
import type { ReactNode } from "react";
import type { InsightMeta } from "@/compass/lib/insights/content";
import { CompassHeader } from "@/compass/components/shared/CompassHeader";
import { TableOfContents } from "./TableOfContents";

function authorInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function InsightShell({
  meta,
  headings,
  children,
}: {
  meta: InsightMeta;
  headings: Array<{ depth: 2 | 3; id: string; text: string }>;
  children: ReactNode;
}) {
  const formattedDate = new Date(meta.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <CompassHeader />
      <main className="insight-shell">
        <nav className="insight-breadcrumb" aria-label="Breadcrumb">
          <Link href="/compass">Compass</Link>
          <span>/</span>
          <Link href="/compass/insights">Insights</Link>
          <span>/</span>
          <span className="current">{meta.title}</span>
        </nav>

        <header className="insight-hero">
          {meta.ribbon ? (
            <div className="insight-ribbon">{meta.ribbon}</div>
          ) : null}
          <h1>{meta.title}</h1>
          <p className="insight-summary">{meta.summary}</p>
          <div className="insight-byline">
            {meta.authorAvatar ? (
              <img
                className="insight-author-avatar"
                src={meta.authorAvatar}
                alt={meta.author}
              />
            ) : (
              <div
                className="insight-author-avatar insight-author-avatar--initials"
                aria-hidden="true"
              >
                {authorInitials(meta.author)}
              </div>
            )}
            <div className="insight-byline-meta">
              <div className="insight-byline-row">
                <span className="insight-author">{meta.author}</span>
                {meta.authorRole ? (
                  <span className="insight-author-role">
                    {meta.authorRole}
                  </span>
                ) : null}
              </div>
              <div className="insight-byline-sub">
                <time dateTime={meta.date}>{formattedDate}</time>
                {meta.readTime ? (
                  <>
                    <span className="insight-meta-sep" aria-hidden="true">
                      ·
                    </span>
                    <span>{meta.readTime}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <div className="insight-layout">
          <aside className="insight-toc-wrapper" aria-label="Table of contents">
            <TableOfContents headings={headings} />
          </aside>
          <article className="insight-content">{children}</article>
        </div>

        <nav className="insight-back" aria-label="Back">
          <Link href="/compass/insights">← All insights</Link>
        </nav>
      </main>
    </>
  );
}
