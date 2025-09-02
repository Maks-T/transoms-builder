<template>
  <div class="frame-builder">
    <div v-if="activeTransom">
      <v-stage
          :config="{ width: canvasWidth, height: canvasHeight }"
          ref="stage"
      >
        <v-layer>
          <!-- Фоновый прямоугольник для всего канваса -->
          <!--   <v-rect
              :config="{
                x: 0,
                y: 0,
                width: canvasWidth,
                height: canvasHeight,
                fill: '#f5f5f5',
                listening: false
              }"
          />-->
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
                  @select="handleSelectCell(index)"
              />
            </template>
          </v-group>

          <!-- Группа для разделителей -->
          <v-group>

            <template v-if="modelingStore.showDividers">
              <!-- Горизонтальные разделители -->
              <v-line
                  v-for="(divider, index) in modelingStore.horizontalDividers"
                  :key="'horizontal-divider-' + index"
                  :config="dividersHorizontalLineConfig(divider)"
              />
              <!-- Вертикальные разделители -->
              <v-line
                  v-for="(divider, index) in  modelingStore.verticalDividers"
                  :key="'vertical-divider-' + index"
                  :config="dividersVerticalLineConfig(divider)"
              />
            </template>
          </v-group>

        </v-layer>
      </v-stage>
      <!-- Блок валидации с сообщениями об оставшейся ширине и высоте -->

      <div class="frame-builder__validation" v-if="!activeTransom.isValid">
        <p v-if="activeTransom.validation.widthDiff !== 0">
          Оставшаяся ширина: {{ activeTransom.validation.widthDiff }} мм
        </p>
        <p v-if="activeTransom.validation.heightDiff !== 0">
          Оставшаяся высота: {{ activeTransom.validation.heightDiff }} мм
        </p>
      </div>

    </div>

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
    stroke: activeTransom.value.isValid ? '#333' : 'red',
    strokeWidth: 3,
    fill: '#ffffff',
  }
})

const leafElementProps = computed(() => (cell, index) => {

  return {
    x: cell.x * scaleFactor.value + props.padding,
    y: cell.y * scaleFactor.value + props.padding,
    width: cell.width * scaleFactor.value,
    height: cell.height * scaleFactor.value,
    realWidth: cell.width,
    realHeight: cell.height,
    type: cell.type,
    isSelected: selectedCellIndex.value === index,
    showDimensions: modelingStore.showDimensions,
    scaleFactor: scaleFactor.value,
    offsets: cell.offsets,
    hingeSide: cell.hingeSide, //ToDo init in store in cell
    index
  }

})

const dividersVerticalLineConfig = computed(() => (divider) => {
  return {
    points: [
      divider * scaleFactor.value + props.padding, props.padding,
      divider * scaleFactor.value + props.padding, activeTransom.value.height * scaleFactor.value + props.padding
    ],
    stroke: '#999999',
    strokeWidth: 1,
    dash: [5, 5],
    listening: false
  }
})

const dividersHorizontalLineConfig = computed(() => (divider) => {
  return {
    points: [
      props.padding, divider * scaleFactor.value + props.padding,
      activeTransom.value.width * scaleFactor.value + props.padding, divider * scaleFactor.value + props.padding
    ],
    stroke: '#999999',
    strokeWidth: 1,
    dash: [5, 5],
    listening: false
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
.frame-builder {
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