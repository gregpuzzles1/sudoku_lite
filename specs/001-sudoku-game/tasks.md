---

description: "Task list for Modern Sudoku Game Website"
---

# Tasks: Modern Sudoku Game Website

**Input**: Design documents from `/specs/001-sudoku-game/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested in the feature specification, so test tasks are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Vue 3 + TypeScript Vite app in package.json, vite.config.ts, tsconfig.json, src/main.ts, src/App.vue, index.html
- [X] T002 Create planned project folders and placeholders in src/components/, src/game/, src/styles/, src/assets/, tests/
- [X] T003 [P] Configure linting/formatting scripts and rules in .eslintrc.cjs, .prettierrc, package.json
- [X] T004 [P] Add GitHub Pages deployment workflow in .github/workflows/deploy.yml
- [X] T005 [P] Create README.md with project overview, local dev steps, and deployment notes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Define core game types and difficulty ranges in src/game/types.ts
- [X] T007 Implement solver and uniqueness checker in src/game/solver.ts (depends on T006)
- [X] T008 Implement puzzle generator with clue-count ranges in src/game/generator.ts (depends on T006, T007)
- [X] T009 Implement rule validator and completion checks in src/game/validator.ts (depends on T006)
- [X] T010 Create game state/composable with move history and selection state in src/game/useGame.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Start and Play a Game (Priority: P1) 🎯 MVP

**Goal**: A user can start a new game and play with immediate correctness feedback.

**Independent Test**: Load the page, select a difficulty, see a grid, select a cell, enter numbers (mouse/touch/keyboard), and see correct vs. incorrect color feedback.

### Implementation for User Story 1

- [X] T011 [P] [US1] Build difficulty dropdown UI in src/components/DifficultyMenu.vue
- [X] T012 [US1] Wire "New Game" control and difficulty heading in src/App.vue
- [X] T013 [P] [US1] Create Sudoku grid layout component in src/components/SudokuGrid.vue
- [X] T014 [P] [US1] Create cell rendering component with given/empty states in src/components/SudokuCell.vue
- [X] T015 [US1] Render puzzle grid and selection state in src/App.vue and src/components/SudokuGrid.vue
- [X] T016 [P] [US1] Add number row input UI in src/components/NumberRow.vue
- [X] T017 [US1] Implement number entry (mouse/touch/keyboard) and rule validation in src/App.vue and src/game/validator.ts
- [X] T018 [P] [US1] Create win modal component in src/components/WinModal.vue
- [X] T019 [US1] Trigger win modal + confetti on completion in src/App.vue and src/components/WinModal.vue

**Checkpoint**: User Story 1 is functional and independently testable

---

## Phase 4: User Story 2 - Use Pencil, Undo, and Erase (Priority: P2)

**Goal**: Users can add pencil notes, undo actions, and erase entries.

**Independent Test**: Toggle pencil mode, add/remove notes, erase a cell, and undo the last action.

### Implementation for User Story 2

- [X] T020 [US2] Build control buttons UI in src/components/ControlBar.vue
- [X] T021 [US2] Render pencil notes in cells using 3x3 mini-grid in src/components/SudokuCell.vue
- [X] T022 [US2] Implement pencil mode entry logic in src/game/useGame.ts and src/App.vue
- [X] T023 [US2] Implement undo stack and hook into UI in src/game/useGame.ts and src/components/ControlBar.vue
- [X] T024 [US2] Implement erase behavior and protect given cells in src/game/useGame.ts

**Checkpoint**: User Stories 1 and 2 both function independently

---

## Phase 5: User Story 3 - Visual Guidance and Completion Effects (Priority: P2)

**Goal**: Active cell, related regions, and completion animations provide clear visual guidance.

**Independent Test**: Select cells to see row/column/box highlights; complete a row/column/box and observe the domino animation.

### Implementation for User Story 3

- [X] T025 [US3] Add active cell + row/column/box highlight states in src/components/SudokuGrid.vue and src/styles/main.css
- [X] T026 [US3] Add same-number highlight logic in src/components/SudokuGrid.vue
- [X] T027 [US3] Detect completed rows/cols/boxes in src/game/validator.ts and trigger domino animation in src/components/SudokuGrid.vue
- [X] T028 [US3] Style correct/incorrect numbers and highlights in src/components/SudokuCell.vue and src/styles/main.css

**Checkpoint**: User Stories 1–3 are functional and independently testable

---

## Phase 6: User Story 4 - Learn and Explore (Priority: P3)

**Goal**: Provide rules/history content and footer links.

**Independent Test**: Scroll below the game area to confirm rules/history text and a footer with dynamic year and links.

### Implementation for User Story 4

- [X] T029 [US4] Add rules and history content sections in src/App.vue
- [X] T030 [US4] Implement footer with dynamic year and links in src/App.vue
- [X] T031 [US4] Style content sections and footer responsively in src/styles/main.css

**Checkpoint**: All user stories are functional and independently testable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T032 [P] Improve generator performance and guard against excessive retries in src/game/generator.ts
- [X] T033 [P] Add accessibility labels and focus states in src/components/DifficultyMenu.vue, src/components/ControlBar.vue, src/components/NumberRow.vue, src/styles/main.css
- [X] T034 [P] Add lightweight link check and accessibility notes in README.md
- [X] T035 [P] Add HTML/CSS validation checks (document commands) in README.md
- [X] T036 [P] Add no-JS fallback messaging in index.html
- [X] T037 [P] Verify keyboard/touch/mouse input behaviors and document test steps in README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies (Graph)

- **US1** → foundational grid + validation only (no story dependencies)
- **US2** → builds on US1 interaction patterns
- **US3** → builds on US1 grid rendering + validation feedback
- **US4** → independent of US1–US3, can be implemented after Foundational

Suggested order: **US1 → (US2, US3 in parallel) → US4 → Polish**

### Parallel Opportunities

- Setup tasks marked [P] can run in parallel
- After Foundational, component shells for US1 can be built in parallel
- US2 and US3 can proceed in parallel after US1 baseline is in place
- Polish tasks are independent and can run in parallel

---

## Parallel Example: User Story 1

- [ ] T011 [P] [US1] Build difficulty dropdown UI in src/components/DifficultyMenu.vue
- [ ] T013 [P] [US1] Create Sudoku grid layout component in src/components/SudokuGrid.vue
- [ ] T014 [P] [US1] Create cell rendering component with given/empty states in src/components/SudokuCell.vue
- [ ] T016 [P] [US1] Add number row input UI in src/components/NumberRow.vue
- [ ] T018 [P] [US1] Create win modal component in src/components/WinModal.vue

---

## Parallel Example: User Story 2

- [ ] T020 [US2] Build control buttons UI in src/components/ControlBar.vue
- [ ] T021 [US2] Render pencil notes in cells using 3x3 mini-grid in src/components/SudokuCell.vue
- [ ] T023 [US2] Implement undo stack and hook into UI in src/game/useGame.ts and src/components/ControlBar.vue

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and validate** the game can be played end-to-end

### Incremental Delivery

1. Setup + Foundational
2. US1 → validate
3. US2 + US3 → validate independently
4. US4 → validate content and footer
5. Polish

### Parallel Team Strategy

- Developer A: US1 integration + game loop
- Developer B: US2 pencil/undo/erase
- Developer C: US3 highlights/animations
- Developer D: US4 content + footer

---

## Notes

- [P] tasks = different files, no dependencies
- Each user story remains independently testable
- Commit after each task or logical group
- Avoid cross-story coupling that blocks incremental delivery
