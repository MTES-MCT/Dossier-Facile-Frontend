<template>
  <BackLinkRow :label="t('scholarship')" :to="parent" />
  <i18n-t tag="p" class="fr-mb-1w" keypath="enter-income">
    <strong>{{ t('net-income') }}</strong>
  </i18n-t>
  <UploadFilesFinancial category="SCHOLARSHIP">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide">
        <strong>{{ t('award-notice') }}</strong>
      </i18n-t>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'

const parent = useParentRoute()
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "scholarship": "You have a scholarship",
    "enter-income": "Enter your {0}:",
    "net-income": "net monthly income",
    "please-provide": "Please provide your {0}.",
    "award-notice": "most recent notice of award"
  },
  "fr": {
    "scholarship": "Vous êtes boursier",
    "enter-income": "Saisissez votre {0} :",
    "net-income": "revenu mensuel net",
    "please-provide": "Veuillez fournir votre {0}.",
    "award-notice": "dernier avis d’attribution de bourse"
  }
}
</i18n>
