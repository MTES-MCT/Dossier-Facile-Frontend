<template>
  <IndetityBackLinkRow :label="t('third-party-identity')" />
  <IdentityForm text-key="third-party" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IndetityBackLinkRow from './lib/IdentityBackLinkRow.vue'
import IdentityForm from './IdentityForm.vue'
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "third-party-identity": "For someone else"
  },
  "fr": {
    "third-party-identity": "Pour une autre personne"
  }
}
</i18n>
