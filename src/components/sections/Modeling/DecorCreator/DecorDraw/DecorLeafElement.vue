<template>
  <v-group
      :config="{
        x: cell.x * props.scaleFactor + props.padding,
        y: cell.y * props.scaleFactor + props.padding,
        listening: true
      }"
      >
    <!-- Основной прямоугольник окна -->
    <v-rect
        :config="mainRectConfig"
        @click="() => handleCellClick()"
        @dblclick="() => handleCellDblClick()"
    />

    <!-- Внутренние прямоугольники -->
    <template v-for="(rect, rectIndex) in cell.presetRects.items" :key="'rect-' + rectIndex">
      <v-rect
          :config="innerRectConfig(rect, rectIndex)"          
          @click="() => handleRectClick(rectIndex)"
          @dblclick="() => handleRectDblClick(rectIndex)"
      />
      <v-text
          v-if="isProfileRail"
          :config="textConfig(rect, rectIndex)"
      />
    </template>

    <!-- Выделение окна -->
    <v-rect v-if="isSelected" :config="selectRectConfig"/>

<!--    <v-path :config="iconConfig"/>-->
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

const isProfileRail = computed(() => {
  return props.cell.presetType === 'profileRail';
});

const isSelected = computed(() => {
  return decorStore.selectedCellIndex === props.index;
});

const isRectSelected = computed(() => (rectIndex) => {
  return (
      decorStore.selectedRectIndex === rectIndex &&
      decorStore.selectedCellIndex === props.index
  );
});

const mainRectConfig = computed(() => {
  return {
    width: props.cell.width * props.scaleFactor,
    height: props.cell.height * props.scaleFactor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    fill: fillColor,
    listening: !isProfileRail.value
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

const innerRectConfig = (rect, rectIndex) => {
  return {
    x: rect.x * props.scaleFactor,
    y: rect.y * props.scaleFactor,
    width: rect.width * props.scaleFactor,
    height: rect.height * props.scaleFactor,
    stroke: "#666",
    strokeWidth: 1,
    fill: rect.material || "transparent",
    listening: isProfileRail.value,
  };
};

const textConfig = (rect, rectIndex) => {
  const centerX = (rect.x + rect.width / 2) * props.scaleFactor;
  const centerY = (rect.y + rect.height / 2) * props.scaleFactor;
  return {
    x: centerX - 5,
    y: centerY - 8,
    text: rectIndex + 1,
    fontSize: 12,
    fontFamily: "Arial",
    fontStyle: isRectSelected.value(rectIndex) ? "bold" : "normal",
    fill: isRectSelected.value(rectIndex) ? "#000" : "#9f3a3a",
  };
};

/*const mirrorIconPath = 'M21.553 6.064A.75.75 0 0 1 22 6.75v10.5a.75.75 0 0 1-1.256.554l-5.75-5.25a.75.75 0 0 1 0-1.108l5.75-5.25a.75.75 0 0 1 .809-.132M2.447 17.936A.75.75 0 0 1 2 17.25V6.75a.75.75 0 0 1 1.256-.554l5.75 5.25a.75.75 0 0 1 0 1.108l-5.75 5.25a.75.75 0 0 1-.809.132M7.387 12L3.5 8.45v7.1L7.388 12Zm9.226 0l3.887 3.55v-7.1L16.612 12ZM12 2.75a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75m0 4a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75m0 8a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75m0 4a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75m0-8a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75';

const iconConfig = computed(() => {
  return {
    x: 10,
    y: 10,
    data: mirrorIconPath,
    fill: '#666',
    listening: false
  };
});*/

const handleCellClick = () => {
  decorStore.setSelectedCellIndex(props.index);
  decorStore.setSelectedRectIndex(null);
  console.log('click leaf ' + props.index);
};

const handleCellDblClick = () => {
  console.log('double click leaf ' + props.index);
}

const handleRectClick = (rectIndex) => {
  console.log(`Клик на rectIndex ${rectIndex} в cellIndex ${props.index}`);
  decorStore.setSelectedCellIndex(props.index);
  decorStore.setSelectedRectIndex(rectIndex);
};

const handleRectDblClick = (rectIndex) => {
  console.log(`Двойной клик на rectIndex ${rectIndex} в cellIndex ${props.index}`);
};

</script>