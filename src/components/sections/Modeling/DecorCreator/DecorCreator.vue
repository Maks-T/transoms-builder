<template>
    <div class="decor-creator">    
      <DecorDraw
          :canvas-width="900"
          :canvas-height="canvasHeight"
          :padding="padding"
          @update:selected-cell-index="handleSelectedCellIndex"
      />    
    </div>
</template>

<script setup>

import {storeToRefs} from "pinia";
import {computed, ref, watch} from "vue";
import {useModelingStore} from "@src/stores/index.js";
import DecorDraw from "@components/sections/Modeling/DecorCreator/DecorDraw/DecorDraw.vue";

//Адаптируем высоту экрана по высоте
const canvasHeight = computed(() => Math.min(600, window.innerHeight * 0.49));
//Адаптируем padding от высоты экрана
const padding = computed(() => Math.min(40, 40 * canvasHeight.value / 900));

const modelingStore = useModelingStore()

const {activeTransom} = storeToRefs(modelingStore);
const selectedCell = ref(null);

const handleSelectedCellIndex = (index) => {
  selectedCell.value = activeTransom.value.cells[index] ?? null;
  console.log('Выбранная ячейка в декоре:', selectedCell.value)
}


// Отслеживание изменений активной фрамуги
watch(activeTransom, (newTransom) => {
  if (newTransom) {
    console.log('DECOR: Активная фрамуга изменилась:', newTransom)

    selectedCell.value = activeTransom.value.cells[selectedCell?.value?.idx] ?? null;
  }
}, {deep: true})

</script>


<style lang="scss" scoped>
.decor-creator {
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content 1fr min-content;

  gap: rem(10);
}
</style>