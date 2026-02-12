// Sudoku validation and completion checking

import type { Cell, Puzzle } from './types'

/**
 * Check if a number placement violates Sudoku rules
 * Returns true if the placement creates a conflict
 */
export function hasConflict(grid: Cell[][], row: number, col: number, value: number): boolean {
  // Check row for duplicates
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c].value === value) {
      return true
    }
  }

  // Check column for duplicates
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col].value === value) {
      return true
    }
  }

  // Check 3x3 box for duplicates
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c].value === value) {
        return true
      }
    }
  }

  return false
}

/**
 * Validate entire grid and update cell states
 * Marks cells with conflicts as 'error'
 */
export function validateGrid(grid: Cell[][], solution?: number[][]): void {
  // Reset all non-empty cells to 'filled'
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = grid[row][col]
      if (cell.value !== null) {
        cell.state = 'filled'
      } else {
        cell.state = 'empty'
      }
    }
  }

  // Check for conflicts and mark errors
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = grid[row][col]
      if (cell.value !== null) {
        const violatesRules = hasConflict(grid, row, col, cell.value)
        const violatesSolution = solution ? cell.value !== solution[row][col] : false

        if (violatesRules || violatesSolution) {
          cell.state = 'error'
        }
      }
    }
  }
}

/**
 * Check if a row is complete and correct
 */
export function isRowComplete(grid: Cell[][], row: number): boolean {
  const values = new Set<number>()
  
  for (let col = 0; col < 9; col++) {
    const value = grid[row][col].value
    if (value === null) return false
    if (values.has(value)) return false
    values.add(value)
  }
  
  return values.size === 9
}

/**
 * Check if a column is complete and correct
 */
export function isColumnComplete(grid: Cell[][], col: number): boolean {
  const values = new Set<number>()
  
  for (let row = 0; row < 9; row++) {
    const value = grid[row][col].value
    if (value === null) return false
    if (values.has(value)) return false
    values.add(value)
  }
  
  return values.size === 9
}

/**
 * Check if a 3x3 box is complete and correct
 */
export function isBoxComplete(grid: Cell[][], box: number): boolean {
  const values = new Set<number>()
  const boxRow = Math.floor(box / 3) * 3
  const boxCol = (box % 3) * 3
  
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      const value = grid[r][c].value
      if (value === null) return false
      if (values.has(value)) return false
      values.add(value)
    }
  }
  
  return values.size === 9
}

/**
 * Check if the entire puzzle is solved correctly
 */
export function isPuzzleSolved(grid: Cell[][], solution?: number[][]): boolean {
  if (solution) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col].value !== solution[row][col]) return false
      }
    }
    return true
  }

  // Check all rows
  for (let row = 0; row < 9; row++) {
    if (!isRowComplete(grid, row)) return false
  }
  
  // Check all columns
  for (let col = 0; col < 9; col++) {
    if (!isColumnComplete(grid, col)) return false
  }
  
  // Check all boxes
  for (let box = 0; box < 9; box++) {
    if (!isBoxComplete(grid, box)) return false
  }
  
  return true
}

/**
 * Get all completed rows
 */
export function getCompletedRows(grid: Cell[][]): Set<number> {
  const completed = new Set<number>()
  for (let row = 0; row < 9; row++) {
    const hasError = grid[row].some((cell) => cell.state === 'error')
    if (!hasError && isRowComplete(grid, row)) {
      completed.add(row)
    }
  }
  return completed
}

/**
 * Get all completed columns
 */
export function getCompletedCols(grid: Cell[][]): Set<number> {
  const completed = new Set<number>()
  for (let col = 0; col < 9; col++) {
    let hasError = false
    for (let row = 0; row < 9; row++) {
      if (grid[row][col].state === 'error') {
        hasError = true
        break
      }
    }
    if (!hasError && isColumnComplete(grid, col)) {
      completed.add(col)
    }
  }
  return completed
}

/**
 * Get all completed boxes
 */
export function getCompletedBoxes(grid: Cell[][]): Set<number> {
  const completed = new Set<number>()
  for (let box = 0; box < 9; box++) {
    const boxRow = Math.floor(box / 3) * 3
    const boxCol = (box % 3) * 3
    let hasError = false

    for (let row = boxRow; row < boxRow + 3; row++) {
      for (let col = boxCol; col < boxCol + 3; col++) {
        if (grid[row][col].state === 'error') {
          hasError = true
          break
        }
      }
      if (hasError) break
    }

    if (!hasError && isBoxComplete(grid, box)) {
      completed.add(box)
    }
  }
  return completed
}

/**
 * Check if placing a value would match the solution (for testing purposes)
 * Not used in main game flow per specification
 */
export function matchesSolution(puzzle: Puzzle, row: number, col: number, value: number): boolean {
  return puzzle.solution[row][col] === value
}
