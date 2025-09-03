<template>
  <Step :title="'Результаты'">
    <div class="section-temp-results">
      <div class="cells-info">
        <p>Информация по ячейкам</p>
        <table class="cells-table">
          <thead>
          <tr>
            <th>Ячейка</th>
            <th>Тип</th>
            <th>Ширина, мм</th>
            <th>Высота, мм</th>
            <th>Периметр/Длина, мм</th>
            <th>Площадь, м²</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(cell, index) in cells" :key="index">
            <td>#{{ index + 1 }}</td>
            <td>{{ LEAF_NAMES[cell.type] || 'Короб' }}</td>
            <td>{{ cell.innerWidth }}</td>
            <td>{{ cell.innerHeight }}</td>
            <td>{{ calculatePerimeterOrLength(cell) }}</td>
            <td>{{ isLeaf(cell) ? calculateArea(cell) : '—' }}</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <td colspan="4">Итоговые значения</td>
            <td>{{ totalProfileLength }}</td>
            <td>{{ totalLeafArea }}</td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </Step>
</template>

<script setup>
import { computed } from 'vue';
import { useModelingStore } from '@stores';
import Step from "@components/common/Step.vue";
import {LEAF_NAMES, PROFILE_TYPE} from "@constants"
const modelingStore = useModelingStore();

// Получаем calculatedCells из стора
const cells = computed(() => modelingStore.calculatedCells || []);

// Функция для определения, является ли ячейка полотном
const isLeaf = (cell) => {
  return cell.type !== 'profile';
};

// Функция для расчета периметра для полотен или длины для профилей
const calculatePerimeterOrLength = (cell) => {
  if (isLeaf(cell)) {
    // Периметр для полотен: 2 * (innerWidth + innerHeight)
    return 2 * (cell.innerWidth + cell.innerHeight);
  } else {
    // Длина для профилей: innerWidth для горизонтальных, innerHeight для вертикальных
    if (cell.isHorizontal) {
      return cell.innerWidth;
    } else if (cell.isVertical) {
      return cell.innerHeight;
    }
    return 0;
  }
};

// Функция для расчета площади (только для полотен)
const calculateArea = (cell) => {
  if (isLeaf(cell)) {
    return Math.round(cell.innerWidth * cell.innerHeight /1000)/1000;
  }
  return 0;
};

// Вычисляем суммарную длину профиля
const totalProfileLength = computed(() => {
  return cells.value.reduce((sum, cell) => sum + calculatePerimeterOrLength(cell), 0);
});

// Вычисляем суммарную площадь полотен
const totalLeafArea = computed(() => {
  return Math.round(cells.value.reduce((sum, cell) => sum + calculateArea(cell), 0) *1000)/1000;
});
</script>

<style scoped>

.cells-info {

}

.cells-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.cells-table th,
.cells-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.cells-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.cells-table tfoot td {
  font-weight: bold;
  background-color: #e8e8e8;
}
</style>
