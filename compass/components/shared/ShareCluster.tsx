"use client";

import { useState } from "react";
import { Twitter, Linkedin, Mail, Link2, Check } from "lucide-react";

/**
 * Compact icon-button cluster for sharing a Compass detail page.
 * Renders Twitter/X, LinkedIn, Email, and Copy-Link buttons in a
 * horizontal row. Designed to sit inside the meta card on
 * `/workflows/[slug]` and `/templates/[slug]` heroes.
 *
 * All four buttons share one chrome recipe — `p-1.5 rounded-md
 * border border-edge-medium text-fg-medium hover:text-fg-high
 * hover:border-edge-high transition-colors`. Same shape as the
 * code-block copy button so the visual family is consistent.
 *
 * The copy button has a transient "Copied" state (1.6s) that swaps
 * the icon to `<Check>` and the border to `border-accent`. Other
 * three buttons are plain anchors that open share intents in a
 * new window.
 */
export function ShareCluster({
  url,
  title,
}: {
  /** Canonical share URL — embedded in every intent target. */
  url: string;
  /** Title used as the prefilled tweet text / email subject. */
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const twitterHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const emailHref = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be blocked in some contexts; fail silently.
    }
  };

  const buttonClasses =
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-edge-medium text-fg-medium hover:text-fg-high hover:border-edge-high transition-colors duration-150";

  return (
    <div className="flex items-center gap-2">
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X / Twitter"
        className={buttonClasses}
      >
        <Twitter width={14} height={14} color="currentColor" strokeWidth={2} aria-hidden />
      </a>
      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={buttonClasses}
      >
        <Linkedin width={14} height={14} color="currentColor" strokeWidth={2} aria-hidden />
      </a>
      <a
        href={emailHref}
        aria-label="Share via email"
        className={buttonClasses}
      >
        <Mail width={14} height={14} color="currentColor" strokeWidth={2} aria-hidden />
      </a>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Link copied" : "Copy link"}
        className={[
          buttonClasses,
          copied ? "border-accent text-accent hover:border-accent hover:text-accent" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {copied ? (
          <Check width={14} height={14} color="currentColor" strokeWidth={2} aria-hidden />
        ) : (
          <Link2 width={14} height={14} color="currentColor" strokeWidth={2} aria-hidden />
        )}
      </button>
    </div>
  );
}
