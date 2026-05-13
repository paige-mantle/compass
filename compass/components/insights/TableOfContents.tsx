"use client";

import { useEffect, useState } from "react";

type Heading = { depth: 2 | 3; id: string; text: string };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  // Only h2s get top-level entries; h3s render under the preceding h2.
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
    <nav aria-label="Jump to section">
      <h2 className="mb-4 font-heading text-xl font-normal tracking-tight text-fg-high">
        Jump to section
      </h2>
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {topLevel.map((h) => {
          const active = activeId === h.id;
          return (
            <li key={h.id}>
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
                className={[
                  "block font-sans text-[16px] leading-snug no-underline",
                  "transition-colors duration-150",
                  active
                    ? "text-fg-high"
                    : "text-fg-medium hover:text-fg-high",
                ].join(" ")}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
