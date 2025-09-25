<template>
  <div class="section-materials">
    <h2>Материалы</h2>

    <!-- Вкладки для переключения -->
    <div class="tabs">
      <button
          :class="{ 'active': activeTab === 'detailed' }"
          @click="activeTab = 'detailed'"
      >
        Спецификация подробно
      </button>
      <button
          :class="{ 'active': activeTab === 'summary' }"
          @click="activeTab = 'summary'"
      >
        Спецификация кратко
      </button>
    </div>

    <!-- Подробный вид -->
    <div v-if="activeTab === 'detailed'">
      <div v-for="(cellMaterials, cellIdx) in sortedMaterials" :key="cellIdx" class="cell-materials">
        <h3>Ячейка {{ Number(cellIdx) + 1 }} {{ LEAF_NAMES[cells[cellIdx]?.type] || 'Короб' }}</h3>
        <table class="materials-table">
          <thead>
          <tr>
            <th @click="sortBy('side')">Сторона {{ sortIndicator('side') }}</th>
            <th @click="sortBy('material')">Материал {{ sortIndicator('material') }}</th>
            <th @click="sortBy('quantity')">Количество {{ sortIndicator('quantity') }}</th>
            <th>Ед. изм</th>
            <th>Цена</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="material in cellMaterials" :key="material.id">
            <td>{{ material.side }}</td>
            <td>{{ material.price?.name || material.price?.id }}</td>
            <td>{{ material.quantity }}</td>
            <td>{{ material.price?.unit || '-' }}</td>
            <td>{{ material.price?.priceIn || 0 }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Суммарный вид -->
    <div v-if="activeTab === 'summary'">
      <!-- Сумма по ячейкам -->
      <div v-for="(cellSummary, cellIdx) in summarizedByCell" :key="cellIdx" class="cell-summary">
        <h3>Ячейка {{ Number(cellIdx) + 1 }} {{  LEAF_NAMES[cells[cellIdx]?.type] || 'Короб' }}</h3>
        <table class="summary-table">
          <thead>
          <tr>
            <th>Материал</th>
            <th>Количество</th>
            <th>Ед. изм</th>
            <th>Цена</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(summary, priceId) in cellSummary" :key="priceId">
            <td>{{ summary.name }}</td>
            <td>{{ summary.totalQuantity }}</td>
            <td>{{ summary.unit }}</td>
            <td>{{ summary.priceIn }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Итого по всем ячейкам -->
      <div class="total-summary">
        <h3>Итого по всем ячейкам</h3>
        <table class="summary-table">
          <thead>
          <tr>
            <th>Материал</th>
            <th>Количество</th>
            <th>Ед. изм</th>
            <th>Цена</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(summary, priceId) in totalSummary" :key="priceId">
            <td>{{ summary.name }}</td>
            <td>{{ summary.totalQuantity }}</td>
            <td>{{ summary.unit }}</td>
            <td>{{ summary.priceIn }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, computed } from 'vue';
import { useMaterialsStore, useModelingStore } from '@stores';
import { storeToRefs } from 'pinia';
import {LEAF_NAMES} from "@constants/index.js";

const modelingStore = useModelingStore();
const materialsStore = useMaterialsStore();

const { activeTransom } = storeToRefs(modelingStore);

const materials = /** @type MaterialsObject */ ref({});
const cells = /** @type TransomCell[] */ ref([]);

// Состояние для сортировки
const sortColumn = ref(null); // Текущий столбец сортировки: 'side', 'material', 'quantity'
const sortDirection = ref('asc'); // Направление: 'asc' или 'desc'

// Отслеживание изменений ячеек активной фрамуги
watch(
    activeTransom,
    (activeTransom) => {
      if (activeTransom) {
        materials.value = materialsStore.calculateTransomMaterials(activeTransom);
        cells.value = activeTransom.cells;
        console.log('materials', materials.value);
      }
    },
    { deep: true }
);

const activeTab = ref('detailed'); // По умолчанию подробный вид

// Вычисляем отсортированные материалы
const sortedMaterials = computed(() => {
  if (!sortColumn.value) return materials.value;

  const sorted = {};
  Object.entries(materials.value).forEach(([cellIdx, cellMaterials]) => {
    sorted[cellIdx] = [...cellMaterials].sort((a, b) => {
      let valueA, valueB;

      switch (sortColumn.value) {
        case 'side':
          valueA = a.side || '';
          valueB = b.side || '';
          break;
        case 'material':
          valueA = a.price?.name || a.price?.id || '';
          valueB = b.price?.name || b.price?.id || '';
          break;
        case 'quantity':
          valueA = a.quantity || 0;
          valueB = b.quantity || 0;
          break;
        default:
          return 0;
      }

      // Сравнение строк (для side и material)
      if (typeof valueA === 'string') {
        return sortDirection.value === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
      }
      // Сравнение чисел (для quantity)
      return sortDirection.value === 'asc'
          ? valueA - valueB
          : valueB - valueA;
    });
  });
  return sorted;
});

// Вычисляем суммарные данные по ячейкам
const summarizedByCell = computed(() => {
  const summary = {};
  Object.entries(materials.value).forEach(([cellIdx, cellMaterials]) => {
    summary[cellIdx] = {};
    cellMaterials.forEach((material) => {
      const priceId = material.price.id;
      if (!summary[cellIdx][priceId]) {
        summary[cellIdx][priceId] = {
          name: material.price.name || material.price.id,
          unit: material.price.unit || '-',
          priceIn: material.price.priceIn || 0,
          totalQuantity: 0,
        };
      }
      summary[cellIdx][priceId].totalQuantity += material.quantity;
    });
  });
  return summary;
});

// Вычисляем итого по всем ячейкам
const totalSummary = computed(() => {
  const summary = {};
  Object.values(materials.value).forEach((cellMaterials) => {
    cellMaterials.forEach((material) => {
      const priceId = material.price.id;
      if (!summary[priceId]) {
        summary[priceId] = {
          name: material.price.name || material.price.id,
          unit: material.price.unit || 'шт',
          priceIn: material.price.priceIn || 0,
          totalQuantity: 0,
        };
      }
      summary[priceId].totalQuantity += material.quantity;
    });
  });
  return summary;
});

// Обработчик клика по заголовку для сортировки
const sortBy = (column) => {
  if (sortColumn.value === column) {
    if (sortDirection.value === 'asc') {
      // Второй клик: переключаем на desc
      sortDirection.value = 'desc';
    } else {
      // Третий клик: сбрасываем сортировку
      sortColumn.value = null;
      sortDirection.value = 'asc';
    }
  } else {
    // Первый клик: устанавливаем новый столбец и сортировку по возрастанию
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

// Индикатор направления сортировки
const sortIndicator = (column) => {
  if (sortColumn.value !== column) return '';
  return sortDirection.value === 'asc' ? '↑' : '↓';
};
</script>

<style scoped>
.section-materials {
  margin-bottom: 30px;

  h2 {
    margin-bottom: 1rem;
  }
}

.tabs {
  display: flex;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  margin-right: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  cursor: pointer;
}

.tabs button.active {
  background-color: #ddd;
  font-weight: bold;
}

.cell-materials,
.cell-summary {
  margin-bottom: 30px;
}

.materials-table,
.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.materials-table th,
.materials-table td,
.summary-table th,
.summary-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.materials-table th,
.summary-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  cursor: pointer;
}

.materials-table th:hover,
.summary-table th:hover {
  background-color: #e0e0e0;
}

.total-summary {
  margin-top: 20px;
}
</style>