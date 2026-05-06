import type { ReactNode } from "react";

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="notion-callout">
      <div className="notion-callout-content">{children}</div>
    </div>
  );
}
