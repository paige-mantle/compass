/**
 * `/compass/answers` — Q&A entries.
 *
 * Currently stored as a hardcoded list. Once we have detail pages
 * for each Q&A, this should move to an MDX-based content lib like
 * `compass/lib/insights/content.ts` (one MDX file per answer, with
 * frontmatter for title/desc/tag/date). For now the list is here
 * inline because the static page these were migrated from had
 * `href="#"` on every card — no detail pages yet.
 */
export type AnswerMeta = {
  title: string;
  description: string;
  tag: string;
  /** Display date, human-readable (e.g. "Apr 22, 2026"). */
  date: string;
  /** Machine-readable ISO date for the `<time datetime>` attr. */
  datetime: string;
  /** Optional slug for the future detail page. */
  slug?: string;
};

export const ANSWERS: AnswerMeta[] = [
  {
    title: "Do I need my own Supabase account when building with Lovable?",
    description: "When Lovable's bundled storage is enough — and the moment you should bring your own Supabase.",
    tag: "Workflows",
    date: "Apr 22, 2026",
    datetime: "2026-04-22",
  },
  {
    title: "Can you get a free Base44 site into Google Search Console?",
    description: "Yes — but there's one verification step most builders skip on a free plan.",
    tag: "Growth",
    date: "Apr 18, 2026",
    datetime: "2026-04-18",
  },
  {
    title: "Can I do SEO on a no-code AI-built site without knowing how to code?",
    description: "On most AI builders, SEO is filling fields, not writing code. Here's the field list.",
    tag: "Growth",
    date: "Apr 15, 2026",
    datetime: "2026-04-15",
  },
  {
    title: "How do I write a one-shot prompt that generates a full app?",
    description: "The structure that turns a vague idea into a working scaffold on the first generation.",
    tag: "Mantle AI",
    date: "Apr 11, 2026",
    datetime: "2026-04-11",
  },
  {
    title: "How do I verify my site in Google Search Console?",
    description: "Skip the meta-tag dance — DNS verification is faster and survives redeploys.",
    tag: "Growth",
    date: "Apr 08, 2026",
    datetime: "2026-04-08",
  },
  {
    title: "How to write an API that won't break in six months",
    description: "Six months is when shortcuts start charging interest. Write it like it has to last.",
    tag: "Workflows",
    date: "Apr 04, 2026",
    datetime: "2026-04-04",
  },
  {
    title: "How do I track real visitors to my AI-built site?",
    description: "Free analytics that show real humans, not bots — and integrate without touching code.",
    tag: "Growth",
    date: "Apr 01, 2026",
    datetime: "2026-04-01",
  },
  {
    title: "How do I add Apple Sign-In to a Base44 app to pass App Store review?",
    description: "The exact Apple Sign-In flow reviewers expect — and the gotchas that cause rejections.",
    tag: "Workflows",
    date: "Mar 28, 2026",
    datetime: "2026-03-28",
  },
  {
    title: "Are people actually making money from vibe-coded apps?",
    description: "Real revenue numbers from real builders — separated from the X-timeline hype.",
    tag: "Validation",
    date: "Mar 25, 2026",
    datetime: "2026-03-25",
  },
  {
    title: "Why won't my images display in my AI-built app?",
    description: "The asset-hosting setup that actually works — and the three reasons it usually breaks.",
    tag: "Workflows",
    date: "Mar 21, 2026",
    datetime: "2026-03-21",
  },
  {
    title: "How do I market my vibe-coded app to get real users?",
    description: "Channels that work for solo builders without an audience — and the ones that don't.",
    tag: "Growth",
    date: "Mar 18, 2026",
    datetime: "2026-03-18",
  },
  {
    title: "When to build vs buy a feature in your early product",
    description: "A 60-second framework for deciding whether to write code or pay for a tool.",
    tag: "Strategy",
    date: "Mar 14, 2026",
    datetime: "2026-03-14",
  },
  {
    title: "How do I stop my Lovable project from appearing in Discover?",
    description: "The single toggle that pulls your project off the public Discover surface.",
    tag: "Workflows",
    date: "Mar 11, 2026",
    datetime: "2026-03-11",
  },
  {
    title: "Why does my Stripe integration keep breaking in my no-code app?",
    description: "The three Stripe pitfalls that always hit no-code apps — and how to defuse them.",
    tag: "Workflows",
    date: "Mar 07, 2026",
    datetime: "2026-03-07",
  },
  {
    title: "Should I set up Stripe at the beginning of a build or after?",
    description: "Why most builders should wire Stripe last — and the few cases where it has to be first.",
    tag: "Planning",
    date: "Mar 04, 2026",
    datetime: "2026-03-04",
  },
  {
    title: "How do I fix an exposed Supabase key without breaking login?",
    description: "Step-by-step: rotate an exposed key without locking out users mid-session.",
    tag: "Workflows",
    date: "Feb 28, 2026",
    datetime: "2026-02-28",
  },
  {
    title: "How do I add Stripe to my AI-built app?",
    description: "The cleanest way to wire Stripe Checkout into an AI builder — minimal config, full coverage.",
    tag: "Workflows",
    date: "Feb 25, 2026",
    datetime: "2026-02-25",
  },
];
