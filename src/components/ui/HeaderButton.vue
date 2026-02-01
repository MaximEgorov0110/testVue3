<template>
  <button
    :class="['header-btn', type]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="btn-text">{{ text }}</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeaderButton',
  
  props: {
    text: {
      type: String,
      required: true
    },
    type: {
      type: String as () => 'add',
      default: 'add'
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
.header-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  line-height: 1;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.add {
    background-color: #3b82f6;
    color: white;

    &:hover:not(:disabled) {
      background-color: #2563eb;
    }
  }

  .btn-text {
    white-space: nowrap;
  }
}
</style>