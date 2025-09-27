<template>
  <v-group
      :config="{
        x: cell.x * props.scaleFactor + props.padding,
        y: cell.y * props.scaleFactor + props.padding,
        listening: false
      }"
      >
    <!-- Основной прямоугольник окна -->
    <v-rect
        :config="mainRectConfig"
    />

    <!-- Выделение окна -->
    <v-rect v-if="isSelected" :config="selectRectConfig"/>

  </v-group>

</template>

<script setup>
import {computed} from "vue";
import {useDecorStore, useModelingStore} from "@stores/index.js";
import {storeToRefs} from "pinia";

const props = defineProps({
  padding: Number,
  cell: /** @type {DecorCell} */ Object,
  scaleFactor: Number,
  index: Number,
});

const decorStore = useDecorStore();
const modelingStore = useModelingStore();
const {activeTransom} = storeToRefs(modelingStore);

const fillColor = "white";
const strokeColor = "#303030";
const strokeWidth = 2;

const isSelected = computed(() => {
  return decorStore.selectedCellIndex === props.index;
});


const mainRectConfig = computed(() => {
  return {
    width: props.cell.width * props.scaleFactor,
    height: props.cell.height * props.scaleFactor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    fill: fillColor,
    listening: false
  };
});

const selectRectConfig = computed(() => {
  return {
    x: -3,
    y: -3,
    width: props.cell.width * props.scaleFactor + 6,
    height: props.cell.height * props.scaleFactor + 6,
    stroke: "#9F3A3A",
    strokeWidth: 2,
    fill: "transparent",
    listening: false, // чтобы не блокировало клики
  };
});


const handleCellClick = () => {
  decorStore.setSelectedCellIndex(props.index);
  decorStore.setSelectedRectIndex(null);
  console.log('click leaf ' + props.index);
};

const handleCellDblClick = () => {
  console.log('double click leaf ' + props.index);
}


</script>