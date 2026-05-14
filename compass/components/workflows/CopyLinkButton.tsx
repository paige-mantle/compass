"use client";

import { useState } from "react";

/**
 * `<CopyLinkButton>` — minimal "Copy link" button used in the method
 * meta strip. Replaces the previous Twitter / LinkedIn / Email
 * `<ShareLinks>` cluster plus the `<Feedback>` widget: most readers
 * just want a shareable URL. The button copies the canonical method
 * URL to the clipboard and briefly swaps its label to "Copied".
 *
 * Reuses the same `font-mono · 14px · uppercase · tracking-wider`
 * eyebrow recipe used across Compass so it reads as part of the
 * existing visual system.
 */
export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard might be blocked; fail silently.
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Link copied" : "Copy link to this method"}
      className={[
        "inline-flex cursor-pointer items-center gap-2 rounded-md border",
        "px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider",
        "transition-colors duration-150",
        copied
          ? "border-fg-high bg-transparent text-fg-high"
          : "border-edge-high/70 bg-transparent text-fg-medium hover:border-fg-medium hover:text-fg-high",
      ].join(" ")}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="flex-none"
      >
        {copied ? (
          <path d="M20 6 9 17l-5-5" />
        ) : (
          <>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </>
        )}
      </svg>
      <span>{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}
