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
            <v-rect :config="rectFrameConfig"/>
          </v-group>

          <!-- Слой для сетки -->
          <v-group
              v-if="decorStore.showGrid"
              :config="{
                x: gridOffset.x,
                y: gridOffset.y
              }"
          >
            <!-- Линии сетки (вертикальные) -->
            <v-line
                v-for="(x, index) in gridVerticalLines"
                :key="'v-line-' + index + Math.random()"
                :config="verticalLineConfig(x)"
            />


            <!-- Линии сетки (горизонтальные) -->
            <v-line
                v-for="(y, index) in gridHorizontalLines"
                :key="'h-line-' + index + Math.random()"
                :config="horizontalLineConfig(y)"
            />

            <!-- Точки на пересечениях -->
            <v-circle
                v-for="point in gridPoints"
                :key="'point-' + point.x + '-' + point.y + Math.random()"
                :config="pointConfig(point)"
                @click="(e) => handlePointClick(e, point)"
                @mouseenter="() => handlePointMouseEnter(point)"
                @mouseleave="handlePointMouseLeave"
            />

            <v-circle
                v-if="hoveredPoint"
                :config="hoverPointConfig()"
            />
          </v-group>

          <!-- Слой сетки -->
          <v-group>
            <!-- Декоративные линии -->
            <v-line
                style="cursor: pointer"
                v-for="line in activeDecorTransom.lines"
                :key="line.id + Math.random()"
                :config="decorLineConfig(line)"
                @click="handleLineClick(line.id)"
            />
          </v-group>

        </v-layer>
      </v-stage>
    </div>
  </div>
  <button class="btn-red" @click="decorStore.splitLinesToCells" style="margin-top: 20px;">Разделить линии</button>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import {useDecorGridStore, useModelingStore} from "@stores/index.js";
import {computed, ref, watch} from 'vue';
import DecorGridLeafElement
  from "@components/sections/Modeling/DecorGridCreator/DecorGridDraw/DecorGridLeafElement.vue";

const props = defineProps({
  canvasWidth: {type: Number, default: 1100},
  canvasHeight: {type: Number, default: 600},
  padding: {type: Number, default: 40},
});

const modelingStore = useModelingStore();
const decorStore = useDecorGridStore();

const {activeTransom} = storeToRefs(modelingStore);
const {selectedCellIndex, drawingStart, stepWidth: step, gridOffset} = storeToRefs(decorStore)

const hoveredPoint = ref(null);

// Активная фрамуга декора
const activeDecorTransom = computed(() => decorStore.activeTransom);
const selectedLine = computed(() => decorStore.activeTransom?.selectedLine || null);

// Реактивно получаем ячейки из decorStore
const decorCells = computed(() => {
  console.log(decorStore.calculatedCells(activeTransom.value))

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

// Конфиг вертикальных линий
const verticalLineConfig = (x) => ({
  points: [
    x * scaleFactor.value + props.padding,
    props.padding,
    x * scaleFactor.value + props.padding,
    activeTransom.value.height * scaleFactor.value + props.padding
  ],
  stroke: '#cccccc',
  strokeWidth: 1,
  listening: false
})

// Конфиг горизонтальных линий
const horizontalLineConfig = (y) => ({
  points: [
    props.padding,
    y * scaleFactor.value + props.padding,
    activeTransom.value.width * scaleFactor.value + props.padding,
    y * scaleFactor.value + props.padding
  ],
  stroke: '#cccccc',
  strokeWidth: 1,
  listening: false
})


// Конфиг точек сетки
const pointConfig = (point) => ({
  x: point.x * scaleFactor.value + props.padding,
  y: point.y * scaleFactor.value + props.padding,
  radius: 4,
  fill: drawingStart.value &&
  drawingStart.value.x === point.x &&
  drawingStart.value.y === point.y
      ? 'blue'
      : 'gray',
  listening: true
})

// Конфиг для отладочной точки ховера (теперь computed)
const hoverPointConfig = () => {
  if (!hoveredPoint.value) return;

  return {
    x: hoveredPoint.value.x * scaleFactor.value + props.padding,
    y: hoveredPoint.value.y * scaleFactor.value + props.padding,
    radius: 8,
    fill: 'rgba(255, 102, 0, 0.5)',
    listening: false,
  }

};

// Обработчики ховера
const handlePointMouseEnter = (point) => {
  hoveredPoint.value = point;
};

const handlePointMouseLeave = () => {
  hoveredPoint.value = null;
};


// Конфиг декоративных линий
const decorLineConfig = (line) => ({
  points: [
    line.start.x * scaleFactor.value + props.padding,
    line.start.y * scaleFactor.value + props.padding,
    line.end.x * scaleFactor.value + props.padding,
    line.end.y * scaleFactor.value + props.padding
  ],
  stroke: selectedLine.value?.id === line.id ? '#14ea17' : '#f86439',
  strokeWidth: 4,
  listening: true
})


// Вычисление позиций вертикальных линий сетки (в мм)
const gridVerticalLines = computed(() => {
  if (!activeTransom.value) return []
  const width = activeTransom.value.width

  const lines = []

  for (let x = 0; x <= width + gridOffset.value.x; x += step.value) {
    lines.push(x)
  }
  lines.push(width + gridOffset.value.x) //последняя линия
  return lines
})

// Вычисление позиций горизонтальных линий сетки (в мм)
const gridHorizontalLines = computed(() => {
  if (!activeTransom.value) return []
  const lines = []
  for (let y = 0 + gridOffset.value.y; y <= activeTransom.value.height + gridOffset.value.y; y += step.value) {
    lines.push(y)
  }
  lines.push(activeTransom.value.height + gridOffset.value.y)
  return lines
})

// Вычисление точек пересечения (в мм)
const gridPoints = computed(() => {
  const points = [];
  gridVerticalLines.value.forEach(x => {
    gridHorizontalLines.value.forEach(y => {
      points.push({x, y});
    });
  });
  return points;
});


// Обработчик клика на точку
const handlePointClick = (e, point) => {
  e.evt.stopImmediatePropagation();

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
  if (drawingStart.value) return;

  if (selectedLine.value && selectedLine.value.id === lineId) {
    decorStore.setSelectedLine(null)
  } else {
    decorStore.setSelectedLine(lineId)
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