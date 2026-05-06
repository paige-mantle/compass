import type { ReactNode } from "react";

export function FAQ({
  title = "Frequently asked questions",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="manual-faq">
      <div className="manual-faq-eyebrow">{title}</div>
      {children}
    </div>
  );
}

export function FAQItem({
  q,
  children,
}: {
  q: string;
  children: ReactNode;
}) {
  return (
    <details className="manual-faq-item">
      <summary>{q}</summary>
      <div className="manual-faq-body">{children}</div>
    </details>
  );
}
