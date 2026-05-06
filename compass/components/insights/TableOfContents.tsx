"use client";

import { useEffect, useState } from "react";

type Heading = { depth: 2 | 3; id: string; text: string };

function pad2(n: number) {
  return n < 10 ? "0" + n : "" + n;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  // Only h2s get numbered "section" entries; h3s render as nested children of
  // the preceding h2 in the manual-sidebar style.
  const topLevel = headings.filter((h) => h.depth === 2);

  const [activeId, setActiveId] = useState<string | null>(
    topLevel[0]?.id ?? headings[0]?.id ?? null
  );

  useEffect(() => {
    if (typeof window === "undefined" || headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const onScroll = () => {
      const offset = 120;
      let current: HTMLElement | null = null;
      for (const el of elements) {
        if (el.getBoundingClientRect().top - offset <= 0) current = el;
        else break;
      }
      if (current) setActiveId(current.id);
      else setActiveId(elements[0].id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (topLevel.length === 0) return null;

  return (
    <nav className="insight-toc" aria-label="On this page">
      <div className="insight-toc-label">On this page</div>
      <ol className="insight-toc-list">
        {topLevel.map((h, i) => {
          const active = activeId === h.id;
          return (
            <li key={h.id} className={active ? "active" : undefined}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  const el = document.getElementById(h.id);
                  if (!el) return;
                  e.preventDefault();
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                  history.replaceState(null, "", `#${h.id}`);
                  setActiveId(h.id);
                }}
              >
                <span className="insight-toc-num">{pad2(i + 1)}</span>
                <span className="insight-toc-title">{h.text}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
