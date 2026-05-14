import type { ReactNode } from "react";

/**
 * `<Chips>` — a compact two-column grid of label chips. Used inside
 * `.framework-content` for "Expected outputs" / "Best used for" style
 * lists where a vertical bullet list would feel too heavy. Each chip is
 * a single-line label with a subtle border + neutral fill, sized to
 * read as scannable metadata rather than prose.
 *
 * Usage in MDX:
 *
 *   <Chips items={[
 *     "Company overview",
 *     "Product summary",
 *     ...
 *   ]} />
 *
 * Children are also supported when you need to pass JSX (e.g. links):
 *
 *   <Chips>
 *     <Chip>Company overview</Chip>
 *     <Chip>Product summary</Chip>
 *   </Chips>
 */
export function Chips({
  items,
  children,
}: {
  items?: string[];
  children?: ReactNode;
}) {
  return (
    <ul className="framework-chips">
      {items
        ? items.map((label) => <li key={label}>{label}</li>)
        : children}
    </ul>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}
