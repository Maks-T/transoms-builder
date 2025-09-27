<template>
  <div class="frame-settings">


    <div class="frame-settings__sizes_and_style">
      <!-- Поля для размеров фрамуги -->
      <div class="frame-settings__sizes" v-if="activeTransom">
        <InputText
            id="frame-width"
            type="number"
            :value="activeTransom.width"
            @input="onInputTransomWidthDebounced"
            :min="activeTransom.minWidth"
            :max="activeTransom.maxWidth"
            :label="_('Ширина: ')"
        />

        <InputText
            id="frame-height"
            type="number"
            :value="activeTransom.height"
            @input="onInputTransomHeightDebounced"
            :min="activeTransom.minHeight"
            :max="activeTransom.maxHeight"
            :label="_('Высота: ')"
        />
      </div>

      <!-- Кнопка внешний вид -->
      <DecorCreator />

    </div>

    <div class="frame-settings__options">
      <!-- Селект профилей -->
      <Select
          v-model="selectedProfileId"
          :options="modelingStore.profileTypesArray"
          placeholder="Выберите профиль"
          :label="_('Профиль: ')"
      />
      <!-- Селект шаблонов -->
      <Select
          v-model="selectedTemplateId"
          :options="modelingStore.transomTemplatesArray"
          placeholder="Выберите шаблон"
          :label="_('Шаблон: ')"
      />

    </div>

    <div class="frame-settings__group">
    </div>

    <div class="">
      <DecorGridCreator />
    </div>

  </div>
</template>

<script setup>
import {useModelingStore} from "@stores"
import {watch, computed, ref, onMounted} from "vue"
import {storeToRefs} from "pinia"
import {useDebounce} from "@src/composables";
import {InputText, Select, Modal} from "@components/ui";
import {Icon} from "@iconify/vue";
import {useTranslate as _} from '@src/composables/index.js';
import DecorCreator from "@components/sections/Modeling/DecorCreator/DecorCreator.vue";
import DecorGridCreator from "@components/sections/Modeling/DecorGridCreator/DecorGridCreator.vue";

const modelingStore = useModelingStore()
const {activeTransom} = storeToRefs(modelingStore);

const onInputTransomWidthDebounced = useDebounce(($event) => {
  modelingStore.setTransomWidth(Number($event.target.value))
  $event.target.value = activeTransom.value.width
}, 700)

const onInputTransomHeightDebounced = useDebounce(($event) => {
  modelingStore.setTransomHeight(Number($event.target.value))
  $event.target.value = activeTransom.value.height
}, 700)

const selectedProfileId = computed({
  get: () => modelingStore.selectedProfileId,
  set: (value) => modelingStore.setProfileType(value)
})

const selectedTemplateId = computed({
  get: () => modelingStore.selectedTemplateId,
  set: (value) => modelingStore.setTransomTemplate(value)
})


onMounted(() => {
  if (modelingStore.configsStore.defaultProfile) {
    modelingStore.setProfileType(modelingStore.configsStore.defaultProfile)
  }

  if (modelingStore.configsStore.defaultTemplate) {
    modelingStore.setTransomTemplate(modelingStore.configsStore.defaultTemplate)
  }
})



</script>

<style lang="scss" scoped>
.frame-settings {
  grid-row: 1;
  grid-column: 1 / span 2;

  display: flex;
  flex-direction: row;
  gap: rem(6);

  &__sizes_and_style {
    display: flex;
    flex-direction: column;
    gap: rem(6);
  }

  &__sizes {
    display: flex;
    flex-direction: row;
    gap: rem(6);
  }

  &__options {
    display: flex;
    flex-direction: row;
    gap: rem(6);
  }
}
</style>
