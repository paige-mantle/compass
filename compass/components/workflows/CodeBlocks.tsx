"use client";

import { Fragment, useRef, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import type { WorkflowCodeBlock } from "../../lib/workflows/content";

/**
 * Right-rail prompt panel for workflows + templates.
 *
 * When the workflow has multiple `codeBlocks` the panel renders as a
 * TAB STRIP — each block becomes a tab with its `filename` as the
 * label and a mono numeric index (01, 02, …) as the suffix. The
 * active tab gets an accent top-bar + lifted surface; inactive tabs
 * sit a notch darker. Pattern mirrors the next-gen Mantle "Quote /
 * Build / Schedule / Cover / Track" sequence-tabs visual, recolored
 * to Compass dark mode with canonical tokens.
 *
 * Single-block workflows skip the tab strip and render the bare
 * frame — no point in a one-tab tab bar.
 *
 * Each block's `<code>` element is `contentEditable` so readers can
 * tweak the prompt before copying. `[PLACEHOLDER]` tokens render
 * in the accent so fill-in slots are visually obvious. The Copy
 * button always reads the live text from the editable element.
 */

/**
 * Tokenize one code line and return colored `<span>` elements.
 *
 * Replaces the heavyweight Shiki/rehype-pretty-code pipeline with
 * about ~30 lines of regex. Four token classes are recognized:
 *
 *   • Keywords (`import`, `export`, `const`, `type`, `from`) —
 *     `text-accent-alt-high` (Mantle purple #9676FF)
 *   • String literals (single OR double quoted) —
 *     `text-green-high` (Mantle electric lime #98FF76)
 *   • `[PLACEHOLDER]` fill-in slots —
 *     `text-accent-high` (Mantle warm gold #FFC66E)
 *   • Everything else — `text-fg-medium` (default body ink)
 *
 * The single master regex (`TOKEN_RE`) captures any of the three
 * highlighted token kinds via alternation; whatever falls between
 * matches is the "default" run that gets the body-ink class. This
 * is the same shape as Shiki's textmate-grammar tokenizer but
 * specific to the small slice of TS-flavored prompts Compass ships:
 * imports, type declarations, string args, placeholder slots. Add
 * a new branch + class if a new token kind needs highlighting.
 *
 * Edge cases handled:
 *   • Word boundaries (`\b`) so "important" doesn't match "import".
 *   • Escaped quotes inside strings (`'don\\'t'`) via `[^'\\]|\\.`
 *     repeat.
 *   • Lines with no recognized tokens return early as the raw
 *     string — no per-character span overhead.
 */
type LineToken = { text: string; className: string };

const TOKEN_RE =
  /(\b(?:import|export|const|type|from)\b)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\[[A-Z][A-Z0-9 _\-]*\])/g;

const DEFAULT_TOKEN_CLASS = "text-fg-medium";
const KEYWORD_TOKEN_CLASS = "text-accent-alt-high";
const STRING_TOKEN_CLASS = "text-green-high";
const PLACEHOLDER_TOKEN_CLASS = "text-accent-high";

function tokenizeLine(line: string): LineToken[] {
  const tokens: LineToken[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  // Reset regex state — `TOKEN_RE` is a module-level `g` regex,
  // so `.lastIndex` carries between calls. Setting it to 0 makes
  // each call deterministic.
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line))) {
    if (m.index > last) {
      tokens.push({
        text: line.slice(last, m.index),
        className: DEFAULT_TOKEN_CLASS,
      });
    }
    if (m[1]) {
      tokens.push({ text: m[1], className: KEYWORD_TOKEN_CLASS });
    } else if (m[2]) {
      tokens.push({ text: m[2], className: STRING_TOKEN_CLASS });
    } else if (m[3]) {
      tokens.push({ text: m[3], className: PLACEHOLDER_TOKEN_CLASS });
    }
    last = m.index + m[0].length;
  }
  if (last < line.length) {
    tokens.push({
      text: line.slice(last),
      className: DEFAULT_TOKEN_CLASS,
    });
  }
  return tokens;
}

function renderLine(line: string) {
  const tokens = tokenizeLine(line);
  if (tokens.length === 0) return line;
  // Single default-class run? Skip the span wrapper — the parent
  // already carries `text-fg-medium`, so wrapping plain prose lines
  // in a redundant span is dead DOM weight.
  if (
    tokens.length === 1 &&
    tokens[0].className === DEFAULT_TOKEN_CLASS
  ) {
    return tokens[0].text;
  }
  return tokens.map((t, i) => (
    <Fragment key={i}>
      <span className={t.className}>{t.text}</span>
    </Fragment>
  ));
}

