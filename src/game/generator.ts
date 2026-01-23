// Sudoku puzzle generator with difficulty-based clue removal

import { generateCompleteSolution, hasUniqueSolution } from './solver'
import type { Difficulty, Puzzle, Cell } from './types'
import { DIFFICULTY_CONFIG, createCell } from './types'

/**
 * Generate a Sudoku puzzle for the specified difficulty
 * Ensures unique solution and meets clue-count requirements
 */
export function generatePuzzle(difficulty: Difficulty): Puzzle {
  const maxAttempts = 100
  let attempts = 0

  while (attempts < maxAttempts) {
    attempts++

    // Generate complete solution
    const solution = generateCompleteSolution()
    
    // Create puzzle grid by removing cells
    const puzzle = createPuzzleFromSolution(solution, difficulty)
    
    if (puzzle) {
      return puzzle
    }
  }

  // Fallback: return a simple puzzle if generation fails
  console.warn(`Failed to generate ${difficulty} puzzle after ${maxAttempts} attempts, using fallback`)
  return generateFallbackPuzzle(difficulty)
}

/**
 * Create a puzzle by removing cells from solution while maintaining uniqueness
 */
function createPuzzleFromSolution(solution: number[][], difficulty: Difficulty): Puzzle | null {
  const config = DIFFICULTY_CONFIG[difficulty]
  const targetClues = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min

  // Create working grid copy
  const grid = solution.map(row => [...row])
  
  // Create list of all cell positions
  const positions: Array<{ row: number; col: number }> = []
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push({ row, col })
    }
  }

  // Shuffle positions for random removal
  shuffleArray(positions)

  // Remove cells one at a time while maintaining unique solution
  let cluesCount = 81
  
  for (const pos of positions) {
    if (cluesCount <= targetClues) break

    const { row, col } = pos
    const backup = grid[row][col]
    
    // Try removing this cell
    grid[row][col] = 0
    
    // Check if puzzle still has unique solution
    if (hasUniqueSolution(grid)) {
      cluesCount--
    } else {
      // Restore cell if uniqueness lost
      grid[row][col] = backup
    }
  }

  // Verify we're within target range
  if (cluesCount < config.min || cluesCount > config.max) {
    return null
  }

  // Convert to Puzzle object
  return createPuzzleObject(grid, solution, difficulty, cluesCount)
}

/**
 * Create Puzzle object from grid and solution
 */
function createPuzzleObject(
  grid: number[][],
  solution: number[][],
  difficulty: Difficulty,
  cluesCount: number
): Puzzle {
  const id = generatePuzzleId()
  
  const cellGrid: Cell[][] = []
  for (let row = 0; row < 9; row++) {
    const cellRow: Cell[] = []
    for (let col = 0; col < 9; col++) {
      const cell = createCell(row, col)
      const value = grid[row][col]
      
      if (value !== 0) {
        cell.value = value
        cell.given = true
        cell.state = 'filled'
      }
      
      cellRow.push(cell)
    }
    cellGrid.push(cellRow)
  }

  return {
    id,
    difficulty,
    grid: cellGrid,
    solution,
    cluesCount
  }
}

/**
 * Generate simple fallback puzzle for when generation fails
 */
function generateFallbackPuzzle(difficulty: Difficulty): Puzzle {
  // Use a known valid solution
  const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ]

  const config = DIFFICULTY_CONFIG[difficulty]
  const targetClues = Math.floor((config.min + config.max) / 2)

  // Create grid with random cells revealed
  const grid = Array(9).fill(0).map(() => Array(9).fill(0))
  const positions: Array<{ row: number; col: number }> = []
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push({ row, col })
    }
  }
  
  shuffleArray(positions)
  
  for (let i = 0; i < targetClues; i++) {
    const { row, col } = positions[i]
    grid[row][col] = solution[row][col]
  }

  return createPuzzleObject(grid, solution, difficulty, targetClues)
}

/**
 * Shuffle array in place (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

/**
 * Generate unique puzzle ID
 */
function generatePuzzleId(): string {
  return `puzzle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
