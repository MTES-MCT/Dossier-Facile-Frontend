<template>
  <BackLinkRow :label="t('no-activity')" :to="parent" category="NO_ACTIVITY" />
  <i18n-t tag="p" :keypath="'please-provide-' + suffix">
    <a href="https://www.service-public.fr/simulateur/calcul/AttestationHonneur" target="_blank">{{
      t('model')
    }}</a>
  </i18n-t>
  <UploadFilesMainActivity category="NO_ACTIVITY" />
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
    "no-activity": "No activity",
    "please-provide-tenant": "If your current activity does not correspond to any of the choices on this list, please add a sworn statement explaining your situation. You can use this {0}.",
    "please-provide-other": "If their current activity does not correspond to any of the choices on this list, please add a sworn statement explaining their situation. You can use this {0}.",
    "model": "model certificate"
  },
  "fr": {
    "no-activity": "Sans activité",
    "please-provide-tenant": "Si votre activité actuelle ne correspond à aucun des choix de cette liste, veuillez ajouter une attestation sur l’honneur qui explique votre situation. Vous pouvez utiliser ce {0}.",
    "please-provide-other": "Si son activité actuelle ne correspond à aucun des choix de cette liste, veuillez ajouter une attestation sur l’honneur qui explique sa situation. Vous pouvez utiliser ce {0}.",
    "model": "modèle d’attestation"
  }
}
</i18n>
