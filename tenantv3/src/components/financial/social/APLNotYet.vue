<template>
  <BackLinkRow :label="t('form.financial.social-aid')" :to="ancestor" />
  <BackLinkRow
    :label="t('form.financial.you-receive', [t('form.financial.social.apl')])"
    :to="grandparent"
  />
  <BackLinkRow :label="t('not-yet')" :to="parent" />
  <p class="fr-mb-1w">{{ t('form.financial.enter-monthly-income') }}</p>
  <UploadFilesFinancial category="SOCIAL_SERVICE" step="SOCIAL_SERVICE_APL_NOT_YET">
    <template #incomeFilled>
      <i18n-t tag="p" keypath="please-provide">
        <a href="https://www.service-public.fr/particuliers/vosdroits/R2972" target="_blank">{{
          t('simulation')
        }}</a>
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
const grandparent = useParentRoute(2)
const ancestor = useParentRoute(3)
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "not-yet": "You're not yet receiving APL",
    "please-provide": "Please provide a screenshot of the {0}.",
    "simulation": "CAF housing assistance simulation"
  },
  "fr": {
    "not-yet": "Vous ne touchez pas encore l’APL",
    "please-provide": "Veuillez fournir une copie d’écran de la {0}.",
    "simulation": "simulation CAF d’aide au logement"
  }
}
</i18n>
