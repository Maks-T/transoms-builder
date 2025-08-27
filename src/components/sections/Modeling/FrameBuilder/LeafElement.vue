<template>
  <v-group
      :config="{
      x,
      y,
      listening: true
    }"
      @click="$emit('click')"
  >
    <!-- Основной прямоугольник окна -->
    <v-rect
        :config="mainRectConfig"
        @mouseup="handleMouseUp"
    />
  </v-group>
</template>
<script setup>
import {computed} from "vue";

const props = defineProps({
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  type: String,
  scaleFactor: Number,
  offsets: Object
})

console.log('PROPS', props)

const fillColor = computed(() => {
  switch (props.type) {
    case 'active-leaf': return 'rgba(179, 255, 179, 0.6)'
    case 'inactive-leaf': return 'rgba(204, 204, 204, 0.6)'
    case 'inactive-leaf-small': return 'rgba(153, 153, 153, 0.6)'
    case 'active-leaf-small': return 'rgba(102, 204, 255, 0.6)'
    default: return 'rgba(238, 238, 238, 0.6)'
  }
})

const strokeColor = computed(() => {
  return '#2E7D32'//  isActive.value ? '#2E7D32' : '#333333'
})

const strokeWidth = 2;

const mainRectConfig = computed(() => {
  return {
    width: props.width,
    height: props.height,
    stroke: strokeColor.value,
    strokeWidth: strokeWidth.value,
    fill: fillColor.value,
    listening: true
  }
})

const emit = defineEmits(['click'])

const handleMouseUp = (event) => {
  console.log('click leaf')
}
</script>