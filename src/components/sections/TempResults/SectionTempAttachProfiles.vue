<template>
  <Step :title="'Профили'">
    <div class="section-profiles">
      <button @click="logProfiles">Вывести профили в консоль</button>
      <div class="cell-profiles">
        <h3>Профили по ячейкам</h3>
        <table class="profiles-table">
          <thead>
          <tr>
            <th>Номер ячейки</th>
            <th>Имя дополнительного профиля</th>
            <th>Длина лево (мм)</th>
            <th>Длина право (мм)</th>
            <th>Длина верх (мм)</th>
            <th>Длина низ (мм)</th>
            <th>Сумма (мм)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(cell, rowKey) in profilesTableData" :key="rowKey">
            <td>{{ cell.cellIdx }}</td>
            <td>{{ cell.profileName }}</td>
            <td>{{ cell.left || 0 }}</td>
            <td>{{ cell.right || 0 }}</td>
            <td>{{ cell.top || 0 }}</td>
            <td>{{ cell.bottom || 0 }}</td>
            <td>{{ cell.total || 0 }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Step>
</template>

<script setup>
import {watch, ref, computed} from 'vue';
import {useEstimateStore, useModelingStore} from '@stores';
import Step from '@components/common/Step.vue';
import {storeToRefs} from 'pinia';

const modelingStore = useModelingStore();
const estimateStore = useEstimateStore();

const {activeTransom, calculatedCells} = storeToRefs(modelingStore);

// Храним профили и суммы
const attachProfiles = ref({});
const profilesByType = ref({});

// Маппинг имен профилей
const profileNames = {
  mountProfile: 'АВД 0159',
  connectorProfile: 'S5х32',
  adapterProfile: 'АВД 7967'
};

// Подготовка данных для таблицы
const profilesTableData = computed(() => {
  const tableData = {};

  Object.entries(attachProfiles.value).forEach(([cellIdx, cellProfiles]) => {
    // Для каждого типа профиля создаем запись
    Object.keys(profileNames).forEach(profileType => {
      const profileName = profileNames[profileType];
      const rowKey = `${cellIdx}-${profileType}`;

      // Инициализируем объект для строки таблицы
      tableData[rowKey] = {
        cellIdx,
        profileName,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        total: 0
      };

      // Суммируем длины профилей по сторонам
      Object.entries(cellProfiles).forEach(([side, profiles]) => {
        profiles.forEach(profile => {
          if (profile.profileType === profileType && profile.length) {
            tableData[rowKey][side] += profile.length;
            tableData[rowKey].total += profile.length;
          }
        });
      });
    });
  });

  return tableData;
});

// Отслеживание изменений ячеек активной фрамуги
watch(
    calculatedCells,
    (newCells) => {
      if (newCells) {
        attachProfiles.value = estimateStore.calculateAllCellAttachProfiles(newCells);
        profilesByType.value = estimateStore.calculateProfileSumLength(attachProfiles.value);

        console.log('attachProfiles', attachProfiles.value);
        console.log('profilesByType', profilesByType.value);

        // Замена ключей на имена для отладки
        const profilesByTypeWithNames = Object.entries(profilesByType.value).map(([cellIdx, item]) => ({
          cellIdx,
          [profileNames.mountProfile]: item.mountProfile || 0,
          [profileNames.connectorProfile]: item.connectorProfile || 0,
          [profileNames.adapterProfile]: item.adapterProfile || 0
        }));

        console.log('profilesByType with names:', profilesByTypeWithNames);
      }
    },
    {deep: true}
);

// Функция для логирования профилей
const logProfiles = () => {
  console.log('Текущие профили:', attachProfiles.value);
  console.log('Суммы по типам:', profilesByType.value);
};
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

.cell-profiles {
  margin-bottom: 30px;
}
</style>