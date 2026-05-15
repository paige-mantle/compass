"use client";

/**
 * `<CompassFilterTabs />` — pill-toggle filter group used on
 * listing pages to scope the rendered card grid by tag / category.
 *
 * Visual recipe ported byte-for-byte from the next-gen Mantle
 * `Tabs.astro` (the marketing-site pricing + experiences tabs)
 * so listing-page filters share their footprint:
 *
 *   • Outer pill group: `inline-flex self-start bg-surface-lower
 *     rounded-xl p-1.5 gap-0.5`. The container itself is a
 *     bordered "card" of all filter chips; the active chip lifts
 *     to a brighter surface.
 *   • Inactive chip: `text-fg-medium hover:text-fg-high
 *     transition-colors duration-200`. No fill until hover/active.
 *   • Active chip: `bg-surface-highest text-fg-high`. The fill is
 *     the visual signal — no border, no underline, just a lifted
 *     surface inside the muted group.
 *   • Chip shape: `rounded-md py-1.5 px-4 text-xs`. Matches
 *     next-gen `Tabs.astro` default-size variant.
 *
 * Overflow handling: at narrow viewports the group can exceed the
 * container width. `overflow-x-auto` + `whitespace-nowrap` lets
 * the row scroll horizontally without breaking the pill layout.
 */
export function CompassFilterTabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = "Filter",
}: {
  options: ReadonlyArray<{ id: T; label: string }>;
  value: T;
  onChange: (next: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="
        inline-flex max-w-full overflow-x-auto self-start
        rounded-xl bg-surface-lower p-1.5 gap-0.5
      "
    >
      {options.map((opt) => {
        const isActive = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.id)}
            className={[
              "shrink-0 cursor-pointer whitespace-nowrap",
              "rounded-md py-1.5 px-4 text-xs font-medium",
              "transition-colors duration-200",
              /* Active chip lifts to a WHITE plate with dark ink.
                 Was `bg-surface-highest text-fg-high` (#1E1C23
                 dark plate + white text) — the dark-on-dark
                 lacked enough lift inside the `bg-surface-lower`
                 group container. White-on-dark reads as a
                 deliberate selection signal. */
              isActive
                ? "bg-fg-high text-surface-medium"
                : "text-fg-medium hover:text-fg-high",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
