<template>

  <SectionModeling />
  <SectionTempResults />
  <SectionTempAttachProfiles />

</template>

<script setup>
import {useTranslate as _} from "@composables";
import SectionModeling from "@components/sections/Modeling/SectionModeling.vue";
import './assets/styles/index.scss'
import SectionTempResults from "@components/sections/TempResults/SectionTempResults.vue";
import SectionTempAttachProfiles from "@components/sections/TempResults/SectionTempCalcProfiles.vue";

</script>

<style scoped>

</style>