<template>
  <div id="app">
    <header class="app-header">
      <div class="header-left">
        <h1 class="app-title">
          Sudoku Lite
        </h1>
      </div>
      <div class="header-controls">
        <div
          id="difficulty-select"
          ref="difficultyMenuRef"
          class="difficulty-menu"
          @focusout="handleDifficultyFocusOut"
        >
          <button
            type="button"
            class="new-game-select"
            :disabled="isGenerating"
            :aria-expanded="showDifficultyMenu"
            aria-haspopup="listbox"
            @click="toggleDifficultyMenu"
          >
            {{ isGenerating ? 'Generating...' : 'New Game' }}
          </button>
          <ul
            v-if="showDifficultyMenu"
            class="difficulty-options"
            role="listbox"
            aria-label="Difficulty levels"
          >
            <li
              v-for="difficulty in difficultyOptions"
              :key="difficulty"
              role="option"
              :aria-selected="selectedDifficulty === difficulty"
            >
              <button
                type="button"
                class="difficulty-option"
                @click="handleDifficultySelect(difficulty)"
              >
                {{ difficulty }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <main class="app-main" @click.self="clearSelection">

      <div class="game-area">
        <div class="grid-wrapper">
          <div
            v-if="puzzle && selectedDifficulty"
            class="difficulty-label"
            aria-live="polite"
          >
            {{ selectedDifficulty }}
          </div>
          <div
            v-if="puzzle"
            class="strike-label"
            aria-live="polite"
          >
            {{ strikeText }}
          </div>
          <div
            v-if="showProgressTooltip"
            class="progress-tooltip"
            role="status"
            aria-live="polite"
          >
            <span class="tooltip-emoji">😊</span>
            <span class="tooltip-text">{{ progressTooltip }}</span>
          </div>
          <SudokuGrid
            :grid="gridToRender"
            :active-cell="activeCell"
            :related-cells="relatedCells"
            :same-number-cells="sameNumberCells"
            :completed-rows="completedRows"
            :completed-cols="completedCols"
            :completed-boxes="completedBoxes"
            @cell-click="handleCellClick"
          />
          <div
            v-if="isGenerating"
            class="generating-overlay"
            aria-live="polite"
            aria-label="Generating puzzle"
          >
            <div class="generating-badge">
              <span class="spinner" aria-hidden="true"></span>
              Generating...
            </div>
          </div>
        </div>

        <ControlBar
          v-if="puzzle"
          :pencil-mode="pencilMode"
          :can-undo="canUndo"
          @toggle-pencil="togglePencilMode"
          @undo="undo"
          @erase="eraseCell"
        />

        <NumberRow
          :completed-numbers="completedNumbers"
          @select="handleNumberSelect"
        />
      </div>

      <div
        v-if="!puzzle"
        class="welcome"
      >
        <p>Click "New Game" and select a difficulty to start playing!</p>
      </div>
    </main>

    <section class="content-section">
      <h2>How to Play Sudoku</h2>
      <p>
        Sudoku is a logic-based number puzzle where the objective is to fill a 9×9 grid with digits 
        so that each column, each row, and each of the nine 3×3 sub-grids contains all digits from 1 to 9.
      </p>
      <h3>Rules</h3>
      <ul>
        <li>Each row must contain the numbers 1-9, without repetition</li>
        <li>Each column must contain the numbers 1-9, without repetition</li>
        <li>Each 3×3 box must contain the numbers 1-9, without repetition</li>
        <li>Some cells are pre-filled (given) and cannot be changed</li>
        <li>Numbers that violate these rules will be marked in red</li>
      </ul>
      <h3>Controls</h3>
      <ul>
        <li><strong>Mouse/Touch:</strong> Click or tap cells and number buttons</li>
        <li><strong>Keyboard:</strong> Use arrow keys to navigate, 1-9 to enter numbers</li>
        <li><strong>Pencil Mode (P):</strong> Add small notes to cells for tracking possibilities</li>
        <li><strong>Undo (U):</strong> Reverse your last action</li>
        <li><strong>Erase (Delete/Backspace):</strong> Clear the selected cell</li>
      </ul>
    </section>
    <section class="content-section">
      <h2 class="about-heading">About Sudoku</h2>
      <p>
        Sudoku originated in the late 19th century as "Number Place" but gained worldwide popularity 
        in 2004 when it was introduced to the international market. The name "Sudoku" comes from the 
        Japanese phrase "Sūji wa dokushin ni kagiru" (数字は独身に限る), meaning "the digits must be single."
      </p>
      <p>
        While the modern puzzle was popularized in Japan, its roots trace back to the Latin squares 
        studied by Swiss mathematician Leonhard Euler in the 18th century. Today, Sudoku appears in 
        newspapers and puzzle books worldwide, enjoyed by millions for its perfect balance of logic 
        and challenge.
      </p>
    </section>

    <footer class="app-footer">
      <p>© {{ copyrightYears }} Greg Christian</p>
      <nav class="footer-nav">
        <a
          href="https://github.com/gregpuzzles1/sudoku_lite/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIT License
        </a>
        <span class="separator">·</span>
        <a
          href="https://github.com/gregpuzzles1/sudoku_lite"
          target="_blank"
          rel="noopener noreferrer"
        >
          Project Repo
        </a>
        <span class="separator">·</span>
        <a
          href="https://github.com/gregpuzzles1/sudoku_lite/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open an Issue
        </a>
      </nav>
    </footer>

    <WinModal
      :show="showWinModal"
      @close="showWinModal = false"
      @new-game="handleNewGame"
    />
    <StrikeModal
      :show="showStrikeModal"
      :can-second-chance="canSecondChance"
      @second-chance="handleSecondChance"
      @game-over="handleGameOver"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import confetti from 'canvas-confetti'
import { createCell } from './game/types'
import type { Difficulty } from './game/types'
import { useGame } from './game/useGame'
import SudokuGrid from './components/SudokuGrid.vue'
import NumberRow from './components/NumberRow.vue'
import WinModal from './components/WinModal.vue'
import ControlBar from './components/ControlBar.vue'
import StrikeModal from './components/StrikeModal.vue'

const {
  gameState,
  puzzle,
  grid,
  activeCell,
  pencilMode,
  canUndo,
  isSolved,
  strikeCount,
  strikeLimit,
  strikeRound,
  isStrikeOut,
  isGameOver,
  newGame,
  selectCell,
  clearSelection,
  placeNumber,
  togglePencilMode,
  undo,
  eraseCell,
  getRelatedCells,
  getSameNumberCells,
  useSecondChance,
  endGame,
  resetGame
} = useGame()

const selectedDifficulty = ref<Difficulty | null>(null)
const difficultyOptions: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master', 'Extreme']
const showDifficultyMenu = ref(false)
const difficultyMenuRef = ref<HTMLElement | null>(null)
const currentYear = computed(() => new Date().getFullYear())
const copyrightYears = computed(() => `2025-${currentYear.value}`)
const showWinModal = ref(false)
const isGenerating = ref(false)
const strikeText = computed(() => `Strikes ${strikeCount.value}/${strikeLimit.value}`)
const showStrikeModal = computed(() => Boolean(puzzle.value) && isStrikeOut.value)
const canSecondChance = computed(() => strikeRound.value === 1 && !isGameOver.value)
const relatedCells = computed<Set<string>>(() =>
  puzzle.value ? getRelatedCells() : new Set<string>()
)
const sameNumberCells = computed<Set<string>>(() =>
  puzzle.value ? getSameNumberCells() : new Set<string>()
)
const completedRows = computed<Set<number>>(() =>
  puzzle.value ? gameState.value.completedRows : new Set<number>()
)
const completedCols = computed<Set<number>>(() =>
  puzzle.value ? gameState.value.completedCols : new Set<number>()
)
const completedBoxes = computed<Set<number>>(() =>
  puzzle.value ? gameState.value.completedBoxes : new Set<number>()
)
const completedNumbers = computed<Set<number>>(() => {
  if (!puzzle.value) return new Set<number>()

  const done = new Set<number>()
  for (let num = 1; num <= 9; num++) {
    let allCorrect = true
    for (let row = 0; row < 9 && allCorrect; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle.value.solution[row][col] === num) {
          if (grid.value[row][col].value !== num) {
            allCorrect = false
            break
          }
        }
      }
    }

    if (allCorrect) {
      done.add(num)
    }
  }

  return done
})
const totalPlayableCells = computed(() => {
  if (!puzzle.value) return 0
  let total = 0
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!puzzle.value.grid[row][col].given) {
        total += 1
      }
    }
  }
  return total
})
const correctPlayableCells = computed(() => {
  if (!puzzle.value) return 0
  let correct = 0
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = puzzle.value.grid[row][col]
      if (!cell.given && cell.value === puzzle.value.solution[row][col]) {
        correct += 1
      }
    }
  }
  return correct
})
const progressPercent = computed(() => {
  const total = totalPlayableCells.value
  if (!puzzle.value || total === 0) return 0
  return Math.floor((correctPlayableCells.value / total) * 100)
})
const progressTooltip = ref('')
const showProgressTooltip = ref(false)
const shownProgressThresholds = ref<Set<number>>(new Set())
const progressTooltipTimer = ref<number | null>(null)
const emptyGrid = computed(() =>
  Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => createCell(row, col))
  )
)
const gridToRender = computed(() => (puzzle.value ? grid.value : emptyGrid.value))

