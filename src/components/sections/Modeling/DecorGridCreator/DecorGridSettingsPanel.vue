<template>
  <div class="decor-grid-settings">
    <div class="decor-grid-settings__group">

      <h4>Настройки сетки</h4>

      <InputText
          id="decor-grid-width"
          type="number"
          :value="step"
          @input="onInputStepWidthDebounced"
          :label="_('Шаг сетки, мм: ')"
      />

      <InputText
          id="decor-grid-width"
          type="number"
          :value="gridOffset.x"
          @input="onInputOffsetGridXDebounced"
          :label="_('Смещение сетки по X, мм: ')"
      />

      <InputText
          id="decor-grid-width"
          type="number"
          :value="gridOffset.y"
          @input="onInputOffsetGridYDebounced"
          :label="_('Смещение сетки по Y, мм: ')"
      />
    </div>

    <div class="decor-grid-settings__group" v-if="decorStore.activeTransom.selectedLine">
      <h4>
        <span>Настройки линии</span>
        <Icon icon="pajamas:remove-all"
              style="color: darkred"
              @click="decorStore.removeSelectedLine"/>
      </h4>

      <InputText
          id="decor-grid-width"
          type="number"
          :value="selectedLine.type === 'vertical' ? selectedLine.start.x : selectedLine.start.y"
          @input="onInputLineMarginDebounced"
          :label="selectedLine.type === 'vertical' ? _('Отступ слева, мм: ') : _('Отступ сверху, мм: ')"
      />

    </div>

  </div>
</template>

<script setup>
import {useDecorGridStore} from "@stores"
import {computed, onMounted} from "vue"
import {storeToRefs} from "pinia"
import {useDebounce} from "@src/composables";
import {InputText} from "@components/ui";
import {useTranslate as _} from '@src/composables/index.js';
import {Icon} from "@iconify/vue";

const decorStore = useDecorGridStore()
const { selectedCellIndex, activeTransom, stepWidth: step, gridOffset } = storeToRefs(decorStore)
const selectedLine = computed(() => decorStore.activeTransom?.selectedLine || null);


const onInputStepWidthDebounced = useDebounce(($event) => {
  decorStore.setStepWidth(Math.max(Number($event.target.value), 100))
  $event.target.value = step.value
}, 700)

const onInputOffsetGridXDebounced = useDebounce(($event) => {
  decorStore.setGridOffsetX(Number($event.target.value))
  $event.target.value = gridOffset.value.x
}, 700)

const onInputOffsetGridYDebounced = useDebounce(($event) => {
  decorStore.setGridOffsetY(Number($event.target.value))
  $event.target.value = gridOffset.value.y
}, 700)

const onInputLineMarginDebounced = useDebounce(($event) => {
  decorStore.setLineMargin(Number($event.target.value))

  //$event.target.value =
}, 700)

onMounted(() => {

})



</script>

<style lang="scss" scoped>
.decor-grid-settings {
  display: flex;
  flex-direction: column;
  gap: rem(16)
}

.decor-grid-settings__group {
  display: flex;
  flex-direction: column;
  gap: rem(10)
}
</style>
