<template>

  <button class="btn-white"
          @click="openModal"
          :disabled="!isValidTransom"
          :title="!isValidTransom ? 'Конструкция фрамуги не валидна' : ''"
  >
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
        />
      </div>

      <div class="decor-creator__list">
        <DecorList/>
      </div>
    </div>

    <template #footer>
      <button class="btn-red" @click="closeModal">Потвердить</button>
    </template>

  </Modal>


</template>


<script setup>

import {computed, ref} from "vue";
import {useModelingStore} from "@src/stores/index.js";
import DecorDraw from "@components/sections/Modeling/DecorCreator/DecorDraw/DecorDraw.vue";
import DecorList from "@components/sections/Modeling/DecorCreator/DecorList.vue";
import {Modal} from "@components/ui/index.js";
import {Icon} from "@iconify/vue";
import {storeToRefs} from "pinia";

//Адаптируем высоту экрана по высоте
const canvasHeight = computed(() => Math.min(600, window.innerHeight * 0.49));
//Адаптируем padding от высоты экрана
const padding = computed(() => Math.min(40, 40 * canvasHeight.value / 900));

// Хранилища
const modelingStore = useModelingStore();

const { activeTransom } = storeToRefs(modelingStore);

const isValidTransom = computed(() => {
    return activeTransom.value?.validationData?.isValid ?? false;
});

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