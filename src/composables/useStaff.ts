import { computed } from 'vue';
import { useStaffStore } from '../store/modules/staff';
import type { IEmployee } from '../models/employee';

export function useStaff() {
  const staffStore = useStaffStore();

  // Инициализация при первом запуске
  staffStore.init();

  // Геттеры
  const employees = computed(() => staffStore.getEmployees);
  const employeesCount = computed(() => staffStore.getEmployeesCount);
  const showForm = computed(() => staffStore.showForm);
  const currentEmployee = computed(() => staffStore.currentEmployee);
  const isEditing = computed(() => staffStore.isEditing);
  const isCurrentEmployeeValid = computed(() => staffStore.isCurrentEmployeeValid);
  const currentEmployeeErrors = computed(() => staffStore.getCurrentEmployeeErrors);

  // Методы
  const openAddForm = (): void => {
    staffStore.openAddForm();
  };

  const openEditForm = (id: number): void => {
    staffStore.openEditForm(id);
  };

  const closeForm = (): void => {
    staffStore.closeForm();
  };

  const deleteEmployee = (id: number): void => {
    staffStore.deleteEmployee(id);
  };

  const updateCurrentEmployee = (employeeData: Partial<IEmployee>): void => {
    staffStore.updateCurrentEmployee(employeeData);
  };

  const saveEmployee = async (employeeData: Partial<IEmployee>): Promise<boolean> => {
    try {
      await staffStore.saveEmployee(employeeData);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
      return false;
    }
  };

  return {
    // Состояние
    employees,
    employeesCount,
    showForm,
    currentEmployee,
    isEditing,
    isCurrentEmployeeValid,
    currentEmployeeErrors,

    // Методы
    openAddForm,
    openEditForm,
    closeForm,
    saveEmployee,
    deleteEmployee,
    updateCurrentEmployee
  };
}