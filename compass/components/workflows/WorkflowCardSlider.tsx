"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { WorkflowMeta } from "../../lib/workflows/content";
import {
  CARD_BG_CLASS,
  CARD_TEXT_CLASS,
  CARD_TEXT_COLOR,
  CARD_TAG_CLASS,
  CARD_LABEL_BOX_CLASS,
  resolveCardAccent,
  type CardAccent,
} from "../../lib/card-accents";
import { formatShortDate, truncateSentences } from "../../lib/format-date";
import { MetaDot } from "../shared/MetaDot";

/**
 * `<WorkflowCardSlider />` — horizontal scroll-snap row used on the
 * Compass home in place of the 3-col grid. Same card recipe as
 * `<WorkflowCardGrid>` (colored hero plate + dot grid + title +
 * tag pills + 2-sentence excerpt + author · date) — only the
 * outer layout changes to `overflow-x-auto snap-x snap-mandatory`
 * so the row scrolls horizontally with cards snapping into place.
 *
 * Round arrow buttons (top-right) call `scrollBy` on the scroll
 * container; `aria-disabled` updates based on the current
 * scrollLeft + clientWidth + scrollWidth so the buttons read as
 * inactive at the ends of the row. Buttons hide entirely when the
 * row fits without overflow (≤ 3 cards on a wide viewport).
 *
 * Each card is `flex-none` + `basis-[85%] sm:basis-[55%] lg:basis-
 * [calc((100%-2rem)/3)]` so mobile shows ~1 card with peek, sm
 * shows ~2 cards, lg shows 3 cards cleanly inside the slider width.
 */
export function WorkflowCardSlider({
  methods,
}: {
  methods: WorkflowMeta[];
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    // Only show the arrows if the row actually overflows. A small
    // buffer (2px) avoids a false positive when the row fits
    // exactly inside its container.
    setShowArrows(scrollWidth > clientWidth + 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, methods.length]);

  function scrollBy(direction: "prev" | "next") {
    const el = scrollRef.current;
    if (!el) return;
    /* Step is roughly one card-width (clientWidth ÷ visible-cards).
       At 3 cards visible, each card is ~33% of the container; one
       step = clientWidth × 0.85 so the next card snaps to the
       same x-position the previous card occupied. */
    const step = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      {/* Round arrow controls — top-right, only render when the
          row overflows. Each button is a 36px circle with the
          canonical edge + hover treatment. Disabled state at
          either end gets a quieter fg + cursor. */}
      {showArrows ? (
        <div className="absolute -top-14 right-0 flex items-center gap-2 max-[720px]:relative max-[720px]:-top-0 max-[720px]:mt-[-72px] max-[720px]:justify-end">
          <SliderArrow
            direction="prev"
            disabled={!canScrollLeft}
            onClick={() => scrollBy("prev")}
          />
          <SliderArrow
            direction="next"
            disabled={!canScrollRight}
            onClick={() => scrollBy("next")}
          />
        </div>
      ) : null}

      <div
        ref={scrollRef}
        className="
          flex gap-6 overflow-x-auto snap-x snap-mandatory
          pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        "
      >
        {methods.map((m, i) => (
          <div
            key={m.slug}
            className="
              snap-start flex-none
              basis-[85%] sm:basis-[55%]
              lg:basis-[calc((100%-3rem)/3)]
            "
          >
            <SliderCard method={m} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SliderArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous workflows" : "Next workflows"}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center",
        "h-9 w-9 rounded-full",
        "border border-edge-medium",
        "transition-[background-color,border-color,color,opacity] duration-150",
        disabled
          ? "text-fg-lower opacity-40 cursor-not-allowed"
          : "text-fg-medium hover:text-fg-high hover:border-edge-high hover:bg-surface-higher cursor-pointer",
      ].join(" ")}
    >
      <Icon width={18} height={18} strokeWidth={2} aria-hidden />
    </button>
  );
}

/* SliderCard — same recipe as `WorkflowCardGrid > MethodCard`
   inlined here so the slider component is self-contained. Any
   change to the card chrome should be mirrored across both
   surfaces. */
function SliderCard({
  method,
  index,
}: {
  method: WorkflowMeta;
  index: number;
}) {
  const isMantleOfficial = method.mantleOfficial !== false;
  const accent: CardAccent = isMantleOfficial
    ? "accent"
    : resolveCardAccent(method.blockColor, index);

  return (
    <Link
      href={`/workflows/${method.slug}`}
      className="
        group flex flex-col h-full no-underline text-fg-high
        rounded-xl overflow-hidden
        border border-edge-medium hover:border-edge-high
        transition-colors duration-200
      "
    >
      <div
        className={[
          "relative aspect-[16/9]",
          "flex flex-col justify-between p-7",
          CARD_BG_CLASS[accent],
          CARD_TEXT_CLASS[accent],
        ].join(" ")}
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      >
        <h3
          className="m-0 font-heading text-3xl font-medium leading-[1.1] tracking-tight"
          style={{ color: CARD_TEXT_COLOR[accent] }}
        >
          {method.title}
        </h3>
        {method.tags && method.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {method.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`${CARD_LABEL_BOX_CLASS} ${CARD_TAG_CLASS[accent]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 p-5 flex-1">
        {method.summary ? (
          <p className="m-0 max-w-[44ch] font-sans text-base leading-[1.45] text-fg-medium line-clamp-2">
            {truncateSentences(method.summary, 2)}
          </p>
        ) : null}

        {(method.author || method.lastUpdated) ? (
          <div className="flex items-center font-sans text-sm text-fg-low mt-auto">
            {method.author ? <span>{method.author}</span> : null}
            {method.author && method.lastUpdated ? <MetaDot /> : null}
            {method.lastUpdated ? (
              <time>{formatShortDate(method.lastUpdated)}</time>
            ) : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
