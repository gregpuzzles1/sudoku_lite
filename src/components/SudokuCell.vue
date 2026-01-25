<template>
  <div
    class="sudoku-cell"
    :class="{
      'cell-given': cell.given,
      'cell-filled': cell.state === 'filled',
      'cell-error': cell.state === 'error',
      'cell-active': isActive,
      'cell-related': isRelated,
      'cell-same-number': isSameNumber
    }"
    @click="handleClick"
  >
    <span
      v-if="cell.value !== null"
      class="cell-value"
    >
      {{ cell.value }}
    </span>
    <div
      v-else-if="cell.notes.size > 0"
      class="cell-notes"
    >
      <span
        v-for="num in 9"
        :key="num"
        class="note"
        :class="{ 'note-active': cell.notes.has(num) }"
      >
        {{ cell.notes.has(num) ? num : '' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cell } from '../game/types'

interface Props {
  cell: Cell
  isActive?: boolean
  isRelated?: boolean
  isSameNumber?: boolean
}

withDefaults(defineProps<Props>(), {
  isActive: false,
  isRelated: false,
  isSameNumber: false
})

const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.sudoku-cell {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
  user-select: none;
}

.sudoku-cell:hover {
  background-color: var(--color-highlight);
}

.cell-value {
  font-size: 2.2rem;
  font-weight: 500;
  color: var(--color-text);
}

.cell-given .cell-value {
  color: #000000;
  font-weight: 700;
}

.cell-filled .cell-value {
  color: #1976D2;
}

.cell-error .cell-value {
  color: var(--color-error);
  font-weight: 700;
}

.cell-related {
  background-color: #e8e8e8;
}

.cell-same-number {
  background-color: rgba(74, 144, 226, 0.2);
}

.cell-active {
  background-color: var(--color-primary) !important;
  color: white;
  border-color: var(--color-primary);
}

.cell-active .cell-value {
  color: white;
}

.cell-active.cell-error .cell-value {
  color: var(--color-error);
}

.cell-notes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  padding: 2px;
  gap: 1px;
}

.note {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--color-secondary);
}

.note-active {
  font-weight: 600;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .sudoku-cell {
    width: 40px;
    height: 40px;
  }

  .cell-value {
    font-size: 1.5rem;
  }

  .cell-notes {
    padding: 1px;
    gap: 0px;
  }

  .note {
    font-size: 0.5rem;
    line-height: 1;
  }
}

@media (min-width: 600px) and (max-width: 900px) and (orientation: portrait) {
  .sudoku-cell {
    width: 54px;
    height: 54px;
  }

  .cell-value {
    font-size: 2rem;
  }

  .note {
    font-size: 0.7rem;
  }
}
</style>
