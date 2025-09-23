<template>
  <div class="decor-controls">

    <button
        class="btn-white"
        :disabled="!isCellSelected || selectedCell?.presetId === 'default'"
        @click="resetDecor"
    >
      <Icon icon="mingcute:delete-2-line" class="icon" />
      <span>Убрать декоративные накладки</span>
    </button>

    <button
        class="btn-white"
        :disabled="!isCellSelected"
        @click="setSelectedPresetToAllCells"
    >
      <Icon icon="mingcute:copy-2-line" class="icon" />
      <span>Применить ко всем полотнам</span>
    </button>

    <button
        class="btn-white"
        :disabled="!isCellSelected"
        @click="toggleSelectedCellFlip"
    >
      <Icon icon="mingcute:flip-horizontal-line" class="icon" />
      <span>Отразить по горизонтали</span>
    </button>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDecorStore, useModelingStore } from '@src/stores/index.js';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';

const decorStore = useDecorStore();
const modelingStore = useModelingStore();

const { selectedCellIndex, selectedCell } = storeToRefs(decorStore);
const { activeTransom } = storeToRefs(modelingStore);

// Проверяем, выбрана ли ячейка
const isCellSelected = computed(() => selectedCellIndex.value !== null);

// Сбрасывает декор выбранной ячейки на 'default'
const resetDecor = () => {
  if (selectedCell.value) {
    decorStore.setPresetForSelectedCell('default', null);
  }
};

// Применяет текущий пресет ко всем ячейкам
const setSelectedPresetToAllCells = () => {
  if (selectedCell.value) {
    decorStore.setSelectedPresetToAllCells();
  }
};

// Переключает isFlip для выбранной ячейки
const toggleSelectedCellFlip = () => {
  if (selectedCell.value) {
    decorStore.toggleSelectedCellFlip();
  }
};

</script>

<style lang="scss" scoped>
.decor-controls {
  display: flex;
  justify-content: center;
  gap: rem(20);
  padding: rem(10);

  button {
    font-size: rem(14);
  }
}
</style>