import type { AnswerMeta } from "../../lib/answers/content";
import { CARD_LABEL_BOX_CLASS } from "../../lib/card-accents";

/**
 * Answer card grid — listing surface for `/compass/answers`.
 *
 * Cards are simpler than methods/templates — no colored block,
 * just title + description + tag + date in a bordered text card.
 * No `<Link>` until detail pages exist; for now they're inert
 * `<article>` elements with the same hover lift as the rest.
 */
export function AnswerCardGrid({ answers }: { answers: AnswerMeta[] }) {
  return (
    <section
      aria-label="Answers"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {answers.map((a) => (
        <AnswerCard key={a.title} answer={a} />
      ))}
    </section>
  );
}

function AnswerCard({ answer }: { answer: AnswerMeta }) {
  return (
    <article
      className="
        group flex flex-col gap-4 rounded-xl
        border border-edge-medium bg-[var(--color-surface-higher)]
        p-6 transition-transform duration-200 ease-out
        hover:-translate-y-[3px] hover:border-edge-high
      "
    >
      <h3 className="m-0 font-heading text-xl font-medium leading-tight tracking-tight text-fg-high">
        {answer.title}
      </h3>
      <p className="m-0 font-sans text-base leading-[1.45] text-fg-medium">
        {answer.description}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3">
        {/* Tag pill — canonical Compass card-label recipe via
            `CARD_LABEL_BOX_CLASS` so the answer-card pill matches
            insight + workflow + template tag pills byte-for-byte
            (rounded-md, px-2 py-0.5, text-xxs font-medium). Was
            an off-recipe inline `px-2.5 py-1` block; pulled in
            line with the canonical shape so pill sizes don't drift
            between surfaces. */}
        <span className={`${CARD_LABEL_BOX_CLASS} border border-edge-high/60 bg-surface-high text-fg-high`}>
          {answer.tag}
        </span>
        <time
          dateTime={answer.datetime}
          className="font-sans text-sm text-fg-low"
        >
          {answer.date}
        </time>
      </div>
    </article>
  );
}
