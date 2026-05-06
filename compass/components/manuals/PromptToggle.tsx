"use client";

import { Children, isValidElement, useState } from "react";

function extractText(node: React.ReactNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return extractText(props.children);
  }
  return Children.toArray(node as React.ReactNode)
    .map(extractText)
    .join("");
}

export function PromptToggle({
  label,
  prompt,
  children,
}: {
  label: string;
  prompt?: string;
  children?: React.ReactNode;
}) {
  const initial = prompt ?? extractText(children) ?? "";
  const [value, setValue] = useState(initial);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* swallow */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="manual-prompt">
      <div className="manual-prompt-head">
        <span className="manual-prompt-label">{label || "Prompt"}</span>
        <button
          type="button"
          className={"manual-prompt-copy" + (copied ? " is-copied" : "")}
          onClick={copy}
        >
          <svg
            width="12"
            height="12"
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
          <span className="manual-prompt-copy-label">
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>
      <textarea
        className="manual-prompt-body"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        rows={Math.max(8, (value ?? "").split("\n").length + 1)}
      />
    </div>
  );
}
