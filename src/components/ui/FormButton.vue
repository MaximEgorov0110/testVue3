<template>
  <button
    :class="['form-btn', type]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="btn-text">{{ text }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormButton',
  
  props: {
    text: {
      type: String,
      required: true
    },
    type: {
      type: String as () => 'submit' | 'reset',
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['click'],
  
  setup(props, { emit }) {
    const handleClick = (event: Event): void => {
      if (!props.disabled) {
        emit('click', event);
      }
    };

    return {
      handleClick
    };
  }
});
</script>

<style lang="scss" scoped>
.form-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in;
  min-width: 120px;
  font-family: inherit;
  line-height: 1;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.submit {
    background-color: #3b82f6;
    color: white;

    &:hover:not(:disabled) {
      background-color: #2563eb;
    }
  }

  &.reset {
    background-color: #f1f5f9;
    color: #475569;

    &:hover:not(:disabled) {
      background-color: #e2e8f0;
    }
  }

  .btn-text {
    white-space: nowrap;
  }
}
</style>