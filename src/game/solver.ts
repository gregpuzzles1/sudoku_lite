// Sudoku solver using backtracking algorithm

/**
 * Check if placing a number at position (row, col) is valid
 */
function isValid(grid: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (grid[row][c] === num) return false
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num) return false
    }
  }

  return true
}

/**
 * Find next empty cell (returns null if grid is complete)
 */
function findEmptyCell(grid: number[][]): { row: number; col: number } | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        return { row, col }
      }
    }
  }
  return null
}

/**
 * Solve a Sudoku puzzle using backtracking
 * Modifies the grid in place
 * Returns true if solvable, false otherwise
 */
export function solve(grid: number[][]): boolean {
  const emptyCell = findEmptyCell(grid)
  
  // If no empty cells, puzzle is solved
  if (!emptyCell) return true

  const { row, col } = emptyCell

  // Try numbers 1-9
  for (let num = 1; num <= 9; num++) {
    if (isValid(grid, row, col, num)) {
      grid[row][col] = num

      // Recursively try to solve
      if (solve(grid)) {
        return true
      }

      // Backtrack if no solution found
      grid[row][col] = 0
    }
  }

  return false
}

/**
 * Check if a puzzle has a unique solution
 * Returns true if exactly one solution exists
 */
export function hasUniqueSolution(grid: number[][]): boolean {
  // Create a copy to avoid modifying original
  const gridCopy = grid.map(row => [...row])
  
  let solutionCount = 0
  const maxSolutions = 2 // Only need to find 2 to know it's not unique

  function countSolutions(g: number[][]): void {
    if (solutionCount >= maxSolutions) return

    const emptyCell = findEmptyCell(g)
    
    if (!emptyCell) {
      solutionCount++
      return
    }

    const { row, col } = emptyCell

    for (let num = 1; num <= 9; num++) {
      if (isValid(g, row, col, num)) {
        g[row][col] = num
        countSolutions(g)
        g[row][col] = 0

        if (solutionCount >= maxSolutions) return
      }
    }
  }

  countSolutions(gridCopy)
  return solutionCount === 1
}

/**
 * Generate a complete valid Sudoku grid
 * Uses randomized backtracking for variety
 */
export function generateCompleteSolution(): number[][] {
  const grid: number[][] = Array(9).fill(0).map(() => Array(9).fill(0))

  function fillGrid(row: number, col: number): boolean {
    // Move to next row if at end of column
    if (col === 9) {
      row++
      col = 0
    }

    // If all rows filled, success
    if (row === 9) return true

    // Generate random order of numbers 1-9
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
    }

    // Try each number
    for (const num of numbers) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num

        if (fillGrid(row, col + 1)) {
          return true
        }

        grid[row][col] = 0
      }
    }

    return false
  }

  fillGrid(0, 0)
  return grid
}
