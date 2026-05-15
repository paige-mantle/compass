/**
 * Date helpers shared across Compass card grids + article meta lines.
 *
 * Single source of truth so insight / workflow / template cards and
 * detail-page meta lines render dates identically. Mismatched formats
 * across surfaces were the visual giveaway that each card grid had
 * been hand-built — pulling format through here keeps them locked.
 */

const MONTH_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Canonical Compass date format — "May 13, 2026".
 *
 * Long-form US-style date used everywhere a date appears: card meta
 * lines, article-header "Updated …" / "Published …" lines, byline
 * timestamps. One format across every surface so the eye doesn't
 * have to re-learn the convention between a listing and a detail
 * page. Earlier this function returned "MAY 13 26" (compact mono);
 * dropped per design call — the dense uppercase form was harder to
 * scan + felt at odds with the conversational tone of the body
 * copy. Function name is kept for source-stability since every
 * call site already imports it; what changes is the output string.
 *
 * Falsy / unparseable input → empty string. Callers should guard
 * (`if (date)`) before rendering the surrounding chrome.
 */
export function formatShortDate(value: string | undefined | null): string {
  if (!value) return "";
  // `new Date('2026-05-13')` parses as UTC midnight; rendering in the
  // local timezone can flip the date back a day. Pin to UTC reads.
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const month = MONTH_FULL[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

/**
 * Truncate text to the first N sentences. Card excerpts on listings
 * are capped at 2 sentences so a long frontmatter `summary` doesn't
 * blow up a card's height + visually compete with the title. The
 * detail page renders the full summary — this is listing-only.
 *
 * "Sentence" = run of non-`.!?` characters ending in `.`, `!`, or
 * `?` followed by whitespace or end-of-string. Trailing whitespace +
 * an ellipsis are NOT added because authored summaries are usually
 * already complete thoughts — the truncated cut reads cleaner than
 * "… built without an ellipsis hack".
 */
export function truncateSentences(value: string | undefined | null, max = 2): string {
  if (!value) return "";
  const trimmed = value.trim();
  // Match up to `max` sentences. Each segment is captured greedily up
  // to the first sentence-terminator; the `g` flag lets us iterate.
  // Falls back to the whole string when the text has no terminators
  // (single-fragment summaries shouldn't get axed mid-clause).
  const segments = trimmed.match(/[^.!?]+[.!?]+(?:\s|$)/g);
  if (!segments || segments.length === 0) return trimmed;
  return segments.slice(0, max).join("").trim();
}
