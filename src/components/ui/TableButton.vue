<template>
  <button
    :class="['action-btn', type]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="btn-text">{{ text }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ActionButton',
  
  props: {
    text: {
      type: String,
      required: true
    },
    type: {
      type: String as () => 'edit' | 'delete',
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
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in;
  margin-right: 8px;
  line-height: 1;

  &.edit {
    background-color: #dbeafe;
    color: #1549da;

    &:hover:not(:disabled) {
      background-color: #c8ddf8;
    }
  }

  &.delete {
    background-color: #fee2e2;
    color: #dc2626;

    &:hover:not(:disabled) {
      background-color: #f8c0c0;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.btn-text {
    white-space: nowrap;
  }
}
</style>