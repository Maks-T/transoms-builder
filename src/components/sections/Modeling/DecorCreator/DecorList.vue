<template>
  <div class="decor-list">
    <h3 v-if="!isCellSelected" class="no-cell-selected">Выберите ячейку для выбора декора</h3>
    <div v-else class="decor-lists-container">
      <!-- Секционный декор (profileRail) -->
      <div class="decor-section">
        <h4>Секционный декор</h4>
        <div class="decor-items">
          <label
              v-for="preset in decorLists.profileRail"
              :key="preset"
              class="decor-item"
          >
            <input
                type="radio"
                :value="preset"
                :checked="selectedPreset === preset"
                :disabled="!isCellSelected"
                @change="$emit('update:selectedPreset', preset)"
            />
            {{ preset }}
          </label>
        </div>
      </div>

      <!-- Накладной декор (glueRail) -->
      <div class="decor-section">
        <h4>Накладной декор</h4>
        <div class="decor-items">
          <label
              v-for="preset in decorLists.glueRail"
              :key="preset"
              class="decor-item"
          >
            <input
                type="radio"
                :value="preset"
                :checked="selectedPreset === preset"
                :disabled="!isCellSelected"
                @change="$emit('update:selectedPreset', preset)"
            />
            {{ preset }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isCellSelected: {
    type: Boolean,
    default: false,
  },
  decorLists: {
    type: Object,
    required: true,
    validator: (obj) => {
      return Array.isArray(obj.profileRail) && Array.isArray(obj.glueRail);
    },
  },
  selectedPreset: {
    type: [String, null],
    default: null,
  },
});

defineEmits(['update:selectedPreset']);
</script>

<style lang="scss" scoped>
.decor-list {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-cell-selected {
  color: #888;
  font-size: 16px;
  text-align: center;
}

.decor-lists-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.decor-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.decor-section h4 {
  font-size: 18px;
  margin: 0 0 10px 0;
  color: #333;
}

.decor-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.decor-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.decor-item:hover {
  background: #e0f7fa;
}

.decor-item input[type="radio"] {
  margin-right: 8px;
}

.decor-item input[type="radio"]:disabled {
  cursor: not-allowed;
}

.decor-item input[type="radio"]:checked + span {
  font-weight: bold;
  color: #007bff;
}
</style>