async function handleNewGame() {
  if (isGenerating.value) return
  isGenerating.value = true
  showDifficultyMenu.value = false
  showWinModal.value = false
  selectedDifficulty.value = null
  await nextTick()
  setTimeout(() => {
    resetGame()
    isGenerating.value = false
  }, 0)
}

function toggleDifficultyMenu() {
  if (isGenerating.value) return
  showDifficultyMenu.value = !showDifficultyMenu.value
}

function handleDifficultyFocusOut(event: FocusEvent) {
  const nextTarget = event.relatedTarget as Node | null
  if (difficultyMenuRef.value && !difficultyMenuRef.value.contains(nextTarget)) {
    showDifficultyMenu.value = false
  }
}

async function handleDifficultySelect(difficulty: Difficulty) {
  if (isGenerating.value) return
  selectedDifficulty.value = difficulty
  showDifficultyMenu.value = false
  isGenerating.value = true
  showWinModal.value = false
  await nextTick()
  setTimeout(() => {
    newGame(difficulty)
    isGenerating.value = false
  }, 0)
}

function handleSecondChance() {
  useSecondChance()
}

function handleGameOver() {
  endGame()
}

function handleCellClick(row: number, col: number) {
  if (!puzzle.value) return
  selectCell(row, col)
}

function handleNumberSelect(num: number) {
  if (activeCell.value) {
    placeNumber(num)
  }
}

