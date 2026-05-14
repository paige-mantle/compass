import "@/compass/components/callouts/callouts.css";
import {
  FieldNote,
  RealityCheck,
  CommonFailure,
  DecisionPoint,
  FounderShift,
} from "@/compass/components/callouts/Callouts";
import { Callout } from "@/compass/components/manuals/Callout";
import { FAQ, FAQItem } from "@/compass/components/manuals/FAQ";
import { Checklist, CheckItem } from "@/compass/components/manuals/Checklist";
import { AuthorCard } from "@/compass/components/manuals/AuthorCard";
import { PromptToggle } from "@/compass/components/manuals/PromptToggle";
import { TLDR } from "@/compass/components/manuals/TLDR";

export const metadata = { title: "Callouts & blocks — preview" };

export default function CalloutsPreviewPage() {
  return (
    <>
      {/* Manual blocks (Callout/FAQ/Checklist/...) are styled inside the
          `.manual-section` scope. Pull the canonical compass-manual-*
          stylesheets directly so this design-system demo page sees the
          same rules as the real manual chapters. (Originally loaded
          from `/manuals/get-to-real-demand/` but those files are now
          deleted; the canonical copies live at the /public root.) */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-manual-base.css" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/compass-manual.css" />
      {/* Callout rules live in `app/globals.css` `@layer components`
          (loaded automatically with the Tailwind v4 bundle) — see the
          Manual callouts block. No standalone callouts stylesheet
          anymore. */}

      <main
        style={{
          maxWidth: "72ch",
          margin: "0 auto",
          padding: "64px 24px 120px",
          background: "var(--canvas, #f8f8f6)",
          minHeight: "100vh",
        }}
      >
        <header style={{ marginBottom: 48 }}>
          <p className="callouts-demo-eyebrow">Preview · Manual building blocks</p>
          <h1
            style={{
              fontFamily: "var(--font-display, 'Geist Pixel Line')",
              fontSize: 54,
              fontWeight: 400,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              margin: "0 0 16px",
              color: "var(--text-primary, #110f14)",
            }}
          >
            Callouts &amp; blocks
          </h1>
          <p className="callouts-demo-lede">
            Every callout and structured block available inside a manual,
            rendered with the live components and styles. Use this page to
            sanity-check spacing, typography, and how each piece sits in
            editorial flow.
          </p>
        </header>

        {/* ═══════════════════════════════════════════════════════════════
            PART 1 — The 5 new callouts, in editorial flow
            ═══════════════════════════════════════════════════════════ */}
        <section className="manual-section" style={{ marginBottom: 80, maxWidth: "none" }}>
          <SectionLabel>Part 1 · Semantic callouts</SectionLabel>

          <article className="callouts-demo">
            <p>
              Most founders enter the AI-builder game from one of two doors: the
              engineer who learned to ship, or the operator who learned to
              prompt. Both arrive confident in a craft. Neither, on day one, is
              yet a founder.
            </p>

            {/* Each callout is wrapped in an accent-* class so it picks
                up its chapter's cover-series ink via `--gold`. Real
                manuals get their accent from `manifest.accent` on the
                `.manual-shell` scope; the demo cycles the palette so
                every callout family renders in a different chapter
                color. */}
            <div className="accent-foundation">
              <FieldNote>
                <p>
                  A polished sidebar has emotionally manipulated a lot of
                  people into thinking they had product-market fit.
                </p>
              </FieldNote>
            </div>

            <p>
              The shipping cadence is impressive, the screens look great, the
              waitlist is growing — none of which says anything about whether
              the product earns revenue.
            </p>

            <div className="accent-shape">
              <RealityCheck>
                <p>
                  Building an app and building a business aren't the same job.
                </p>
              </RealityCheck>
            </div>

            <p>
              Once you accept that, the next question is what to do differently
              on Monday. The honest answer is rarely "write more code."
            </p>

            <div className="accent-build">
              <CommonFailure>
                <p>
                  Founders launch with short trials because they want faster
                  conversion numbers, but the actual setup takes longer than
                  the trial itself. The users who would have paid never get
                  far enough to see the value.
                </p>
              </CommonFailure>
            </div>

            <p>
              Most of this manual is about taking those patterns seriously and
              choosing, deliberately, which one you're not going to repeat.
            </p>

            <div className="accent-launch">
              <DecisionPoint>
                <div>
                  <h4>Fit your life around the company</h4>
                  <p>
                    Move fast, raise capital, optimize for outcome. Decisions
                    get made by the calendar — a launch, a round, a hire.
                  </p>
                </div>
                <div>
                  <h4>Fit the company around your life</h4>
                  <p>
                    Move at your pace, fund from revenue, optimize for
                    ownership. Decisions get made by the constraint — your
                    time, your energy.
                  </p>
                </div>
              </DecisionPoint>
            </div>

            <p>
              Whichever path you pick, the more important move is the one
              underneath it — the mindset shift the rest of this manual is
              trying to produce.
            </p>

            <div className="accent-monetize">
              <FounderShift>
                <div>
                  <h4>Builder mode</h4>
                  <p>
                    Ship the next thing. Measure progress in commits,
                    features, demo polish.
                  </p>
                </div>
                <div>
                  <h4>Founder mode</h4>
                  <p>
                    Earn the next dollar. Measure progress in customer
                    conversations, revenue, retention.
                  </p>
                </div>
              </FounderShift>
            </div>
          </article>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PART 2 — Existing manual blocks
            ═══════════════════════════════════════════════════════════ */}
        <section
          className="manual-section"
          style={{ marginBottom: 80, maxWidth: "none" }}
        >
          <SectionLabel>Part 2 · Manual blocks</SectionLabel>

          <SubLabel>TL;DR (collapsible)</SubLabel>
          <TLDR>
            <p>
              CoinTracker's content needs outgrew Ghost, so we migrated the
              entire blog stack to Sanity and rebuilt it around structured,
              scalable content.
            </p>
            <p>
              This is the story of why we moved, what broke, and what we
              learned fixing it.
            </p>
          </TLDR>

          <SubLabel>Callout (notion-callout)</SubLabel>
          <div className="accent-grow">
            <Callout>
              <p>
                <strong>The hard part isn't shipping.</strong> AI made shipping
                easy. The hard part is figuring out what actually matters before
                you waste months building the wrong thing.
              </p>
            </Callout>
          </div>

          <SubLabel>Checklist</SubLabel>
          <Checklist>
            <CheckItem>You can describe the problem in one sentence.</CheckItem>
            <CheckItem>
              You know one person who is paying you (or would).
            </CheckItem>
            <CheckItem>
              You can articulate what you're explicitly not building.
            </CheckItem>
            <CheckItem>
              You have a sustainable cadence — not a launch sprint.
            </CheckItem>
          </Checklist>

          <SubLabel>FAQ</SubLabel>
          <FAQ>
            <FAQItem q="How long does this manual take to read?">
              <p>About 25 minutes end-to-end. Each chapter stands alone.</p>
            </FAQItem>
            <FAQItem q="Do I need to have shipped something first?">
              <p>
                No. The manual is built for people anywhere on the spectrum —
                from idea to a few paying users.
              </p>
            </FAQItem>
            <FAQItem q="Is this AI-specific or general founder advice?">
              <p>
                Both. The frame is universal; the examples and pitfalls are
                AI-specific.
              </p>
            </FAQItem>
          </FAQ>

          <SubLabel>PromptToggle</SubLabel>
          <PromptToggle label="Ask yourself: who is this actually for?">
            <p>
              Be specific. Not "founders." Not "AI builders." A name, a job, a
              week-in-the-life. If you can't picture them clicking "subscribe,"
              you don't know yet.
            </p>
          </PromptToggle>

          <SubLabel>AuthorCard</SubLabel>
          <AuthorCard
            name="Paige Harris"
            tagline="Author · Mantle"
            avatar="/compass-logo-color-black.svg"
          >
            <p>
              Writes about turning AI prototypes into real businesses. Over a
              decade in product, growth, and operations across SaaS and
              Shopify.
            </p>
          </AuthorCard>
        </section>
      </main>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#8a3e00",
        margin: "0 0 24px",
        paddingBottom: 12,
        borderBottom: "1px solid var(--border-soft, rgba(17,15,20,0.08))",
      }}
    >
      {children}
    </p>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--text-label, #8a8784)",
        margin: "32px 0 12px",
      }}
    >
      {children}
    </p>
  );
}
