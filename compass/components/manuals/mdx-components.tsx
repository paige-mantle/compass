import { Callout } from "./Callout";
import { AuthorCard } from "./AuthorCard";
import { Checklist, CheckItem } from "./Checklist";
import { Prompt } from "./Prompt";
import {
  FieldNote,
  RealityCheck,
  CommonFailure,
  DecisionPoint,
  FounderShift,
} from "@/compass/components/callouts/Callouts";

/**
 * MDX component shims — anything used in an .mdx file with a
 * capitalized tag name (e.g. `<Callout/>`, `<RealityCheck/>`,
 * `<Checklist/>`) maps to one of these. Plain HTML tags (h1, h2,
 * p, ul, blockquote, etc.) are styled by `compass/styles/prose.css`
 * and render as-is.
 *
 * The Compass callout system collapses to **six conceptual buckets**:
 *
 *   1. Note          — neutral info. Shorthand aliases: `<Callout>`
 *                      (freeform), `<FieldNote>`.
 *   2. RealityCheck  — warning / danger. Always red regardless of
 *                      manual accent (see callouts.css warning
 *                      override). Shorthand alias: `<CommonFailure>`.
 *   3. DecisionPoint — two-column fork ("Option A vs Option B").
 *   4. Shift         — before/after transformation. Shorthand alias:
 *                      `<FounderShift>`.
 *   5. Checklist     — interactive item list with `<CheckItem>` rows.
 *   6. Prompt        — code / prompt block with copy affordance.
 *
 * Every callout outside the warning family inherits
 * `var(--manual-accent)` — the current manual's chapter accent —
 * so a single manual reads as one coherent identity.
 *
 * The legacy `<FAQ>`, `<PromptToggle>`, `<TLDR>`, `<Quote>`, and
 * `<Placeholder>` shims were dropped when the `/compass/callouts`
 * demo route was retired. None of them were used in any active
 * MDX content. Their styling lived in `/public/compass-manual.css`
 * which is also gone.
 */
export const mdxComponents = {
  // Note bucket — generic + content shorthand aliases. `<Note>` is
  // the canonical bucket name; `<Callout>` is the legacy alias kept
  // for backwards compatibility with content authored before the
  // callout consolidation.
  Note: Callout,
  Callout,
  FieldNote,
  // RealityCheck bucket (warning family — always red).
  RealityCheck,
  CommonFailure,
  // DecisionPoint / Shift buckets.
  DecisionPoint,
  FounderShift,
  // Checklist bucket.
  Checklist,
  CheckItem,
  // Prompt bucket.
  Prompt,
  // Non-callout helpers used inside chapters.
  AuthorCard,
  // Map a plain "---" thematic break to our notion-divider class.
  hr: () => <hr className="notion-divider" />,
  // remark-gfm renders task-list checkboxes with `disabled`; strip
  // that so readers can actually toggle them.
  input: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    if (props.type === "checkbox") {
      const { disabled: _disabled, defaultChecked, ...rest } = props;
      return <input {...rest} type="checkbox" defaultChecked={defaultChecked} />;
    }
    return <input {...props} />;
  },
};
