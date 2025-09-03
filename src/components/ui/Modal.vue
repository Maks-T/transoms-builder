<template>
  <transition name="modal-fade">
    <div
        v-if="isOpen"
        class="modal-overlay"
        @click.self="handleOverlayClick"
        @keydown.esc="handleEscKey"
    >
      <div class="modal" :class="modalClass" :style="modalStyle">
        <button
            v-if="showCloseButton"
            class="modal__close-btn"
            @click="closeModal"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" stroke-width="2"/>
          </svg>
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
import {onMounted, onUnmounted, watch, ref} from 'vue'

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

// Обработчик клика по оверлею
const handleOverlayClick = () => {
  console.log()
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
   //document.body.style.paddingRight = '16px' // Компенсация для скроллбара
  }
}

// Разблокировка скролла body
const unlockBodyScroll = () => {
  if (props.lockScroll) {
    document.body.style.overflow = ''
    //document.body.style.paddingRight = ''
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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  width: v-bind(typeof props.width==='number' ? props.width + 'px': props . width);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
  margin-bottom: 16px;
}

.modal__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.modal__close-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__close-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

.modal__content {
  padding: 0 24px 24px;
}

.modal__footer {
  padding: 16px 24px 24px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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