<template>
  <div class="decor-list">
    <h3 v-if="!isCellSelected" class="no-cell-selected">Выберите ячейку для выбора декора</h3>
    <div v-else class="decor-lists-container">
      <div class="decor-section" v-for="(presets, type) in groupedDecorPresets" :key="type">
        <h4>{{ decorTypeNames[type] || type }}</h4>
        <div class="decor-items">
          <div class="decor-item" v-for="presetId in presets" :key="presetId">
            <label class="decor-item__icon">
              <img alt="" :src="`https://configdoor.com/public/images/template/${presetId}.svg`"/>
              <input
                  type="radio"
                  :value="presetId"
                  :checked="selectedPresetId === presetId"
                  :disabled="!isCellSelected"
                  @change="handlePresetChange(presetId, type)"
              />
            </label>
            <span>{{ presetId }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {useDecorStore, useModelingStore} from "@src/stores/index.js";
import {storeToRefs} from 'pinia';

// Объект для маппинга ключей на читаемые имена
const decorTypeNames = {
  profileRail: 'Секционный декор',
  glueRail: 'Накладной декор',
};

const decorStore = useDecorStore();
const modelingStore = useModelingStore();

// Реактивные ссылки на store
const {activeTransom} = storeToRefs(modelingStore);
const {selectedCell, selectedCellIndex} = storeToRefs(decorStore);

// Проверяем, выбрана ли ячейка
const isCellSelected = computed(() => selectedCellIndex.value !== null);

// Получаем доступные пресеты и группируем их по типу
const groupedDecorPresets = computed(() => {
  return decorStore.getAvailableDecor(activeTransom.value);
});

// Текущий выбранный presetId
const selectedPresetId = computed(() => {
  return selectedCell.value?.presetId || null;
});

// Обработчик изменения пресета
const handlePresetChange = (presetId, type) => {
  if (selectedCellIndex.value !== null) {
    decorStore.setPresetForSelectedCell(presetId, type);
  }
};
</script>

<style lang="scss" scoped>
.decor-list {
  padding: rem(20);
}

.no-cell-selected {
  // Стили для сообщения о невыбранной ячейке
}

.decor-lists-container {
  display: flex;
  flex-direction: column;
  gap: rem(20) rem(30);
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: rem(8);
  font-size: rem(18);
  text-transform: uppercase;

  &__icon {
    @include base-border;

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: rem(8);
    height: rem(85);
    width: rem(60);
    cursor: pointer;
    transition: all 0.2s ease;

    input[type="radio"] {
      display: none;
    }

    input[type="radio"]:checked + span {
      border-color: $accent-text-color;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>