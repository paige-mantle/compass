import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Shared breadcrumb — extracted from `CompassDetailHero` so manual
 * chapter routes (and any future surface that wants a labelled
 * navigation trail) can reuse the same chrome.
 *
 * Eyebrow label recipe matches `CompassPromptHeading` byte-for-byte
 * so breadcrumbs share line-height + tracking with the marketing
 * hero eyebrow on heymantle.com:
 *
 *   font-mono · font-medium · text-xs · tracking-wider · uppercase ·
 *   leading-loose · text-accent
 *
 * Segments render as `Link` elements separated by a 14px ChevronRight
 * icon (same icon family as the rest of Compass). A chevron is also
 * prefixed before the first segment so a single-segment breadcrumb
 * still reads as a trail rather than a stray label.
 */

export type BreadcrumbSegment = { label: string; href: string };

export function Breadcrumb({ segments }: { segments: BreadcrumbSegment[] }) {
  if (segments.length === 0) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-accent leading-loose"
    >
      <BreadcrumbChevron />
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        {segments.map((seg, i) => (
          <li key={seg.href} className="flex items-center gap-2">
            <Link
              href={seg.href}
              className="font-mono text-xs font-medium uppercase tracking-wider leading-loose text-accent hover:text-accent-low transition-colors duration-150 no-underline"
            >
              {seg.label}
            </Link>
            {i < segments.length - 1 ? <BreadcrumbChevron /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function BreadcrumbChevron() {
  return (
    <ChevronRight
      width={14}
      height={14}
      color="currentColor"
      strokeWidth={2}
      aria-hidden
      className="shrink-0"
    />
  );
}
