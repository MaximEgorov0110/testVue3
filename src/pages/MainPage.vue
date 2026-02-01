<template>
  <div class="main-page">
    <!-- Заголовок -->
    <header class="page-header">
      <h1>Список сотрудников ({{ employeesCount }})</h1>
      <HeaderButton 
        text="+ Добавить сотрудника"
        type="add"
        @click="openAddForm"
      />
    </header>
    
    <!-- Таблица сотрудников -->
    <StaffTable 
      :employees="employees"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    
    <!-- Модальное окно формы -->
    <UserForm
      :show="showForm"
      :employee="currentEmployee"
      :is-editing="isEditing"
      :errors="currentEmployeeErrors"
      :can-save="isCurrentEmployeeValid"
      @save="handleSave"
      @close="closeForm"
      @update="updateCurrentEmployee"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStaff } from '../composables/useStaff';
import StaffTable from '../components/blocks/StaffTable.vue';
import UserForm from '../components/blocks/UserForm.vue';
import HeaderButton from '../components/ui/HeaderButton.vue';

export default defineComponent({
  name: 'MainPage',
  
  components: {
    StaffTable,
    UserForm,
    HeaderButton
  },
  
  setup() {
    const staff = useStaff();
    
    const handleEdit = (id: number): void => {
      staff.openEditForm(id);
    };
    
    const handleDelete = (id: number): void => {
      if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
        staff.deleteEmployee(id);
      }
    };
    
    const handleSave = async (employeeData: any): Promise<void> => {
      const success = await staff.saveEmployee(employeeData);
      if (success) {
        staff.closeForm();
      }
    };
    
    return {
      employees: staff.employees,
      employeesCount: staff.employeesCount,
      showForm: staff.showForm,
      currentEmployee: staff.currentEmployee,
      isEditing: staff.isEditing,
      isCurrentEmployeeValid: staff.isCurrentEmployeeValid,
      currentEmployeeErrors: staff.currentEmployeeErrors,
      
      openAddForm: staff.openAddForm,
      closeForm: staff.closeForm,
      updateCurrentEmployee: staff.updateCurrentEmployee,
      
      handleEdit,
      handleDelete,
      handleSave
    };
  }
});
</script>

<style lang="scss" scoped>
.main-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0;
  color: #000000;
  font-size: 1.75rem;
}
</style>