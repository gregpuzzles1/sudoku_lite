# Research: Modern Sudoku Game Website

## Decisions

### Frontend framework
- **Decision**: Use Vue 3 with TypeScript.
- **Rationale**: Vue 3 provides reactive UI updates with a clean component model; TypeScript improves correctness for game state and solver logic.
- **Alternatives considered**: React + TypeScript, Svelte.

### Build tool
- **Decision**: Use Vite.
- **Rationale**: Fast dev server and efficient static builds suitable for GitHub Pages.
- **Alternatives considered**: Vue CLI, Webpack.

### Puzzle generation approach
- **Decision**: Generate a full valid grid via backtracking, then remove cells while maintaining a single unique solution and meeting clue-count ranges.
- **Rationale**: Ensures valid puzzles with controlled difficulty and uniqueness.
- **Alternatives considered**: Pre-generated puzzle library, random fill with constraint checking only.

### Difficulty tuning
- **Decision**: Use explicit clue-count ranges per difficulty (Beginner 40–45, Intermediate 35–40, Advanced 30–35, Expert 27–30, Master 24–27, Extreme 22–24), and verify uniqueness after each removal.
- **Rationale**: Provides a consistent, measurable baseline for difficulty while keeping algorithm straightforward.
- **Alternatives considered**: Solver-based grading only.

### Validation feedback
- **Decision**: Mark entries as incorrect only if they violate row/column/box rules (not based on hidden solution).
- **Rationale**: Matches standard Sudoku UX and avoids revealing solution prematurely.
- **Alternatives considered**: Immediate solution-based correctness checks.

### Confetti effect
- **Decision**: Use a lightweight confetti library (e.g., canvas-confetti).
- **Rationale**: Provides a polished finish with minimal code and bundle size.
- **Alternatives considered**: Pure CSS animation, custom canvas implementation.

### State management
- **Decision**: Use Vue’s built-in reactivity (composition API) without a global store.
- **Rationale**: State is localized to a single page and a single puzzle session.
- **Alternatives considered**: Pinia store.

### Testing strategy
- **Decision**: Unit tests for generator/solver/validator with Vitest; smoke e2e tests with Playwright.
- **Rationale**: Ensures puzzle correctness and protects key interaction flows.
- **Alternatives considered**: Unit tests only; no e2e tests.

### Storage
- **Decision**: No persistence (in-memory state only).
- **Rationale**: Spec does not require saving games; keeps scope minimal for static hosting.
- **Alternatives considered**: localStorage persistence; DynamoDB (future only).
