<template>
  <p class="display--flex align-items--center">
    <span>{{ label }}</span>
    <router-link :to="to" class="fr-btn fr-btn--tertiary-no-outline fr-ml-auto"
      >Modifier <RiArrowGoBackLine size="1rem" class="fr-ml-1w"
    /></router-link>
  </p>
</template>

<script setup lang="ts">
import type { RouterLinkProps } from 'vue-router'
import { RiArrowGoBackLine } from '@remixicon/vue'

defineProps<{ label: string; to: RouterLinkProps['to'] }>()
</script>
