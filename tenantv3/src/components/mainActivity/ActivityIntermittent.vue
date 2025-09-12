<template>
  <BackLinkRow :label="t('intermittent')" :to="parent" category="INTERMITTENT" />
  <i18n-t tag="p" :keypath="'please-provide-' + suffix">
    <template #report>
      <strong>{{ t('status-report') }}</strong>
    </template>
    <template #link>
      <a
        href="https://www.francetravail.fr/faq/candidat/ma-recherche-demploi/laccompagnement-par-le-reseau-fr/lespace-personnel/attestation-france-travail.html"
        :title="`${t('obtain-report')} - ${t('new-window')}`"
        target="_blank"
        >{{ t('obtain-report') }}</a
      >
    </template>
  </i18n-t>
  <p>{{ t('tip-' + suffix) }}</p>

  <UploadFilesMainActivity category="INTERMITTENT" />
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
    "intermittent": "Intermittent",
    "please-provide-tenant":"Please add a France Travail status report less than 3 months old (obtain a status report), as well as your current employment contract if you have one.",
    "please-provide-other":"Please add a France Travail status report less than 3 months old (obtain a status report), as well as their current employment contract if available.",
    "tip-tenant": "Tip: you can also add your contracts for the last 3 months. This will enable an owner to check that your assignments are regular and recurring. However, be careful not to overload your file: if you have 30 one-day contracts, it's better to add a summary document rather than these 30 contracts.",
    "tip-other": "Tip: you can also add their contracts for the last 3 months. This will enable an owner to check that their assignments are regular and recurring. However, be careful not to overload your file: if you have 30 one-day contracts, it's better to add a summary document rather than these 30 contracts."
  },
  "fr": {
    "intermittent": "Intermittence",
    "please-provide-tenant":"Merci d’ajouter un {report} de moins de 3 mois ({link}), ainsi que votre contrat de travail en cours si vous en avez un.",
    "please-provide-other":"Merci d’ajouter un {report} de moins de 3 mois ({link}), ainsi que son contrat de travail en cours si cette personne en dispose.",
    "status-report": "avis de situation France Travail",
    "obtain-report": "obtenir un avis de situation",
    "tip-tenant": "Conseil : vous pouvez également ajouter vos contrats de ces 3 derniers mois. Cela permettra à un propriétaire de s’assurer que vos missions sont régulières et récurrentes. Attention toutefois à ne pas surcharger votre dossier : si vous avez 30 contrats d’une journée, il vaut mieux ajouter un document récapitulatif plutôt que ces 30 contrats.",
    "tip-other": "Conseil : vous pouvez également ajouter ses contrats de ces 3 derniers mois. Cela permettra à un propriétaire de s’assurer que ses missions sont régulières et récurrentes. Attention toutefois à ne pas surcharger votre dossier : si vous avez 30 contrats d’une journée, il vaut mieux ajouter un document récapitulatif plutôt que ces 30 contrats."
  }
}
</i18n>
