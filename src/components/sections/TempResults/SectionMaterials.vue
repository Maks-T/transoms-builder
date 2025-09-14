<template>
  <div class="section-materials">
    <h2>Раскрой материалов</h2>

    <!-- Вкладки для переключения -->
    <div class="tabs">
      <button
          :class="{ 'active': activeTab === 'detailed' }"
          @click="activeTab = 'detailed'"
      >
        Спецификация раскроя
      </button>
      <button
          :class="{ 'active': activeTab === 'summary' }"
          @click="activeTab = 'summary'"
      >
        Спецификация по ячейкам
      </button>
    </div>

    <!-- Подробный вид -->
    <div v-if="activeTab === 'detailed'">
      <div v-for="(cellMaterials, cellIdx) in materials" :key="cellIdx" class="cell-materials">
        <h3>Ячейка {{ Number(cellIdx) + 1 }}</h3>
        <table class="materials-table">
          <thead>
          <tr>
            <th>Номер ячейки</th>
            <th>Сторона</th>
            <th>Материал</th>
            <th>Количество</th>
            <th>Ед. изм</th>
            <th>Цена</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="material in cellMaterials" :key="material.id">
            <td>{{ Number(cellIdx) + 1 }}</td>
            <td>{{ material.side }}</td>
            <td>{{ material.price?.name || material.price?.id }}</td>
            <td>{{ material.quantity }}</td>
            <td>{{ material.price?.unit || '-' }}</td>
            <td>{{ material.price?.priceIn || 0 }} </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Суммарный вид -->
    <div v-if="activeTab === 'summary'">
      <!-- Сумма по ячейкам -->
      <div v-for="(cellSummary, cellIdx) in summarizedByCell" :key="cellIdx" class="cell-summary">
        <h3>Ячейка {{ Number(cellIdx) + 1 }}</h3>
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
            <td>{{ summary.priceIn }} BYN</td>
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

const modelingStore = useModelingStore();
const materialsStore = useMaterialsStore();

const { activeTransom } = storeToRefs(modelingStore);

const materials = /** @type MaterialsObject */ ref({});

// Отслеживание изменений ячеек активной фрамуги
watch(
    activeTransom,
    (activeTransom) => {
      if (activeTransom) {
        materials.value = materialsStore.calculateTransomMaterials(activeTransom);
        console.log('materials', materials.value);
      }
    },
    { deep: true }
);

const activeTab = ref('detailed'); // По умолчанию подробный вид

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
}

.total-summary {
  margin-top: 20px;
}
</style>