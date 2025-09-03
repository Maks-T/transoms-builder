<template>
  <section class="step">
    <h3 class="step__title">
      {{ title }}
    </h3>

    <div class="step__content">
      <slot></slot>
    </div>
  </section>
</template>

<script setup>

const props = defineProps({
  title: String,
});

</script>

<style lang="scss">
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.step {
  display: flex;
  flex-direction: column;
  gap: rem(16);
  margin-bottom: rem(20);

  padding: rem(12) rem(27);
  border-radius: rem(4);
  border: 2px solid $base-border-color;
  background: #FFF;

  &__title {
    font-size: rem(16);
    font-weight: inherit;
  }

  &__content {
  }
}


</style>