<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" />
  <BackLinkRow
    :label="t('form.financial.you-receive', [t('form.financial.social.aah')])"
    :to="grandparent"
  />
  <BackLinkRow :label="t('not-yet')" :to="parent" />
  <p class="fr-mb-1w">{{ t('form.financial.enter-monthly-income') }}</p>
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_AAH_NOT_YET">
    <template #incomeFilled>
      <p>{{ t('please-provide') }}</p>
    </template>
  </UploadFilesFinancial>
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/financial/lib/FinancialBackRow.vue'
import { useParentRoute } from '../../guarantorResidency/useParentRoute'
import UploadFilesFinancial from '../lib/UploadFilesFinancial.vue'
import { useI18n } from 'vue-i18n'

const parent = useParentRoute()
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "not-yet": "You're not yet receiving AAH",
    "please-provide": "Please provide notification of the MDPH's decision.",
  },
  "fr": {
    "not-yet": "Vous ne touchez pas encore l’AAH",
    "please-provide": "Veuillez fournir la notification de décision de la MDPH.",
  }
}
</i18n>
