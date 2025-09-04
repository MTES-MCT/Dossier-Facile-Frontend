<template>
  <DsfrAccordion>
    <template #title>
      <RiArrowRightLine class="circle fr-p-1v" aria-hidden="true" />
      <span class="fr-h3">{{ title }}</span>
    </template>
    <slot></slot>
  </DsfrAccordion>
</template>

<script setup lang="ts">
import { DsfrAccordion } from '@gouvminint/vue-dsfr'
import { RiArrowRightLine } from '@remixicon/vue'

defineProps<{ title: string }>()
</script>

<style scoped>
.fr-h3 {
  font-weight: 400 !important;
  color: var(--text-action-high-blue-france);
}
</style>
