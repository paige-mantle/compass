import Link from "next/link";
import type { ReactNode } from "react";
import { CompassHeader } from "../shared/CompassHeader";
import type { FrameworkMeta } from "../../lib/frameworks/content";
import { CodeBlocks } from "./CodeBlocks";

function authorInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function FrameworkShell({
  meta,
  children,
}: {
  meta: FrameworkMeta;
  children: ReactNode;
}) {
  const blocks = meta.codeBlocks ?? [];
  return (
    <>
      <CompassHeader />
      <main className="insight-shell framework-shell">
        <header className="insight-hero">
          <Link className="insight-ribbon insight-ribbon--link" href="/compass/frameworks">
            Frameworks
          </Link>
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
                  <span className="insight-author-role">{meta.authorRole}</span>
                ) : null}
              </div>
              {meta.tags && meta.tags.length > 0 ? (
                <div className="insight-byline-sub">
                  {meta.tags.map((t, i) => (
                    <span key={t}>
                      {i > 0 ? (
                        <span className="insight-meta-sep" aria-hidden="true">
                          ·
                        </span>
                      ) : null}
                      <span style={{ marginLeft: i > 0 ? 8 : 0 }}>{t}</span>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="framework-layout">
          <article className="insight-content framework-content">
            {children}
          </article>
          <aside className="framework-code-rail" aria-label="Code">
            <CodeBlocks blocks={blocks} />
          </aside>
        </div>
      </main>
    </>
  );
}
