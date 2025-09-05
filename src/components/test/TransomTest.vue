<template>
  <div class="transom-test-container">
    <button @click="addTransom" class="add-button">Добавить фрамугу</button>
    <div class="transom-list">
      <button
          v-for="transom in transoms"
          :key="transom.id"
          @click="setActiveTransom(transom.id)"
          :class="{ active: transom.id === activeTransomId }"
          class="transom-button"
      >
        {{ transom.name }}
      </button>
    </div>
    <div v-if="activeTransom" class="transom-info">
      <h3>Active Transom: {{ activeTransom.name }}</h3>
      <p>ID: {{ activeTransom.id }}</p>
      <p>Width: {{ activeTransom.width }} mm</p>
      <p>Height: {{ activeTransom.height }} mm</p>
    </div>
  </div>
</template>

<script>
import { useModelingStore } from '@stores/index.js'

export default {
  name: 'TransomTest',
  setup() {
    const modelingStore = useModelingStore()

    return {
      transoms: modelingStore.transoms,
      activeTransom: modelingStore.activeTransom,
      activeTransomId: modelingStore.activeTransomId,
      addTransom: modelingStore.addTransom,
      setActiveTransom: modelingStore.setActiveTransom,
    }
  },
}
</script>

<style scoped>
.transom-test-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.add-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-button:hover {
  background-color: #45a049;
}

.transom-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.transom-button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.transom-button.active {
  background-color: #2196F3;
  color: white;
  border-color: #2196F3;
}

.transom-button:hover {
  background-color: #e0e0e0;
}

.transom-info {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 4px;
}
</style>