<template>
  <div v-if="show" class="form-overlay" @click="close">
    <div class="form-modal" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditing ? 'Редактировать сотрудника' : 'Добавить сотрудника' }}</h2>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-content">
          <div class="form-group">
            <label for="firstName" class="form-label">Имя *</label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              class="form-input"
              placeholder="Введите имя"
              required
              @input="updateField('firstName', $event)"
            />
          </div>
          
          <div class="form-group">
            <label for="lastName" class="form-label">Фамилия *</label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              class="form-input"
              placeholder="Введите фамилию"
              required
              @input="updateField('lastName', $event)"
            />
          </div>
          
          <div class="form-group">
            <label for="position" class="form-label">Должность *</label>
            <select
              id="position"
              v-model="formData.position"
              class="form-select"
              required
              @change="updateField('position', $event)"
            >
              <option value="" disabled>Выберите должность</option>
              <option value="Директор">Директор</option>
              <option value="Шеф-повар">Шеф-повар</option>
              <option value="Повар">Повар</option>
              <option value="Уборщик">Уборщик</option>
              <option value="Официант">Официант</option>
              <option value="Менеджер">Менеджер</option>
              <option value="Разработчик">Разработчик</option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="age" class="form-label">Возраст *</label>
              <input
                id="age"
                v-model.number="formData.age"
                type="number"
                min="18"
                max="100"
                class="form-input"
                placeholder="18-100"
                required
                @input="updateField('age', $event)"
              />
            </div>
            
            <div class="form-group">
              <label for="experience" class="form-label">Стаж (лет) *</label>
              <input
                id="experience"
                v-model.number="formData.experience"
                type="number"
                min="0"
                max="82"
                class="form-input"
                placeholder="0-82"
                required
                @input="updateField('experience', $event)"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="address" class="form-label">Адрес *</label>
            <textarea
              id="address"
              v-model="formData.address"
              class="form-textarea"
              rows="3"
              placeholder="Введите адрес"
              required
              @input="updateField('address', $event)"
            ></textarea>
          </div>
        </div>
        
        <div class="form-actions">
          <FormButton 
            text="Отмена"
            type="reset"
            @click="close"
          />
          <FormButton 
            :text="isEditing ? 'Сохранить' : 'Добавить'"
            type="submit"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import type { IEmployee } from '../../models/employee';
import FormButton from '../ui/FormButton.vue';

interface FormData {
  firstName: string;
  lastName: string;
  position: string;
  experience: number;
  age: number;
  address: string;
}

export default defineComponent({
  name: 'UserForm',
  
  components: {
    FormButton
  },
  
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    employee: {
      type: Object as () => IEmployee | null,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['save', 'close'],
  
  setup(props, { emit }) {
    const formData = reactive<FormData>({
      firstName: '',
      lastName: '',
      position: '',
      experience: 0,
      age: 18,
      address: ''
    });

    watch(() => props.employee, (employee) => {
      if (employee) {
        formData.firstName = employee.firstName || '';
        formData.lastName = employee.lastName || '';
        formData.position = employee.position || '';
        formData.experience = employee.experience || 0;
        formData.age = employee.age || 18;
        formData.address = employee.address || '';
      } else {
        // Сброс формы
        formData.firstName = '';
        formData.lastName = '';
        formData.position = '';
        formData.experience = 0;
        formData.age = 18;
        formData.address = '';
      }
    }, { immediate: true });

    const updateField = (field: keyof FormData, event: Event): void => {
      const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      let value: string | number;
      
      if (field === 'age' || field === 'experience') {
        value = parseInt(target.value) || 0;
      } else {
        value = target.value;
      }
      
      formData[field] = value as never;
    };

    const close = (): void => {
      emit('close');
    };

    const handleSubmit = (): void => {
      const employeeData: IEmployee = {
        id: props.employee?.id || Date.now() + Math.random(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        position: formData.position,
        experience: formData.experience,
        age: formData.age,
        address: formData.address.trim()
      };
      emit('save', employeeData);
    };

    return {
      formData,
      updateField,
      close,
      handleSubmit
    };
  }
});
</script>

<style lang="scss" scoped>
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.form-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: modalAppear 0.5s ease-in;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  line-height: 1;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f1f5f9;
  }
}

form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-content {
  padding: 24px;
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #475569;
  font-size: 0.875rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.form-select {
  background-color: #FFFFFF;
  cursor: pointer;
  appearance: none;
  background-image: url('../../assets/formImages/icons8.png');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  padding: 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>