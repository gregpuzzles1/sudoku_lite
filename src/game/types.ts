// Core types for Sudoku game

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master' | 'Extreme'

export type CellState = 'empty' | 'filled' | 'error'

export interface Cell {
  row: number // 0-8
  col: number // 0-8
  box: number // 0-8
  value: number | null // 1-9 or null
  given: boolean // true if pre-filled
  notes: Set<number> // pencil marks (1-9)
  state: CellState
}

export interface Move {
  cell: { row: number; col: number }
  previousValue: number | null
  nextValue: number | null
  previousNotes: Set<number>
  nextNotes: Set<number>
  timestamp: number
}

export interface Puzzle {
  id: string
  difficulty: Difficulty
  grid: Cell[][]
  solution: number[][]
  cluesCount: number
}

export interface GameState {
  puzzle: Puzzle | null
  activeCell: { row: number; col: number } | null
  pencilMode: boolean
  history: Move[]
  completedRows: Set<number>
  completedCols: Set<number>
  completedBoxes: Set<number>
  isSolved: boolean
  strikeCount: number
  strikeLimit: number
  strikeRound: 1 | 2
  isStrikeOut: boolean
  isGameOver: boolean
}

// Difficulty configuration: clue count ranges
export const DIFFICULTY_CONFIG: Record<Difficulty, { min: number; max: number }> = {
  Beginner: { min: 40, max: 45 },
  Intermediate: { min: 35, max: 40 },
  Advanced: { min: 30, max: 35 },
  Expert: { min: 27, max: 30 },
  Master: { min: 24, max: 27 },
  Extreme: { min: 22, max: 24 }
}

// Helper to calculate box index from row/col
export function getBox(row: number, col: number): number {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3)
}

// Helper to create empty cell
export function createCell(row: number, col: number): Cell {
  return {
    row,
    col,
    box: getBox(row, col),
    value: null,
    given: false,
    notes: new Set(),
    state: 'empty'
  }
}
