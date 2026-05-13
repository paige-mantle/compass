"use client";

import { Fragment, useState } from "react";
import type { FrameworkCodeBlock } from "../../lib/frameworks/content";

/**
 * Split a line into plain segments and [PLACEHOLDER] segments so we can
 * style fill-in-the-blank slots (e.g. `[INSERT IDEA]`) in the gold accent.
 */
function renderLine(line: string) {
  const re = /\[[A-Z][A-Z0-9 _\-]*\]/g;
  const parts: Array<string | { ph: string }> = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) parts.push(line.slice(last, m.index));
    parts.push({ ph: m[0] });
    last = m.index + m[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  if (parts.length === 0) return line;
  return parts.map((p, i) =>
    typeof p === "string" ? (
      <Fragment key={i}>{p}</Fragment>
    ) : (
      <span key={i} className="text-accent">
        {p.ph}
      </span>
    ),
  );
}

export function CodeBlocks({ blocks }: { blocks: FrameworkCodeBlock[] }) {
  if (blocks.length === 0) return null;
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((b, i) => (
        <CodeCard key={`${b.filename}-${i}`} block={b} />
      ))}
    </div>
  );
}

function CodeCard({ block }: { block: FrameworkCodeBlock }) {
  const [copied, setCopied] = useState(false);
  const lines = block.code.replace(/\s+$/, "").split("\n");

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard might be blocked in some contexts; fail silently.
    }
  };

  return (
    <figure
      className="m-0 overflow-hidden rounded-md border border-white/[0.08]
                 bg-[#0c0a0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
    >
      <figcaption
        className="flex items-center justify-between gap-3 border-b
                   border-white/[0.07] bg-[#0f0d12] py-3 pl-5 pr-3"
      >
        <span className="overflow-hidden truncate whitespace-nowrap font-mono text-[12px] tracking-[0.02em] text-[#b8b6c4]">
          {block.filename}
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Copied" : "Copy code to clipboard"}
          className={[
            "inline-flex cursor-pointer items-center gap-1.5 rounded border",
            "px-[9px] py-[5px] font-mono text-[11px] font-medium uppercase",
            "tracking-wider transition-colors duration-150",
            copied
              ? "border-accent bg-transparent text-accent"
              : "border-white/[0.07] bg-transparent text-[#a2a0b1] hover:border-[#a2a0b1] hover:bg-white/[0.04] hover:text-[#e2e1eb]",
          ].join(" ")}
        >
          {copied ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="flex-none"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>Copied</span>
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="flex-none"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </figcaption>
      <pre
        className={`m-0 overflow-x-hidden py-7 font-mono text-[13px] leading-[1.85] text-[#e2e1eb] lang-${block.language}`}
      >
        <code className="block">
          {lines.map((line, i) => (
            <span
              className="grid items-baseline whitespace-pre-wrap break-words
                         grid-cols-[52px_minmax(0,1fr)]"
              key={i}
            >
              <span className="select-none pr-4 text-right text-[11.5px] text-[#56546a]">
                {i + 1}
              </span>
              <span className="pr-6">
                {line ? renderLine(line) : " "}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
