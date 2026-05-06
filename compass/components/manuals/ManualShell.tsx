import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { ManualManifest, ManualSection } from "@/compass/lib/manuals/content";
import { ManualCopyLink } from "./ManualCopyLink";

function pad2(n: number) {
  return n < 10 ? "0" + n : "" + n;
}

function hrefFor(manualSlug: string, s: ManualSection) {
  return `/manuals/${manualSlug}/${s.slug ? s.slug + "/" : ""}`;
}

function PrevNextLink({
  href,
  direction,
  label,
  title,
}: {
  href: string;
  direction: "prev" | "next";
  label: string;
  title: string;
}) {
  const chevron = direction === "prev" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6";
  const labelChildren =
    direction === "prev" ? (
      <>
        <Chevron path={chevron} />
        {label}
      </>
    ) : (
      <>
        {label}
        <Chevron path={chevron} />
      </>
    );
  return (
    <Link className={direction} href={href}>
      <span className="pn-label">{labelChildren}</span>
      <span className="pn-title">{title}</span>
    </Link>
  );
}

function Chevron({ path }: { path: string }) {
  return (
    <svg
      className="pn-chev"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

export function ManualShell({
  manifest,
  current,
  currentIndex,
  prev,
  next,
  introBody,
  children,
}: {
  manifest: ManualManifest;
  current: ManualSection;
  currentIndex: number;
  prev: ManualSection | null;
  next: ManualSection | null;
  introBody?: string;
  children: ReactNode;
}) {
  const accent = manifest.accent ?? "#9676FF";
  return (
    <main
      className="manual-shell"
      data-manual={manifest.slug}
      data-section={current.slug || "intro"}
      style={
        {
          "--gold": accent,
          "--gold-high": accent,
          "--gold-soft": `color-mix(in srgb, ${accent} 18%, transparent)`,
          "--gold-glow": `color-mix(in srgb, ${accent} 30%, transparent)`,
        } as CSSProperties
      }
    >
      <div className="manual-layout">
        <aside className="manual-rail" aria-hidden="true">
          <Link className="manual-rail-logo" href="/" aria-label="Mantle">
            <img src="/mantle-logo.svg" alt="" />
          </Link>
          <span className="manual-rail-text">
            Manuals / {manifest.title}
          </span>
        </aside>
        <aside className="manual-sidebar" aria-label="Manual sections">
          <div className="manual-sidebar-head">
            <h2 className="manual-sidebar-manual">Table of contents</h2>
          </div>
          {manifest.sections.map((s, i) => {
            const active = s.slug === current.slug;
            return (
              <Link
                key={s.slug || "intro"}
                href={hrefFor(manifest.slug, s)}
                className={active ? "active" : undefined}
              >
                <span className="manual-sidebar-num">{pad2(i)}</span>
                <span className="manual-sidebar-title">{s.title}</span>
              </Link>
            );
          })}
        </aside>

        <article className="manual-content">
          <header
            className={
              "manual-hero" +
              (manifest.heroVariant === "light" ? " manual-hero--light" : "")
            }
          >
            <div className="manual-hero-title">
              <div className="manual-hero-title-main">
                <span className="manual-hero-title-num" aria-hidden="true">
                  {pad2(currentIndex)}
                </span>
                <h1>{current.title}</h1>
              </div>
              {introBody ? (
                <p className="manual-hero-intro">{introBody}</p>
              ) : null}
            </div>
          </header>

          <section className="manual-section">{children}</section>

          <nav className="manual-prev-next" aria-label="Section navigation">
            {prev ? (
              <PrevNextLink
                href={hrefFor(manifest.slug, prev)}
                direction="prev"
                label="Previous"
                title={prev.title}
              />
            ) : (
              <span className="placeholder" aria-hidden="true" />
            )}
            {next ? (
              <PrevNextLink
                href={hrefFor(manifest.slug, next)}
                direction="next"
                label="Next"
                title={next.title}
              />
            ) : (
              <PrevNextLink
                href="/compass/manuals"
                direction="next"
                label="Manual complete"
                title="Back to all manuals"
              />
            )}
          </nav>
        </article>
      </div>
    </main>
  );
}
