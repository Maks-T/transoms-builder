<template>
  <div class="frame-settings">

    <!-- Поля для размеров фрамуги -->
    <div class="dimension-inputs" v-if="activeTransom">
      <div class="input-group">
        <label for="frame-width">Ширина:</label>
        <input
            id="frame-width"
            type="number"
            :value="activeTransom.width"
            @input="onInputTransomWidthDebounced"
            :min="activeTransom.minWidth || 100"
            :max="activeTransom.maxWidth || 3000"
        >

      </div>

      <div class="input-group">
        <label for="frame-height">Высота:</label>
        <input
            id="frame-height"
            type="number"
            :value="activeTransom.height"
            @input="onInputTransomHeightDebounced"
            :min="activeTransom.minHeight || 100"
            :max="activeTransom.maxHeight || 3000"
        >
      </div>
    </div>

    <!-- Селект профилей -->
    <select v-model="selectedProfileId">
      <option
          v-for="profile in modelingStore.profileTypesArray"
          :key="profile.id"
          :value="profile.id"
      >
        {{ profile.name }}
      </option>
    </select>

    <!-- Селект шаблонов -->
    <select v-model="selectedTemplateId">
      <option
          v-for="template in modelingStore.transomTemplatesArray"
          :key="template.id"
          :value="template.id"
      >
        {{ template.name }}
      </option>
    </select>

  </div>
</template>

<script setup>
import { useModelingStore } from "@stores"
import {watch, computed, ref, onMounted} from "vue"
import { storeToRefs } from "pinia"
import {useDebounce} from "@src/composables";


const modelingStore = useModelingStore()
const { activeTransom } = storeToRefs(modelingStore);

const onInputTransomWidthDebounced = useDebounce(($event) => {
  modelingStore.setTransomWidth(Number($event.target.value))
  $event.target.value = activeTransom.value.width
},700)

const onInputTransomHeightDebounced = useDebounce(($event) => {
  modelingStore.setTransomHeight(Number($event.target.value))
  $event.target.value = activeTransom.value.height
},700)

const selectedProfileId = computed({
  get: () => modelingStore.selectedProfileId,
  set: (value) => modelingStore.setProfileType(value)
})

const selectedTemplateId = computed({
  get: () => modelingStore.selectedTemplateId,
  set: (value) => modelingStore.setTransomTemplate(value)
})


onMounted(() => {
  if (modelingStore.configsStore.defaultProfileId) {
    modelingStore.setProfileType(modelingStore.configsStore.defaultProfileId)
  }

  if (modelingStore.configsStore.defaultTemplateId) { //ToDo remove
    modelingStore.setTransomTemplate(modelingStore.configsStore.defaultTemplateId)
  }
})
</script>

<style lang="scss" scoped>
.frame-settings {
  grid-row: 1;
  grid-column: 1 / span 2;
}
</style>
