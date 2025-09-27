<template>
  <Step :title="_('Моделирование')">
    <div class="section-modeling">
      <FrameSettingsPanel/>
      <FrameToolbar/>
      <FrameBuilder
          :canvas-width="900"
          :canvas-height="canvasHeight"
          :padding="padding"
          @update:selected-cell-index="handleSelectedCellIndex"
      />
      <CellProperties
          v-if="selectedCell"
          :cell="selectedCell"
      />
    </div>
  </Step>
</template>

<script setup>

import {useTranslate as _} from "@src/composables/index.js";
import Step from "@components/common/Step.vue";
import FrameBuilder from "@components/sections/Modeling/FrameBuilder/FrameBuilder.vue";
import FrameSettingsPanel from "@components/sections/Modeling/FrameSettingsPanel.vue";
import FrameToolbar from "@components/sections/Modeling/FrameToolbar.vue";
import CellProperties from "@components/sections/Modeling/CellProperties.vue";

import {storeToRefs} from "pinia";
import {computed, ref, watch} from "vue";
import {useDecorStore, useModelingStore} from "@src/stores/index.js";

//Адаптируем высоту экрана по высоте
const canvasHeight = computed(() => Math.min(600, window.innerHeight * 0.49));
//Адаптируем padding от высоты экрана
const padding = computed(() => Math.min(40, 40 * canvasHeight.value / 900));

const modelingStore = useModelingStore()

const {activeTransom} = storeToRefs(modelingStore);
const selectedCell = ref(null);

const handleSelectedCellIndex = (index) => {
  selectedCell.value = activeTransom.value.cells[index] ?? null;
  console.log('Выбранная ячейка:', selectedCell.value)
}

const decorStore = useDecorStore() //ToDo remove
// Отслеживание изменений активной фрамуги
watch(activeTransom, (newTransom) => {
  if (newTransom) {
    console.log('Активная фрамуга изменилась:', newTransom)

    selectedCell.value = activeTransom.value.cells[selectedCell?.value?.idx] ?? null;
  }
}, {deep: true})



watch(activeTransom, (newTransom) => {

});


</script>


<style lang="scss" scoped>
.section-modeling {
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content 1fr min-content;

  gap: rem(10);
}
</style>