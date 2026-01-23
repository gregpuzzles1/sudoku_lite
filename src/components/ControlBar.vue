<template>
  <div class="control-bar">
    <button
      class="control-button"
      :class="{ active: pencilMode }"
      :aria-label="pencilMode ? 'Disable pencil mode' : 'Enable pencil mode'"
      title="Pencil Mode (P)"
      @click="handlePencilClick"
    >
      ✏️ Pencil
    </button>

    <button
      class="control-button"
      :disabled="!canUndo"
      aria-label="Undo last action"
      title="Undo (U)"
      @click="handleUndoClick"
    >
      ↶ Undo
    </button>

    <button
      class="control-button"
      aria-label="Erase cell"
      title="Erase (Delete/Backspace)"
      @click="handleEraseClick"
    >
      ⌫ Erase
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  pencilMode: boolean
  canUndo: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  togglePencil: []
  undo: []
  erase: []
}>()

function handlePencilClick() {
  emit('togglePencil')
}

function handleUndoClick() {
  emit('undo')
}

function handleEraseClick() {
  emit('erase')
}
</script>

<style scoped>
.control-bar {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

.control-button {
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-family);
  min-width: 100px;
}

.control-button:hover:not(:disabled) {
  background-color: var(--color-highlight);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.control-button.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  opacity: 1 !important;
}

.control-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.control-button:active:not(:disabled) {
  transform: translateY(0);
}

.control-button.active:hover {
  background-color: var(--color-primary);
  color: white;
}

@media (max-width: 768px) {
  .control-bar {
    width: 100%;
  }

  .control-button {
    flex: 1;
    min-width: auto;
  }
}
</style>
