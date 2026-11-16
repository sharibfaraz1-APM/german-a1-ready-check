import type { Question, Skill } from "@/data/questions";

/** All score weights and readiness cutoffs live here. Adjust this object to tune scoring. */
export const CONFIG = {
  // Higher-difficulty questions contribute more to their skill score.
  difficultyWeights: { 1: 1, 2: 2, 3: 3 },
  // The overall score follows the requested reading / grammar / vocabulary mix.
  skillWeights: { reading: 0.4, grammar: 0.3, vocabulary: 0.3 },
  // Ready begins at 80%; Almost ready begins at 60%; lower scores are Not yet.
  bandThresholds: { ready: 80, almostReady: 60 },
  // A skill below this level prevents the overall band from being Ready.
  minimumSkillForReady: 50,
} as const;

export type ReadinessBand = "Ready" | "Almost ready" | "Not yet";

export interface WeakTopic {
  topic: string;
  mistakes: number;
  tip: string;
}

const PRACTICE_TIPS: Record<string, string> = {
  "Everyday words": "Review a few everyday German words and use each one in a short sentence.",
  Family: "Practise family words by describing the people in your family.",
  "Numbers & time": "Say a few clock times aloud and practise the German half-hour expressions.",
  "Places in town": "Learn common places in town with their articles, such as die Apotheke.",
  Articles: "Practise der, die and das with familiar nouns, then try them in short sentences.",
  "Verb forms": "Conjugate one common verb with ich, du, er/sie and wir.",
  Negation: "Make simple positive and negative sentences with nicht and kein.",
  "Questions & requests": "Practise polite everyday questions with können and bitte.",
  "Short messages": "Read a short note and identify who wrote it and why.",
  Appointments: "Practise reading appointment times and key words for dates and plans.",
  "Days & plans": "Review the days of the week and make a simple plan for tomorrow.",
  "Finding details": "Scan short German messages for names, times and reasons.",
};

/** Difficulty-weight each skill's percent correct; an empty skill scores zero. */
export function calculateSkillScores(
  questions: readonly Question[],
  answers: Readonly<Record<string, number>>,
): Record<Skill, number> {
  const skills: Skill[] = ["reading", "grammar", "vocabulary"];
  return Object.fromEntries(
    skills.map((skill) => {
      const skillQuestions = questions.filter((question) => question.skill === skill);
      const possibleWeight = skillQuestions.reduce(
        (total, question) => total + CONFIG.difficultyWeights[question.difficulty],
        0,
      );
      const earnedWeight = skillQuestions.reduce(
        (total, question) =>
          total +
          (answers[question.id] === question.correctIndex
            ? CONFIG.difficultyWeights[question.difficulty]
            : 0),
        0,
      );
      return [skill, possibleWeight === 0 ? 0 : (earnedWeight / possibleWeight) * 100];
    }),
  ) as Record<Skill, number>;
}

/** Combine skill percentages using the exam-readiness mix in CONFIG. */
export function calculateOverallScore(skillScores: Record<Skill, number>): number {
  return (
    skillScores.reading * CONFIG.skillWeights.reading +
    skillScores.grammar * CONFIG.skillWeights.grammar +
    skillScores.vocabulary * CONFIG.skillWeights.vocabulary
  );
}

/** Return the overall band, applying the low-skill cap after the overall cutoff. */
export function getReadinessBand(
  overallScore: number,
  skillScores: Record<Skill, number>,
): ReadinessBand {
  if (overallScore < CONFIG.bandThresholds.almostReady) return "Not yet";
  if (
    overallScore >= CONFIG.bandThresholds.ready &&
    Object.values(skillScores).some((score) => score < CONFIG.minimumSkillForReady)
  ) {
    return "Almost ready";
  }
  return overallScore >= CONFIG.bandThresholds.ready ? "Ready" : "Almost ready";
}

/** Rank missed topics by number of wrong answers and return up to three practice tips. */
export function getWeakestTopics(
  questions: readonly Question[],
  answers: Readonly<Record<string, number>>,
): WeakTopic[] {
  const mistakes = new Map<string, number>();
  for (const question of questions) {
    const answer = answers[question.id];
    if (answer !== undefined && answer !== question.correctIndex) {
      mistakes.set(question.topic, (mistakes.get(question.topic) ?? 0) + 1);
    }
  }
  return [...mistakes.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 3)
    .map(([topic, count]) => ({
      topic,
      mistakes: count,
      tip: PRACTICE_TIPS[topic] ?? `Review ${topic.toLowerCase()} with a few short A1 examples.`,
    }));
}