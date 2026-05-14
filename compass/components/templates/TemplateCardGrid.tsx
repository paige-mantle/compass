import Link from "next/link";
import type { TemplateMeta } from "../../lib/templates/content";

/**
 * Template card grid — the listing surface for `/templates`.
 *
 * Mirrors the legacy `.framework-card` recipe from
 * `mantle-compass-templates.html` byte-for-byte, in Tailwind:
 *
 *   1. Card is a `<Link>` with vertical flex column, 16px gap
 *   2. Top "block" — 16:9 aspect, 28px padding, dot-grid background,
 *      colored fill (yellow / dark / teal / etc.), translateY lift
 *      on hover
 *   3. Inside the block — title (28px) at the top, tag pills near
 *      the bottom
 *   4. Below the block — description, then a small mono "Added <date>"
 *      footer line
 *
 * Color → text-color mapping mirrors the static-page rules
 * (dark blocks get white text; light blocks get dark text).
 */

const BLOCK_BG: Record<NonNullable<TemplateMeta["blockColor"]>, string> = {
  yellow: "bg-[#FFC66E]",
  gray: "bg-[#d8d8d6]",
  black: "bg-[#1E1C23]",
  orange: "bg-[#EE4815]",
  blue: "bg-[#76E8FF]",
  graphite: "bg-[#2A606B]",
};

const BLOCK_TEXT: Record<NonNullable<TemplateMeta["blockColor"]>, string> = {
  yellow: "text-[#0a0810]",
  gray: "text-[#0a0810]",
  black: "text-white",
  orange: "text-white",
  blue: "text-[#0a0810]",
  graphite: "text-white",
};

export function TemplateCardGrid({ templates }: { templates: TemplateMeta[] }) {
  return (
    <section
      aria-label="Templates"
      className="grid grid-cols-1 gap-8 pb-20 sm:grid-cols-2 lg:grid-cols-3"
    >
      {templates.map((t) => (
        <TemplateCard key={t.slug} template={t} />
      ))}
    </section>
  );
}

function TemplateCard({ template }: { template: TemplateMeta }) {
  const color = template.blockColor ?? "yellow";
  const blockBg = BLOCK_BG[color];
  const blockText = BLOCK_TEXT[color];

  return (
    <Link
      href={`/templates/${template.slug}`}
      className="group flex flex-col gap-4 no-underline text-fg-high"
    >
      {/* Block — 16:9 aspect, dot grid bg, colored fill, lifts on hover */}
      <div
        className={[
          "relative aspect-[16/9] overflow-hidden rounded-xl",
          "flex flex-col justify-between p-7",
          "transition-transform duration-200 ease-out",
          "group-hover:-translate-y-[3px]",
          blockBg,
          blockText,
        ].join(" ")}
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      >
        <h3 className="m-0 font-heading text-[28px] font-medium leading-[1.1] tracking-tight">
          {template.title}
        </h3>
        {template.tags && template.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {template.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                /* Tag pill — same shape as the "Works with" tags on
                   template detail pages (rounded-md, px-2.5 py-1,
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

      {template.description ? (
        <p className="m-0 max-w-[44ch] font-sans text-base leading-[1.45] text-fg-medium">
          {template.description}
        </p>
      ) : null}

      {template.lastUpdated ? (
        <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-fg-low">
          <span>Added</span>
          <time>{template.lastUpdated}</time>
        </div>
      ) : null}
    </Link>
  );
}
