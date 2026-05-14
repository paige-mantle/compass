"use client";

import { useState } from "react";
import type { FrameworkCodeBlock } from "../../lib/methods/content";
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
  blocks: FrameworkCodeBlock[];
  defaultTab?: "preview" | "code";
}) {
  const [tab, setTab] = useState<"preview" | "code">(defaultTab);

  return (
    // Dark-mode shell — matches the `#0c0a0e` code-panel canvas so the
    // tabbed container reads as one piece with the prompt blocks
    // inside it. White-alpha border + inset highlight follow the
    // same recipe as the `<details>` accordions.
    <div
      className="overflow-hidden rounded-md border border-white/[0.08]
                 bg-[#0c0a0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
    >
      {/* Tab strip — sits at the top of the dark shell. Tabs use
          Geist sans-serif at 16px in sentence case; the active tab
          gets a light underline + full-strength ink, the inactive
          tab is muted. */}
      <div
        role="tablist"
        aria-label="Preview / Code"
        className="flex border-b border-white/[0.07] bg-[#0f0d12]"
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewImage.src}
          alt={previewImage.alt}
          className="block w-full rounded-sm bg-white/[0.04] object-cover"
        />
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
        "font-heading text-[16px] font-medium leading-none",
        // Active tab underline uses the Compass brand accent (gold
        // `#FFBB53` via `--color-accent-medium`) so the highlight
        // ties back to the rest of the accent system instead of
        // sitting as another neutral hairline.
        "border-b-2 transition-colors duration-150",
        active
          ? "border-accent bg-transparent text-[#e2e1eb]"
          : "border-transparent bg-transparent text-[#a2a0b1] hover:text-[#e2e1eb]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
