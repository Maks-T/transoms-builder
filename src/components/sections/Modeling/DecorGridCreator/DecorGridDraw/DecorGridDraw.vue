<template>
  <div class="decor-draw">
    <div v-if="activeTransom">
      <v-stage
          :config="{ width: canvasWidth, height: canvasHeight }"
          ref="stage"
      >
        <v-layer>
          <!-- Группа для элементов (leafs) -->
          <v-group>
            <template v-for="(cell, index) in decorCells" :key="'cell-'+index">
              <DecorGridLeafElement
                  v-if="cell && cell.type !== 'profile'"
                  v-bind="leafElementProps(cell, index)"
              />
            </template>
          </v-group>

          <!-- Группа для рамки фрамуги -->
          <v-group>
            <v-rect :config="rectFrameConfig" />
          </v-group>

          <!-- Новый слой для сетки и линий -->

            <v-group>
              <!-- Серые линии сетки (вертикальные) -->
              <v-line
                  v-for="(x, index) in gridVerticalLines"
                  :key="'v-line-' + index"
                  :config="{
                  points: [x * scaleFactor + padding, padding, x * scaleFactor + padding, activeTransom.height * scaleFactor + padding],
                  stroke: '#cccccc',
                  strokeWidth: 1,
                  listening: false
                }"
              />

              <!-- Серые линии сетки (горизонтальные) -->
              <v-line
                  v-for="(y, index) in gridHorizontalLines"
                  :key="'h-line-' + index"
                  :config="{
                  points: [padding, y * scaleFactor + padding, activeTransom.width * scaleFactor + padding, y * scaleFactor + padding],
                  stroke: '#cccccc',
                  strokeWidth: 1,
                  listening: false
                }"
              />

              <!-- Точки на пересечениях -->
              <v-circle
                  v-for="point in gridPoints"
                  :key="'point-' + point.x + '-' + point.y"
                  :config="{
                  x: point.x * scaleFactor + padding,
                  y: point.y * scaleFactor + padding,
                  radius: 4,
                  fill: drawingStart && drawingStart.x === point.x && drawingStart.y === point.y ? 'blue' : 'gray',
                  listening: true
                }"
                  @click="handlePointClick(point)"
              />

              <!-- Красные декоративные линии -->
              <v-line
                  v-for="line in activeDecorTransom.lines"
                  :key="line.id"
                  :config="{
                  points: [
                    line.start.x * scaleFactor + padding,
                    line.start.y * scaleFactor + padding,
                    line.end.x * scaleFactor + padding,
                    line.end.y * scaleFactor + padding
                  ],
                  stroke: '#ff0000',
                  strokeWidth: 2,
                  listening: true // Для опционального удаления
                }"
                  @click="handleLineClick(line.id)"
              />
            </v-group>



        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import {useDecorGridStore, useModelingStore} from "@stores/index.js";
import {computed} from 'vue';
import DecorGridLeafElement from "@components/sections/Modeling/DecorGridCreator/DecorGridDraw/DecorGridLeafElement.vue";

const props = defineProps({
  canvasWidth: { type: Number, default: 1100 },
  canvasHeight: { type: Number, default: 600 },
  padding: { type: Number, default: 40 },
});

const modelingStore = useModelingStore();
const decorStore = useDecorGridStore();

const { activeTransom } = storeToRefs(modelingStore);
const { selectedCellIndex, drawingStart } = storeToRefs(decorStore);

// Активная фрамуга декора
const activeDecorTransom = computed(() => decorStore.activeTransom);

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
const leafElementProps = (cell, index) => {
  return {
    padding: props.padding,
    cell,
    scaleFactor: scaleFactor.value,
    index: Number(index),
    isSelected: selectedCellIndex.value === index,
  };
};

// Вычисление позиций вертикальных линий сетки (в мм)
const gridVerticalLines = computed(() => {
  if (!activeTransom.value) return [];
  const step = 200;
  const lines = [];
  for (let x = 0; x <= activeTransom.value.width; x += step) {
    lines.push(x);
  }
  return lines;
});

// Вычисление позиций горизонтальных линий сетки (в мм)
const gridHorizontalLines = computed(() => {
  if (!activeTransom.value) return [];
  const step = 200;
  const lines = [];
  for (let y = 0; y <= activeTransom.value.height; y += step) {
    lines.push(y);
  }
  return lines;
});

// Вычисление точек пересечения (в мм)
const gridPoints = computed(() => {
  const points = [];
  gridVerticalLines.value.forEach(x => {
    gridHorizontalLines.value.forEach(y => {
      points.push({ x, y });
    });
  });
  return points;
});

// Обработчик клика на точку
const handlePointClick = (point) => {
  if (!drawingStart.value) {
    // Первая точка
    decorStore.setDrawingStart(point);
  } else {
    // Вторая точка: проверка и добавление линии
    decorStore.addLine(drawingStart.value, point);
  }
};

// Опционально: обработчик клика на линию (для удаления)
const handleLineClick = (lineId) => {
  if (confirm('Удалить линию?')) {
    decorStore.removeLine(lineId);
  }
};

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