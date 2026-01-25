// Game state management composable

import { ref, computed } from 'vue'
import type { Difficulty, GameState, Move } from './types'
import { generatePuzzle } from './generator'
import { 
  validateGrid, 
  isPuzzleSolved,
  getCompletedRows,
  getCompletedCols,
  getCompletedBoxes
} from './validator'

export function useGame() {
  // Game state
  const gameState = ref<GameState>({
    puzzle: null,
    activeCell: null,
    pencilMode: false,
    history: [],
    completedRows: new Set(),
    completedCols: new Set(),
    completedBoxes: new Set(),
    isSolved: false
  })

  // Computed properties
  const puzzle = computed(() => gameState.value.puzzle)
  const grid = computed(() => gameState.value.puzzle?.grid ?? [])
  const activeCell = computed(() => gameState.value.activeCell)
  const pencilMode = computed(() => gameState.value.pencilMode)
  const canUndo = computed(() => gameState.value.history.length > 0)
  const isSolved = computed(() => gameState.value.isSolved)

  /**
   * Start a new game with selected difficulty
   */
  function newGame(difficulty: Difficulty): void {
    const newPuzzle = generatePuzzle(difficulty)
    
    gameState.value = {
      puzzle: newPuzzle,
      activeCell: null,
      pencilMode: false,
      history: [],
      completedRows: new Set(),
      completedCols: new Set(),
      completedBoxes: new Set(),
      isSolved: false
    }
  }

  /**
   * Select a cell
   */
  function selectCell(row: number, col: number): void {
    gameState.value.activeCell = { row, col }
  }

  /**
   * Clear active cell selection
   */
  function clearSelection(): void {
    gameState.value.activeCell = null
  }

  /**
   * Toggle pencil mode
   */
  function togglePencilMode(): void {
    gameState.value.pencilMode = !gameState.value.pencilMode
  }

  /**
   * Remove pencil notes from related cells
   */
  function removeNotesFromRelatedCells(row: number, col: number, value: number): void {
    const state = gameState.value
    if (!state.puzzle) return

    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3)
    const boxRow = Math.floor(box / 3) * 3
    const boxCol = (box % 3) * 3

    // Remove from row
    for (let c = 0; c < 9; c++) {
      state.puzzle.grid[row][c].notes.delete(value)
    }

    // Remove from column
    for (let r = 0; r < 9; r++) {
      state.puzzle.grid[r][col].notes.delete(value)
    }

    // Remove from box
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        state.puzzle.grid[r][c].notes.delete(value)
      }
    }
  }

  /**
   * Place a number in the active cell
   */
  function placeNumber(value: number): void {
    const state = gameState.value
    if (!state.puzzle || !state.activeCell) return

    const { row, col } = state.activeCell
    const cell = state.puzzle.grid[row][col]

    // Don't allow editing given cells
    if (cell.given) return

    if (state.pencilMode) {
      // Toggle pencil note
      const previousNotes = new Set(cell.notes)
      
      if (cell.notes.has(value)) {
        cell.notes.delete(value)
      } else {
        cell.notes.add(value)
      }

      // Record move
      const move: Move = {
        cell: { row, col },
        previousValue: cell.value,
        nextValue: cell.value,
        previousNotes,
        nextNotes: new Set(cell.notes),
        timestamp: Date.now()
      }
      state.history.push(move)
    } else {
      // Place number
      const previousValue = cell.value
      const previousNotes = new Set(cell.notes)

      cell.value = value
      cell.notes.clear()

      // Remove this number from pencil notes in related cells
      removeNotesFromRelatedCells(row, col, value)

      // Record move
      const move: Move = {
        cell: { row, col },
        previousValue,
        nextValue: value,
        previousNotes,
        nextNotes: new Set(),
        timestamp: Date.now()
      }
      state.history.push(move)

      // Validate and check completion
      updateGameState()
    }
  }

  /**
   * Erase the active cell
   */
  function eraseCell(): void {
    const state = gameState.value
    if (!state.puzzle || !state.activeCell) return

    const { row, col } = state.activeCell
    const cell = state.puzzle.grid[row][col]

    // Don't allow erasing given cells
    if (cell.given) return

    const previousValue = cell.value
    const previousNotes = new Set(cell.notes)

    cell.value = null
    cell.notes.clear()

    // Record move
    const move: Move = {
      cell: { row, col },
      previousValue,
      nextValue: null,
      previousNotes,
      nextNotes: new Set(),
      timestamp: Date.now()
    }
    state.history.push(move)

    // Validate
    updateGameState()
  }

  /**
   * Undo last move
   */
  function undo(): void {
    const state = gameState.value
    if (!state.puzzle || state.history.length === 0) return

    const move = state.history.pop()!
    const { row, col } = move.cell
    const cell = state.puzzle.grid[row][col]

    // Restore previous state
    cell.value = move.previousValue
    cell.notes = new Set(move.previousNotes)

    // Validate
    updateGameState()
  }

  /**
   * Update game state after a move
   */
  function updateGameState(): void {
    const state = gameState.value
    if (!state.puzzle) return

    // Validate grid
    validateGrid(state.puzzle.grid, state.puzzle.solution)

    // Update completed sections
    const newCompletedRows = getCompletedRows(state.puzzle.grid)
    const newCompletedCols = getCompletedCols(state.puzzle.grid)
    const newCompletedBoxes = getCompletedBoxes(state.puzzle.grid)

    state.completedRows = newCompletedRows
    state.completedCols = newCompletedCols
    state.completedBoxes = newCompletedBoxes

    // Check if puzzle is solved
    state.isSolved = isPuzzleSolved(state.puzzle.grid, state.puzzle.solution)
  }

  /**
   * Get cells in the same row, column, or box as the active cell
   */
  function getRelatedCells(): Set<string> {
    const related = new Set<string>()
    const state = gameState.value
    
    if (!state.activeCell) return related

    const { row, col } = state.activeCell
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3)

    // Add row cells
    for (let c = 0; c < 9; c++) {
      related.add(`${row}-${c}`)
    }

    // Add column cells
    for (let r = 0; r < 9; r++) {
      related.add(`${r}-${col}`)
    }

    // Add box cells
    const boxRow = Math.floor(box / 3) * 3
    const boxCol = (box % 3) * 3
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        related.add(`${r}-${c}`)
      }
    }

    return related
  }

  /**
   * Get cells with the same number as the active cell
   */
  function getSameNumberCells(): Set<string> {
    const same = new Set<string>()
    const state = gameState.value
    
    if (!state.puzzle || !state.activeCell) return same

    const { row, col } = state.activeCell
    const targetValue = state.puzzle.grid[row][col].value
    
    if (targetValue === null) return same

    // Find all cells with same value
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (state.puzzle.grid[r][c].value === targetValue) {
          same.add(`${r}-${c}`)
        }
      }
    }

    return same
  }

  return {
    // State
    gameState,
    puzzle,
    grid,
    activeCell,
    pencilMode,
    canUndo,
    isSolved,

    // Actions
    newGame,
    selectCell,
    clearSelection,
    togglePencilMode,
    placeNumber,
    eraseCell,
    undo,

    // Helpers
    getRelatedCells,
    getSameNumberCells
  }
}
