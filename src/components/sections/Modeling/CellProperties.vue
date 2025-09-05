<template>
  <!-- Панель свойств выбранной ячейки -->
  <div class="cell-properties" v-if="cell && cell.isInitialized">
    <!-- Размеры выбранной ячейки -->
    <div class="cell-properties__group">
      <InputText
          type="number"
          :value="cell.width"
          @input="onInputCellWidthDebounced"
          :label="_('Ширина ячейки:')"
          :title="cell.validationData.titles.width ?? ''"
          :error="cell.validationData.errors.width ?? ''"
      />

      <InputText
          type="number"
          :value="cell.height"
          @input="onInputCellHeightDebounced"
          :label="_('Высота ячейки:')"
          :title="cell.validationData.titles.height ?? ''"
          :error="cell.validationData.errors.height ?? ''"
      />

    </div>

    <!-- Размеры выбранного полотна -->
    <div class="cell-properties__group">
      <InputText
          type="number"
          :value="cell.innerWidth"
          @input="onInputLeafWidthDebounced($event, cell.idx)"
          :label="_('Ширина полотна:')"
          :title="cell.validationData.titles.innerWidth ?? ''"
          :error="cell.validationData.errors.innerWidth ?? ''"
      />
      <InputText
          type="number"
          :value="cell.innerHeight"
          @input="onInputLeafHeightDebounced($event, cell.idx)"
          :label="_('Высота полотна:')"
          :title="cell.validationData.titles.innerHeight ?? ''"
          :error="cell.validationData.errors.innerHeight ?? ''"
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
    <div class="cell-properties__group">
      <Select v-if="cell.isActive"
          v-model="selectedHingeSide"
          :options="modelingStore.openingSidesArray"
          placeholder="Выберите открывание"
          :label="_('Тип открывания: ')"
      />
      <Select v-if="cell.isActive"
              v-model="selectedSwingDirection"
              :options="modelingStore.swingDirectionsArray"
              placeholder="Направление открывания"
              :label="_('Направление открывания: ')"
      />
    </div>

  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useDebounce, useTranslate as _} from "@src/composables";
import {useModelingStore} from "@src/stores";
import {storeToRefs} from "pinia";
import {InputText, Select} from "@components/ui";

const modelingStore = useModelingStore()
const {activeTransom} = storeToRefs(modelingStore)

const props = defineProps({
  cell: {
    type:  /** @type {TransomCell} */ Object,
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
  const newCellWidth = Number($event.target.value) + props.cell.offsets.left +  props.cell.offsets.right;
  modelingStore.setCellWidth(props.cell.idx, newCellWidth);
}, 700);

const selectedHingeSide = computed({
  get: () => props.cell.hingeSide,
  set: (value) => props.cell.hingeSide = value
})

const selectedSwingDirection = computed({
  get: () => props.cell.swingDirection,
  set: (value) => props.cell.swingDirection = value
})

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