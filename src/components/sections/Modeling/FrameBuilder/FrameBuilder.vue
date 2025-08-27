<template>
  <div class="frame-builder" :style="{width: canvasWidth + 'px', height: canvasHeight + 'px'}">
    <v-stage
        :config="{ width: canvasWidth, height: canvasHeight }"
        ref="stage"
        v-if="activeTransom"
    >
      <v-layer >
        <!-- Фоновый прямоугольник для всего канваса -->
        <v-rect
            :config="{
              x: 0,
              y: 0,
              width: canvasWidth,
              height: canvasHeight,
              fill: '#f5f5f5',
              listening: false
            }"
        />
        <!-- Группа для рамки фрамуги -->
        <v-group>
          <v-rect
              :config="rectFrameConfig"
          />
        </v-group>

        <!-- Группа для элементов -->
        <v-group>
          <template v-for="(cell, index) in activeTransom.cells" :key="'cell-'+index">
            <LeafElement
                v-if="cell.type !== 'profile'"
                v-bind="leafElementProps(cell, index)"
                @click="selectCell(index)"
            />
          </template>
        </v-group>

      </v-layer>
    </v-stage>
    <div v-else class="no-transom">
      Выберите или создайте фрамугу
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue'
import {useModelingStore} from "@src/stores";
import {storeToRefs} from 'pinia'
import LeafElement from "@components/sections/Modeling/FrameBuilder/LeafElement.vue";

const modelingStore = useModelingStore()

const {activeTransom} = storeToRefs(modelingStore)

console.log('activeTransom', activeTransom.value)

const props = defineProps({
  canvasWidth: {type: Number, default: 1100},
  canvasHeight: {type: Number, default: 600},
  padding: {type: Number, default: 40}
})
const selectedCellIndex = ref(null)

// Масштабный коэффициент
const scaleFactor = computed(() => {
  if (!activeTransom.value) return 1

  const availableWidth = props.canvasWidth - 2 * props.padding
  const availableHeight = props.canvasHeight - 2 * props.padding

  return Math.min(
      availableWidth / activeTransom.value.width,
      availableHeight / activeTransom.value.height
  )
})
// Конфигурация прямоугольника рамы
const rectFrameConfig = computed(() => {
  if (!activeTransom.value) return {}

  return {
    x: props.padding,
    y: props.padding,
    width: activeTransom.value.width * scaleFactor.value,
    height: activeTransom.value.height * scaleFactor.value,
    stroke: '#333',
    strokeWidth: 3,
    fill: '#ffffff',
  }
})

const leafElementProps = computed(() => (cell, index) => {

    console.log('CELL', cell)

    return {
      x: cell.x * scaleFactor.value + props.padding,
      y: cell.y * scaleFactor.value + props.padding,
      width: cell.width * scaleFactor.value,
      height: cell.height * scaleFactor.value,
      type: cell.type,
      // isSelected: selectedCellIndex.value === index,
      //showDimensions: showDimensions.value,
      scaleFactor: scaleFactor.value,
      offsets: cell.offsets
    }

})

const selectCell = (index) => {
  selectedCellIndex.value = index
}

// Отслеживание изменений активной фрамуги
watch(activeTransom, (newTransom) => {
  if (newTransom) {
    console.log('Активная фрамуга изменилась:', newTransom)
    // Здесь можно добавить логику перерисовки
  }
}, {deep: true})

// Отслеживание изменений размеров
watch(() => [props.canvasWidth, props.canvasHeight], () => {
  // При изменении размеров канваса пересчитываем масштаб
}, {immediate: true})

</script>

<style lang="scss" scoped>
.frame-builder {
  @include base-border;
  grid-row: 2;
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  .no-transom {
    color: #999;
    font-style: italic;
  }
}
</style>