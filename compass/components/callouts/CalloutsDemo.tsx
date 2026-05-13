import {
  FieldNote,
  RealityCheck,
  CommonFailure,
  DecisionPoint,
  FounderShift,
} from "./Callouts";

/**
 * CalloutsDemo
 *
 * Renders all 5 callout types inline within a section of editorial prose so
 * the visual relationship between body copy and callout can be evaluated.
 * Each callout uses the example content from the spec; the surrounding
 * paragraphs are written to match the *cadence* a real manual chapter would
 * have (~2-3 paragraphs between callouts).
 *
 * Drop this into any route to preview the family in context.
 */
export default function CalloutsDemo() {
  return (
    <article className="callouts-demo max-w-[68ch] mx-auto px-6 py-16">
      <header className="callouts-demo-header mb-10">
        <p className="callouts-demo-eyebrow">Manual 001 · Chapter 3</p>
        <h1>Founder mode</h1>
        <p className="callouts-demo-lede">
          Most founders enter the AI-builder game from one of two doors: the
          engineer who learned to ship, or the operator who learned to prompt.
          Both arrive confident in a craft. Neither, on day one, is yet a
          founder.
        </p>
      </header>

      <p>
        That word means something specific, and the gap between knowing a craft
        and running a business is the gap this manual is built to close. The
        first symptom of the gap is usually visual: a beautiful product that
        nobody is paying for, demoed by a founder who can't yet say, in one
        sentence, why anyone should.
      </p>

      <FieldNote>
        <p>
          A polished sidebar has emotionally manipulated a lot of people into
          thinking they had product-market fit.
        </p>
      </FieldNote>

      <p>
        We see it weekly. A founder pulls up the app, walks through a demo, and
        the room nods. The shipping cadence is impressive. The screens look
        great. The waitlist is growing. None of those signals say anything
        about whether the product earns revenue or whether the people on the
        waitlist will ever pay — and most founders, in this mode, are not yet
        asking.
      </p>

      <p>
        The shift the manual is about isn't ambition. It's not working harder.
        It's a re-categorization of what counts as "progress" — and that
        re-categorization tends to land as something the reader doesn't want
        to hear.
      </p>

      <RealityCheck>
        <p>
          Building an app and building a business aren't the same job. The
          first is a craft you can practice in a weekend. The second is a
          posture you adopt for years.
        </p>
      </RealityCheck>

      <p>
        Once you accept that, the next question is what to do differently on
        Monday. The honest answer is rarely "write more code." It's more often
        a structural change in how the week is spent — and the pattern most
        early founders fall into without noticing is one of the most expensive
        mistakes in the playbook.
      </p>

      <CommonFailure>
        <p>
          Founders launch with short trials because they want faster conversion
          numbers, but the actual setup takes longer than the trial itself. The
          users who would have paid never get far enough to see the value, and
          the conversion data ends up measuring the trial length more than the
          product.
        </p>
      </CommonFailure>

      <p>
        Most of this manual is about taking those patterns seriously and
        choosing, deliberately, which one you're not going to repeat. The
        choosing matters because early decisions compound — small forks that
        look symmetric on Tuesday produce wildly different companies by month
        six. One of those forks tends to define the rest of the story.
      </p>

      <DecisionPoint>
        <div>
          <h4>Fit your life around the company</h4>
          <p>
            Move fast, raise capital, optimize for outcome. Decisions get made
            by the calendar — a launch, a round, a hire. You trade flexibility
            for velocity, and you accept that some weeks the company gets to
            decide what your Saturday looks like.
          </p>
        </div>
        <div>
          <h4>Fit the company around your life</h4>
          <p>
            Move at your pace, fund from revenue, optimize for ownership.
            Decisions get made by the constraint — your time, your energy, the
            kind of week you want to have. You trade speed for sovereignty,
            and you keep the right to walk away on Friday.
          </p>
        </div>
      </DecisionPoint>

      <p>
        Whichever you pick, the more important move is the one underneath it:
        the mindset shift the rest of this manual is trying to produce. If you
        leave with one thing, leave with this.
      </p>

      <FounderShift>
        <div>
          <h4>Builder mode</h4>
          <p>
            Ship the next thing. Measure progress in commits, features, demo
            polish. The question is "what should I build?"
          </p>
        </div>
        <div>
          <h4>Founder mode</h4>
          <p>
            Earn the next dollar. Measure progress in customer conversations,
            revenue, retention. The question is "what do they need?"
          </p>
        </div>
      </FounderShift>

      <p>
        The rest of the manual assumes you've made the shift, or are at least
        trying. Every chapter from here forward speaks in founder mode — and
        the five callouts you've just met will reappear when the prose needs
        to slow down, confront, warn, prompt, or transform.
      </p>
    </article>
  );
}
