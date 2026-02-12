<template>
  <div class="sudoku-grid">
    <div
      v-for="(row, rowIndex) in grid"
      :key="rowIndex"
      class="grid-row"
    >
      <SudokuCell
        v-for="(cell, colIndex) in row"
        :key="`${rowIndex}-${colIndex}`"
        :cell="cell"
        :is-active="isActive(rowIndex, colIndex)"
        :is-related="isRelated(rowIndex, colIndex)"
        :is-same-number="isSameNumber(rowIndex, colIndex)"
        :class="{
          'cell-thick-right': (colIndex + 1) % 3 === 0 && colIndex < 8,
          'cell-thick-bottom': (rowIndex + 1) % 3 === 0 && rowIndex < 8,
          'cell-completed': isAnimated(rowIndex, colIndex)
        }"
        @click="handleCellClick(rowIndex, colIndex)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Cell } from '../game/types'
import SudokuCell from './SudokuCell.vue'

interface Props {
  grid: Cell[][]
  activeCell: { row: number; col: number } | null
  relatedCells?: Set<string>
  sameNumberCells?: Set<string>
  completedRows?: Set<number>
  completedCols?: Set<number>
  completedBoxes?: Set<number>
}

const props = withDefaults(defineProps<Props>(), {
  relatedCells: () => new Set(),
  sameNumberCells: () => new Set(),
  completedRows: () => new Set(),
  completedCols: () => new Set(),
  completedBoxes: () => new Set()
})

const emit = defineEmits<{
  cellClick: [row: number, col: number]
}>()

const animationCells = ref<Set<string>>(new Set())
const previousRows = ref<Set<number>>(new Set())
const previousCols = ref<Set<number>>(new Set())
const previousBoxes = ref<Set<number>>(new Set())
const animatedRowsEver = ref<Set<number>>(new Set())
const animatedColsEver = ref<Set<number>>(new Set())
const animatedBoxesEver = ref<Set<number>>(new Set())

const animationDurationMs = 500
const stepDelayMs = 40

function isActive(row: number, col: number): boolean {
  return props.activeCell?.row === row && props.activeCell?.col === col
}

function isRelated(row: number, col: number): boolean {
  return props.relatedCells.has(`${row}-${col}`)
}

function isSameNumber(row: number, col: number): boolean {
  return props.sameNumberCells.has(`${row}-${col}`)
}

function isAnimated(row: number, col: number): boolean {
  return animationCells.value.has(`${row}-${col}`)
}

function addAnimatedCell(row: number, col: number, delay: number): void {
  const key = `${row}-${col}`
  window.setTimeout(() => {
    const next = new Set(animationCells.value)
    next.add(key)
    animationCells.value = next

    window.setTimeout(() => {
      const remove = new Set(animationCells.value)
      remove.delete(key)
      animationCells.value = remove
    }, animationDurationMs)
  }, delay)
}

function animateRow(row: number): void {
  for (let col = 0; col < 9; col++) {
    addAnimatedCell(row, col, col * stepDelayMs)
  }
}

function animateCol(col: number): void {
  for (let row = 0; row < 9; row++) {
    addAnimatedCell(row, col, row * stepDelayMs)
  }
}

function animateBox(box: number): void {
  const startRow = Math.floor(box / 3) * 3
  const startCol = (box % 3) * 3
  let index = 0

  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      addAnimatedCell(r, c, index * stepDelayMs)
      index++
    }
  }
}

watch(
  () => props.completedRows,
  (rows) => {
    const added = [...rows].filter(
      (row) => !previousRows.value.has(row) && !animatedRowsEver.value.has(row)
    )
    added.forEach((row) => {
      animateRow(row)
      const next = new Set(animatedRowsEver.value)
      next.add(row)
      animatedRowsEver.value = next
    })
    previousRows.value = new Set(rows)
  }
)

watch(
  () => props.completedCols,
  (cols) => {
    const added = [...cols].filter(
      (col) => !previousCols.value.has(col) && !animatedColsEver.value.has(col)
    )
    added.forEach((col) => {
      animateCol(col)
      const next = new Set(animatedColsEver.value)
      next.add(col)
      animatedColsEver.value = next
    })
    previousCols.value = new Set(cols)
  }
)

watch(
  () => props.completedBoxes,
  (boxes) => {
    const added = [...boxes].filter(
      (box) => !previousBoxes.value.has(box) && !animatedBoxesEver.value.has(box)
    )
    added.forEach((box) => {
      animateBox(box)
      const next = new Set(animatedBoxesEver.value)
      next.add(box)
      animatedBoxesEver.value = next
    })
    previousBoxes.value = new Set(boxes)
  }
)

watch(
  () => props.grid,
  () => {
    previousRows.value = new Set()
    previousCols.value = new Set()
    previousBoxes.value = new Set()
    animatedRowsEver.value = new Set()
    animatedColsEver.value = new Set()
    animatedBoxesEver.value = new Set()
    animationCells.value = new Set()
  }
)

function handleCellClick(row: number, col: number) {
  emit('cellClick', row, col)
}
</script>

<style scoped>
.sudoku-grid {
  display: inline-block;
  border: 3px solid var(--color-given);
  background-color: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.grid-row {
  display: flex;
}

.cell-thick-right {
  border-right: 2px solid var(--color-given) !important;
}

.cell-thick-bottom {
  border-bottom: 2px solid var(--color-given) !important;
}

.cell-completed {
  animation: cell-flash 0.5s ease forwards;
}

@keyframes cell-flash {
  0%, 100% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(39, 174, 96, 0.35);
  }
}

@media (max-width: 768px) {
  .sudoku-grid {
    max-width: 100%;
  }
}
</style>
