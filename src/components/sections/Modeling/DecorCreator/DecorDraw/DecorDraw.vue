<template>
  <div class="decor-draw">
    <div v-if="activeTransom">
      <v-stage
          :config="{ width: canvasWidth, height: canvasHeight }"
          ref="stage"
      >
        <v-layer>
          <!-- Группа для элементов -->
          <v-group>
            <template v-for="(cell, index) in decorCells" :key="'cell-'+index">
              <DecorLeafElement
                  v-if="cell && cell.type !== 'profile'"
                  v-bind="leafElementProps(cell, index)"
              />
            </template>
          </v-group>

          <!-- Группа для рамки фрамуги -->
          <v-group>
            <v-rect :config="rectFrameConfig" />
          </v-group>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useDecorStore, useModelingStore } from "@stores/index.js";
import { computed, watch } from 'vue';
import DecorLeafElement from "@components/sections/Modeling/DecorCreator/DecorDraw/DecorLeafElement.vue";

const props = defineProps({
  canvasWidth: { type: Number, default: 1100 },
  canvasHeight: { type: Number, default: 600 },
  padding: { type: Number, default: 40 },
});

const modelingStore = useModelingStore();
const decorStore = useDecorStore();

const { activeTransom } = storeToRefs(modelingStore);
const { selectedCellIndex } = storeToRefs(decorStore);

// Реактивно получаем ячейки из decorStore
const decorCells = computed(() => {
  return decorStore.calculatedCells(activeTransom.value);
});


// Масштабный коэффициент
const scaleFactor = computed(() => {
  if (!activeTransom.value) return 1;

  const availableWidth = props.canvasWidth - 2 * props.padding;
  const availableHeight = props.canvasHeight - 2 * props.padding;

  return Math.min(
      availableWidth / activeTransom.value.width,
      availableHeight / activeTransom.value.height
  );
});

// Конфигурация прямоугольника рамы
const rectFrameConfig = computed(() => {
  if (!activeTransom.value) return {};

  return {
    x: props.padding,
    y: props.padding,
    width: activeTransom.value.width * scaleFactor.value,
    height: activeTransom.value.height * scaleFactor.value,
    stroke: '#8e8e8e',
    strokeWidth: 1,
    fill: 'transparent',
    listening: false,
  };
});

// Свойства для DecorLeafElement
const leafElementProps = computed(() => (cell, index) => {
  return {
    padding: props.padding,
    cell,
    scaleFactor: scaleFactor.value,
    index: Number(index),
    isSelected: selectedCellIndex.value === index,
  };
});

</script>

<style lang="scss" scoped>
.decor-draw {
  @include base-border;
  position: relative;
  z-index: 1;
  grid-row: 2;
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  .no-transom {
    color: #999;
    font-style: italic;
  }

  &__container {
    display: grid;
    grid-template-columns: 1fr 150px;
    gap: rem(20);
  }
}
</style>