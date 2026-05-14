import Link from "next/link";
import type { FrameworkMeta } from "../../lib/methods/content";

/**
 * Method card grid — listing surface for `/compass/methods`.
 *
 * Same `.framework-card` recipe as `TemplateCardGrid`: 16:9
 * colored block with dot-grid bg, title + tag pills inside, then
 * the description and a small "Added <date>" line outside.
 *
 * Both pages share the recipe because the static `.framework-card`
 * was the canonical card recipe before the migration. Future
 * cleanup: extract a shared `<CompassBlockCard>` that both this
 * component and `TemplateCardGrid` consume.
 */

const BLOCK_BG: Record<NonNullable<FrameworkMeta["blockColor"]>, string> = {
  yellow: "bg-[var(--color-accent-medium)]",
  gray: "bg-[#d8d8d6]",
  black: "bg-[var(--color-surface-highest)]",
  orange: "bg-[var(--color-mac-red)]",
  blue: "bg-[var(--color-teal-high)]",
  graphite: "bg-[#2A606B]",
};

const BLOCK_TEXT: Record<NonNullable<FrameworkMeta["blockColor"]>, string> = {
  yellow: "text-[#0a0810]",
  gray: "text-[#0a0810]",
  black: "text-white",
  orange: "text-white",
  blue: "text-[#0a0810]",
  graphite: "text-white",
};

export function MethodCardGrid({ methods }: { methods: FrameworkMeta[] }) {
  return (
    <section
      aria-label="Methods"
      className="grid grid-cols-1 gap-8 pb-20 sm:grid-cols-2 lg:grid-cols-3"
    >
      {methods.map((m) => (
        <MethodCard key={m.slug} method={m} />
      ))}
    </section>
  );
}

function MethodCard({ method }: { method: FrameworkMeta }) {
  const color = method.blockColor ?? "yellow";

  return (
    <Link
      href={`/compass/methods/${method.slug}`}
      className="group flex flex-col gap-4 no-underline text-fg-high"
    >
      <div
        className={[
          "relative aspect-[16/9] overflow-hidden rounded-xl",
          "flex flex-col justify-between p-7",
          "transition-transform duration-200 ease-out",
          "group-hover:-translate-y-[3px]",
          BLOCK_BG[color],
          BLOCK_TEXT[color],
        ].join(" ")}
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      >
        <h3 className="m-0 font-heading text-[28px] font-medium leading-[1.1] tracking-tight">
          {method.title}
        </h3>
        {method.tags && method.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {method.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                /* Tag pill — same shape as the "Works with" tags on
                   method detail pages (rounded-md, px-2.5 py-1,
                   text-[12.5px] font-medium, 1px border). bg / text
                   / border colors adapt to the block: light-tinted
                   pill on dark blocks, dark-tinted pill on light
                   blocks. */
                className={[
                  "inline-flex items-center rounded-md",
                  "px-2.5 py-1 text-[12.5px] font-medium",
                  color === "black" || color === "orange" || color === "graphite"
                    ? "border border-white/20 bg-white/10 text-white"
                    : "border border-black/15 bg-black/5 text-[#0a0810]",
                ].join(" ")}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {method.summary ? (
        <p className="m-0 max-w-[44ch] font-sans text-base leading-[1.45] text-fg-medium">
          {method.summary}
        </p>
      ) : null}

      {method.lastUpdated ? (
        <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-fg-low">
          <span>Added</span>
          <time>{method.lastUpdated}</time>
        </div>
      ) : null}
    </Link>
  );
}
