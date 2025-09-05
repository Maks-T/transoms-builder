<template>
  <transition name="modal-fade">
    <div
        v-if="isOpen"
        class="modal-overlay"
        @click.self="handleOverlayClick"
        @keydown.esc="handleEscKey"
    >
      <div class="modal" :class="modalClass" :style="[modalStyle, { width: computedWidth }]">
        <button
            v-if="showCloseButton"
            class="modal__close-btn"
            @click="closeModal"
        >
          <Icon class="icon" icon="iconamoon:close-light"/>
        </button>
        <!-- Заголовок модального окна -->
        <div v-if="$slots.header || title" class="modal__header">
          <slot name="header">
            <h2 class="modal__title">{{ title }}</h2>
          </slot>
        </div>

        <!-- Контент модального окна -->
        <div class="modal__content">
          <slot></slot>
        </div>

        <!-- Футер модального окна -->
        <div v-if="$slots.footer" class="modal__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {onMounted, onUnmounted, watch, ref, computed} from 'vue'
import {Icon} from '@iconify/vue';

const props = defineProps({
  // Управление видимостью
  modelValue: {
    type: Boolean,
    default: false
  },

  // Заголовок модального окна
  title: {
    type: String,
    default: ''
  },

  // Показывать кнопку закрытия
  showCloseButton: {
    type: Boolean,
    default: true
  },

  // Дополнительные классы для модального окна
  modalClass: {
    type: [String, Array, Object],
    default: ''
  },

  // Стили для модального окна
  modalStyle: {
    type: Object,
    default: () => ({})
  },

  // Ширина модального окна
  width: {
    type: [String, Number],
    default: '500px'
  },

  // Заблокировать скролл body при открытии
  lockScroll: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'update:modelValue',
  'open',
  'close',
])

const isOpen = ref(false)

// Вычисляем ширину для стилей
const computedWidth = computed(() => {
  if (typeof props.width === 'number') {
    return `${props.width}px`
  }
  return props.width
})

// Обработчик клика по оверлею
const handleOverlayClick = () => {
  closeModal()
}

// Обработчик нажатия ESC
const handleEscKey = (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

// Закрытие модального окна
const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Открытие модального окна
const openModal = () => {
  emit('update:modelValue', true)
  emit('open')
}

// Блокировка скролла body
const lockBodyScroll = () => {
  if (props.lockScroll) {
    document.body.style.overflow = 'hidden'
    // Определяем ширину скроллбара и компенсируем её
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
  }
}

// Разблокировка скролла body
const unlockBodyScroll = () => {
  if (props.lockScroll) {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}

// Добавление/удаление обработчиков клавиатуры
const setupEventListeners = () => {
  document.addEventListener('keydown', handleEscKey)
}

const removeEventListeners = () => {
  document.removeEventListener('keydown', handleEscKey)
}

// Наблюдаем за изменением modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    isOpen.value = true
    lockBodyScroll()
    setupEventListeners()
  } else {
    isOpen.value = false
    unlockBodyScroll()
    removeEventListeners()
  }
})

// Инициализация
onMounted(() => {
  if (props.modelValue) {
    isOpen.value = true
    lockBodyScroll()
    setupEventListeners()
  }
})

// Очистка
onUnmounted(() => {
  unlockBodyScroll()
  removeEventListeners()
})

// Публичные методы для управления извне
defineExpose({
  open: openModal,
  close: closeModal,
  isOpen
})
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: rem(20);

  background-color: rgba(75, 75, 75, 0.46);
}

.modal {
  position: relative;

  max-width: 90vw;
  max-height: 90vh;

  background: white;
  border-radius: rem(4);
  box-shadow: 0 rem(10) rem(30) rgba(0, 0, 0, 0.3);


  &__title {
    margin: 0;
    font-size: rem(24);
    font-weight: 600;
    color: #333;
  }

  &__close-btn {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);

    width: rem(30);
    height: rem(30);
    border: none;
    outline: none;
    cursor: pointer;
    background: transparent;

    .icon {
      width: 100%;
      height: 100%;
      object-fit: contain;
      color: $base-border-color;
      border: 1px solid $base-border-color;
      border-radius: 50%;
      background: white;

      &:hover {
        color: $accent-text-color;
        border: 1px solid $accent-text-color;
      }
    }

  }

  &__content {
    padding: rem(20);
  }

  &__header {
    border-top: 1px solid #eee;
    padding: rem(20);
  }

  &__footer {
    padding: rem(20);
    border-top: 1px solid #eee;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
}


/* Анимации */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal,
.modal-fade-leave-active .modal {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from .modal,
.modal-fade-leave-to .modal {
  transform: scale(0.95);
  opacity: 0;
}
</style>