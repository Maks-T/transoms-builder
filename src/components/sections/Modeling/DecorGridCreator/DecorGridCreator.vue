<template>

  <button class="btn-white"
          @click="openModal"
          :disabled="!isValidTransom"
          :title="!isValidTransom ? 'Конструкция фрамуги не валидна' : ''"
  >
    <Icon icon="mingcute:paint-2-line" class="icon"/>
    <span>Конфигурация декора</span>
  </button>

  <Modal
      v-model="isModalOpen"
      width="80vw"
      :show-close-button="true"
  >

    <div class="decor-creator">

      <div class="decor-creator__toolbar">
        <DecorGridToolbar />
      </div>
      <div class="decor-creator__draw">
        <DecorGridDraw
            :canvas-width="900"
            :canvas-height="canvasHeight"
            :padding="padding"
        />
      </div>

      <div class="decor-creator__settings-panel">
        <DecorGridSettingsPanel />
      </div>

    </div>

    <template #footer>
      <button class="btn-red" @click="closeModal">Потвердить</button>
    </template>

  </Modal>


</template>


<script setup>

import {computed, ref, watch} from "vue";
import {useDecorGridStore, useModelingStore} from "@src/stores/index.js";

import {Modal} from "@components/ui/index.js";
import {Icon} from "@iconify/vue";
import {storeToRefs} from "pinia";
import DecorGridDraw from "@components/sections/Modeling/DecorGridCreator/DecorGridDraw/DecorGridDraw.vue";
import DecorGridSettingsPanel from "@components/sections/Modeling/DecorGridCreator/DecorGridSettingsPanel.vue";
import DecorGridToolbar from "@components/sections/Modeling/DecorGridCreator/DecorGridToolbar.vue";

//Адаптируем высоту экрана по высоте
const canvasHeight = computed(() => Math.min(600, window.innerHeight * 0.49));
//Адаптируем padding от высоты экрана
const padding = computed(() => Math.min(40, 40 * canvasHeight.value / 900));

// Хранилища
const modelingStore = useModelingStore();

const { activeTransom } = /** @type Transom */ storeToRefs(modelingStore);

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
  grid-template-columns: 44px 60% 32%;
  gap: rem(16) rem(30);

  .decor-creator__draw {

  }
  .decor-creator__draw {

  }
}
</style>