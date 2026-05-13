"use client";

import { useState } from "react";
import { Heart, MessageSquare } from "lucide-react";

/**
 * Feedback — heart toggle (likes) + comment icon (placeholder for
 * future comments feature). Renders into the framework article's
 * meta bar.
 *
 * The "Tell us what you think" label was removed per design — the
 * icons speak for themselves. A11y labels on the buttons preserve
 * screen-reader semantics.
 *
 * `labelClassName` prop kept for caller compatibility (was used
 * for the label that no longer renders); ignored internally.
 */
export function Feedback({
  initialLikes = 7,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  labelClassName,
}: {
  initialLikes?: number;
  labelClassName?: string;
}) {
  const [liked, setLiked] = useState(false);
  const count = initialLikes + (liked ? 1 : 0);

  return (
    <section aria-label="Feedback" className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => setLiked((v) => !v)}
        aria-pressed={liked}
        aria-label={liked ? "Remove like" : "Like this framework"}
        className="
          inline-flex items-center gap-1.5 bg-transparent p-0 text-fg-high
          cursor-pointer transition-colors duration-150 hover:text-accent
        "
      >
        <Heart
          strokeWidth={1.5}
          size={20}
          aria-hidden
          fill={liked ? "currentColor" : "none"}
        />
        <span className="font-sans text-[15px] tabular-nums">{count}</span>
      </button>
      <button
        type="button"
        aria-label="Leave a comment"
        className="
          inline-flex items-center bg-transparent p-0 text-fg-high
          cursor-pointer transition-colors duration-150 hover:text-accent
        "
      >
        <MessageSquare strokeWidth={1.5} size={20} aria-hidden />
      </button>
    </section>
  );
}
