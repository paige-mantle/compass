"use client";

import { useState } from "react";

export function ManualCopyLink() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const finish = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(finish, finish);
    } else {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {}
      document.body.removeChild(ta);
      finish();
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
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
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <span>{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}
