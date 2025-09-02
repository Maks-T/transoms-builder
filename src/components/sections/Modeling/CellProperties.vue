<template>
  <!-- Панель свойств выбранной ячейки -->
  <div class="cell-properties" v-if="cell">
    <!-- Размеры выбранной ячейки -->
    <div class="cell-properties__group">
      <InputText
          type="number"
          :value="cell.width"
          @input="onInputCellWidthDebounced"
          :label="_('Ширина ячейки:')"
      />
      <InputText
          type="number"
          :value="cell.height"
          @input="onInputCellHeightDebounced"
          :label="_('Высота ячейки:')"
      />

    </div>

    <!-- Размеры выбранного полотна -->
    <div class="cell-properties__group">
      <InputText
          type="number"
          :value="cell.innerWidth"
          @input="onInputLeafWidthDebounced"
          :label="_('Ширина полотна:')"
      />
      <InputText
          type="number"
          :value="cell.innerHeight"
          @input="onInputLeafHeightDebounced"
          :label="_('Высота полотна:')"
      />
    </div>

    <!-- Отступы -->
    <div class="cell-properties__group">
      <InputText
          type="number"
          :value="cell.offsets.left"
          :label="_('Отступ слева:')"
          :disabled="true"
      />
      <InputText
          type="number"
          :value="cell.offsets.top"
          :label="_('Отступ сверху:')"
          :disabled="true"
      />
    </div>

    <div class="cell-properties__group">
      <InputText
          type="number"
          :value="cell.offsets.right"
          :label="_('Отступ справа:')"
          :disabled="true"
      />
      <InputText
          type="number"
          :value="cell.offsets.bottom"
          :label="_('Отступ снизу:')"
          :disabled="true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { LEAF_NAMES } from "@constants";
import {useDebounce, useTranslate as _} from "@src/composables/index.js";
import {useModelingStore} from "@src/stores/index.js";
import {storeToRefs} from "pinia";
import {InputText} from "@components/ui/index.js";

const modelingStore = useModelingStore()
const {activeTransom} = storeToRefs(modelingStore)

const props = defineProps({
  cell: {
    type: Object,
    required: true
  }
})

const onInputCellWidthDebounced = useDebounce(($event) => {
  modelingStore.setCellWidth(props.cell.idx, Number($event.target.value))
},700)

const onInputCellHeightDebounced = useDebounce(($event) => {
  modelingStore.setCellHeight(props.cell.idx, Number($event.target.value))
},700)

const onInputLeafHeightDebounced = useDebounce(($event) => {
  const newCellHeight = Number($event.target.value) + props.cell.offsets.top +  props.cell.offsets.bottom;
  modelingStore.setCellHeight(props.cell.idx, newCellHeight);
}, 700);

const onInputLeafWidthDebounced = useDebounce(($event) => {
  const newCellWidth = Number($event.target.value) + props.cell.offsets.left +  props.cell.offsets.left;
  modelingStore.setCellWidth(props.cell.idx, newCellWidth);
}, 700);

</script>

<style lang="scss" scoped>

.cell-properties {
  grid-column: 2;
  grid-row: 3;

  display: flex;
  flex-direction: row;
  gap: rem(16);

  padding: rem(10);

  @include base-border;

  &__group {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: rem(4);
    margin-bottom: rem(8);
    max-width: 100%;
  }

}



</style>