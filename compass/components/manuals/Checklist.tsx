import type { ReactNode } from "react";

export function Checklist({ children }: { children: ReactNode }) {
  return <ul className="notion-checklist">{children}</ul>;
}

export function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li>
      <label>
        <input type="checkbox" />
        <span>{children}</span>
      </label>
    </li>
  );
}
