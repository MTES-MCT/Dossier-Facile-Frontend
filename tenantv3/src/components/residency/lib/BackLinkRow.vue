<template>
  <p class="display--flex align-items--center">
    <RiCheckboxCircleLine color="var(--primary)" size="20px" class="fr-mr-1w no-shrink" />
    <span>{{ label }}</span>
    <router-link :to="to" class="fr-btn fr-btn--tertiary-no-outline fr-ml-auto"
      >{{ t('edit') }} <RiArrowGoBackLine size="1rem" class="fr-ml-1w"
    /></router-link>
  </p>
</template>

<script setup lang="ts">
import type { RouterLinkProps } from 'vue-router'
import { RiArrowGoBackLine, RiCheckboxCircleLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'

defineProps<{ label: string; to: RouterLinkProps['to'] }>()
const { t } = useI18n()
</script>

<style scoped>
.no-shrink {
  flex-shrink: 0;
}
</style>

<i18n>
{
  "en": {
    "edit": "Edit"
  },
  "fr": {
    "edit": "Modifier"
  }
}
</i18n>
