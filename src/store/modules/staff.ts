import { defineStore } from 'pinia';
import { Employee } from '../../models/employee';
import type { IEmployee } from '../../models/employee';

export const useStaffStore = defineStore('staff', {
  state: () => ({
    employees: JSON.parse(localStorage.getItem('staff_employees') || '[]') as IEmployee[],
    currentEmployee: null as IEmployee | null,
    isEditing: false,
    showForm: false
  }),

  getters: {
    getEmployees: (state): Employee[] =>
      state.employees.map(emp => new Employee(emp)),

    getEmployeeById: (state) => (id: number): Employee | undefined => {
      const empData = state.employees.find(emp => emp.id === id);
      return empData ? new Employee(empData) : undefined;
    },

    getEmployeesCount: (state): number => state.employees.length,

    isCurrentEmployeeValid: (state): boolean => {
      if (!state.currentEmployee) return false;
      const employee = new Employee(state.currentEmployee);
      return employee.validate().isValid;
    },

    getCurrentEmployeeErrors: (state): string[] => {
      if (!state.currentEmployee) return [];
      const employee = new Employee(state.currentEmployee);
      return employee.validate().errors;
    },

    currentEmployeeAsObject: (state): Employee | null => {
      return state.currentEmployee ? new Employee(state.currentEmployee) : null;
    }
  },

  actions: {
    saveToStorage() {
      localStorage.setItem('staff_employees', JSON.stringify(this.employees));
    },

    init() {
      if (this.employees.length === 0) {
        const defaultEmployees: IEmployee[] = [
          {
            id: 1,
            firstName: 'Иван',
            lastName: 'Петров',
            position: 'Повар',
            experience: 10,
            age: 45,
            address: 'Москва, ул. Ленина, д. 10'
          },
          {
            id: 2,
            firstName: 'Мария',
            lastName: 'Сидорова',
            position: 'Директор',
            experience: 15,
            age: 42,
            address: 'Санкт-Петербург, Невский пр., д. 25'
          },
          {
            id: 3,
            firstName: 'Алексей',
            lastName: 'Иванов',
            position: 'Уборщик',
            experience: 3,
            age: 28,
            address: 'Казань, ул. Баумана, д. 15'
          }
        ];

        this.employees = defaultEmployees;
        this.saveToStorage();
      }
    },

    openAddForm() {
      this.currentEmployee = {
        id: Date.now() + Math.random(),
        firstName: '',
        lastName: '',
        position: '',
        experience: 0,
        age: 18,
        address: ''
      };
      this.isEditing = false;
      this.showForm = true;
    },

    openEditForm(id: number) {
      const employeeData = this.employees.find(emp => emp.id === id);
      if (employeeData) {
        this.currentEmployee = { ...employeeData };
        this.isEditing = true;
        this.showForm = true;
      }
    },

    closeForm() {
      this.showForm = false;
      this.currentEmployee = null;
      this.isEditing = false;
    },

    updateCurrentEmployee(employeeData: Partial<IEmployee>) {
      if (this.currentEmployee) {
        this.currentEmployee = {
          ...this.currentEmployee,
          ...employeeData
        };
      }
    },

    addEmployee(employeeData: Partial<IEmployee>) {
      const employee = new Employee(employeeData);

      const validation = employee.validate();
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }

      this.employees.push(employee.toJSON());
      this.saveToStorage();
      return employee;
    },

    updateEmployee(employeeData: IEmployee) {
      const employee = new Employee(employeeData);

      const validation = employee.validate();
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }

      const index = this.employees.findIndex(emp => emp.id === employee.id);
      if (index !== -1) {
        this.employees[index] = employee.toJSON();
        this.saveToStorage();
        return employee;
      }

      throw new Error('Сотрудник не найден');
    },

    deleteEmployee(id: number) {
      this.employees = this.employees.filter(emp => emp.id !== id);
      this.saveToStorage();
    },

    saveEmployee(employeeData: Partial<IEmployee>) {
      if (this.isEditing && this.currentEmployee) {
        // Обновить существующего
        return this.updateEmployee({
          ...employeeData,
          id: this.currentEmployee.id
        } as IEmployee);
      } else {
        // Добавить нового
        return this.addEmployee(employeeData);
      }
    }
  }
});