<template>
  <BackLinkRow :label="t('public')" :to="parent" category="PUBLIC" />
  <i18n-t tag="p" :keypath="'desc-public-' + suffix">
    <strong>{{ t('appointment-order') }}</strong>
  </i18n-t>
  <p>{{ t('if-no-doc-' + suffix) }}</p>
  <UploadFilesMainActivity category="PUBLIC" />
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
    "public": "Civil servant",
    "desc-public-tenant":"Please provide your current or future {0}.",
    "desc-public-other":"Please provide their current or future {0}.",
    "appointment-order": "appointment order",
    "if-no-doc-tenant": "If you don't have your appointment order, you can add a certificate from your employer less than 3 months old.",
    "if-no-doc-other": "If you don't have their appointment order, you can add a certificate from their employer less than 3 months old."
  },
  "fr": {
    "public": "Fonctionnaire",
    "desc-public-tenant":"Veuillez fournir votre {0} en cours ou à venir.",
    "desc-public-other":"Veuillez fournir son {0} en cours ou à venir.",
    "appointment-order": "arrêté de nomination",
    "if-no-doc-tenant": "Si vous ne disposez pas de votre arrêté de nomination, vous pouvez ajouter une attestation de votre employeur de moins de 3 mois.",
    "if-no-doc-other": "Si vous ne disposez pas de son arrêté de nomination, vous pouvez ajouter une attestation de son employeur de moins de 3 mois."
  }
}
</i18n>
