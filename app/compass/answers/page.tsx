import { CompassLayout } from "@/compass/components/shared/CompassLayout";
import { CompassIndexHero } from "@/compass/components/shared/CompassIndexHero";
import { CompassSectionNav } from "@/compass/components/shared/CompassSectionNav";
import { CompassNewsletter } from "@/compass/components/shared/CompassNewsletter";
import { AnswerCardGrid } from "@/compass/components/answers/AnswerCardGrid";
import { ANSWERS } from "@/compass/lib/answers/content";

export const metadata = {
  title: "Answers — Mantle Compass",
  description:
    "Short, opinionated answers to the questions AI-builder founders actually ask.",
  alternates: { canonical: "/compass/answers" },
};

export default function AnswersIndexPage() {
  return (
    <CompassLayout showFooterCta={false}>
      <div className="mx-auto w-full max-w-[1320px] px-6 max-[720px]:px-5">
        <CompassIndexHero
          heading="Answers"
          description="Short, opinionated answers to the questions AI-builder founders actually ask."
        />
        <CompassSectionNav
          currentPath="/compass/answers"
          items={[
            { href: "/compass/manuals", label: "Manuals", count: 7 },
            { href: "/compass/methods", label: "Methods", count: 7 },
            { href: "/templates", label: "Templates", count: 2 },
            { href: "/compass/insights", label: "Insights", count: 2 },
            { href: "/compass/answers", label: "Answers", count: ANSWERS.length },
          ]}
        />
        <div className="mt-14 max-[720px]:mt-10">
          <AnswerCardGrid answers={ANSWERS} />
        </div>
      </div>
      <CompassNewsletter />
    </CompassLayout>
  );
}
