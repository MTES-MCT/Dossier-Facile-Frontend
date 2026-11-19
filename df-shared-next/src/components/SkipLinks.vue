<template>
  <DsfrSkipLinks v-if="skipLinks" :links="skipLinks" />
</template>

<script setup lang="ts">
import { DsfrSkipLinks, type DsfrSkipLinksProps } from '@gouvminint/vue-dsfr'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { localizeSkipLinks } from '../models/SkipLink'

const { t } = useI18n()

interface Props {
  links: DsfrSkipLinksProps
}

const props = defineProps<Props>()

const skipLinks = computed(() => localizeSkipLinks(props.links.links, t))
</script>
