<template>

  <SectionModeling />
  <SectionTempResults />
  <TransomTest />
</template>

<script setup>
import {useTranslate as _} from "@composables";
import SectionModeling from "@components/sections/Modeling/SectionModeling.vue";
import './assets/styles/index.scss'
import SectionTempResults from "@components/sections/TempResults/SectionTempResults.vue";
import TransomTest from "@components/test/TransomTest.vue";

</script>

<style scoped>

</style>