<template>

  <SectionModeling />
  <SectionTempResults />
  <SectionTempAttachProfiles />
<!--  <SectionTempEstimate />-->
</template>

<script setup>
import {useTranslate as _} from "@composables";
import SectionModeling from "@components/sections/Modeling/SectionModeling.vue";
import './assets/styles/index.scss'
import SectionTempResults from "@components/sections/TempResults/SectionTempResults.vue";
import TransomTest from "@components/test/TransomTest.vue";
import SectionTempEstimate from "@components/sections/TempResults/SectionTempEstimate.vue";
import SectionTempAttachProfiles from "@components/sections/TempResults/SectionTempAttachProfiles.vue";

</script>

<style scoped>

</style>