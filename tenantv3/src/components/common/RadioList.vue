<template>
  <ul role="list">
    <li v-for="(item, idx) of listItems" :key="idx" v-show="item.condition ?? true">
      <div v-if="item.event" @click.capture="triggerAnalytics(item.event)">
        <DsfrCard
          :link="item.to"
          :title="item.title"
          :description="item.description ?? ''"
          title-tag="h2"
        />
      </div>
      <div v-else @click.capture="triggerAnalytics()">
        <DsfrCard
          :link="item.to"
          :title="item.title"
          :description="item.description ?? ''"
          title-tag="h2"
        />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { DsfrCard } from '@gouvminint/vue-dsfr'

export interface OptionLink {
  to: string
  title: string
  event?: string
  condition?: boolean
  description?: string
}

type AnalyticsEmits = {
  (e: 'analytics:bare'): void
  (e: 'analytics', payload: string): void
}
const emit = defineEmits<AnalyticsEmits>()

interface Props {
  listItems: OptionLink[]
}
defineProps<Props>()

// pass the analytics back to the parent with correct dynamic values
const triggerAnalytics = (value?: string) => {
  if (value) emit('analytics', value)
  else emit('analytics:bare')
}
</script>

<style scoped>
ul > li + li {
  margin-block-start: 1rem;
}

/* Surcharge pour réduire les marges de la card */
:deep(.fr-card.fr-enlarge-link:not(.fr-card--no-icon) .fr-card__content) {
  padding: 1.5rem 1rem;
}
:deep(.fr-card.fr-enlarge-link .fr-card__title a::after) {
  right: 1rem;
  top: 50%;
  translate: 0 -50%;
}
:deep(.fr-card__desc) {
  margin-block-start: 0.5rem;
}
/* hide description when none is provided (upstream bug) */
:deep(.fr-card__desc:empty) {
  display: none;
}
:deep(.fr-card__title) {
  max-inline-size: 30ch;
}
</style>
