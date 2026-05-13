import type { ReactNode } from "react";

/**
 * Manual route layout — loads the same CSS the static manual pages use
 * so MDX-rendered manuals match the existing visual system exactly.
 * The Mantle Compass top nav is intentionally omitted on manual pages;
 * the manual hero + sidebar handle their own navigation chrome.
 */
export default function ManualsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin=""
      />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap"
      />
      {/*
        Load the manual stylesheets from /compass-* paths (root of /public).
        The /manuals/* paths are caught by a global redirect in next.config.ts
        (/manuals/:path* → /compass/manuals), which silently returns HTML and
        breaks any stylesheet linked under /manuals/. These are identical
        copies maintained at the root so the redirect doesn't eat them.
      */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-manual-base.css" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-manual.css" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-content.css" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-callouts.css" />
      {children}
    </>
  );
}
