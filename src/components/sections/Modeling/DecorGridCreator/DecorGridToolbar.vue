<template>
  <div class="frame-grid-toolbar">
    <button
        class="frame-grid-toolbar__btn"
        :class="{ 'frame-grid-toolbar__btn--active': decorStore.showGrid }"
        @click="decorStore.showGrid = !decorStore.showGrid"
        :title="decorStore.showGrid ? _('Скрыть сетку'):_('Показать сетку')"
    >
      <Icon icon="teenyicons:view-grid-solid" />
    </button>

    <button
        class="frame-grid-toolbar__btn"
        :class="{ 'frame-grid-toolbar__btn--active': decorStore.showPolyline }"
        @click="decorStore.showPolyline = !decorStore.showPolyline"
        :title="decorStore.showPolyline ? _('Деактивировать режим полилиний'):_('Активировать режим полилиний')"
    >
      <Icon icon="mdi:vector-polyline-plus" />
    </button>

  </div>
</template>

<script setup>

import {useTranslate as _} from '@src/composables/index.js';
import {Icon} from '@iconify/vue';
import {useDecorGridStore} from "@src/stores";

const decorStore = useDecorGridStore()

</script>

<style lang="scss" scoped>
.frame-grid-toolbar {
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
