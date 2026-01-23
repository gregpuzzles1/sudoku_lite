<template>
  <div class="difficulty-menu">
    <label
      for="difficulty-select"
      class="sr-only"
    >Select Difficulty</label>
    <select
      id="difficulty-select"
      v-model="selectedDifficulty"
      class="difficulty-select"
      @change="handleChange"
    >
      <option value="Beginner">
        Beginner
      </option>
      <option value="Intermediate">
        Intermediate
      </option>
      <option value="Advanced">
        Advanced
      </option>
      <option value="Expert">
        Expert
      </option>
      <option value="Master">
        Master
      </option>
      <option value="Extreme">
        Extreme
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Difficulty } from '../game/types'

const emit = defineEmits<{
  change: [difficulty: Difficulty]
}>()

const selectedDifficulty = ref<Difficulty>('Intermediate')

function handleChange() {
  emit('change', selectedDifficulty.value)
}
</script>

<style scoped>
.difficulty-menu {
  margin-bottom: var(--space-md);
}

.difficulty-select {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color var(--transition-fast);
  min-width: 180px;
}

.difficulty-select:hover {
  border-color: var(--color-primary);
}

.difficulty-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

@media (max-width: 768px) {
  .difficulty-select {
    width: 100%;
  }
}
</style>
