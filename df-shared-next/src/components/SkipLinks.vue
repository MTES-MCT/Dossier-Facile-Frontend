<template>
  <DsfrSkipLinks v-if="links?.links" :links="links.links" />
</template>

<script setup lang="ts">
import { DsfrSkipLinks, type DsfrSkipLinksProps } from '@gouvminint/vue-dsfr'

interface Props {
  links: DsfrSkipLinksProps
}

defineProps<Props>()
</script>
