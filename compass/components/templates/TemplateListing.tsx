"use client";

import { useMemo, useState } from "react";
import type { TemplateMeta } from "../../lib/templates/content";
import { CompassSearch } from "../shared/CompassSearch";
import { CompassFilterTabs } from "../shared/CompassFilterTabs";
import { TemplateCardGrid } from "./TemplateCardGrid";

/**
 * Client wrapper around `<TemplateCardGrid />` — same recipe as
 * `<WorkflowListing />` but typed for templates. Derives filter
 * options from frontmatter `tags`, searches title + summary + tags.
 *
 * See `WorkflowListing.tsx` for the canonical comments on the
 * filter / search / empty-state pattern; this is the paired
 * implementation so each listing surface owns its own typed
 * wrapper without sharing a fragile generic.
 */
export function TemplateListing({ templates }: { templates: TemplateMeta[] }) {
  const filterOptions = useMemo(
    () => deriveFilterOptions(templates),
    [templates],
  );
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      if (activeFilter !== "all") {
        const tags = t.tags ?? [];
        if (!tags.includes(activeFilter)) return false;
      }
      if (!q) return true;
      const haystack = [
        t.title,
        t.summary,
        ...(t.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [templates, activeFilter, query]);

  return (
    <div className="flex flex-col gap-6">
      {/* Filter pills on the LEFT, compact search input on the
          RIGHT — same layout as `<WorkflowListing>`. */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {filterOptions.length > 1 ? (
          <CompassFilterTabs
            options={filterOptions}
            value={activeFilter}
            onChange={setActiveFilter}
            ariaLabel="Filter templates by tag"
          />
        ) : <span aria-hidden="true" />}
        <div className="w-full lg:max-w-[280px]">
          <CompassSearch
            value={query}
            onChange={setQuery}
            placeholder="Search templates…"
            ariaLabel="Search templates"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="m-0 py-8 font-sans text-base text-fg-low">
          No templates match that search. Try a different tag or
          clearing the query.
        </p>
      ) : (
        <TemplateCardGrid templates={filtered} />
      )}
    </div>
  );
}

function deriveFilterOptions(
  templates: TemplateMeta[],
): ReadonlyArray<{ id: string; label: string }> {
  const tally = new Map<string, number>();
  for (const t of templates) {
    for (const tag of t.tags ?? []) {
      tally.set(tag, (tally.get(tag) ?? 0) + 1);
    }
  }
  const top = [...tally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => ({ id: tag, label: tag }));
  return [{ id: "all", label: "All" }, ...top];
}
