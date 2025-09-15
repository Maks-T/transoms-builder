<template>
  <v-group
      :config="{
      x: x,
      y: y
    }"
  >
    <!-- Прямоугольник профиля -->
    <v-rect :config="mainRectConfig"/>

    <!-- Номер ячейки -->
    <v-text :config="numberTextConfig"/>

  </v-group>
</template>

<script setup>
import {computed} from "vue";

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
  showDimensions: Boolean
})


const fillColor = 'rgb(160,160,160)';

const mainRectConfig = computed(() => {
  return {
    width: props.width,
    height: props.height,
    stroke: fillColor,
    strokeWidth: 1,
    fill: fillColor,
  }
})


// Конфигурация для текста номера ячейки
const numberTextConfig = computed(() => {
  return {
    x: props.width / 2,
    y: props.height * 0.4,
    text: String(props.index + 1),
    fontSize: 8,
    fill: 'rgb(227,227,227)',
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 3,
    offsetY: 3
  };
});


</script>