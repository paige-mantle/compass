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
      <span key={i} className="framework-code-placeholder">
        {p.ph}
      </span>
    ),
  );
}

export function CodeBlocks({ blocks }: { blocks: FrameworkCodeBlock[] }) {
  if (blocks.length === 0) return null;
  return (
    <div className="framework-code-stack">
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
    <figure className="framework-code-card">
      <figcaption className="framework-code-header">
        <span className="framework-code-filename">{block.filename}</span>
        <button
          type="button"
          className={`framework-code-copy${copied ? " is-copied" : ""}`}
          onClick={onCopy}
          aria-label={copied ? "Copied" : "Copy code to clipboard"}
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
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </figcaption>
      <pre className={`framework-code-pre lang-${block.language}`}>
        <code>
          {lines.map((line, i) => (
            <span className="framework-code-line" key={i}>
              <span className="framework-code-lineno">{i + 1}</span>
              <span className="framework-code-content">
                {line ? renderLine(line) : " "}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
