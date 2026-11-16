# German A1 Ready Check

Build a mobile-first web app called "Am I exam-ready?" for learners who have

finished A1 German and are about to book the Goethe or ÖSD A1 exam.

Flow: 1) Start screen: one sentence on what it does, "about 5 minutes", Start button.

2) Quiz: 12 multiple-choice questions, one per screen, progress bar.

3) Results screen.

Questions live in src/data/questions.ts. Each has: id, skill

('vocabulary' | 'grammar' | 'reading'), topic (e.g. 'articles', 'verb forms',

'numbers & time'), difficulty (1-3), text, options (4), correctIndex, and an

optional passage for reading. Use 12 placeholder questions for now (4 per skill);

I will replace them.

Scoring lives in src/lib/scoring.ts as pure functions. Put ALL weights and

thresholds in one exported CONFIG object at the top, with comments.

- Skill score = percent correct, weighted by difficulty.

- Overall = reading 40%, grammar 30%, vocabulary 30%.

- Bands: Ready >= 80, Almost ready 60-79, Not yet < 60.

- If any skill is below 50%, cap the band at "Almost ready".

Results screen: the overall band with a plain-language message, a bar for each

skill, the 2-3 weakest topics (from wrong answers) each with a one-line practice

tip, a note that this check covers reading, grammar and vocabulary only (not

listening, speaking or writing) and is an estimate, a "How is this calculated?"

expandable section, and a Retake button.

No login, no backend, everything runs in the browser. Simple clean design, large

tap targets, readable on a phone. Keep the code simple and well commented.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://german-a1-ready-check.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1e674527-d3c2-4951-b59a-8a3a1472dd15).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
