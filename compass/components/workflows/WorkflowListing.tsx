"use client";

import { useMemo, useState } from "react";
import type { WorkflowMeta } from "../../lib/workflows/content";
import { CompassSearch } from "../shared/CompassSearch";
import { CompassFilterTabs } from "../shared/CompassFilterTabs";
import { WorkflowCardGrid } from "./WorkflowCardGrid";

/**
 * Client wrapper around `<WorkflowCardGrid />` that adds a tag-filter
 * pill group + search input. The server route renders the full list
 * of workflows once; this component filters in the browser so filter
 * changes are instant and the URL stays clean.
 *
 * Filter options come in two layers:
 *   • "All" — default, no filter.
 *   • "Mantle" — workflows with `mantleOfficial` set / defaulted to
 *     `true` (Mantle-authored recipes). Community-submitted recipes
 *     (`mantleOfficial: false`) drop out.
 *   • Tag pills — derived from the union of frontmatter `tags`,
 *     capped at the 5 most common so the row fits comfortably
 *     alongside the search input at typical viewport widths.
 *
 * Search matches against title + summary + tags (case-insensitive
 * substring). Combined with the active tag filter — both must
 * pass for a card to render.
 */
const MANTLE_FILTER_ID = "__mantle__";

export function WorkflowListing({ methods }: { methods: WorkflowMeta[] }) {
  // Derive filter options from the input list once per render.
  const filterOptions = useMemo(() => deriveFilterOptions(methods), [methods]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return methods.filter((m) => {
      if (activeFilter === MANTLE_FILTER_ID) {
        if (m.mantleOfficial === false) return false;
      } else if (activeFilter !== "all") {
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
      {/* Filter pills on the LEFT, compact search input on the
          RIGHT. Was reversed (search-left/filter-right) — moved
          per design pass so the primary scoping affordance
          (filter tabs) anchors the row and the optional fuzzy
          search sits as a secondary input. Stacks on mobile;
          filters first, search beneath. */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {filterOptions.length > 1 ? (
          <CompassFilterTabs
            options={filterOptions}
            value={activeFilter}
            onChange={setActiveFilter}
            ariaLabel="Filter workflows by tag"
          />
        ) : <span aria-hidden="true" />}
        <div className="w-full lg:max-w-[280px]">
          <CompassSearch
            value={query}
            onChange={setQuery}
            placeholder="Search workflows…"
            ariaLabel="Search workflows"
          />
        </div>
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
    /* Trim to 5 tag pills (was 6) so the row fits next to the
       new "Mantle" filter + comfortably beside the search box. */
    .slice(0, 5)
    .map(([tag]) => ({ id: tag, label: tag }));
  /* "Mantle" filter — workflows with `mantleOfficial !== false`
     (the default). Lets readers scope to first-party Mantle
     recipes vs. the full mixed list. Sits at index 1, right after
     "All", so it reads as the canonical "trusted" filter. The
     special-case id (MANTLE_FILTER_ID) is matched in the wrapper
     above; doesn't collide with any real tag string. */
  return [
    { id: "all", label: "All" },
    { id: MANTLE_FILTER_ID, label: "Mantle" },
    ...top,
  ];
}
