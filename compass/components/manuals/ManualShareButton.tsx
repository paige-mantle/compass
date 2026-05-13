"use client";

import { useState } from "react";

export function ManualShareButton() {
  const [shared, setShared] = useState(false);

  async function handleShare() {
    if (typeof window === "undefined") return;
    const data = {
      title: document.title,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        // User cancelled or share failed — silently ignore.
      }
      return;
    }
    try {
      await navigator.clipboard?.writeText(data.url);
      setShared(true);
      window.setTimeout(() => setShared(false), 1600);
    } catch {
      // No clipboard available — do nothing.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-live="polite"
      className="inline-flex h-[30px] cursor-pointer items-center gap-[6px]
                 rounded-md border border-fg-medium/30 bg-transparent px-[10px]
                 font-sans text-[14px] font-normal leading-none text-fg-medium
                 transition-colors duration-150
                 hover:border-fg-medium/50 hover:bg-fg-high/[0.04]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="flex-none"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      <span>{shared ? "Copied" : "Share"}</span>
    </button>
  );
}
