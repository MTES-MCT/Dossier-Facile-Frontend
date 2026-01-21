<template>
  <li>
    <router-link :to="to" class="radio-list-item">
      <slot />
    </router-link>

    <!-- <DsfrTile :title :to :description :details :horizontal>
      <template #header>
        <slot name="header"></slot>
      </template>
    </DsfrTile> -->
  </li>
</template>

<script setup lang="ts">
import { DsfrTile } from '@gouvminint/vue-dsfr'
import type { RouteLocationRaw, RouterLinkProps } from 'vue-router'

interface Props {
  to: RouterLinkProps['to']
  // title: string
  description?: string
  details?: string
  horizontal?: boolean
}

const { horizontal = true } = defineProps<Props>()
</script>

<style scoped>
.radio-list-item {
  padding: 0.5rem 1.5rem 0.5rem;
  display: flex;
  min-height: 5rem;
  flex-direction: column;
  justify-content: center;
  border: 1px solid var(--border-default-grey);
  background-image: none;
}
.radio-list-item:hover {
  cursor: pointer;
  outline: 2px solid var(--background-action-high-blue-france-active);
  background-color: var(--background-default-grey-hover);
}
</style>
