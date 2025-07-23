<template>
  <div class="fr-alert fr-alert--info">
    <p :class="pclass">{{ t('realistic-amount') }}</p>
    <slot></slot>
    <p :class="pclass">{{ t('auto-reject') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{ pclass?: string }>()
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "realistic-amount": "The amount entered must be realistic.",
    "auto-reject": "Our team automatically rejects overvalued earnings.",
  },
  "fr": {
    "realistic-amount": "Le montant saisi doit être réaliste.",
    "auto-reject": "Notre équipe refuse automatiquement les revenus surévalués.",
  }
}
</i18n>
