<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="modal-overlay"
        @click="handleClose"
      >
        <div
          class="modal-content"
          @click.stop
        >
          <h2 class="modal-title">
            🎉 Congratulations!
          </h2>
          <p class="modal-message">
            You solved the puzzle!
          </p>
          <button
            class="modal-button"
            @click="handleNewGame"
          >
            New Game
          </button>
          <button
            class="modal-button modal-button-secondary"
            @click="handleClose"
          >
            Close
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  newGame: []
}>()

function handleClose() {
  emit('close')
}

function handleNewGame() {
  emit('newGame')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
}

.modal-content {
  background-color: var(--color-bg);
  padding: var(--space-xl);
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

.modal-message {
  font-size: var(--font-size-lg);
  color: var(--color-secondary);
  margin-bottom: var(--space-xl);
}

.modal-button {
  width: 100%;
  padding: var(--space-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: white;
  background-color: var(--color-primary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  font-family: var(--font-family);
  margin-bottom: var(--space-sm);
}

.modal-button:hover {
  background-color: #3a7bc8;
}

.modal-button-secondary {
  background-color: var(--color-secondary);
}

.modal-button-secondary:hover {
  background-color: #6a7989;
}

/* Transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--transition-medium);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform var(--transition-medium);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>
