<template>
  <div class="staff-table">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>ФИО</th>
            <th>Должность</th>
            <th>Возраст</th>
            <th>Стаж (лет)</th>
            <th>Адрес</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in employees" :key="employee.id">
            <td class="index">{{ index + 1 }}</td>
            <td class="name-cell">{{ employee.fullName }}</td>
            <td class="position-cell">{{ employee.position }}</td>
            <td class="age-cell">{{ employee.age }}</td>
            <td class="experience-cell">{{ employee.experience }}</td>
            <td class="address-cell">{{ employee.address }}</td>
            <td class="actions-cell">
              <TableButton
                type="edit"
                text="Редактировать"
                @click="handleEdit(employee.id)"
              />
              <TableButton
                type="delete"
                text="Удалить"
                @click="handleDelete(employee.id)"
              />
            </td>
          </tr>
          
          <tr v-if="employees.length === 0">
            <td colspan="7" class="empty-state">
              <h3>Сотрудников пока нет</h3>
              <p>Добавьте первого сотрудника</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { Employee } from '../../models/employee';
import TableButton from '../ui/TableButton.vue';

export default defineComponent({
  name: 'StaffTable',

    components: {
    TableButton
  },

  props: {
    employees: {
      type: Array as PropType<Employee[]>,
      required: true,
      default: () => []
    }
  },
  
  emits: ['edit', 'delete'],
  
  setup(_, { emit }) {
    const handleEdit = (id: number): void => {
      emit('edit', id);
    };

    const handleDelete = (id: number): void => {
      emit('delete', id);
    };

    return {
      handleEdit,
      handleDelete,
    };
  }
});
</script>

<style lang="scss" scoped>
.staff-table {
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  & table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
    & thead {
      background-color: #FFFFFF;
      border-bottom: 2px solid #FFFFFF;
      & tr {
        & th {
          padding: 16px 20px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          white-space: nowrap;
        }
      }
    }
    & tbody{
      & tr {
        &:hover {
          background-color: #f8fafc;
        }
      
        & td {
        padding: 16px 20px;
        border-bottom: 1px solid #f1f5f9;

          &.position-cell,
          &.age-cell,
          &.experience-cell {
          font-weight: 500;
          text-align: center;
          width: 100px;
          }

          &.name-cel,
          &.address-cell {
            max-width: 250px;
          }

          &.actions-cell {
            min-width: 220px;
            white-space: nowrap;
          }
          
          &.empty-state {
            padding: 60px 20px;
            text-align: center;
        
            & h3 {
              margin: 0 0 8px 0;
              font-weight: 600;
            }
        
            & p {
              margin: 0;
              font-size: 14px;
            }
          }
        }
      } 
    }
  }
}
</style>