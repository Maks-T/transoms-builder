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
    <v-rect
        :config="mainRectConfig"

    />

    <!-- Внутренний прямоугольник для окна -->
    <v-rect
        :config="innerRectConfig"
    />

    <!-- Название типа полотна -->
    <v-text
        :config="textNameRectConfig"
    />

    <!-- Выделение окна -->
    <v-rect
        v-if="isSelected"
        :config="{
        width,
        height,
        stroke: '#4bbfff',
        strokeWidth: 4,
        fill: 'transparent',
        dash: [8, 4]
      }"
    />

    <!-- Размеры окна (если включены) -->
    <template v-if="showDimensions">
      <!-- Текст размера ширины (с учетом отступов) -->
      <v-text :config="textWidthRectConfig" />

      <!-- Текст размера высоты (с учетом отступов) -->
      <v-text :config="textHeightRectConfig" />
    </template>

  </v-group>
</template>
<script setup>
import {computed} from "vue";
import  {LEAF_TYPES, LEAF_NAMES} from "@constants";

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
  index: Number,
  isSelected: Boolean,
  showDimensions: Boolean
})

const emit = defineEmits(['select'])

const fillColor = computed(() => {
  switch (props.type) {
    case LEAF_TYPES.ACTIVE_LEAF: return 'rgba(179, 255, 179, 0.2)'
    case LEAF_TYPES.INACTIVE_LEAF: return 'rgba(204, 204, 204, 0.2)'
    case LEAF_TYPES.ACTIVE_LEAF_SMALL: return 'rgba(153, 153, 153, 0.2)'
    case LEAF_TYPES.INACTIVE_LEAF_SMALL: return 'rgba(102, 204, 255, 0.2)'
    default: return 'rgba(238, 238, 238, 0.2)'
  }
})

const strokeColor = computed(() => {
  return '#303030'//  isActive.value ? '#2E7D32' : '#333333'
})

const strokeWidth = 2;
const profileOffset = 15

const mainRectConfig = computed(() => {
  return {
    width: props.width,
    height: props.height,
    stroke: strokeColor.value,
    strokeWidth: strokeWidth.value,
    fill: fillColor.value,
  }
})

const innerRectConfig = computed(() => {
  return {
    x: profileOffset,
    y: profileOffset,
    width: props.width - 2 * profileOffset,
    height: props.height - 2 * profileOffset,
    stroke: strokeColor.value,
    strokeWidth: strokeWidth/2,
    fill: 'transparent'
  }
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


const typeLabel = computed(() => {
  return LEAF_NAMES[props.type] || props.type
})

const handleMouseUp = (event) => {
  console.log('click leaf ' + props.index);
  emit('select', props.index);
}

</script>