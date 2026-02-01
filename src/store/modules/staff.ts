import { defineStore } from 'pinia';
import { Employee } from '../../models/employee';
import type { IEmployee } from '../../models/employee';

export const useStaffStore = defineStore('staff', {
  state: () => ({
    employees: JSON.parse(localStorage.getItem('staff_employees') || '[]')
      .map((emp: any) => new Employee(emp)) as Employee[],
    currentEmployee: null as Employee | null,
    isEditing: false,
    showForm: false
  }),

  getters: {
    getEmployees: (state): Employee[] => state.employees,

    getEmployeeById: (state) => (id: number): Employee | undefined => {
      return state.employees.find(emp => emp.id === id);
    },

    getEmployeesCount: (state): number => state.employees.length,

    isCurrentEmployeeValid: (state): boolean => {
      return state.currentEmployee?.validate().isValid || false;
    },

    getCurrentEmployeeErrors: (state): string[] => {
      return state.currentEmployee?.validate().errors || [];
    },
  },

  actions: {
    saveToStorage() {
      const employeesData = this.employees.map(emp => ({
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        position: emp.position,
        experience: emp.experience,
        age: emp.age,
        address: emp.address
      }));
      localStorage.setItem('staff_employees', JSON.stringify(employeesData));
    },

    init() {
      if (this.employees.length === 0) {
        this.employees = [
          new Employee({
            id: 1,
            firstName: 'Иван',
            lastName: 'Петров',
            position: 'Повар',
            experience: 10,
            age: 45,
            address: 'Москва, ул. Ленина, д. 10'
          }),
          new Employee({
            id: 2,
            firstName: 'Мария',
            lastName: 'Сидорова',
            position: 'Директор',
            experience: 15,
            age: 42,
            address: 'Санкт-Петербург, Невский пр., д. 25'
          }),
          new Employee({
            id: 3,
            firstName: 'Алексей',
            lastName: 'Иванов',
            position: 'Уборщик',
            experience: 3,
            age: 28,
            address: 'Казань, ул. Баумана, д. 15'
          })
        ];
        this.saveToStorage();
      }
    },

    openAddForm() {
      this.currentEmployee = new Employee({
        id: Date.now() + Math.random(),
        firstName: '',
        lastName: '',
        position: '',
        experience: 0,
        age: 18,
        address: ''
      });
      this.isEditing = false;
      this.showForm = true;
    },

    openEditForm(id: number) {
      const employee = this.employees.find(emp => emp.id === id);
      if (employee) {
        this.currentEmployee = employee.clone(); // Используем клонирование
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
        this.currentEmployee = new Employee({
          ...this.currentEmployee,
          ...employeeData
        });
      }
    },

    addEmployee(employeeData: Partial<IEmployee>) {
      const employee = new Employee(employeeData);

      const validation = employee.validate();
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }

      this.employees.push(employee);
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
        this.employees[index] = employee;
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
      }
      // Добавить нового
      return this.addEmployee(employeeData);
    }
  }
});