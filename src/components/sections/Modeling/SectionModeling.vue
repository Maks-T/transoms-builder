<template>
  <Step :title="_('Моделирование')">
    <div class="section-modeling">
      <FrameSettingsPanel/>
      <FrameToolbar/>
      <FrameBuilder
          :canvas-width="1100"
          :canvas-height="600"
          :padding="40"
      />
    </div>
  </Step>
</template>

<script setup>

import {useTranslate as _} from "@src/composables/index.js";
import Step from "@components/common/Step.vue";
import FrameBuilder from "@components/sections/Modeling/FrameBuilder/FrameBuilder.vue";
import FrameSettingsPanel from "@components/sections/Modeling/FrameSettingsPanel.vue";
import FrameToolbar from "@components/sections/Modeling/FrameToolbar.vue";

</script>

<style lang="scss" scoped>
  .section-modeling {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: min-content 1fr;

    gap: rem(10);
  }
</style>