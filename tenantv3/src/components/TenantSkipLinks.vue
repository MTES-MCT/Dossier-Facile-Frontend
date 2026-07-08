<template>
  <DsfrSkipLinks v-if="links" :links />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { DsfrSkipLinks } from '@gouvminint/vue-dsfr'

const route = useRoute()
const links = computed(() => route.meta.skipLinks?.links)
</script>
