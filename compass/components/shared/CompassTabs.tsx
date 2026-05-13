"use client";

import { useState, type ReactNode } from "react";

/**
 * Compass tabs — light-mirror of Mantle's `Tabs.astro`.
 *
 * Same visual recipe (rounded pill bar with bg-surface-lower
 * background, active pill with bg-surface-highest fill) but
 * translated from Astro's hardcoded 6-slot model to a React
 * items-array API so callers can pass any number of tabs.
 *
 *   • `items` → `{ id, label, content }[]`
 *   • `size`  → "default" | "large"
 *   • `position` → "top" | "bottom" (default "bottom" — header
 *                  sits below the content panel, matching Mantle)
 *
 * Component is self-contained: tracks active tab via `useState`.
 * If you want external control, swap in `activeId` + `onChange`
 * later — the structure is unchanged.
 */

export type TabItem = {
  id: string;
  label: ReactNode;
  content: ReactNode;
};

type Size = "default" | "large";

export function CompassTabs({
  items,
  size = "default",
  position = "bottom",
  className = "",
  initialId,
}: {
  items: TabItem[];
  size?: Size;
  position?: "top" | "bottom";
  className?: string;
  initialId?: string;
}) {
  const [activeId, setActiveId] = useState(
    initialId ?? items[0]?.id ?? "",
  );

  const tabLabelClass = (active: boolean) => {
    const base =
      "tab-header block text-fg-medium hover:text-fg-high transition-colors duration-200 cursor-pointer";
    const sized =
      size === "large"
        ? "rounded-xl py-1.5 px-4 text-base"
        : "rounded-md py-1.5 px-4 text-xs";
    const activeState = active ? "bg-surface-highest text-fg-high active" : "";
    return [base, sized, activeState].filter(Boolean).join(" ");
  };

  const headerBar = (
    <div className={`tab-headers inline-flex self-center bg-surface-lower rounded-xl p-1.5 ${className}`}>
      {items.map((tab) => (
        <button
          key={tab.id}
          type="button"
          data-show-tab={tab.id}
          className={tabLabelClass(tab.id === activeId)}
          onClick={() => setActiveId(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  const contentPanels = (
    <div className="tab-content">
      {items.map((tab) => (
        <div
          key={tab.id}
          id={tab.id}
          data-tab-panel
          className={tab.id === activeId ? "" : "hidden"}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );

  return (
    <div className="tabs flex flex-col gap-4 justify-center">
      {position === "top" ? headerBar : null}
      {contentPanels}
      {position === "bottom" ? headerBar : null}
    </div>
  );
}
