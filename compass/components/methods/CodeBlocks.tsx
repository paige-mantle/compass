"use client";

import { Fragment, useRef, useState } from "react";
import type { FrameworkCodeBlock } from "../../lib/methods/content";

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
    // Every block is always shown — no accordion. They stack with a
    // small gap so multi-block prompts read as a continuous tool
    // panel.
    <div className="flex flex-col gap-4">
      {blocks.map((b, i) => (
        <CodeCard key={`${b.filename}-${i}`} block={b} />
      ))}
    </div>
  );
}

function CodeCard({ block }: { block: FrameworkCodeBlock }) {
  const [copied, setCopied] = useState(false);
  // Live prompt text — the contentEditable `<code>` element is the
  // source of truth at edit time, but we keep a ref so the Copy
  // button can always read the latest text without re-rendering the
  // syntax-highlighted line spans (which would steal the user's
  // caret position on each keystroke).
  const codeRef = useRef<HTMLElement | null>(null);
  const initial = block.code.replace(/\s+$/, "");
  const lines = initial.split("\n");

  const onCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Stop the click bubbling into the surrounding <summary>, which
    // would toggle the accordion every time the user copies code.
    e.preventDefault();
    e.stopPropagation();
    const text = codeRef.current?.innerText ?? initial;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard might be blocked in some contexts; fail silently.
    }
  };

  return (
    // Flat code panel — flat (no accordion). The `focus-within`
    // ring lifts the border subtly when the contentEditable code
    // inside is focused, so the user gets a clear visual "you're
    // editing this" cue. `transition-colors` smooths the change.
    <div
      className="m-0 overflow-hidden rounded-md border border-white/[0.08]
                 bg-[#0c0a0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]
                 transition-colors duration-150
                 focus-within:border-white/[0.18]"
    >
      <div
        className="flex items-center justify-between gap-3
                   border-b border-white/[0.07]
                   bg-[#0f0d12] py-3 pl-4 pr-3"
      >
        <span
          className="m-0 overflow-hidden truncate whitespace-nowrap
                     font-mono text-xs font-medium uppercase
                     tracking-wider leading-[1.6] text-[#b8b6c4]"
        >
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
      </div>
      {/* Prompt body — sits directly below the header bar inside the
          flat dark panel. */}
      <pre
        className={`m-0 overflow-hidden bg-[#0c0a0e] py-5 font-mono text-[13px]
                    leading-[1.7] text-[#e2e1eb] lang-${block.language}`}
      >
        {/* Prompts are prose, not source code — render plain editable
            lines with no gutter, no line numbers. The yellow accent
            on `[PLACEHOLDER]` tokens still applies via renderLine(). */}
        <code
          ref={codeRef}
          /* `cursor-text` makes the i-beam appear on hover so users
             see immediately that the prompt is editable. Outline is
             suppressed at the element level because the parent
             panel's `focus-within` ring is the actual focus indicator
             (keeps the panel's visual edge clean while staying
             accessible — the focused panel changes border color). */
          className="block px-5 cursor-text outline-none focus:outline-none"
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          aria-label={`${block.filename} prompt — editable`}
        >
          {lines.map((line, i) => (
            <span
              className="block whitespace-pre-wrap break-words"
              key={i}
            >
              {line ? renderLine(line) : " "}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
