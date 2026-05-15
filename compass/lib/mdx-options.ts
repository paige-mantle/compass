import type { Pluggable } from "unified";
import remarkGfm from "remark-gfm";
import rehypePrettyCode, { type Options as RehypePrettyCodeOptions } from "rehype-pretty-code";

/**
 * Shared MDX render options for every Compass content surface
 * (manual chapters, workflow recipes, template recipes, insight
 * articles). Single source of truth so every detail page tokenises
 * code fences the same way.
 *
 * Pipeline:
 *   1. remark-gfm — GitHub-flavoured markdown (tables, task lists,
 *      strikethrough, autolinks). Long-standing Compass dependency.
 *   2. rehype-pretty-code — Shiki-backed syntax highlighting for
 *      ` ```bash `, ` ```ts `, ` ```json ` etc. fences. Renders
 *      span-per-token with inline color styles + a `data-language`
 *      attribute on the wrapping `<pre>`.
 *
 * Theme: `github-dark-default` ships with Shiki and matches the
 * canonical Compass dark surface — keywords in purple-ish blue,
 * strings in green, numbers in orange. Maps reasonably to the
 * Mantle palette out of the box. Swap to a Mantle-custom theme
 * (JSON file under `compass/styles/shiki-mantle.json`) in a
 * follow-up if/when we want exact `--color-accent-alt-high` /
 * `--color-green-high` token matching.
 *
 * Runs at request/build time in Node — Shiki's tokenizer and
 * grammar files stay server-side. Output is pre-tokenized HTML
 * with no client-side JS overhead.
 */
const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: "github-dark-default",
  /* Keep the markup minimal — don't add line numbers, line
     highlighting, or filename headers via rehype-pretty-code's
     options. Compass uses its own `<CodeFence>` wrapper for
     the tile chrome; rehype-pretty-code only contributes the
     token-coloured spans inside `<pre><code>`. */
  keepBackground: false,
};

export const compassMdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypePrettyCode, rehypePrettyCodeOptions] as Pluggable,
    ],
  },
};
