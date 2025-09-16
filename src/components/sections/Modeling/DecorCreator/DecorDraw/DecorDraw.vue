<template>
  <div class="decor-creator">
    <div v-if="activeTransom">
      <v-stage
          :config="{ width: canvasWidth, height: canvasHeight }"
          ref="stage"
      >
        <v-layer>

          <!-- Группа для элементов -->
          <v-group>
            <template v-for="(cell, index) in activeTransom.cells" :key="'cell-'+index">
              <DecorLeafElement
                  v-if="cell.type !== 'profile'"
                  v-bind="leafElementProps(cell, index)"
                  @select="handleSelectCell(index)"
              />
            </template>
          </v-group>

          <!-- Группа для рамки фрамуги -->
          <v-group>
            <v-rect
                :config="rectFrameConfig"
            />
          </v-group>

        </v-layer>
      </v-stage>


    </div>

    <div v-else class="no-transom">
      Не создана ни одна фрамуга
    </div>
  </div>

</template>

<script setup>
import {storeToRefs} from 'pinia'
import {useModelingStore} from "@stores/index.js";
import {ref, computed, onMounted, onUnmounted, watch} from 'vue'
import DecorLeafElement from "@components/sections/Modeling/DecorCreator/DecorDraw/DecorLeafElement.vue";

const modelingStore = useModelingStore()

const {activeTransom} = storeToRefs(modelingStore)

const emit = defineEmits(['update:selected-cell-index'])

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
    stroke: activeTransom.value.validationData.isValid ? '#333' : 'red',
    strokeWidth: 1,
    fill: 'transparent',
    listening: false
  }
})

const leafElementProps = computed(() => (cell, index) => {

  return {
    padding: props.padding,
    cell,
    isSelected: selectedCellIndex.value === index,
    scaleFactor: scaleFactor.value,
    index
    /*x: cell.x * scaleFactor.value + props.padding,
    y: cell.y * scaleFactor.value + props.padding,
    width: cell.width * scaleFactor.value,
    height: cell.height * scaleFactor.value,
    realWidth: cell.width,
    realHeight: cell.height,
    type: cell.type,*/
    /*offsets: cell.offsets,
    hingeSide: cell.hingeSide,*/
  }

})

const handleSelectCell = (index) => {
  if (index === null) return;

  selectedCellIndex.value = index

  emit('update:selected-cell-index', index)
}

// Отслеживание изменений размеров
watch(() => [props.canvasWidth, props.canvasHeight], () => {
  // При изменении размеров канваса пересчитываем масштаб
}, {immediate: true})

</script>

<style lang="scss" scoped>
.decor-creator {
  @include base-border;

  position: relative;
  z-index: 1;

  grid-row: 2;
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  &__validation {
    position: absolute;
    z-index: 2;
    right: rem(20);
    top: rem(20);
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    padding: rem(4) rem(16);
    color: #fff;
    font-size: rem(14);
    border-radius: rem(12);
    box-shadow: 0 8px 32px rgba(255, 107, 107, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .no-transom {
    color: #999;
    font-style: italic;
  }

  &__container {
    display: grid;
    grid-template-columns: 1fr 150px;
    gap: rem(20)
  }

}
</style>