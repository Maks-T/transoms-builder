<template>
  <v-group
      :config="{
      x: cell.x * props.scaleFactor + props.padding,
      y: cell.y  * props.scaleFactor + props.padding,
      listening: true
    }"
      @mouseup="handleMouseUp"
  >
    <!-- Основной прямоугольник окна -->
    <v-rect :config="mainRectConfig"/>

    <!-- Выделение окна -->
    <v-rect v-if="isSelected" :config="selectRectConfig"/>

  </v-group>
</template>
<script setup>
import {computed} from "vue";

const props = defineProps({
  padding: Number,
  cell: Object,
  scaleFactor: Number,
  isSelected: Boolean,
  index: Number,
})

console.log('props.cell', props.cell)

const emit = defineEmits(['select'])

const fillColor = 'white'
const strokeColor = '#303030'
const strokeWidth = 1;

const mainRectConfig = computed(() => {
  return {
    width: props.cell.width * props.scaleFactor,
    height: props.cell.height * props.scaleFactor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    fill: fillColor,
  }
})

const selectRectConfig = computed(() => {
  return {
    width: props.cell.width * props.scaleFactor,
    height: props.cell.height * props.scaleFactor,
    stroke: '#4bbfff',
    strokeWidth: 4,
    fill: 'transparent',
    dash: [8, 4]
  }

})

const handleMouseUp = (event) => {
  console.log('click leaf ' + props.index, typeof props.index);
  emit('select', props.index);
}

</script>