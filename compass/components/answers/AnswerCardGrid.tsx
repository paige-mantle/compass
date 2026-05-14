import type { AnswerMeta } from "../../lib/answers/content";

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
      className="grid grid-cols-1 gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3"
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
        {/* Tag pill — same recipe as the "Works with" tags on
            method/template detail pages. */}
        <span className="inline-flex items-center rounded-md border border-edge-high/60 bg-surface-high px-2.5 py-1 text-[12.5px] font-medium text-fg-high">
          {answer.tag}
        </span>
        <time
          dateTime={answer.datetime}
          className="font-mono text-[11px] uppercase tracking-wider text-fg-low"
        >
          {answer.date}
        </time>
      </div>
    </article>
  );
}
