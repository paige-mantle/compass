import type { ReactNode } from "react";

/**
 * Templates layout — mirrors `app/compass/frameworks/layout.tsx`
 * so template detail pages reuse the same editorial typography +
 * code panel styling as Methods (frameworks). The Templates
 * surface is currently a parallel resource section to Compass
 * (lives at `/templates`, not `/compass/templates`) but shares
 * the visual recipe via these stylesheets.
 */
export default function TemplatesLayout({ children }: { children: ReactNode }) {
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
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/insight.css" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/framework.css" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-content.css" />
      {children}
    </>
  );
}
