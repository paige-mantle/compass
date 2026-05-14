"use client";

import { useState } from "react";
import { Link2, Linkedin, Mail, Check } from "lucide-react";

/**
 * Manual share section — renders at the bottom of every manual
 * chapter, above the prev/next nav. Light-theme aesthetic (bordered
 * square icon buttons on a cream/white surface) matching the
 * next-gen Mantle marketing share pattern shown in the brief
 * screenshot.
 *
 * Four destinations:
 *   1. Copy link — clipboard, flashes a check on success
 *   2. LinkedIn — opens the LinkedIn share dialog
 *   3. X (Twitter) — opens the tweet composer
 *   4. Email — pre-fills mailto:
 *
 * `title` + `href` are passed in by `ManualShell` so each chapter
 * shares its own canonical URL + chapter title (e.g. "Foundation —
 * Who this is for" / "/manuals/foundation/who-this-is-for"). The
 * component constructs the absolute URL against the public origin
 * (heymantle.com) rather than the live deploy URL, so social shares
 * always point at the production canonical, never the preview.
 *
 * Visual recipe (matches the brief screenshot):
 *   • Mono uppercase "Share section:" label (text-fg-low)
 *   • Row of 36×36px bordered-square buttons
 *   • Border: 1px border-edge-medium; on hover, border-edge-high
 *   • Icon: 18×18 lucide stroke, text-fg-medium → text-fg-high hover
 *   • Top hairline above the whole section
 */

const SITE_ORIGIN = "https://heymantle.com";

function buildAbsoluteUrl(href: string): string {
  if (href.startsWith("http")) return href;
  return `${SITE_ORIGIN}${href.startsWith("/") ? href : `/${href}`}`;
}

export function ManualShareSection({
  title,
  href,
}: {
  /** Page title — used in tweet text + email subject. */
  title: string;
  /** Path relative to SITE_ORIGIN (e.g. `/manuals/foundation/who-this-is-for`). */
  href: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = buildAbsoluteUrl(href);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=heymantle`;
  const mailHref = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Clipboard API can fail in non-secure contexts (e.g. preview
         deploys on http). Fail silently — the share row stays
         responsive and the user can use one of the other buttons. */
    }
  }

  return (
    <section
      aria-label="Share this section"
      className="
        mt-12 flex items-center gap-4
        border-t border-edge-medium pt-6 pb-8
        max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-3
        max-[720px]:px-5
      "
    >
      <span className="font-mono text-xs font-medium uppercase tracking-wider text-fg-low">
        Share section:
      </span>
      <div className="flex items-center gap-2">
        <ShareIconButton
          onClick={handleCopy}
          ariaLabel={copied ? "Link copied" : "Copy link"}
        >
          {copied ? (
            <Check size={16} strokeWidth={2} aria-hidden />
          ) : (
            <Link2 size={16} strokeWidth={2} aria-hidden />
          )}
        </ShareIconButton>
        <ShareIconLink href={linkedInHref} ariaLabel="Share on LinkedIn">
          <Linkedin size={16} strokeWidth={2} aria-hidden />
        </ShareIconLink>
        <ShareIconLink href={twitterHref} ariaLabel="Share on X (Twitter)">
          <XIcon />
        </ShareIconLink>
        <ShareIconLink href={mailHref} ariaLabel="Share via email">
          <Mail size={16} strokeWidth={2} aria-hidden />
        </ShareIconLink>
      </div>
    </section>
  );
}

/* Shared visual recipe — bordered 36×36px square, hover-darken
   border, icon shifts from fg-medium → fg-high. Used for both the
   <button> (copy link) and <a> (external share) variants. */
const ICON_BUTTON_CLASSES = [
  "inline-flex h-9 w-9 items-center justify-center",
  "rounded-md border border-edge-medium bg-transparent",
  "text-fg-medium",
  "transition-colors duration-150",
  "hover:border-edge-high hover:text-fg-high",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
].join(" ");

function ShareIconButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={ICON_BUTTON_CLASSES}
    >
      {children}
    </button>
  );
}

function ShareIconLink({
  href,
  children,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener nofollow"
      aria-label={ariaLabel}
      className={ICON_BUTTON_CLASSES}
    >
      {children}
    </a>
  );
}

/**
 * X / Twitter glyph as an inline SVG — lucide-react doesn't ship the
 * post-rebrand mark, so a single-path inline SVG keeps weight + style
 * in sync with the other 16px lucide icons in this row.
 */
function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2H21.5l-7.42 8.48L23 22h-6.797l-5.32-6.96L4.8 22H1.54l7.94-9.07L1.04 2h6.92l4.81 6.36L18.244 2Zm-2.39 18h1.88L7.23 4H5.21l10.644 16Z" />
    </svg>
  );
}
