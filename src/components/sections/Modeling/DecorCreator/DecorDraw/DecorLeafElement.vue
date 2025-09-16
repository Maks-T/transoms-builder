<template>
  <v-group
      :config="{
      x: (cell.x + cell.offsets.left) * scaleFactor + props.padding,
      y: (cell.y + cell.offsets.top) * scaleFactor + props.padding,
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
  cell: /** @type {TransomCell} */ Object,
  scaleFactor: Number,
  isSelected: Boolean,
  index: Number,
})

const emit = defineEmits(['select'])

const fillColor = 'white'
const strokeColor = '#303030'
const strokeWidth = 1;

const mainRectConfig = computed(() => {
  return {
    width: props.cell.innerWidth * props.scaleFactor,
    height: props.cell.innerHeight * props.scaleFactor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    fill: fillColor,
  }
})

const selectRectConfig = computed(() => {
  return {
    width: props.cell.innerWidth * props.scaleFactor,
    height: props.cell.innerHeight * props.scaleFactor,
    stroke: '#4bbfff',
    strokeWidth: 4,
    fill: 'transparent',
    dash: [8, 4]
  }

})

const handleMouseUp = (event) => {
  console.log('click leaf ' + props.index);
  emit('select', props.index);
}

</script>