export function CodeBlocks({ blocks }: { blocks: WorkflowCodeBlock[] }) {
  if (blocks.length === 0) return null;
  /* Single block — no tabs needed, just render the bare frame with
     the filename above it. Same recipe as the old vertical-stack
     layout for the one-prompt case. */
  if (blocks.length === 1) {
    return <SingleBlock block={blocks[0]} />;
  }
  return <TabbedBlocks blocks={blocks} />;
}

/* ─────────────────────────────────────────────────────────────
 * Tab strip + active panel — sequence-numbered prompts
 * ─────────────────────────────────────────────────────────────
 */
function TabbedBlocks({ blocks }: { blocks: WorkflowCodeBlock[] }) {
  const [active, setActive] = useState(0);
  return (
    /* Container is a column-flex with a hard height (set by the
       sticky `<aside>` in `CompassDetailShell`) so the tab strip
       stays pinned at the top and the active panel takes the
       remaining height. `min-h-0` is required to let the flex child
       shrink below its intrinsic content height so the inner `<pre>`
       can scroll internally. */
    <div className="flex flex-col h-full rounded-lg border border-edge-medium overflow-hidden">
      <div
        role="tablist"
        aria-label="Prompt sequence"
        className="grid border-b border-edge-medium shrink-0"
        style={{ gridTemplateColumns: `repeat(${blocks.length}, minmax(0, 1fr))` }}
      >
        {blocks.map((b, i) => {
          const isActive = i === active;
          const tabId = `prompt-tab-${i}`;
          const panelId = `prompt-panel-${i}`;
          return (
            <button
              key={`${b.filename}-${i}`}
              role="tab"
              id={tabId}
              aria-selected={isActive}
              aria-controls={panelId}
              onClick={() => setActive(i)}
              type="button"
              className={[
                /* Number on the LEFT (sequence-tabs spec). Filename
                   reads after the index so the prompt-order is the
                   primary cue and the filename qualifies it. */
                "group flex items-center gap-3",
                "px-4 py-3 text-left",
                "border-r border-edge-medium last:border-r-0",
                /* Active tab: accent BOTTOM bar (`border-b-2
                   border-b-accent`) lining up with the strip's
                   hairline below. `-mb-px` pulls the tab's bottom
                   edge 1px below its natural baseline so the 2px
                   accent border overlaps the parent's 1px hairline
                   — visually replaces it for the active tab while
                   the inactive tabs let the hairline show through.
                   Lifted `surface-higher` background + full-strength
                   ink. Inactive: transparent bottom bar +
                   `surface-high` surface + muted ink that hovers to
                   full strength. */
                "border-b-2 -mb-px transition-colors duration-150 cursor-pointer",
                isActive
                  ? "border-b-accent bg-surface-higher text-fg-high"
                  : "border-b-transparent bg-surface-high text-fg-medium hover:bg-surface-higher hover:text-fg-high",
              ].join(" ")}
            >
              <span
                className={[
                  "font-mono text-xxs tracking-wider tabular-nums shrink-0",
                  isActive ? "text-fg-medium" : "text-fg-lower",
                ].join(" ")}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-heading text-sm font-medium leading-tight truncate">
                {b.filename}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active panel — only the selected tab is rendered. The bare
          frame fills the remaining flex space. */}
      {blocks.map((b, i) => (
        <div
          key={`${b.filename}-panel-${i}`}
          role="tabpanel"
          id={`prompt-panel-${i}`}
          aria-labelledby={`prompt-tab-${i}`}
          hidden={i !== active}
          className={i === active ? "flex flex-col flex-1 min-h-0" : ""}
        >
          <BlockFrame block={b} bare />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Single-block rendering (no tabs)
 * ─────────────────────────────────────────────────────────────
 */
function SingleBlock({ block }: { block: WorkflowCodeBlock }) {
  /* Fills the sticky aside the same way the tabbed variant does —
     filename eyebrow at the top, frame takes the remaining flex
     height. */
  return (
    <div className="flex flex-col h-full space-y-2">
      <span className="block font-mono text-xs text-fg-low shrink-0">{block.filename}</span>
      <div className="flex flex-col flex-1 min-h-0">
        <BlockFrame block={block} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Block frame — the actual code + Copy / .md toolbar
 * ─────────────────────────────────────────────────────────────
 *
 * `bare={true}` is used inside the tabbed container — the outer
 * tab wrapper already owns the rounded border, so the frame strips
 * its own border/radius and just contributes the inner surface +
 * pill toolbar + code text.
 *
 * Layout: column-flex. Toolbar pinned to the top of the frame,
 * scrolling `<pre>` takes the remaining height (`flex-1 min-h-0`)
 * so the prompt fills whatever vertical space the sticky right rail
 * has allocated. The sticky aside (in `CompassDetailShell`) caps the
 * outer height to `100dvh - header`, so the frame never grows past
 * the viewport — the prompt scrolls internally instead.
 *
 * Word wrapping: long prompt lines wrap inside the frame
 * (`whitespace-pre-wrap break-words`) so long prompts read inline
 * instead of forcing horizontal scroll.
 *
 * Toolbar: two outline pill buttons — Copy + .md (markdown download).
 * The pills sit in their own row at the top of the frame so they
 * never overlap with the prompt text (and the prompt body doesn't
 * have to reserve right-side padding).
 */
function BlockFrame({
  block,
  bare = false,
}: {
  block: WorkflowCodeBlock;
  bare?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement | null>(null);
  const initial = block.code.replace(/\s+$/, "");
  const lines = initial.split("\n");

  const onCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const text = codeRef.current?.innerText ?? initial;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard might be blocked in some contexts; fail silently.
    }
  };

  /* Download the (possibly edited) prompt text as a `.md` file. We
     read from the live `contentEditable` element so any inline edits
     the reader made before clicking are preserved. Filename derives
     from the block's `filename` field — strip any existing extension
     and append `.md`. */
  const onDownloadMd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const text = codeRef.current?.innerText ?? initial;
    const base = block.filename.replace(/\.[^.]+$/, "");
    const filename = `${base || "prompt"}.md`;
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const frameClasses = bare
    ? "relative flex flex-col h-full bg-surface-higher transition-colors duration-150 focus-within:bg-surface-higher"
    : "relative flex flex-col h-full rounded-lg border border-edge-medium bg-surface-higher overflow-hidden transition-colors duration-150 focus-within:border-edge-high";

  return (
    <div className={frameClasses}>
      {/* Toolbar row — outline pill buttons. Matches the design spec
          from the reference screenshot: rounded-2xl pill, thin
          edge-medium border, icon + label, hover lifts to
          surface-higher. */}
      <div className="flex items-center justify-end gap-2 px-3 pt-3 pb-2 shrink-0">
        <ToolbarPillButton
          onClick={onCopy}
          aria-label={copied ? "Copied to clipboard" : "Copy prompt to clipboard"}
          icon={
            copied ? (
              <Check width={14} height={14} color="currentColor" strokeWidth={2} aria-hidden />
            ) : (
              <Copy width={14} height={14} color="currentColor" strokeWidth={2} aria-hidden />
            )
          }
          label={copied ? "Copied" : "Copy"}
        />
        <ToolbarPillButton
          onClick={onDownloadMd}
          aria-label="Download prompt as markdown"
          icon={
            <Download width={14} height={14} color="currentColor" strokeWidth={2} aria-hidden />
          }
          label=".md"
        />
      </div>

      <pre
        className={[
          "m-0 flex-1 min-h-0 overflow-y-auto px-3 pb-4 font-mono text-xs leading-loose",
          `lang-${block.language}`,
        ].join(" ")}
      >
        <code
          ref={codeRef}
          className="block cursor-text outline-none focus:outline-none"
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          aria-label={`${block.filename} prompt — editable`}
        >
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span
                className="select-none w-10 pr-3 shrink-0 text-right text-fg-lower"
                aria-hidden
                contentEditable={false}
              >
                {i + 1}
              </span>
              <span className="flex-1 text-fg-medium whitespace-pre-wrap break-words">
                {line ? renderLine(line) : " "}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * ToolbarPillButton — outline pill with icon + label
 * ─────────────────────────────────────────────────────────────
 * Border radius matches the canonical `CompassButton` medium recipe
 * (`rounded-2xl`) so every button across Compass shares the same
 * corner radius. Height pinned to `h-9` (= 36px), padding tuned to
 * `pl-3 pr-3.5` so the icon + label cluster sits centred. Outline
 * variant (transparent fill, edge-medium border) reads as a quiet
 * utility action — used only inside the prompt toolbar; primary
 * CTAs continue to use `CompassButton primary`.
 */
function ToolbarPillButton({
  onClick,
  icon,
  label,
  "aria-label": ariaLabel,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon: React.ReactNode;
  label: string;
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="
        inline-flex items-center gap-1.5
        h-9 pl-3 pr-3.5 rounded-2xl
        border border-edge-medium
        bg-transparent text-fg-high
        font-sans text-xs font-medium leading-none
        hover:bg-surface-highest hover:border-edge-high
        transition-colors duration-150 cursor-pointer
      "
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
