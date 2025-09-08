<template>
  <Step :title="'Профили'">
    <div class="section-profiles">
      <div class="cell-profiles" v-for="(cell, index) in cells" :key="index">
        <p>
          {{ index + 1 }}. Ячейка #{{ cell.cellIdx + 1 }}:
          {{ cell.isProfile ? 'Короб' : `Spazio: ${cell.width}*${cell.height} мм` }}
        </p>
        <table class="profiles-table">
          <thead>
          <tr>
            <th>№</th>
            <th>Наименование</th>
            <th>Ед</th>
            <th>Кол-во</th>
            <th>Цена, руб</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(mat, subindex) in cell.materials" :key="subindex">
            <td>{{ index + 1 }}.{{ subindex + 1 }}</td>
            <td>{{ mat.id }}</td>
            <td>{{ mat.unit }}</td>
            <td>{{ mat.quantity.toFixed(3) }}</td>
            <td>{{ '' }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="total-profiles">
        <p>Общие количества профилей</p>
        <table class="profiles-table">
          <thead>
          <tr>
            <th>Наименование</th>
            <th>Ед</th>
            <th>Кол-во</th>
            <th>Цена, руб</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(quantity, id) in totalProfiles" :key="id">
            <td>{{ id }}</td>
            <td>мп</td>
            <td>{{ quantity.toFixed(3) }}</td>
            <td>{{ '' }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Step>
</template>

<script setup>
import {computed, watch} from 'vue';
import { useModelingStore, useEstimateStore } from '@stores';
import Step from "@components/common/Step.vue";
import { PROFILE_TYPE } from '@constants';

const modelingStore = useModelingStore();
const estimateStore = useEstimateStore();



const cells = computed(() => {
  return estimateStore.profilesPerCell.map(cell => {
    const cellData = modelingStore.calculatedCells.find(c => c.idx === cell.cellIdx);
    return {
      ...cell,
      width: cellData ? cellData.innerWidth : 0,
      height: cellData ? cellData.innerHeight : 0,
      isProfile: cellData ? cellData.type === PROFILE_TYPE : false
    };
  });
});

watch(() =>  cells, (newCells) => {
  console.log('estimateNewCells', newCells.value)
})

console.log('estimateCells', cells.value)
console.log('additionalProfilesPerCell', estimateStore.additionalProfilesPerCell)
const totalProfiles = computed(() => estimateStore.totalProfiles);
</script>

<style scoped>
.section-profiles {
  margin-bottom: 30px;
}

.profiles-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.profiles-table th,
.profiles-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.profiles-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.cell-profiles,
.total-profiles {
  margin-bottom: 30px;
}
</style>