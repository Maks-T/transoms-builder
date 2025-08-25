<template>
  <div class="frame-settings">

    <!-- Селект профилей - меняет профиль активной фрамуги -->
    <select v-model="modelingStore.selectedProfileId"
            @change="modelingStore.setProfileType($event.target.value)">
      <option v-for="profile in modelingStore.profileTypesArray"
              :key="profile.id"
              :value="profile.id">
        {{ profile.name }}
      </option>
    </select>

    <!-- Селект шаблонов - автоматически создает/изменяет фрамуги -->
    <select v-model="modelingStore.selectedTemplateId"
            @change="modelingStore.setTransomTemplate($event.target.value)">
      <option v-for="template in modelingStore.transomTemplatesArray"
              :key="template.id"
              :value="template.id">
        {{ template.name }}
      </option>
    </select>


  </div>
</template>

<script setup>
import {useModelingStore} from "@stores";
import { watch } from 'vue'


const modelingStore = useModelingStore();

watch(
    () => modelingStore.$state,
    (newState, oldState) => {
      console.log('🔄 Изменение всего состояния store:')
      console.log('Новое состояние:', newState)
      console.log('Предыдущее состояние:', oldState)
    },
    { deep: true }
)

</script>

<style lang="scss" scoped>
.frame-settings {
  grid-row: 1;
  grid-column: 1 / span 2;
}
</style>