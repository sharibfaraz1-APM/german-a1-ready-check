import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpenCheck, Check, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QUESTIONS, type Skill } from "@/data/questions";
import {
  calculateOverallScore,
  calculateSkillScores,
  getReadinessBand,
  getWeakestTopics,
} from "@/lib/scoring";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Am I exam-ready? — German A1 readiness check" },
      {
        name: "description",
        content: "Take a quick German A1 check for reading, grammar, and vocabulary before your Goethe or ÖSD exam.",
      },
      { property: "og:title", content: "Am I exam-ready? — German A1 readiness check" },
      {
        property: "og:description",
        content: "A five-minute German A1 check for reading, grammar, and vocabulary.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Stage = "start" | "quiz" | "results";

const SKILL_LABELS: Record<Skill, string> = {
  reading: "Reading",
  grammar: "Grammar",
  vocabulary: "Vocabulary",
};

function Index() {
  const [stage, setStage] = useState<Stage>("start");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentQuestion = QUESTIONS[questionIndex];

  function startQuiz() {
    setAnswers({});
    setQuestionIndex(0);
    setStage("quiz");
  }

  function chooseAnswer(optionIndex: number) {
    if (!currentQuestion) return;
    if (!currentQuestion) return;
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: optionIndex }));
  }

  function goForward() {
    if (!currentQuestion) return;
    if (answers[currentQuestion.id] === undefined) return;
    if (questionIndex === QUESTIONS.length - 1) {
      setStage("results");
    } else {
      setQuestionIndex((previous) => previous + 1);
    }
  }

  const skillScores = calculateSkillScores(QUESTIONS, answers);
  const overallScore = calculateOverallScore(skillScores);
  const band = getReadinessBand(overallScore, skillScores);
  const weakTopics = getWeakestTopics(QUESTIONS, answers);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookOpenCheck aria-hidden="true" className="size-5" />
          </span>
          <span className="font-semibold tracking-normal">Am I exam-ready?</span>
        </div>
        <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          GERMAN · A1
        </span>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-16 pt-5 sm:px-8 sm:pt-12">
        {stage === "start" && <StartScreen onStart={startQuiz} />}
        {stage === "quiz" && currentQuestion && (
          <QuizScreen
            question={currentQuestion}
            questionIndex={questionIndex}
            selectedAnswer={answers[currentQuestion.id]}
            onSelect={chooseAnswer}
            onBack={() => {
              if (questionIndex === 0) setStage("start");
              else setQuestionIndex((previous) => previous - 1);
            }}
            onNext={goForward}
          />
        )}
        {stage === "results" && (
          <ResultsScreen
            skillScores={skillScores}
            overallScore={overallScore}
            band={band}
            weakTopics={weakTopics}
            onRetake={startQuiz}
          />
        )}
      </main>

      <footer className="mx-auto flex w-full max-w-5xl justify-between border-t border-border/70 px-5 py-5 text-xs text-muted-foreground sm:px-8">
        <span>German A1 · Goethe & ÖSD</span>
        <span>Made for your next step</span>
      </footer>
    </div>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="mx-auto max-w-3xl py-10 sm:py-16">
      <p className="mb-5 text-sm font-semibold text-primary">A small check-in before a big step</p>
      <h1 className="max-w-2xl font-display text-5xl leading-[1.08] text-foreground sm:text-6xl">
        Am I exam-ready?
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
        Answer a few questions to see how your German reading, grammar and vocabulary are coming along for the Goethe or ÖSD A1 exam.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-foreground">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
          About 5 minutes
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          12 questions
        </span>
      </div>

      <Button onClick={onStart} size="lg" className="mt-9 h-14 min-w-48 rounded-lg px-7 text-base">
        Start
        <ArrowRight aria-hidden="true" />
      </Button>

      <div className="mt-16 border-t border-border pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Your check covers
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
          {([
            ["01", "Reading", "Understand short everyday messages"],
            ["02", "Grammar", "Choose the right forms and phrases"],
            ["03", "Vocabulary", "Recall useful words for daily life"],
          ] as const).map(([number, title, detail]) => (
            <div key={title} className="flex items-start gap-3">
              <span className="pt-0.5 text-xs font-semibold text-primary">{number}</span>
              <div>
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuizScreen({
  question,
  questionIndex,
  selectedAnswer,
  onSelect,
  onBack,
  onNext,
}: {
  question: (typeof QUESTIONS)[number];
  questionIndex: number;
  selectedAnswer: number | undefined;
  onSelect: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const progress = questionIndex + 1;

  return (
    <section className="mx-auto max-w-2xl py-5 sm:py-8">
      <div className="mb-8 flex items-center justify-between text-sm">
        <span className="font-semibold text-primary">Question {progress} of {QUESTIONS.length}</span>
        <span className="text-muted-foreground">{SKILL_LABELS[question.skill]}</span>
      </div>
      <progress
        aria-label="Quiz progress"
        className="quiz-progress"
        value={progress}
        max={QUESTIONS.length}
      />

      <div className="mt-10 sm:mt-12">
        <p className="text-sm font-medium text-muted-foreground">{question.topic}</p>
        {question.passage && (
          <blockquote className="mt-4 rounded-lg border-l-4 border-accent bg-card px-5 py-4 text-base leading-7 text-foreground">
            {question.passage}
          </blockquote>
        )}
        <h1 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">{question.text}</h1>

        <div className="mt-7 grid gap-3" role="group" aria-label="Answer choices">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            return (
              <Button
                key={option}
                type="button"
                variant="outline"
                size="lg"
                aria-pressed={isSelected}
                onClick={() => onSelect(index)}
                className={`h-auto min-h-16 w-full justify-between rounded-lg px-5 py-4 text-left text-base font-normal leading-relaxed whitespace-normal ${
                  isSelected ? "border-primary bg-primary/10 text-foreground" : "bg-card"
                }`}
              >
                <span>{option}</span>
                {isSelected && <Check aria-hidden="true" className="text-primary" />}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
        <Button type="button" variant="ghost" onClick={onBack} className="min-h-11 px-3">
          <ArrowLeft aria-hidden="true" />
          Back
        </Button>
        <Button type="button" onClick={onNext} disabled={selectedAnswer === undefined} className="min-h-11 px-5">
          {questionIndex === QUESTIONS.length - 1 ? "See results" : "Next"}
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}

function ResultsScreen({
  skillScores,
  overallScore,
  band,
  weakTopics,
  onRetake,
}: {
  skillScores: Record<Skill, number>;
  overallScore: number;
  band: "Ready" | "Almost ready" | "Not yet";
  weakTopics: ReturnType<typeof getWeakestTopics>;
  onRetake: () => void;
}) {
  const roundedScore = Math.round(overallScore);
  const bandClass = band === "Ready" ? "text-result-ready" : band === "Almost ready" ? "text-result-almost" : "text-result-not-yet";
  const message = band === "Ready"
    ? "Your results look strong across the areas in this check. You may be close to booking your exam."
    : band === "Almost ready"
      ? "You have a good foundation. A little more practice in your weaker areas could help before booking."
      : "This is a helpful starting point. Spend some time reviewing the topics below, then try again.";

  return (
    <section className="mx-auto max-w-3xl py-5 sm:py-8">
      <p className="text-sm font-semibold text-primary">Your check-in</p>
      <div className="mt-5 flex flex-col gap-3 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={`font-display text-4xl leading-tight sm:text-5xl ${bandClass}`}>{band}</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">{message}</p>
        </div>
        <p className="shrink-0 text-5xl font-semibold tabular-nums text-foreground" aria-label={`Overall score ${roundedScore} percent`}>
          {roundedScore}<span className="text-2xl text-muted-foreground">%</span>
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">By skill</h2>
        <div className="mt-5 space-y-5">
          {(["reading", "grammar", "vocabulary"] as const).map((skill) => {
            const score = Math.round(skillScores[skill]);
            return (
              <div key={skill}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">{SKILL_LABELS[skill]}</span>
                  <span className="tabular-nums text-muted-foreground">{score}%</span>
                </div>
                <progress
                  aria-label={`${SKILL_LABELS[skill]} score`}
                  className="skill-progress"
                  value={score}
                  max={100}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-7">
        <h2 className="text-lg font-semibold">A few topics to practise</h2>
        {weakTopics.length > 0 ? (
          <ul className="mt-4 divide-y divide-border">
            {weakTopics.map(({ topic, tip }) => (
              <li key={topic} className="py-4 first:pt-0 last:pb-0">
                <h3 className="font-medium">{topic}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{tip}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            No missed topics this time. Keep practising a little every day.
          </p>
        )}
      </div>

      <p className="mt-9 rounded-lg bg-muted px-5 py-4 text-sm leading-6 text-muted-foreground">
        This check covers reading, grammar and vocabulary only—not listening, speaking or writing. Your result is an estimate, not a guarantee of exam performance.
      </p>

      <details className="group mt-6 border-b border-border pb-5">
        <summary className="cursor-pointer list-none font-semibold marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="inline-flex min-h-11 items-center gap-2">
            How is this calculated?
            <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-90">›</span>
          </span>
        </summary>
        <div className="max-w-2xl space-y-2 pb-1 text-sm leading-6 text-muted-foreground">
          <p>Each skill score is the percentage of correct answers, with more challenging questions counting a little more.</p>
          <p>The overall score combines reading (40%), grammar (30%) and vocabulary (30%). Ready starts at 80%; Almost ready is 60–79%; below 60% is Not yet.</p>
          <p>If any skill is below 50%, the overall result cannot be higher than Almost ready.</p>
        </div>
      </details>

      <Button onClick={onRetake} size="lg" className="mt-8 min-h-12 rounded-lg px-6">
        <RotateCcw aria-hidden="true" />
        Retake
      </Button>
    </section>
  );
}
