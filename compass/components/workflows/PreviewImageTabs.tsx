"use client";

import { useState } from "react";

/**
 * `<PreviewImageTabs />` — tabbed preview-image gallery used on
 * template detail pages. Renders ABOVE the prompt code-block panel
 * in the right rail when a template ships multiple preview images
 * (bento / mobile / spotlight / etc.).
 *
 * Visual recipe mirrors the prompt `CodeBlocks` TabbedBlocks
 * footprint byte-for-byte so the two stacked blocks read as one
 * family:
 *   • Rounded shell, `border border-edge-medium`, dark surface.
 *   • Tab strip on top — accent `border-b-2` on the active tab,
 *     `-mb-px` overlap, number on the left, label on the right.
 *   • Panel below — 16:9 aspect-ratio container; the active image
 *     fills via `object-cover` and lazy-loads.
 *
 * Single-image gallery degrades to a bare frame (no tabs) for the
 * same reason `CodeBlocks` single-block does — one tab is noise.
 */
export type PreviewImage = {
  label: string;
  src: string;
  alt: string;
  caption?: string;
};

export function PreviewImageTabs({ images }: { images: PreviewImage[] }) {
  if (!images?.length) return null;
  return (
    <div className="flex flex-col rounded-lg border border-edge-medium overflow-hidden">
      {images.length > 1 ? <TabStrip images={images} /> : <BareFrame image={images[0]} />}
    </div>
  );
}

function TabStrip({ images }: { images: PreviewImage[] }) {
  const [active, setActive] = useState(0);
  return (
    <>
      <div
        role="tablist"
        aria-label="Template preview gallery"
        className="grid border-b border-edge-medium shrink-0"
        style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }}
      >
        {images.map((img, i) => {
          const isActive = i === active;
          const tabId = `preview-tab-${i}`;
          const panelId = `preview-panel-${i}`;
          return (
            <button
              key={`${img.label}-${i}`}
              role="tab"
              id={tabId}
              aria-selected={isActive}
              aria-controls={panelId}
              onClick={() => setActive(i)}
              type="button"
              className={[
                /* Same recipe as the prompt CodeBlocks TabbedBlocks:
                   number on the left, label on the right, accent
                   border on the BOTTOM of the active tab with
                   `-mb-px` so the active border overlaps the
                   parent's hairline. */
                "group flex items-center gap-3",
                "px-4 py-3 text-left",
                "border-r border-edge-medium last:border-r-0",
                "border-b-2 -mb-px transition-colors duration-150 cursor-pointer",
                isActive
                  ? "border-b-accent bg-surface-higher text-fg-high"
                  : "border-b-transparent bg-surface-high text-fg-medium hover:bg-surface-higher hover:text-fg-high",
              ].join(" ")}
            >
              <span
                className={[
                  "font-mono text-xxs tracking-wider tabular-nums shrink-0",
                  isActive ? "text-fg-medium" : "text-fg-lower",
                ].join(" ")}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-heading text-sm font-medium leading-tight truncate">
                {img.label}
              </span>
            </button>
          );
        })}
      </div>
      {images.map((img, i) => (
        <div
          key={`${img.label}-panel-${i}`}
          role="tabpanel"
          id={`preview-panel-${i}`}
          aria-labelledby={`preview-tab-${i}`}
          hidden={i !== active}
          className={i === active ? "block" : ""}
        >
          <PreviewPanel image={img} />
        </div>
      ))}
    </>
  );
}

function BareFrame({ image }: { image: PreviewImage }) {
  return <PreviewPanel image={image} />;
}

function PreviewPanel({ image }: { image: PreviewImage }) {
  return (
    /* 16:9 aspect-ratio container reserves the image slot at
       SSR-time so the panel doesn't snap from 0px → image-height
       on first paint. `object-cover` fills any actual image
       dimensions; intrinsic `width=1600 height=900` on the `<img>`
       gives the browser a fallback ratio. */
    <div className="p-3">
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md bg-white/[0.04]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.alt}
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 block h-full w-full object-cover"
        />
      </div>
      {image.caption ? (
        <p className="m-0 mt-2 px-1 font-sans text-xs text-fg-low">
          {image.caption}
        </p>
      ) : null}
    </div>
  );
}
