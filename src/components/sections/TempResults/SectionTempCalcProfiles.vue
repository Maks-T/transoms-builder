<template>
  <Step :title="'Профили'">
    <div class="section-profiles">
      <div v-for="(cellProfiles, cellIdx, index) in mainProfiles" :key="cellIdx" class="cell-profiles">
        <h3>Ячейка #{{ index + 1 }}</h3>
        <table class="profiles-table">
          <thead>
          <tr>
            <th>Тип ячейки</th>
            <th>Сторона</th>
            <th>Тип профиля</th>
            <th>Длина (мм)</th>
            <th>Длина с запасом (мм)</th>

          </tr>
          </thead>
          <tbody>
          <tr v-for="(profile, profileIdx) in getCellProfiles(cellIdx)" :key="profileIdx">
            <td>{{ LEAF_NAMES[profile.cellType] || 'Короб' }}</td>
            <td>{{ profile.side }}</td>
            <td>{{ profileNames[profile.profileType] }}</td>
            <td>{{ profile.originLength }}</td>
            <td>{{ profile.length }}</td>

          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Step>
</template>

<script setup>
import { watch, ref, computed } from 'vue';
import { useCalcProfilesStore, useModelingStore } from '@stores';
import Step from '@components/common/Step.vue';
import { storeToRefs } from 'pinia';
import {CELL_TYPES, LEAF_NAMES, PROFILE_TYPE} from '@constants';

const modelingStore = useModelingStore();
const calcProfilesStore = useCalcProfilesStore();

const { activeTransom, calculatedCells } = storeToRefs(modelingStore);

// Храним профили
const attachProfiles = ref({});
const mainProfiles = ref({});

// Маппинг имен профилей
const profileNames = {
  mainProfile: 'S39х41',
  mountProfile: 'АВД 0159',
  connectorProfile: 'S5х32',
  adapterProfile: 'АВД 7967'
};

// Маппинг имен типов ячеек
const cellTypeNames = {
  [CELL_TYPES.ACTIVE]: 'Активное полотно',
  [CELL_TYPES.INACTIVE]: 'Глухое полотно',
  [CELL_TYPES.PROFILE]: 'Профиль',
  [PROFILE_TYPE]: 'Профиль' // Fallback for raw PROFILE_TYPE
};

// Подготовка данных для таблицы
const getCellProfiles = computed(() => {
  return (cellIdx) => {
    const profiles = [];

    // Сначала добавляем основные профили
    if (mainProfiles.value[cellIdx]) {
      Object.entries(mainProfiles.value[cellIdx]).forEach(([side, sideProfiles]) => {
        sideProfiles.forEach(profile => {
          profiles.push({
            cellType: profile.cellType,
            side,
            profileType: profile.profileType,
            originLength: profile.originLength,
            length: profile.length
          });
        });
      });
    }

    // Затем добавляем attach-профили
    if (attachProfiles.value[cellIdx]) {
      Object.entries(attachProfiles.value[cellIdx]).forEach(([side, sideProfiles]) => {
        sideProfiles.forEach(profile => {
          profiles.push({
            cellType: profile.cellType,
            side,
            profileType: profile.profileType,
            originLength: profile.originLength,
            length: profile.length
          });
        });
      });
    }

    return profiles;
  };
});

// Отслеживание изменений ячеек активной фрамуги
watch(
    calculatedCells,
    (newCells) => {
      if (newCells) {
        mainProfiles.value = calcProfilesStore.calculateAllMainProfiles(newCells);
        attachProfiles.value = calcProfilesStore.calculateAllAttachProfilesByCells(newCells);
        console.log('mainProfiles', mainProfiles.value);
        console.log('attachProfiles', attachProfiles.value);
      }
    },
    { deep: true }
);
</script>

<style scoped>
.section-profiles {
  margin-bottom: 30px;
}

.cell-profiles {
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
</style>