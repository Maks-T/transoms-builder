<template>

  <SectionModeling />
  <SectionMaterials />
</template>

<script setup>
import {useTranslate as _} from "@composables";
import SectionModeling from "@components/sections/Modeling/SectionModeling.vue";

import SectionMaterials from "@components/sections/TempResults/SectionMaterials.vue";
import './assets/styles/index.scss'

</script>

<style scoped>

</style>