<template>
  <div class="banner-icon-text-line" :class="lineClass">
    <VIcon
      class="banner-icon-text-line__icon"
      :name="iconName"
      :scale="iconScale"
      :color="iconColor"
    />
    <span class="banner-icon-text-line__text fr-ml-1w" :class="textClass">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from '@gouvminint/vue-dsfr'

withDefaults(
  defineProps<{
    iconName: string
    iconColor: string
    text: string
    textClass?: string
    lineClass?: string
    iconScale?: number
  }>(),
  {
    textClass: undefined,
    lineClass: undefined,
    iconScale: 1.25
  }
)
</script>

<style scoped>
.banner-icon-text-line {
  display: flex;
  align-items: flex-start;
}

.banner-icon-text-line__icon {
  flex-shrink: 0;
}

.banner-icon-text-line__text {
  font-size: 0.875rem;
  line-height: 1.5rem;
}
</style>
