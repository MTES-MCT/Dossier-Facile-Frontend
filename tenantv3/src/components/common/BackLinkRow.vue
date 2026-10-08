<template>
  <div class="display--flex align-items--center fr-mb-3w">
    <VIcon
      name="ri:checkbox-circle-line"
      color="var(--primary)"
      size="20px"
      class="fr-mr-1w no-shrink"
    />
    <h2 class="fr-text--md fr-text--regular fr-mb-0">{{ label }}</h2>
    <DsfrButton
      v-if="isButton"
      :label="t('edit')"
      tertiary
      no-outline
      class="fr-ml-auto"
      :disabled
      icon="fr-icon-arrow-go-back-fill"
      icon-right
      @click="$emit('click')"
    >
      <span class="visually-hidden">: {{ label }}</span>
    </DsfrButton>
    <RouterLink
      v-else
      class="fr-btn fr-icon-arrow-go-back-fill fr-btn--icon-right fr-btn--tertiary-no-outline fr-ml-auto"
      :to
    >
      {{ t('edit') }} <span class="visually-hidden">: {{ label }}</span>
    </RouterLink>
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * The component uses either a link to go back to a previous step or a button to open the confirmation dialog before navigation.
 */

import { useI18n } from 'vue-i18n'
import { DsfrButton, VIcon } from '@gouvminint/vue-dsfr'
import type { RouteLocationRaw, RouterLink } from 'vue-router'

const {
  label,
  disabled = false,
  to,
  isButton
} = defineProps<{
  label: string
  disabled?: boolean
  to: RouteLocationRaw
  isButton: boolean
}>()

defineEmits<{ click: [] }>()
const { t } = useI18n()
</script>

<style scoped>
.no-shrink {
  flex-shrink: 0;
}
</style>

<i18n lang="json">
{
  "en": {
    "edit": "Edit"
  },
  "fr": {
    "edit": "Modifier"
  }
}
</i18n>
