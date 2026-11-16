# Am I exam-ready?

Build a mobile-first, browser-only German A1 readiness check on the home page.

## What it includes
- A welcoming start screen, then 12 one-at-a-time multiple-choice questions with progress and answer selection.
- A results screen with difficulty-weighted skill scores, weighted overall band, weakest-topic practice tips, scope note, calculation details, and retake.
- A question bank with 12 editable placeholders and a pure scoring module whose weights and thresholds live together in `CONFIG`.

## Implementation
- Keep quiz state local to the page; add no account, backend, or persistence.
- Use the existing TanStack route and UI patterns, accessible large tap targets, and semantic design tokens.
- Add focused tests for scoring rules and the 12-question distribution; verify start, quiz, results, and retake in the browser.
