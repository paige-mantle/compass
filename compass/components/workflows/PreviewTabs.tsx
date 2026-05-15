"use client";

import { useState } from "react";
import type { WorkflowCodeBlock } from "../../lib/workflows/content";
import { CodeBlocks } from "./CodeBlocks";

/**
 * `<PreviewTabs>` — a tabbed right-rail panel used on Template detail
 * pages that pair a visual mockup with the prompt code block(s).
 * Two tabs: "Preview" (the image) and "Code" (the collapsible
 * `<CodeBlocks>` panel). Both live in a single bordered container so
 * the rail reads as one tool, not two stacked widgets.
 *
 * The component is only rendered when a `previewImage` is declared in
 * the meta. Method pages (no preview image) keep the bare
 * `<CodeBlocks>` rendering — no tabs to switch when there's only one
 * thing to show.
 */
export function PreviewTabs({
  previewImage,
  blocks,
  defaultTab = "preview",
}: {
  previewImage: { src: string; alt: string; caption?: string };
  blocks: WorkflowCodeBlock[];
  defaultTab?: "preview" | "code";
}) {
  const [tab, setTab] = useState<"preview" | "code">(defaultTab);

  return (
    /* Dark-mode shell — matches the canonical Compass code-panel
       canvas (`bg-surface-medium`, the page's dark base) so the
       tabbed container reads as one piece with the prompt blocks
       inside it. Hairline border + inset highlight follow the same
       recipe as the `<details>` accordions. All colours pulled from
       canonical Mantle tokens — the previous hardcoded `#0c0a0e`,
       `#0f0d12`, `#e2e1eb`, `#a2a0b1` resolved to the same hexes
       but didn't track theme retunes. */
    <div className="overflow-hidden rounded-md border border-edge-medium bg-surface-medium shadow-[inset_0_1px_0_var(--color-edge-low)]">
      {/* Tab strip — sits at the top of the dark shell. Tabs use
          Geist sans-serif at 16px in sentence case; the active tab
          gets a light underline + full-strength ink, the inactive
          tab is muted. */}
      <div
        role="tablist"
        aria-label="Preview / Code"
        className="flex border-b border-edge-medium bg-surface-higher"
      >
        <TabButton
          active={tab === "preview"}
          onClick={() => setTab("preview")}
          label="Preview"
        />
        <TabButton
          active={tab === "code"}
          onClick={() => setTab("code")}
          label="Code"
        />
      </div>

      {/* Panels — both stay mounted; toggled via the `hidden`
          attribute so contentEditable edits inside the code panel
          survive a tab swap. */}
      <div role="tabpanel" hidden={tab !== "preview"} className="p-3">
        {/* Wrapper reserves a 16:9 aspect-ratio box BEFORE the image
            loads, so the preview panel doesn't snap from 0px → image
            height on first paint (the previous raw `<img>` shipped no
            intrinsic dimensions and caused layout shift inside the
            tabbed rail). 16:9 is the canonical Compass card aspect
            and matches the dot-grid plate ratio used across the
            listing cards. Inside the box, `object-cover` fills any
            actual image dimensions; intrinsic `width=1600 height=900`
            on the `<img>` itself gives the browser a fallback ratio
            even if CSS fails to load. */}
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md bg-white/[0.04]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage.src}
            alt={previewImage.alt}
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 block h-full w-full object-cover"
          />
        </div>
        {/* Caption intentionally not rendered — the tab strip already
            labels this as "Preview"; a duplicate caption underneath
            was visual noise. */}
      </div>

      <div role="tabpanel" hidden={tab !== "code"} className="p-3">
        <CodeBlocks blocks={blocks} />
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "flex-1 cursor-pointer px-5 py-3",
        // Tab label — Geist 16px medium, sentence case. Matches the
        // rest of the body type system; reads as a tab, not as an
        // eyebrow.
        "font-heading text-base font-medium leading-none",
        // Active tab underline uses the Compass brand accent (gold
        // `#FFBB53` via `--color-accent-medium`) so the highlight
        // ties back to the rest of the accent system instead of
        // sitting as another neutral hairline.
        "border-b-2 transition-colors duration-150",
        active
          ? "border-accent bg-transparent text-fg-medium"
          : "border-transparent bg-transparent text-fg-low hover:text-fg-medium",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
