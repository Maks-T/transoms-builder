<template>

  <button class="btn-white" @click="openModal">
    <Icon icon="mingcute:paint-2-line" class="icon"/>
    <span>Внешний вид</span>
  </button>

  <Modal
      v-model="isModalOpen"
      width="80vw"
      :show-close-button="true"
  >

    <div class="decor-creator">
      <div class="decor-creator__draw">
        <DecorDraw
            :canvas-width="900"
            :canvas-height="canvasHeight"
            :padding="padding"
            :cells

        />
      </div>

      <div class="decor-creator__list">
        <DecorList
            :decor-lists="decorLists"
        />
      </div>
    </div>

    <template #footer>
      <button class="btn-red" @click="closeModal">Потвердить</button>
    </template>

  </Modal>


</template>


<script setup>

import {storeToRefs} from "pinia";
import {computed, ref, watch} from "vue";
import {useDecorStore, useModelingStore} from "@src/stores/index.js";
import DecorDraw from "@components/sections/Modeling/DecorCreator/DecorDraw/DecorDraw.vue";
import DecorList from "@components/sections/Modeling/DecorCreator/DecorList.vue";
import {Modal} from "@components/ui/index.js";
import {Icon} from "@iconify/vue";

//Адаптируем высоту экрана по высоте
const canvasHeight = computed(() => Math.min(600, window.innerHeight * 0.49));
//Адаптируем padding от высоты экрана
const padding = computed(() => Math.min(40, 40 * canvasHeight.value / 900));

// Хранилища
const modelingStore = useModelingStore();
const decorStore = useDecorStore();

const { activeTransom } = storeToRefs(modelingStore);

const cells = computed(() => {
  return decorStore.calculatedCells(activeTransom.value)
})



// Отслеживание изменений активной фрамуги
watch(activeTransom, (newTransom) => {
  //ToDo может принимать фрамугу из пропсов
  if (newTransom) {
    console.log('DECOR: Активная фрамуга изменилась:', newTransom);

   // cells.value = decorStore.calculatedCells(newTransom)
  }
}, { deep: true });



const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

</script>

<style lang="scss" scoped>
.decor-creator {
  display: grid;
  grid-template-columns: 60% 36%;
  gap: rem(30);

  .decor-creator__draw {

  }

  .decor-creator__list {

  }
}
</style>