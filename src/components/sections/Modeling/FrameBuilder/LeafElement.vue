<template>
  <v-group
      :config="{
      x,
      y,
      listening: true
    }"
      @mouseup="handleMouseUp"
  >
    <!-- Основной прямоугольник окна -->
    <v-rect :config="mainRectConfig"/>

    <!-- Внутренний прямоугольник для окна -->
    <v-rect :config="innerRectConfig"/>

    <!-- Название типа полотна -->
    <v-text v-if="showLeafsNames" :config="textNameRectConfig"/>

    <!-- Треугольник для отображения типа открывания (для активных полотен) -->
    <v-line v-if="isActive" :config="openingTriangleConfig"/>

    <!-- Номер ячейки -->
    <v-text :config="numberTextConfig"/>

    <!-- Выделение окна -->
    <v-rect v-if="isSelected" :config="selectRectConfig"/>

    <!-- Размеры окна (если включены) -->
    <template v-if="showDimensions">
      <!-- Текст размера ширины (с учетом отступов) -->
      <v-text :config="textWidthRectConfig"/>

      <!-- Текст размера высоты (с учетом отступов) -->
      <v-text :config="textHeightRectConfig"/>
    </template>

  </v-group>
</template>
<script setup>
import {computed} from "vue";
import {LEAF_TYPES, LEAF_NAMES, LEAF_HINGE_SIDE} from "@constants";

const props = defineProps({
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  realWidth: Number,
  realHeight: Number,
  type: String,
  scaleFactor: Number,
  offsets: Object,
  hingeSide: String,
  index: Number,
  isSelected: Boolean,
  showDimensions: Boolean,
  showLeafsNames: Boolean
})

const emit = defineEmits(['select'])

const fillColor = computed(() => {
  switch (props.type) {
    case LEAF_TYPES.ACTIVE_LEAF:
      return 'rgba(179, 255, 179, 0.2)'
    case LEAF_TYPES.INACTIVE_LEAF:
      return 'rgba(204, 204, 204, 0.2)'
    case LEAF_TYPES.ACTIVE_LEAF_SMALL:
      return 'rgba(102, 204, 255, 0.2)'
    case LEAF_TYPES.INACTIVE_LEAF_SMALL:
      return 'rgba(153, 153, 153, 0.2)'
    default:
      return 'rgba(238, 238, 238, 0.2)'
  }
})

const strokeColor = computed(() => {
  return '#303030'//  isActive.value ? '#2E7D32' : '#333333'
})

// Определяем, является ли полотно активным
const isActive = computed(() => {//ToDo добавить в константу активные типы открывания
  return props.type === LEAF_TYPES.ACTIVE_LEAF || props.type === LEAF_TYPES.ACTIVE_LEAF_SMALL;
})

const strokeWidth = 2;
const profileOffset = 12

const mainRectConfig = computed(() => {
  return {
    width: props.width,
    height: props.height,
    stroke: strokeColor.value,
    strokeWidth: strokeWidth,
    fill: fillColor.value,
  }
})

const innerRectConfig = computed(() => {
  return {
    x: profileOffset,
    y: profileOffset,
    width: props.width - 2 * profileOffset,
    height: props.height - 2 * profileOffset,
    stroke: 'rgba(81,81,81,0.8)',
    strokeWidth: strokeWidth / 2,
    fill: 'transparent'
  }
})


const typeLabel = computed(() => {
  return LEAF_NAMES[props.type] || props.type
})

const textNameRectConfig = computed(() => {
  return {
    x: props.width / 2 - typeLabel.value.length * 2,
    y: props.height / 2,
    text: typeLabel.value,
    fill: '#006699',
    fontSize: 12,
    align: 'center',
    verticalAlign: 'middle',
  }
})

const textWidthRectConfig = computed(() => {
  return {
    x: 20,
    y: 20,
    text: `${props.realWidth - props.offsets.left - props.offsets.right} мм`,
    fill: '#0059fd',
    fontSize: 12,
    align: 'center',
    fontWeight: 'bold',
  }
})

const textHeightRectConfig = computed(() => {
  return {
    x: 20,
    y: props.height * 0.8,
    text: `${props.realHeight - props.offsets.top - props.offsets.bottom} мм`,
    fill: '#0059fd',
    fontSize: 12,
    align: 'center',
    fontWeight: 'bold',
    rotation: -90
  }
})

const selectRectConfig = computed(() => {
  return {
    width: props.width,
    height: props.height,
    stroke: '#4bbfff',
    strokeWidth: 4,
    fill: 'transparent',
    dash: [8, 4]
  }

})


// Конфигурация для треугольника открывания
const openingTriangleConfig = computed(() => {
  const defaultConfig = {
    stroke: 'rgba(81,81,81,0.6)',
    strokeWidth: 1,
    fill: 'transparent',
    closed: true
  }

  if (props.hingeSide === LEAF_HINGE_SIDE.LEFT) {
    // Для левого открывания
    return {
      points: [
        0, 0,
        props.width, props.height / 2,
        0, props.height
      ],
      ...defaultConfig
    }

  } else if (props.hingeSide === LEAF_HINGE_SIDE.RIGHT) {
    // Для правого открывания
    return {
      points: [
        props.width, 0,
        0, props.height / 2,
        props.width, props.height
      ],
      ...defaultConfig
    }
  }

  return null;
})

// Конфигурация для текста номера ячейки
const numberTextConfig = computed(() => {
  return {
    x: props.width / 2,
    y: props.height * 0.4,
    text: String(props.index + 1),
    fontSize: 8,
    fill: 'rgba(81,81,81,0.6)',
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 3,
    offsetY: 3
  };
});


const handleMouseUp = (event) => {
  console.log('click leaf ' + props.index);
  emit('select', props.index);
}

</script>