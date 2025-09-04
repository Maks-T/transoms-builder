<template>
  <div class="frame-toolbar">
    <button
        class="frame-toolbar__btn"
        :class="{ 'frame-toolbar__btn--active': modelingStore.showDimensions }"
        @click="modelingStore.showDimensions = !modelingStore.showDimensions"
        :title="modelingStore.showDimensions ? _('Скрыть размеры полотен'):_('Показать размеры полотен')"
    >
      <Icon icon="mdi:ruler" />
    </button>
    <button
        class="frame-toolbar__btn"
        :class="{ 'frame-toolbar__btn--active': modelingStore.showLeafsNames }"
        @click="modelingStore.showLeafsNames = !modelingStore.showLeafsNames"
        :title="modelingStore.showLeafsNames ?_('Скрыть названия полотен') :_('Показать названия полотен')"
    >
      <Icon icon="fluent:text-t-12-filled" />
    </button>

    <button
        class="frame-toolbar__btn"
        :class="{ 'frame-toolbar__btn--active': modelingStore.showDividers }"
        @click="modelingStore.showDividers = !modelingStore.showDividers"
        :title="modelingStore.showDividers ? _('Скрыть границы ячеек') : _('Показать границы ячеек')"
    >
      <Icon icon="gis:grid" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTranslate as _ } from '@src/composables/index.js';
import { Icon } from '@iconify/vue';
import {useModelingStore} from "@src/stores";

const showDimensions = ref(false);
const showCellBorders = ref(false);

const modelingStore = useModelingStore()

</script>

<style lang="scss" scoped>
.frame-toolbar {
  @include base-border;

  grid-row: 2;
  grid-column: 1;

  display: flex;
  flex-direction: column;
  gap: rem(10);
  padding: rem(4);

  &__btn {
    background: #fff;
    border: 1px solid transparent;
    padding: rem(2);
    cursor: pointer;
    border-radius: rem(4);
    transition: box-shadow 0.2s ease, background-color 0.2s ease;

    width: rem(32);
    height: rem(32);

    display: flex;
    align-items: center;
    justify-content: center;
    color: $base-text-color;

    &:hover {
      box-shadow: 0 rem(2) rem(4) rgba(0, 0, 0, 0.15);
    }

    &:active {
      box-shadow: inset 0 rem(1) rem(2) rgba(0, 0, 0, 0.1);
    }

    svg {
      width: rem(24);
      height: rem(24);
      transition: fill 0.2s ease;
    }

    &--active {
      box-shadow: 0 rem(2) rem(6) rgba(0, 0, 0, 0.2);
      color: $accent-text-color;
    }

  }
}
</style>
