# Callouts — MDX authoring guide

How to format every callout type when writing manual chapters in `.mdx` files
under `compass/content/manuals/`. Every callout here renders the canonical
Mantle next-gen v2 chrome — bordered plate, 8% chapter-accent tint, floating
filled-accent tag at top-left, optional typed designator in the bottom-right
— via the rules in `app/globals.css` `@layer components`.

The chapter accent (`--gold`) flows down automatically from the manual's
`.manual-shell` scope, which reads from `manifest.accent`. You don't set
colors per callout — pick a semantic type, write your prose, and the chapter
ink does the rest.

---

## Quick reference

| Tag | Use for | Default label |
|---|---|---|
| `<Callout>` | Generic highlight — anything that doesn't fit a semantic type | "Callout" |
| `<FieldNote>` | Observation from the field — what you actually saw founders do | "Field Note" |
| `<RealityCheck>` | Hard truth — the part the reader doesn't want to hear | "Reality Check" |
| `<CommonFailure>` | Pattern to avoid — the mistake that keeps happening | "Common Failure" |
| `<DecisionPoint>` | Two-column fork — present a binary choice with both options | "Decision Point" |
| `<FounderShift>` | Mindset transformation — old way → new way | "Founder Shift" |
| `<Quote>` | Pull-quote with attribution — outside voice, not yours | "Quote" |
| `<Checklist>` | Actionable list — each item wrapped in `<CheckItem>` | (no tag — list only) |
| `<Prompt>` | Copyable AI prompt — editable textarea + copy button | "Prompt" |
| `<TLDR>` | Chapter summary — sits at the top of long chapters | "TL;DR" |
| `<FAQ>` | Q&A block — each pair wrapped in `<FAQItem q="...">` | (no tag — list only) |
| `<PromptToggle>` | Reader prompt — collapsible question the reader writes against | (toggle label) |

All shells share the same chrome. The only differences are the **label string**
(set automatically by the tag name) and the **inner body layout** for
DecisionPoint (two columns) and FounderShift (three columns).

---

## Optional props on every callout

- **`title="..."`** — override the default label. Rare; only when "Field Note"
  isn't right for what you're putting in a `<FieldNote>`.
- **`dataIndex="X-NN"`** — typed designator that renders in the bottom-right
  corner (e.g. `data-index="F-01"`). Pure visual cue — useful when you want
  callouts to read as numbered specs.

```mdx
<FieldNote title="From the trenches" dataIndex="F-03">
…
</FieldNote>
```

---

## 1 · Generic Callout

When in doubt, use this. The fallback for "I want a highlighted block but
none of the semantic types fit."

```mdx
<Callout>
The tools give you leverage. Leverage amplifies whatever you point it at.
Point it at the wrong problem and you get a very efficient path to nowhere.
</Callout>
```

To set a custom label:

```mdx
<Callout title="Important">
…
</Callout>
```

---

## 2 · FieldNote

An observation from working with real founders. Use it when you're saying
"here's what we actually saw" — concrete, sourced.

```mdx
<FieldNote>
A polished sidebar has emotionally manipulated a lot of people into thinking
they had product-market fit.
</FieldNote>
```

---

## 3 · RealityCheck

A direct, uncomfortable truth. Use it sparingly — overusing it numbs the
reader. The body should be the single sentence the reader needs to internalize.

```mdx
<RealityCheck>
Building an app and building a business aren't the same job.
</RealityCheck>
```

---

## 4 · CommonFailure

A pattern you keep seeing fail. Body should name the failure mode and why
it happens — not how to fix it (save the fix for prose).

```mdx
<CommonFailure>
Founders launch with short trials because they want faster conversion
numbers, but the actual setup takes longer than the trial itself. The users
who would have paid never get far enough to see the value.
</CommonFailure>
```

---

## 5 · DecisionPoint

Two-column fork. Pass exactly **two** children — each becomes a column.
Each child should be a `<div>` containing an `<h4>` title + a `<p>` body.

```mdx
<DecisionPoint>
  <div>
    <h4>Fit your life around the company</h4>
    <p>
      Move fast, raise capital, optimize for outcome. Decisions get made by
      the calendar — a launch, a round, a hire.
    </p>
  </div>
  <div>
    <h4>Fit the company around your life</h4>
    <p>
      Move at your pace, fund from revenue, optimize for ownership.
      Decisions get made by the constraint — your time, your energy.
    </p>
  </div>
</DecisionPoint>
```

**Layout**: stacks vertically below 768px, side-by-side above, with a
hairline divider between the columns. Column tops align regardless of body
length.

---

## 6 · FounderShift

Three-column **before → arrow → after**. Pass exactly **two** children — the
component drops in the arrow between them.

```mdx
<FounderShift>
  <div>
    <h4>Builder mode</h4>
    <p>
      Ship the next thing. Measure progress in commits, features, demo polish.
    </p>
  </div>
  <div>
    <h4>Founder mode</h4>
    <p>
      Earn the next dollar. Measure progress in customer conversations,
      revenue, retention.
    </p>
  </div>
</FounderShift>
```

**Note on the `<h4>` here**: it renders as a small mono uppercase eyebrow
(not a heading) because the FounderShift body uses the eyebrow recipe for
column kickers — gives the from/to a label-like feel rather than a heading.
For DecisionPoint, `<h4>` renders as a proper h4 heading.

**Layout**: stacks vertically below 768px (arrow rotates 90°), three columns
above (1fr / auto / 1fr).

---

## 7 · Quote

