"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

/**
 * `<CompassSearch />` — controlled text input for listing-page
 * search bars. Sits above the card grid on workflows / templates /
 * insights / answers; bound to whatever filter wrapper owns the
 * list state.
 *
 * Visual recipe tuned to match the next-gen Mantle marketing-site
 * input register:
 *   • `bg-surface-higher` plate — one notch above the page surface
 *     so the field sits as a deliberate input slot, not flat
 *     against the canvas.
 *   • `border border-edge-medium` hairline; `focus-within:border-
 *     edge-high` brightens on focus. A 3px accent-medium @ 18%
 *     box-shadow ring on focus signals keyboard focus without the
 *     loud accent halo the global `:focus-visible` rule used to
 *     paint inside the input.
 *   • `rounded-xl` (8px) — same radius the workflow / template
 *     card frames use, so the search slot reads as part of the
 *     same chrome family.
 *
 * Modern features:
 *   • **Clear button** (`<X>` icon) appears when the input has a
 *     value — one-tap reset. The button focus-rings via the
 *     global `:focus-visible` recipe (it's a `<button>`, not an
 *     input, so it keeps the standard accent ring).
 *   • **⌘K / Ctrl-K** keyboard shortcut focuses the input from
 *     anywhere on the page. The hint label sits at the right of
 *     the input as a quiet `<kbd>` chip; clicking it also focuses
 *     the field.
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
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* ⌘K / Ctrl-K → focus the input. Window-scoped listener attached
     on mount; cleared on unmount. `e.preventDefault()` blocks the
     browser's default behaviour for ⌘K (URL-bar focus in some
     browsers). */
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (!isCmdK) return;
      e.preventDefault();
      inputRef.current?.focus();
      // Select existing query so a fresh ⌘K → type replaces the
      // previous search rather than appending to it.
      inputRef.current?.select();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <label
      className="
        group/search relative flex w-full items-center gap-2
        rounded-xl border border-edge-medium bg-surface-higher
        pl-3 pr-2 py-1.5
        transition-[border-color,box-shadow] duration-150
        focus-within:border-edge-high
        focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-accent-medium)_18%,transparent)]
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
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        /* `bg-transparent` + `outline-none` so the field inherits
           the wrapping label's plate + the wrapper's focus ring
           drives the affordance. */
        className="
          flex-1 min-w-0 bg-transparent outline-none border-0
          font-sans text-sm text-fg-high placeholder:text-fg-low
        "
      />
      {value ? (
        /* Clear button — only renders when the input has a value.
           Stops form submission + clicks-bubble so a parent form
           doesn't react to the clear. Focus-rings via the global
           accent recipe (it's a button, not an input). */
        <button
          type="button"
          aria-label="Clear search"
          onClick={(e) => {
            e.preventDefault();
            onChange("");
            inputRef.current?.focus();
          }}
          className="
            shrink-0 inline-flex items-center justify-center
            h-6 w-6 rounded-md
            text-fg-low hover:text-fg-high hover:bg-edge-medium
            transition-colors duration-150 cursor-pointer
          "
        >
          <X width={14} height={14} strokeWidth={2} aria-hidden="true" />
        </button>
      ) : (
        /* ⌘K hint chip — quiet `<kbd>` that doubles as a clickable
           focus target. Hidden on mobile (`hidden sm:inline-flex`)
           since the shortcut isn't relevant on a touch device.
           Reads `Ctrl K` on non-Mac platforms via the user-agent
           hint inside the component — declined here for SSR-safety
           since `navigator.platform` is client-only; sticking with
           `⌘K` keeps the chip stable across SSR + hydration. */
        <button
          type="button"
          aria-label="Press Command-K to focus search"
          tabIndex={-1}
          onClick={() => inputRef.current?.focus()}
          className="
            hidden sm:inline-flex shrink-0 items-center gap-0.5
            rounded-md border border-edge-medium bg-surface-medium
            px-1.5 py-0.5
            font-mono text-[10px] font-medium text-fg-low
            cursor-pointer hover:text-fg-medium transition-colors duration-150
          "
        >
          <span aria-hidden="true">⌘</span>
          <span>K</span>
        </button>
      )}
    </label>
  );
}
