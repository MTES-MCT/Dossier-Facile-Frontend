<template>
  <IdentityBackLinkRow
    :label="t('third-party-identity')"
    @click="AnalyticsService.tenantIdentityModifyThirdParty()"
  />
  <IdentityForm text-key="third-party" />
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { useI18n } from 'vue-i18n'
import IdentityForm from './IdentityForm.vue'
import IdentityBackLinkRow from './lib/IdentityBackLinkRow.vue'
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