Pull-quote with attribution. The quote body renders in the Geist Pixel
display face inside a `<blockquote>`; the attribution sits below as a
mono uppercase `<cite>`. A 3px gold left bar gives it the editorial
pull-quote feel without losing the bordered-card identity.

```mdx
<Quote attribution="— Mark Zuckerberg, on Stratechery, 2011">
The biggest risk is not taking any risk. In a world that's changing
really quickly, the only strategy that is guaranteed to fail is not
taking risks.
</Quote>
```

The `attribution` prop is optional — omit it for an anonymous pull-quote.

---

## 8 · Checklist

Actionable items, each wrapped in `<CheckItem>`. Renders as a list with
toggle-able checkboxes; the reader can tick items off as they go.

```mdx
<Checklist>
  <CheckItem>You can describe the problem in one sentence.</CheckItem>
  <CheckItem>You know one person who is paying you, or would.</CheckItem>
  <CheckItem>You can articulate what you're explicitly not building.</CheckItem>
  <CheckItem>You have a sustainable cadence — not a launch sprint.</CheckItem>
</Checklist>
```

Pre-check items by passing `done`:

```mdx
<CheckItem done>You can describe the problem in one sentence.</CheckItem>
```

---

## 9 · Prompt

Copyable AI prompt. A toolbar row (title + copy button) sits above an
editable `<textarea>` — readers can copy the prompt verbatim or edit it
first and copy their version. The copy button flashes "Copied" for ~1.6s
after click. Useful when you want the reader to drop the prompt into
ChatGPT / Claude / their tool of choice.

```mdx
<Prompt
  title="Pressure-test your one-liner"
  defaultPrompt={`Act as a brutally honest co-founder. Read my product one-liner below and tell me exactly which user it would confuse and why. Don't suggest fixes — just name the confusion clearly so I can rewrite it.`}
  dataIndex="P-01"
>
  Paste into ChatGPT, Claude, or your AI tool of choice.
</Prompt>
```

**Note**: the prompt body goes in the `defaultPrompt` prop, NOT as
children. That's because the body lives inside a `<textarea>` whose
initial value can't be JSX. Children — if any — render as a hint
paragraph below the prompt block.

**Convention**: use a template literal (backticks) for `defaultPrompt`
so multi-line prompts read cleanly in the MDX source. The textarea
respects newlines.

`<Prompt>` is a client component (uses `useState` for the copied
state + `navigator.clipboard` for the actual copy), so the surrounding
MDX page must be a server component that renders it — which is the
default for every Compass chapter.

---

## 10 · TLDR

Chapter summary. Place at the top of long chapters so readers know whether
to keep reading. Body text renders slightly larger than normal prose.

```mdx
<TLDR>
CoinTracker's content needs outgrew Ghost, so we migrated the entire blog
stack to Sanity and rebuilt it around structured, scalable content. This is
the story of why we moved, what broke, and what we learned fixing it.
</TLDR>
```

Multiple paragraphs are fine — each `<p>` gets its own line.

---

## 11 · FAQ

Question-and-answer block. Each pair wrapped in `<FAQItem q="..."> answer
</FAQItem>`. Questions are the `q` prop (not body); answers are the children.

```mdx
<FAQ>
  <FAQItem q="How long does this manual take to read?">
    About 25 minutes end-to-end. Each chapter stands alone.
  </FAQItem>
  <FAQItem q="Do I need to have shipped something first?">
    No. The manual is built for people anywhere on the spectrum — from idea
    to a few paying users.
  </FAQItem>
</FAQ>
```

---

## 12 · PromptToggle

Collapsible reader-prompt — a question the reader is meant to answer for
themselves. Click the label to reveal the prompt body.

```mdx
<PromptToggle label="Ask yourself: who is this actually for?">
Be specific. Not "founders." Not "AI builders." A name, a job, a
week-in-the-life. If you can't picture them clicking "subscribe," you don't
know yet.
</PromptToggle>
```

The `label` prop is the question (always visible); the children are the
prompt detail (revealed on click).

---

## House-style conventions

- **One sentence per RealityCheck** unless absolutely necessary. The
  punchier, the better.
- **CommonFailure names the failure, not the fix.** The prose around the
  callout handles the fix.
- **FieldNote should be sourced.** Don't put generic claims here — that's
  what Callout is for. Save FieldNote for things you actually observed.
- **DecisionPoint = binary choice.** If there are 3+ options, fall back to
  prose or a list.
- **FounderShift = same axis, two ends.** Builder mode → Founder mode is
  the same axis (what counts as progress). Don't use it for unrelated
  before/after pairs.
- **Don't stack callouts back-to-back.** Always 2-3 paragraphs of prose
  between them — they're punctuation, not content.

---

## Where the styles live

If you need to tune the look:

- **All shell + body rules** → `app/globals.css` `@layer components`, search
  for "Manual callouts"
- **Per-chapter accent** → `compass/content/manuals/<manual>/manifest.json`
  `accent` field, which sets `--gold` on `.manual-shell` via `ManualShell.tsx`
- **Per-cover-accent token mapping** → `public/compass-base.css` (the
  `--cover-accent-*` tokens that the `.accent-*` classes resolve to)
- **MDX component shims** → `compass/components/manuals/mdx-components.tsx`
- **Generic Callout component** → `compass/components/manuals/Callout.tsx`
- **Quote / Prompt / Checklist / TLDR / FAQ / PromptToggle / AuthorCard** →
  `compass/components/manuals/*.tsx`
- **Semantic callout family** (FieldNote · RealityCheck · CommonFailure ·
  DecisionPoint · FounderShift) → `compass/components/callouts/Callouts.tsx`