function showProgressThreshold(threshold: number) {
  const message = threshold === 25 ? '25% Done' : `${threshold}% Completed`
  progressTooltip.value = message
  showProgressTooltip.value = true

  if (progressTooltipTimer.value !== null) {
    window.clearTimeout(progressTooltipTimer.value)
  }

  progressTooltipTimer.value = window.setTimeout(() => {
    showProgressTooltip.value = false
  }, 1600)
}

function handleKeyDown(event: KeyboardEvent) {
  if (!puzzle.value) return

  const { key } = event

  // Number keys 1-9
  if (key >= '1' && key <= '9') {
    event.preventDefault()
    handleNumberSelect(parseInt(key))
    return
  }

  // Delete/Backspace for erase
  if (key === 'Delete' || key === 'Backspace') {
    event.preventDefault()
    eraseCell()
    return
  }

  // P for pencil mode
  if (key === 'p' || key === 'P') {
    event.preventDefault()
    togglePencilMode()
    return
  }

  // U for undo
  if (key === 'u' || key === 'U') {
    event.preventDefault()
    undo()
    return
  }

  // 
  // Number keys 1-9
  if (key >= '1' && key <= '9') {
    event.preventDefault()
    handleNumberSelect(parseInt(key))
    return
  }

  // Arrow key navigation
  if (!activeCell.value) return

  const { row, col } = activeCell.value
  let newRow = row
  let newCol = col

  switch (key) {
    case 'ArrowUp':
      event.preventDefault()
      newRow = Math.max(0, row - 1)
      break
    case 'ArrowDown':
      event.preventDefault()
      newRow = Math.min(8, row + 1)
      break
    case 'ArrowLeft':
      event.preventDefault()
      newCol = Math.max(0, col - 1)
      break
    case 'ArrowRight':
      event.preventDefault()
      newCol = Math.min(8, col + 1)
      break
  }

  if (newRow !== row || newCol !== col) {
    selectCell(newRow, newCol)
  }
}

// Watch for puzzle solved
watch(isSolved, (solved) => {
  if (solved) {
    showWinModal.value = true
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }
})

watch(progressPercent, (percent) => {
  if (!puzzle.value) return

  const thresholds = [25, 50, 75]
  const eligible = thresholds.filter(
    (threshold) => percent >= threshold && !shownProgressThresholds.value.has(threshold)
  )

  if (eligible.length > 0) {
    const threshold = eligible[eligible.length - 1]
    shownProgressThresholds.value.add(threshold)
    showProgressThreshold(threshold)
  }
})

watch(puzzle, () => {
  shownProgressThresholds.value = new Set()
  showProgressTooltip.value = false
  if (progressTooltipTimer.value !== null) {
    window.clearTimeout(progressTooltipTimer.value)
    progressTooltipTimer.value = null
  }
})

