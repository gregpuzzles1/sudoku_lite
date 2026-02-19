<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="modal-overlay"
      >
        <div
          class="modal-content"
          @click.stop
        >
          <h2 class="modal-title">
            Game Over
          </h2>
          <p class="modal-message">
            You have struck out!
          </p>
          <button
            class="modal-button"
            @click="handleGameOver"
          >
            Game Over
          </button>
          <button
            v-if="canSecondChance"
            class="modal-button modal-button-secondary"
            @click="handleSecondChance"
          >
            Second Chance
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  canSecondChance: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  secondChance: []
  gameOver: []
}>()

function handleSecondChance() {
  emit('secondChance')
}

function handleGameOver() {
  emit('gameOver')
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
  max-width: 420px;
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
  background-color: var(--color-error);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  font-family: var(--font-family);
  margin-bottom: var(--space-sm);
}

.modal-button:hover {
  background-color: #d64533;
}

.modal-button-secondary {
  background-color: var(--color-primary);
}

.modal-button-secondary:hover {
  background-color: #3a7bc8;
}

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
