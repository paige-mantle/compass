import type { ReactNode } from "react";
import { ImagePlus, MessageSquareQuote, FileQuestion } from "lucide-react";

type PlaceholderType = "example" | "image" | "note";

interface PlaceholderProps {
  type?: PlaceholderType;
  children: ReactNode;
}

const META: Record<PlaceholderType, { label: string; Icon: typeof ImagePlus }> = {
  example: { label: "Example to add", Icon: MessageSquareQuote },
  image: { label: "Image to add", Icon: ImagePlus },
  note: { label: "Note to self", Icon: FileQuestion },
};

/**
 * In-draft placeholder block for content the author plans to fill in later
 * (example stories to source, screenshots to insert, notes to self). Renders
 * with a dashed border and a "to-do" badge so it's unmistakable in-context
 * but doesn't visually compete with finished editorial blocks.
 */
export function Placeholder({ type = "example", children }: PlaceholderProps) {
  const { label, Icon } = META[type];
  return (
    <aside className={`manual-placeholder manual-placeholder--${type}`}>
      <header className="manual-placeholder-header">
        <Icon
          className="manual-placeholder-icon"
          strokeWidth={1.5}
          size={16}
          aria-hidden
        />
        <span className="manual-placeholder-badge">{label}</span>
      </header>
      <div className="manual-placeholder-body">{children}</div>
    </aside>
  );
}
