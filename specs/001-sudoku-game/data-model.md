# Data Model: Modern Sudoku Game Website

## Entities

### Puzzle
- **Fields**:
  - `id`: string (generated per new game session)
  - `difficulty`: enum (Beginner, Intermediate, Advanced, Expert, Master, Extreme)
  - `grid`: 9x9 array of `Cell`
  - `solution`: 9x9 array of numbers (1–9)
  - `cluesCount`: number
- **Relationships**: Puzzle contains 81 `Cell` entities
- **Validation**:
  - Each row/column/box in `solution` contains numbers 1–9 exactly once
  - `grid` is derived from `solution` with removed entries based on difficulty
  - Puzzle has a single unique solution

### Cell
- **Fields**:
  - `row`: 0–8
  - `col`: 0–8
  - `box`: 0–8
  - `value`: number | null
  - `given`: boolean (true if pre-filled)
  - `notes`: set of numbers (1–9)
  - `state`: enum (`empty`, `filled`, `error`)
- **Validation**:
  - `given` cells are immutable
  - `notes` only allowed when `value` is null
  - `state=error` only when a rule conflict exists

### Move
- **Fields**:
  - `cell`: { row, col }
  - `previousValue`: number | null
  - `nextValue`: number | null
  - `previousNotes`: set<number>
  - `nextNotes`: set<number>
  - `timestamp`: number
- **Relationships**: Move references a `Cell` in a `Puzzle`

### GameState
- **Fields**:
  - `activeCell`: { row, col } | null
  - `pencilMode`: boolean
  - `history`: list of `Move`
  - `completedRows`: set of row indices
  - `completedCols`: set of col indices
  - `completedBoxes`: set of box indices
  - `isSolved`: boolean

## State Transitions

- **New Game**: generate Puzzle → set `GameState` defaults
- **Select Cell**: update `activeCell`
- **Place Number**: update `Cell.value`, push `Move`, revalidate conflicts
- **Add/Remove Note**: update `Cell.notes`, push `Move`
- **Undo**: pop `Move`, restore prior `Cell` state
- **Solve Section**: update completed sets → trigger animation
- **Solve Puzzle**: set `isSolved=true` → show win modal
