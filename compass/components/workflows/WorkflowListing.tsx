"use client";

import { useMemo, useState } from "react";
import type { WorkflowMeta } from "../../lib/workflows/content";
import { CompassSearch } from "../shared/CompassSearch";
import { CompassFilterTabs } from "../shared/CompassFilterTabs";
import { WorkflowCardGrid } from "./WorkflowCardGrid";

/**
 * Client wrapper around `<WorkflowCardGrid />` that adds a search
 * input + tag-filter pill group. The server route renders the full
 * list of workflows once; this component filters in the browser so
 * filter changes are instant and the URL stays clean.
 *
 * Filter options are derived from the union of frontmatter `tags`
 * across the input list, capped at the 6 most common tags so the
 * pill group fits one row at typical viewport widths. "All" is
 * always the first option and the default.
 *
 * Search matches against title + summary + tags (case-insensitive
 * substring). Combined with the active tag filter — both must
 * pass for a card to render.
 */
export function WorkflowListing({ methods }: { methods: WorkflowMeta[] }) {
  // Derive filter options from the input list once per render.
  const filterOptions = useMemo(() => deriveFilterOptions(methods), [methods]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return methods.filter((m) => {
      if (activeFilter !== "all") {
        const tags = m.tags ?? [];
        if (!tags.includes(activeFilter)) return false;
      }
      if (!q) return true;
      const haystack = [
        m.title,
        m.summary,
        ...(m.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [methods, activeFilter, query]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search + filter row — search input on the left, filter
          pills on the right at lg+; stacked on mobile. */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-[420px]">
          <CompassSearch
            value={query}
            onChange={setQuery}
            placeholder="Search workflows…"
            ariaLabel="Search workflows"
          />
        </div>
        {filterOptions.length > 1 ? (
          <CompassFilterTabs
            options={filterOptions}
            value={activeFilter}
            onChange={setActiveFilter}
            ariaLabel="Filter workflows by tag"
          />
        ) : null}
      </div>

      {/* Empty state — when search + filter combine to no matches,
          render a quiet sans-serif line instead of an empty grid. */}
      {filtered.length === 0 ? (
        <p className="m-0 py-8 font-sans text-base text-fg-low">
          No workflows match that search. Try a different tag or
          clearing the query.
        </p>
      ) : (
        <WorkflowCardGrid methods={filtered} />
      )}
    </div>
  );
}

/**
 * Derive a tag-filter option list from the workflows.
 *
 * Tally every tag across all workflows, sort by frequency, and
 * take the top 6 — the pill group fits one row at ≥1024px without
 * wrapping. "All" is always position 0 + the default.
 *
 * Exported solely for tests / co-located callers; the component
 * memoizes internally.
 */
function deriveFilterOptions(
  methods: WorkflowMeta[],
): ReadonlyArray<{ id: string; label: string }> {
  const tally = new Map<string, number>();
  for (const m of methods) {
    for (const tag of m.tags ?? []) {
      tally.set(tag, (tally.get(tag) ?? 0) + 1);
    }
  }
  const top = [...tally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => ({ id: tag, label: tag }));
  return [{ id: "all", label: "All" }, ...top];
}
