"use client";

import { useEffect, useState } from "react";

/**
 * Mobile hamburger that toggles the sidebar TOC.
 * Adds `data-mobile-nav-open="true"` to the .manual-shell root, which the
 * CSS uses to slide the sidebar into view on small screens.
 */
export function ManualMobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const shell = document.querySelector(".manual-shell");
    if (!shell) return;
    if (open) shell.setAttribute("data-mobile-nav-open", "true");
    else shell.removeAttribute("data-mobile-nav-open");
  }, [open]);

  // Close on viewport switch back to desktop.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 861px)");
    const handler = () => mql.matches && setOpen(false);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Close on route change / Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close sections menu" : "Open sections menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="hidden max-[860px]:fixed max-[860px]:right-3 max-[860px]:top-3
                   max-[860px]:z-[60] max-[860px]:inline-flex max-[860px]:h-11
                   max-[860px]:w-11 max-[860px]:cursor-pointer max-[860px]:items-center
                   max-[860px]:justify-center max-[860px]:rounded-md
                   max-[860px]:border max-[860px]:border-fg-medium/25
                   max-[860px]:bg-surface-highest max-[860px]:text-fg-high"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {open ? (
            <>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </>
          ) : (
            <>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </>
          )}
        </svg>
      </button>
      {open ? (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-[55] bg-fg-high/50"
        />
      ) : null}
    </>
  );
}
