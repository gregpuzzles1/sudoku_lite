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
 * Validate that the current grid has no conflicts among filled cells
 */
function isValidInitialGrid(grid: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = grid[row][col]
      if (value === 0) continue

      grid[row][col] = 0
      const valid = isValid(grid, row, col, value)
      grid[row][col] = value

      if (!valid) return false
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
  if (!isValidInitialGrid(grid)) return false

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

  if (!isValidInitialGrid(gridCopy)) return false
  
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
  const base = 3
  const side = base * base

  const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const pattern = (row: number, col: number): number =>
    (base * (row % base) + Math.floor(row / base) + col) % side

  const rowsBase = [...Array(base).keys()]
  const colsBase = [...Array(base).keys()]

  const rowBands = shuffle(rowsBase)
  const colBands = shuffle(colsBase)

  const rows = rowBands.flatMap((band) =>
    shuffle(rowsBase).map((r) => band * base + r)
  )
  const cols = colBands.flatMap((band) =>
    shuffle(colsBase).map((c) => band * base + c)
  )

  const nums = shuffle([...Array(side).keys()]).map((n) => n + 1)

  const grid: number[][] = Array(side)
    .fill(0)
    .map(() => Array(side).fill(0))

  for (let r = 0; r < side; r++) {
    for (let c = 0; c < side; c++) {
      grid[r][c] = nums[pattern(rows[r], cols[c])]
    }
  }

  return grid
}
