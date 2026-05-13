import { Callout } from "./Callout";
import { FAQ, FAQItem } from "./FAQ";
import { AuthorCard } from "./AuthorCard";
import { PromptToggle } from "./PromptToggle";
import { Checklist, CheckItem } from "./Checklist";
import { Placeholder } from "./Placeholder";
import { TLDR } from "./TLDR";
import {
  FieldNote,
  RealityCheck,
  CommonFailure,
  DecisionPoint,
  FounderShift,
} from "@/compass/components/callouts/Callouts";

/**
 * MDX component shims — anything used in an .mdx file with a capitalized
 * tag name (e.g. <Callout/>, <FAQItem/>, <RealityCheck/>) maps to one of these.
 *
 * Plain HTML tags (h1, h2, p, ul, blockquote, etc.) are styled by manual.css
 * and rendered by MDX as-is, so no override needed here.
 */
export const mdxComponents = {
  Callout,
  FAQ,
  FAQItem,
  AuthorCard,
  PromptToggle,
  Checklist,
  CheckItem,
  Placeholder,
  TLDR,
  // Semantic callouts (Field Note · Reality Check · Common Failure ·
  // Decision Point · Founder Shift). Styled by callouts.css, loaded in
  // app/manuals/layout.tsx.
  FieldNote,
  RealityCheck,
  CommonFailure,
  DecisionPoint,
  FounderShift,
  // Map a plain "---" thematic break to our notion-divider class
  hr: () => <hr className="notion-divider" />,
  // remark-gfm renders task-list checkboxes with `disabled`; strip that so
  // readers can actually toggle them.
  input: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    if (props.type === "checkbox") {
      const { disabled: _disabled, defaultChecked, ...rest } = props;
      return <input {...rest} type="checkbox" defaultChecked={defaultChecked} />;
    }
    return <input {...props} />;
  },
};
