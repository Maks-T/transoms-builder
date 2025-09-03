<template>
  <div
      class="select"
      :class="{ 'select--open': isOpen, 'select--disabled': disabled }"
      v-click-outside="closeDropdown"
  >
    <!-- Заголовок -->
    <label v-if="label" class="select__label">{{ label }}</label>

    <!-- Триггер -->
    <div class="select__trigger" @click="toggleDropdown">
      <div class="select__selected">
        <img
            v-if="selectedOption?.imgSrc"
            :src="selectedOption.imgSrc"
            class="select__selected-img"
            alt=""
        />
        <span class="select__selected-text">
          {{ selectedOption?.label || placeholder }}
        </span>
      </div>
      <span class="select__arrow">▼</span>
    </div>

    <!-- Выпадающий список -->
    <transition name="fade">
      <div v-show="isOpen" class="select__dropdown">
        <div class="select__options">
          <div
              v-for="option in options"
              :key="option.value"
              class="select__option"
              :class="{
              'select__option--selected': isSelected(option),
              'select__option--disabled': option.disabled
            }"
              @click="selectOption(option)"
          >
            <img
                v-if="option.imgSrc"
                :src="option.imgSrc"
                class="select__option-img"
                alt=""
            />
            <span class="select__option-text">{{ option.label }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: [String, Number, Object],
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Выберите вариант'
  },
  label: {
    type: String,
    default: ''
  },
  disabled: Boolean
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const selectedValue = ref(props.modelValue)

const selectedOption = computed(() =>
    props.options.find(option => option.value === selectedValue.value) || null
)

const isSelected = option => option.value === selectedValue.value

const toggleDropdown = () => {
  if (!props.disabled) isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const selectOption = option => {
  if (option.disabled) return
  selectedValue.value = option.value
  emit('update:modelValue', option.value)
  emit('change', option)
  isOpen.value = false
}

watch(() => props.modelValue, val => {
  selectedValue.value = val
})
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  min-width: rem(200);
  font-family: inherit;
  display: flex;
  flex-direction: column;
  gap: rem(4);
}

.select__label {
  font-size: rem(14);
  font-style: normal;
  font-weight: 400;
  color: $base-text-color;
}

.select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: rem(10);
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
  min-height: rem(40);
}

.select__trigger:hover {
  border-color: $accent-text-color;
}

.select--open .select__trigger {
  border-color: $accent-text-color;
  box-shadow: 0 0 0 2px rgba(159, 58, 58, 0.2);
}

.select--disabled .select__trigger {
  background-color: #f5f7fa;
  cursor: not-allowed;
  opacity: 0.6;
}

.select__selected {
  display: flex;
  align-items: center;
  gap: rem(8);
  flex: 1;
}

.select__selected-img,
.select__option-img {
  width: rem(65);
  align-self: stretch;
  aspect-ratio: 17/14;
  object-fit: contain;
  border-radius: 2px;
}

.select__selected-text {
  font-size: 14px;
  color: #333;
}

.select__arrow {
  transition: transform 0.2s ease;
  font-size: 12px;
  color: #666;
}

.select--open .select__arrow {
  transform: rotate(180deg);
}

.select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.select__options {
  padding: 4px 0;
}

.select__option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.select__option:hover {
  background-color: #f5f7fa;
}

.select__option--selected {
  background-color: #f5f7fa;
  color: $accent-text-color;
}

.select__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.select__option-text {
  font-size: 14px;
  color: inherit;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
