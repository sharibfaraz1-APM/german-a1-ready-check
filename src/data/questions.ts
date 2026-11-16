export type Skill = "vocabulary" | "grammar" | "reading";

export interface Question {
  id: string;
  skill: Skill;
  topic: string;
  difficulty: 1 | 2 | 3;
  text: string;
  options: readonly [string, string, string, string];
  correctIndex: number;
  passage?: string;
}

const noteFromSam =
  "Liebe Frau Müller, ich kann heute nicht zum Deutschkurs kommen. Ich habe einen Arzttermin um 10 Uhr. Können wir morgen sprechen? Viele Grüße, Sam";

// These are starter questions. Replace their text and answers with your final question bank.
export const QUESTIONS = [
  {
    id: "vocab-bread",
    skill: "vocabulary",
    topic: "Everyday words",
    difficulty: 1,
    text: "What does “Brot” mean?",
    options: ["Milk", "Bread", "Water", "Cheese"],
    correctIndex: 1,
  },
  {
    id: "vocab-sister",
    skill: "vocabulary",
    topic: "Family",
    difficulty: 1,
    text: "Who is your “Schwester”?",
    options: ["Your brother", "Your mother", "Your sister", "Your daughter"],
    correctIndex: 2,
  },
  {
    id: "vocab-half-three",
    skill: "vocabulary",
    topic: "Numbers & time",
    difficulty: 2,
    text: "What time is “halb drei”?",
    options: ["2:30", "3:30", "2:15", "3:15"],
    correctIndex: 0,
  },
  {
    id: "vocab-pharmacy",
    skill: "vocabulary",
    topic: "Places in town",
    difficulty: 2,
    text: "Where do you go to buy medicine?",
    options: ["Zum Bahnhof", "Zur Apotheke", "Zum Kino", "Zur Schule"],
    correctIndex: 1,
  },
  {
    id: "grammar-article",
    skill: "grammar",
    topic: "Articles",
    difficulty: 1,
    text: "Er kauft ___ Apfel.",
    options: ["eine", "einen", "ein", "der"],
    correctIndex: 1,
  },
  {
    id: "grammar-verb",
    skill: "grammar",
    topic: "Verb forms",
    difficulty: 1,
    text: "Wir ___ aus Kanada.",
    options: ["kommt", "komme", "kommen", "kommst"],
    correctIndex: 2,
  },
  {
    id: "grammar-negation",
    skill: "grammar",
    topic: "Negation",
    difficulty: 2,
    text: "Ich ___ heute keine Zeit.",
    options: ["bin", "habe", "hat", "sein"],
    correctIndex: 1,
  },
  {
    id: "grammar-question",
    skill: "grammar",
    topic: "Questions & requests",
    difficulty: 3,
    text: "___ du mir bitte helfen?",
    options: ["Kann", "Bist", "Hast", "Macht"],
    correctIndex: 0,
  },
  {
    id: "reading-who",
    skill: "reading",
    topic: "Short messages",
    difficulty: 1,
    text: "Who wrote the message?",
    options: ["Frau Müller", "Sam", "The doctor", "A teacher"],
    correctIndex: 1,
    passage: noteFromSam,
  },
  {
    id: "reading-appointment",
    skill: "reading",
    topic: "Appointments",
    difficulty: 1,
    text: "What does Sam have at 10 o’clock?",
    options: ["A German lesson", "A train", "A doctor’s appointment", "A meeting"],
    correctIndex: 2,
    passage: noteFromSam,
  },
  {
    id: "reading-when",
    skill: "reading",
    topic: "Days & plans",
    difficulty: 2,
    text: "When can Sam and Frau Müller speak?",
    options: ["Today", "Tomorrow", "On Sunday", "At 10 o’clock"],
    correctIndex: 1,
    passage: noteFromSam,
  },
  {
    id: "reading-reason",
    skill: "reading",
    topic: "Finding details",
    difficulty: 3,
    text: "Why can’t Sam come to the course today?",
    options: ["Sam is at work", "Sam is travelling", "Sam has a doctor’s appointment", "Sam is ill in bed"],
    correctIndex: 2,
    passage: noteFromSam,
  },
] satisfies readonly Question[];