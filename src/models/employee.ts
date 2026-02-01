export interface IEmployee {
  id?: number;
  firstName: string;
  lastName: string;
  position: string;
  experience: number;
  age: number;
  address: string;
}

export class Employee implements IEmployee {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  experience: number;
  age: number;
  address: string;

  constructor(data: Partial<IEmployee> = {}) {
    this.id = data.id || Date.now() + Math.random();
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.position = data.position || '';
    this.experience = data.experience || 0;
    this.age = data.age || 18;
    this.address = data.address || '';
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.firstName.trim()) errors.push('Имя обязательно');
    if (!this.lastName.trim()) errors.push('Фамилия обязательна');
    if (!this.position.trim()) errors.push('Должность обязательна');
    if (this.experience < 0) errors.push('Стаж не может быть отрицательным');
    if (this.experience > this.age - 16) errors.push('Стаж не может превышать возраст минус 16 лет');
    if (this.age < 18 || this.age > 100) errors.push('Возраст должен быть от 18 до 100 лет');
    if (!this.address.trim()) errors.push('Адрес обязателен');

    return { isValid: errors.length === 0, errors };
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  clone(): Employee {
    return new Employee({ ...this });
  }

  toJSON(): IEmployee {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      position: this.position,
      experience: this.experience,
      age: this.age,
      address: this.address
    };
  }
}