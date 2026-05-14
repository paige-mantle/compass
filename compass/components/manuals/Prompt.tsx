"use client";

import { useRef, useState, type ReactNode } from "react";

/**
 * Prompt — Mantle next-gen "Top 10 callouts" v2 spec
 * (public/mantle-callouts-v2.html, callout #09).
 *
 * Copyable text block inside the canonical Compass callout shell.
 * A toolbar row (title + copy button) sits above an editable
 * `<textarea>` — readers can copy the prompt verbatim or edit it
 * first and copy their version. The copy button flashes a "Copied"
 * confirmation for ~1.6s on click.
 *
 * Use in MDX:
 *
 *   <Prompt
 *     title="Pressure-test your one-liner"
 *     defaultPrompt={`Act as a brutally honest co-founder. Read my
 * product one-liner below and tell me which user it would confuse
 * and why. Don't suggest fixes — just name the confusion clearly.`}
 *     dataIndex="P-01"
 *   />
 *
 * The prompt body is passed via the `defaultPrompt` prop (not via
 * children) because it lives inside a `<textarea>` whose initial
 * value can't be JSX. Children — if any — render as a hint
 * paragraph BELOW the block (e.g. "Paste into ChatGPT, Claude,
 * or your AI tool of choice").
 *
 * Styling lives in `app/globals.css` `@layer components` →
 * `.manual-section .callout-prompt`. Mirrors the v2 spec line-for-line.
 *
 * Note the "use client" directive — required for the textarea state
 * + clipboard handler.
 */
export function Prompt({
  title = "Pressure-test your one-liner",
  defaultPrompt = "",
  dataIndex,
  children,
}: {
  /** Heading text in the toolbar row above the prompt block. */
  title?: string;
  /** Initial textarea value — what the reader copies if they don't edit. */
  defaultPrompt?: string;
  /** Optional bottom-right designator (e.g. "P-01"). */
  dataIndex?: string;
  /** Optional hint paragraph(s) rendered below the prompt block. */
  children?: ReactNode;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = textareaRef.current?.value?.trim() ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for environments that block clipboard via file:// or
      // missing permission — select + execCommand the textarea.
      textareaRef.current?.select();
      try {
        document.execCommand("copy");
      } catch {
        // give up silently — visual confirmation still fires
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <aside className="callout callout-prompt" data-index={dataIndex}>
      <header className="callout-header">
        <h3 className="callout-label">Prompt</h3>
      </header>
      <div className="callout-body">
        <div className="prompt-toolbar">
          <h4 className="prompt-title">{title}</h4>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy prompt to clipboard"
            className={"prompt-copy" + (copied ? " is-copied" : "")}
          >
            <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect
                x="4"
                y="4"
                width="8"
                height="8"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M10 4V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <span className="prompt-copy-label">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>
        <div className="prompt-block">
          <textarea
            ref={textareaRef}
            className="prompt-text"
            defaultValue={defaultPrompt}
            spellCheck={false}
            rows={4}
            aria-label="Editable prompt — copy to clipboard with the button above"
          />
        </div>
        {children}
      </div>
    </aside>
  );
}
