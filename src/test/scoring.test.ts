import { describe, expect, it } from "vitest";

import { QUESTIONS, type Question, type Skill } from "@/data/questions";
import {
  calculateOverallScore,
  calculateSkillScores,
  getReadinessBand,
  getWeakestTopics,
} from "@/lib/scoring";

const fullScores: Record<Skill, number> = { reading: 100, grammar: 100, vocabulary: 100 };

function vocabularyQuestion(id: string, difficulty: 1 | 2 | 3, correctIndex = 0): Question {
  return {
    id,
    skill: "vocabulary",
    topic: "Everyday words",
    difficulty,
    text: "Choose the right answer.",
    options: ["A", "B", "C", "D"],
    correctIndex,
  };
}

describe("exam readiness scoring", () => {
  it("weights correct answers by difficulty within each skill", () => {
    const questions = [vocabularyQuestion("easy", 1), vocabularyQuestion("hard", 3)];
    const scores = calculateSkillScores(questions, { easy: 1, hard: 0 });
    expect(scores.vocabulary).toBe(75);
  });

  it("weights reading 40%, grammar 30%, and vocabulary 30% overall", () => {
    expect(calculateOverallScore({ reading: 100, grammar: 50, vocabulary: 0 })).toBe(55);
  });

  it("sets Ready at 80% when every skill reaches 50%", () => {
    expect(getReadinessBand(80, fullScores)).toBe("Ready");
  });

  it("sets Almost ready from 60% through 79%", () => {
    expect(getReadinessBand(60, fullScores)).toBe("Almost ready");
    expect(getReadinessBand(79, fullScores)).toBe("Almost ready");
  });

  it("sets Not yet below 60%", () => {
    expect(getReadinessBand(59.99, fullScores)).toBe("Not yet");
  });

  it("caps Ready at Almost ready when any skill is below 50%", () => {
    expect(getReadinessBand(90, { reading: 49, grammar: 100, vocabulary: 100 })).toBe("Almost ready");
  });

  it("returns up to three missed topics with a one-line practice tip", () => {
    const topics = getWeakestTopics(QUESTIONS.slice(0, 4), {
      "vocab-bread": 0,
      "vocab-sister": 0,
      "vocab-half-three": 1,
      "vocab-pharmacy": 0,
    });
    expect(topics).toHaveLength(3);
    expect(topics[0]?.topic).toBe("Everyday words");
    expect(topics[0]?.tip.length).toBeGreaterThan(0);
  });
});

describe("starter question bank", () => {
  it("contains 12 questions with four for each requested skill", () => {
    expect(QUESTIONS).toHaveLength(12);
    expect(QUESTIONS.filter((question) => question.skill === "vocabulary")).toHaveLength(4);
    expect(QUESTIONS.filter((question) => question.skill === "grammar")).toHaveLength(4);
    expect(QUESTIONS.filter((question) => question.skill === "reading")).toHaveLength(4);
  });

  it("gives every question four options", () => {
    expect(QUESTIONS.every((question) => question.options.length === 4)).toBe(true);
  });
});