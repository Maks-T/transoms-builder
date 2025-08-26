<template>
  <div class="input-text-debounced">
    <input
        type="text"
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        class="input-text"
        :class="{ 'input-text--disabled': disabled }"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useDebounce } from '@composables';

// Определение пропсов
const props = defineProps({
  modelValue: {
    type: [String, Number], // Поддержка строк и чисел
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  debounceTime: {
    type: Number,
    default: 300
  }
});

// Определение события v-model
const emit = defineEmits(['update:modelValue']);

// Локальное состояние для значения ввода
const inputValue = ref(props.modelValue.toString()); // Приведение к строке для input

// Debounced функция для обновления значения
const debouncedUpdate = useDebounce((value) => {
  // Преобразование в число, если возможно, иначе строка
  const parsedValue = isNaN(Number(value)) ? value : Number(value);
  emit('update:modelValue', parsedValue);
}, props.debounceTime);

// Обработка ввода
const handleInput = (event) => {
  inputValue.value = event.target.value;
  debouncedUpdate(inputValue.value);
};

// Отслеживание изменений modelValue из родительского компонента
watch(
    () => props.modelValue,
    (newValue) => {
      // Приведение к строке для отображения в input
      const stringValue = newValue == null ? '' : newValue.toString();
      if (stringValue !== inputValue.value) {
        inputValue.value = stringValue;
      }
    },
    {immediate: true}
);
</script>

<style scoped>
.input-text-debounced {
  display: flex;
  width: 100%;
}

.input-text {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  transition: border-color 0.2s ease;
}

.input-text:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.input-text--disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>