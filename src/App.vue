<template>

  <SectionModeling />
  <SectionTempResults />
<!--  <SectionTempEstimate />-->
</template>

<script setup>
import {useTranslate as _} from "@composables";
import SectionModeling from "@components/sections/Modeling/SectionModeling.vue";
import './assets/styles/index.scss'
import SectionTempResults from "@components/sections/TempResults/SectionTempResults.vue";
import TransomTest from "@components/test/TransomTest.vue";
import SectionTempEstimate from "@components/sections/TempResults/SectionTempEstimate.vue";

</script>

<style scoped>

</style>