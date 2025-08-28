<template>
  <div class="" v-if="cell">
    <div class="property-group">
      <label>Тип полотна:</label>
      <select v-model="localCell.type" @change="updateCell">
        <option
            v-for="(name, type) in LEAF_NAMES"
            :key="type"
            :value="type"
        >
          {{ name }}
        </option>
      </select>
    </div>

    <div class="property-group">
      <label>Ширина ячейки:</label>
      <input
          type="number"
          v-model="localCell.width"
          @input="updateCell"
      >
    </div>

    <div class="property-group">
      <label>Высота ячейки:</label>
      <input
          type="number"
          v-model="localCell.height"
          @input="updateCell"
      >
    </div>

    <div class="property-group">
      <label>Ширина полотна:</label>
      <span class="calculated-value">
        {{ leafWidth }}
      </span>
    </div>

    <div class="property-group">
      <label>Высота полотна:</label>
      <span class="calculated-value">
        {{ leafHeight }}
      </span>
    </div>

    <div class="offsets-group">
      <h4>Отступы:</h4>
      <div class="offset-inputs">
        <div class="offset-input">
          <label>Слева:</label>
          <input
              type="number"
              v-model="localCell.offsets.left"
              @input="updateCell"
              disabled
          >
        </div>
        <div class="offset-input">
          <label>Справа:</label>
          <input
              type="number"
              v-model="localCell.offsets.right"
              @input="updateCell"
              disabled
          >
        </div>
        <div class="offset-input">
          <label>Сверху:</label>
          <input
              type="number"
              v-model="localCell.offsets.top"
              @input="updateCell"
              disabled
          >
        </div>
        <div class="offset-input">
          <label>Снизу:</label>
          <input
              type="number"
              v-model="localCell.offsets.bottom"
              @input="updateCell"
              disabled
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { LEAF_NAMES } from "@constants";

const props = defineProps({
  cell: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:cell'])

// Локальная копия ячейки для редактирования
const localCell = ref({...props.cell}) //ToDo cloneObject

// Вычисляемые свойства для размеров полотна
const leafWidth = computed(() => {
  return localCell.value.width - localCell.value.offsets.left - localCell.value.offsets.right
})

const leafHeight = computed(() => {
  return localCell.value.height - localCell.value.offsets.top - localCell.value.offsets.bottom
})

// Обновляем локальную копию при изменении пропса
watch(() => props.cell, (newCell) => {
  localCell.value = {...newCell}
}, { deep: true })

// Функция для отправки обновлений
const updateCell = () => {
  emit('update:cell', {...localCell.value})
}
</script>

<style lang="scss" scoped>

.property-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: rem(4);
  margin-bottom: rem(8);
  max-width: 100%;

  label {
    display: block;
    font-weight: 500;
  }

  select,
  input {
    @include base-border;

    padding: rem(6) rem(8);

  }

}

.calculated-value {
  display: inline-block;
  padding: 6px 8px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.offsets-group h4 {
  margin-bottom: 8px;
  color: #333;
}

.offset-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
}

.offset-input label {
  display: block;
  margin-bottom: 2px;

  color: #666;
}

.offset-input input {
  width: 85%;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
</style>