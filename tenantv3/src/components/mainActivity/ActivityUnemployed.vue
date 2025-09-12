<template>
  <BackLinkRow :label="t('unemployed')" :to="parent" category="UNEMPLOYED" />
  <p class="fr-mb-0">{{ t('please-provide') }}</p>
  <ul>
    <li>
      <i18n-t keypath="row-1">
        <template #report>
          <strong>{{ t('status-report') }}</strong>
        </template>
        <template #link>
          <a
            href="https://www.francetravail.fr/faq/candidat/ma-recherche-demploi/laccompagnement-par-le-reseau-fr/lespace-personnel/attestation-france-travail.html"
            :title="`${t('get-status-report-' + suffix)} - ${t('new-window')}`"
            target="_blank"
            >{{ t('get-status-report-' + suffix) }}</a
          >
        </template>
      </i18n-t>
    </li>
    <li>{{ t('row-2') }}</li>
  </ul>
  <UploadFilesMainActivity category="UNEMPLOYED" />
</template>

<script setup lang="ts">
import BackLinkRow from '@/components/mainActivity/lib/ProfessionalBackRow.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useMainActivityState } from '@/components/mainActivity/lib/mainActivityState'
import { useI18n } from 'vue-i18n'
import UploadFilesMainActivity from './lib/UploadFilesMainActivity.vue'
const { t } = useI18n()
const { suffix } = useMainActivityState()
const parent = useParentRoute()
</script>

<i18n>
{
  "en": {
    "unemployed": "Unemployed",
    "please-provide":"Please provide one of the following:",
    "row-1": "a {report} less than 3 months old ({link})",
    "status-report": "France Travail status report",
    "get-status-report-tenant": "obtain your status report",
    "get-status-report-other": "obtain a status report",
    "row-2": "proof of ARE entitlement",
  },
  "fr": {
    "unemployed": "Chômage",
    "please-provide":"Veuillez fournir l’un des documents suivants :",
    "row-1": "un {report} de moins de 3 mois ({link})",
    "status-report": "avis de situation France Travail",
    "get-status-report-tenant": "obtenir votre avis de situation",
    "get-status-report-other": "obtenir un avis de situation",
    "row-2": "une attestation d’ouverture de droits à l’ARE",
  }
}
</i18n>
