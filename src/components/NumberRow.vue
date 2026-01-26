<template>
  <div class="number-row">
    <button
      v-for="num in numbers"
      :key="num"
      class="number-button"
      :class="{ completed: props.completedNumbers.has(num) }"
      :aria-label="props.completedNumbers.has(num) ? `Number ${num} completed` : `Enter number ${num}`"
      @click="handleClick(num, $event)"
    >
      {{ props.completedNumbers.has(num) ? '✓' : num }}
    </button>
  </div>
</template>

<script setup lang="ts">
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

interface Props {
  completedNumbers?: Set<number>
}

const props = withDefaults(defineProps<Props>(), {
  completedNumbers: () => new Set<number>()
})

const emit = defineEmits<{
  select: [number: number]
}>()

function handleClick(num: number, event: MouseEvent) {
  ;(event.currentTarget as HTMLButtonElement | null)?.blur()
  emit('select', num)
}
</script>

<style scoped>
.number-row {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  margin: var(--space-lg) 0;
  flex-wrap: nowrap;
}

.number-button {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-family);
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.number-button:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.number-button:active {
  transform: translateY(0);
}

.number-button:focus,
.number-button:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  background-color: #f5f5f5 !important;
  color: var(--color-text) !important;
}

@media (max-width: 768px) {
  .number-button {
    width: 38px;
    height: 38px;
    font-size: 1.4rem;
  }
  
  .number-row {
    gap: 3px;
  }
}
</style>