// Keyboard event listeners
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (progressTooltipTimer.value !== null) {
    window.clearTimeout(progressTooltipTimer.value)
  }
})
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.app-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-secondary);
  font-weight: 500;
}

.app-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}


.header-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.difficulty-menu {
  position: relative;
}

.new-game-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.new-game-label {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
}

.new-game-select {
  padding: var(--space-sm) var(--space-md);
  padding-right: calc(var(--space-md) + 20px);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  font-weight: 600;
  color: white;
  background-color: var(--color-correct);
  border: 2px solid var(--color-correct);
  border-radius: 6px;
  cursor: pointer;
  width: 200px;
  transition: background-color var(--transition-fast);
  text-align: left;
}

.new-game-select:hover:not(:disabled) {
  background-color: #229954;
}

.new-game-select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
}

.new-game-select:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.new-game-select::after {
  content: '';
  position: absolute;
}

.difficulty-options {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 4px 0;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  z-index: 20;
}

.difficulty-option {
  width: 100%;
  border: 0;
  text-align: left;
  padding: 10px 12px;
  font: inherit;
  color: var(--color-text);
  background-color: #ffffff;
  cursor: pointer;
}

.difficulty-option:hover,
.difficulty-option:focus-visible {
  background-color: var(--color-given);
  color: #ffffff;
  outline: none;
}

.game-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.grid-wrapper {
  position: relative;
  display: inline-flex;
  justify-content: center;
  max-width: 100%;
}

.difficulty-label {
  position: absolute;
  top: -22px;
  left: 33.33%;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-secondary);
  letter-spacing: 0.3px;
}

.strike-label {
  position: absolute;
  top: -22px;
  left: 66.67%;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-secondary);
  letter-spacing: 0.3px;
  text-align: left;
}

.progress-tooltip {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translate(-50%, -100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  font-weight: 600;
  color: var(--color-text);
  z-index: 2;
  pointer-events: none;
}

.progress-tooltip::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0 6px;
  border-style: solid;
  border-color: #ffffff transparent transparent transparent;
  filter: drop-shadow(0 -1px 0 var(--color-border));
}

.tooltip-emoji {
  font-size: 1.1rem;
  line-height: 1;
}

.tooltip-text {
  font-size: 0.9rem;
  line-height: 1.1;
}

.generating-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(2px);
  border-radius: 10px;
}

.generating-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: 999px;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  color: var(--color-text);
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.welcome {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-secondary);
  font-size: var(--font-size-lg);
}

@media (max-width: 768px) {
  .app-title {
    font-size: 1.75rem;
  }

  .app-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-controls {
    justify-content: center;
  }

  .new-game-wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-xs);
  }

  .new-game-label {
    text-align: center;
  }

  .new-game-select {
    width: 100%;
  }
}

@media (min-width: 600px) and (max-width: 900px) {
  .new-game-select {
    width: auto;
    min-width: 200px;
    max-width: 240px;
  }
}

@media (max-width: 900px) and (orientation: portrait) {
  .app-title {
    font-size: 2rem;
  }

  .app-header {
    align-items: center;
  }

  .header-controls {
    align-self: auto;
    margin-top: 0;
  }
}

.content-section {
  max-width: 800px;
  margin: var(--space-xl) auto;
  padding: 0 var(--space-lg);
  color: var(--color-text);
}

.content-section + .content-section {
  margin-top: calc(var(--space-xl) * 1.5);
}

.section-spacer {
  height: var(--space-lg);
}

.about-heading {
  margin-top: var(--space-lg);
}

.content-section h2 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-md);
  color: var(--color-text);
  letter-spacing: 0.2px;
}

.content-section h3 {
  font-size: var(--font-size-lg);
  margin-top: var(--space-lg);
  margin-bottom: var(--space-sm);
  color: var(--color-primary);
}

.content-section p {
  line-height: 1.8;
  margin-bottom: var(--space-md);
  color: #3f5364;
}

.content-section ul {
  list-style-position: inside;
  margin-bottom: var(--space-md);
  padding-left: var(--space-md);
}

.content-section li {
  margin-bottom: var(--space-sm);
  line-height: 1.6;
  color: #3f5364;
}

.app-footer {
  margin-top: var(--space-xl);
  padding: var(--space-xl) var(--space-lg);
  text-align: center;
  border-top: 1px solid var(--color-border);
  color: var(--color-secondary);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.app-footer p {
  margin-bottom: var(--space-sm);
}

.footer-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.footer-nav a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-nav a:hover {
  color: var(--color-text);
  text-decoration: underline;
}

.separator {
  color: var(--color-border);
}
</style>
