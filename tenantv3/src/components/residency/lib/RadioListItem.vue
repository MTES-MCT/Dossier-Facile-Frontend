<template>
  <div class="fr-fieldset__element">
    <router-link :to="to" class="radio-group">
      <div class="radio-list-item">
        <slot />
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import type { RouterLinkProps } from 'vue-router'

defineProps<{ to: RouterLinkProps['to'] }>()
</script>

<style scoped>
.radio-list-item {
  min-height: 5rem;
  padding: 0.5rem 1.5rem 0.5rem 3.5rem;
  border: 1px solid var(--border-default-grey);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;

  &:hover {
    cursor: pointer;
    background-color: var(--background-default-grey-hover);
  }

  &::after {
    content: ' ';
    background-color: transparent;
    border: 1px solid var(--primary);
    border-radius: 50%;
    height: 1rem;
    width: 1rem;
    left: calc(2rem - 4px);
    top: 2rem;
    position: absolute;
  }
}
</style>
