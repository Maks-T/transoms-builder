<template>
  <div class="section-materials">
    <h2>Раскрой материалов по ячейкам</h2>
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
          <td>{{ material.price?.name || material.price?.id}}</td>
          <td>{{ material.quantity }}</td>
          <td>{{ material.price?.unit || 'шт' }}</td>
          <td>{{ material.price?.priceIn || 0 }} {{ material.price?.price ? 'BYN' : '' }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import {  useMaterialsStore, useModelingStore } from '@stores';
import { storeToRefs } from 'pinia';


const modelingStore = useModelingStore();
const materialsStore = useMaterialsStore();

const { activeTransom } = storeToRefs(modelingStore);

const materials = /** @type MaterialsObject */ ref({});

// Отслеживание изменений ячеек активной фрамуги
watch(
    activeTransom,(activeTransom) => {
      if (activeTransom) {
        materials.value = materialsStore.calculateTransomMaterials(activeTransom);
        console.log('materials', materials.value);
      }
    },
    { deep: true }
);
</script>

<style scoped>
.section-materials {
  margin-bottom: 30px;

  h2 {
    margin-bottom: 1rem;
  }
}

.cell-materials {
  margin-bottom: 30px;
}

.materials-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.materials-table th,
.materials-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.materials-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}
</style>