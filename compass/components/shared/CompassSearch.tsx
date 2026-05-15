"use client";

import { Search } from "lucide-react";

/**
 * `<CompassSearch />` — controlled text input for listing-page
 * search bars. Sits above the card grid on workflows / templates /
 * insights / answers; bound to whatever filter wrapper owns the
 * list state.
 *
 * Visual recipe is anchored to canonical Compass tokens so the
 * input feels native to the surface it lives on:
 *   • `bg-surface-higher` fill — one notch above the page surface,
 *     same plate the meta card + cover plates use.
 *   • `border border-edge-medium` + `focus-within:border-edge-high`
 *     — hairline that brightens on focus, mirrors the prompt
 *     `<CodeFence>` recipe.
 *   • `rounded-lg` — same radius family as cards + prompt frames.
 *   • Search icon at the left in `text-fg-low`; placeholder in
 *     `text-fg-low` too so the icon + placeholder read as one
 *     muted cluster against the active input value (full-strength
 *     `text-fg-high`).
 *   • Input itself is `font-sans text-sm` — case-preserved body
 *     register, NOT the mono uppercase eyebrow recipe (search is a
 *     text-entry surface, not a label).
 */
export function CompassSearch({
  value,
  onChange,
  placeholder = "Search…",
  ariaLabel = "Search",
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}) {
  return (
    <label
      className="
        group/search relative flex w-full items-center gap-2
        rounded-lg border border-edge-medium bg-surface-higher
        pl-3 pr-3 py-2.5
        transition-colors duration-150
        focus-within:border-edge-high
      "
    >
      <Search
        width={16}
        height={16}
        strokeWidth={2}
        aria-hidden="true"
        className="shrink-0 text-fg-low"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        /* `bg-transparent` + `outline-none` so the field inherits
           the wrapping label's plate + the wrapper's focus ring
           drives the affordance. Native search-clear styling is
           browser-specific and inconsistent; the input is
           controlled, so callers can clear via state if needed. */
        className="
          flex-1 min-w-0 bg-transparent outline-none border-0
          font-sans text-sm text-fg-high placeholder:text-fg-low
        "
      />
    </label>
  );
}
