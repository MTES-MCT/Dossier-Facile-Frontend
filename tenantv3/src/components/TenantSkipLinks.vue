<template>
  <DsfrSkipLinks v-if="skipLinks" :links="skipLinks" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { DsfrSkipLinks } from '@gouvminint/vue-dsfr'
import { useI18n } from 'vue-i18n'
import { localizeSkipLinks } from 'df-shared-next/src/models/SkipLink'

const route = useRoute()
const { t } = useI18n()
const links = computed(() => route.meta.skipLinks?.links)
const skipLinks = computed(() => localizeSkipLinks(links.value, t))
</script>
