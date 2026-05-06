import type { ComponentPropsWithoutRef, ReactNode } from "react";

function slugifyHeading(node: ReactNode): string {
  const text = textFrom(node);
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function textFrom(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFrom).join("");
  if (typeof node === "object" && "props" in node) {
    return textFrom((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function HeadingWithId({
  Tag,
  ...props
}: { Tag: "h2" | "h3" } & ComponentPropsWithoutRef<"h2">) {
  const id = props.id ?? slugifyHeading(props.children);
  return <Tag {...props} id={id} />;
}

export const insightMdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <HeadingWithId Tag="h2" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <HeadingWithId Tag="h3" {...props} />
  ),
};
