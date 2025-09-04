<template>
  <div :class="['input-text', { 'input-text--error': hasError, 'input-text--disabled': disabled }]">
    <label v-if="label" :for="id" class="input-text__label">
      {{ label }}
    </label>
    <input
        :id="id"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :class="['input-text__field', { 'input-text__field--error': hasError }]"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
        v-bind="$attrs"
    />

    <div v-if="hasError && error" class="input-text__error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, useAttrs} from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'password', 'email', 'tel', 'number'].includes(value)
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    default: null
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).slice(2, 9)}`
  },

})


const emit = defineEmits(['update:modelValue', 'input', 'blur', 'focus'])

const inputRef = ref(null)

const hasError = computed(() => !!props.error)

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  emit('input', event)
}

// Public methods
const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

// Доступ к методам родителю
defineExpose({
  focus,
  blur
})

</script>

<style lang="scss" scoped>

.input-text {
  display: flex;
  flex-direction: column;
  gap: rem(4);
  width: rem(120);
}

.input-text__label {
  font-size: rem(14);
  font-style: normal;
  font-weight: 400;
  color: $base-text-color;
}

.input-text__field {
  @include base-border;

  height: rem(32);
  padding: rem(8) rem(9);
  color: #808080;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-text__field:focus {
  border-color: $accent-text-color;
  box-shadow: 0 0 0 2px rgba(159, 58, 58, 0.2);
}

.input-text__field--error {
  color: $error-color;
  border-color: $error-color;
}

.input-text__field--error:focus {
  color: $error-color;
  border-color: $error-color;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2);
}

.input-text__field:disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
  opacity: 0.6;
}

.input-text__error {
  color: $error-color;
  font-size: 12px;
  margin-top: 2px;
}

.input-text--disabled .input-text__label {
  opacity: 0.6;
}
</style>