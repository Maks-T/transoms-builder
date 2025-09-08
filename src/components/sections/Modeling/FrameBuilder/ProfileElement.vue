<template>
  <v-group
      :config="{
      x: x,
      y: y
    }"
  >
    <!-- Прямоугольник профиля -->
    <v-rect :config="mainRectConfig"/>

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


</script>