<template>
  <DsfrAccordion>
    <template #title>
      {{ title }}
    </template>
    <slot></slot>
  </DsfrAccordion>
</template>

<script setup lang="ts">
import { DsfrAccordion } from '@gouvminint/vue-dsfr'

defineProps<{ title: string }>()
</script>
