import type { ReactNode } from "react";

export function AuthorCard({
  name,
  tagline,
  avatar,
  children,
}: {
  name: string;
  tagline?: string;
  avatar: string;
  children: ReactNode;
}) {
  return (
    <div className="manual-author">
      <div className="manual-author-eyebrow">About the author</div>
      <div className="manual-author-card">
        <img className="manual-author-avatar" src={avatar} alt={name} />
        <div className="manual-author-content">
          <div className="manual-author-name">{name}</div>
          {tagline ? (
            <div className="manual-author-tagline">{tagline}</div>
          ) : null}
          <div className="manual-author-bio">{children}</div>
        </div>
      </div>
    </div>
  );
}
