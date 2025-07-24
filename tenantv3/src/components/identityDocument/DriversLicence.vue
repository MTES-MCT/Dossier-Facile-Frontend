<template>
  <BackLinkRow :label="t('drivers-license')" :to="parent" category="driving-licence" />
  <i18n-t :keypath="'add-doc-' + textKey" tag="p"
    ><strong>{{ t('valid') }}</strong></i18n-t
  >
  <UploadFilesIdentity category="DRIVERS_LICENSE" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import BackLinkRow from './lib/IdentityBackRow.vue'
import UploadFilesIdentity from './lib/UploadFilesIdentity.vue'
import { useIdentificationState } from './lib/identityDocumentState'

const parent = useParentRoute()
const { t } = useI18n()
const { textKey } = useIdentificationState()
</script>

<i18n>
{
  "en": {
    "add-doc-tenant": "Be sure to enclose your {0} French or foreign driver's license.",
    "add-doc-guarantor": "Be sure to enclose your guarantor's {0} French or foreign driver's license.",
    "add-doc-couple": "Be sure to enclose your spouse's {0} French or foreign driver's license.",
    "valid": "valid",
  },
  "fr": {
    "add-doc-tenant": "Assurez-vous de joindre votre permis de conduire français ou étranger {0}.",
    "add-doc-guarantor": "Assurez-vous de joindre le permis de conduire français ou étranger de votre garant {0}.",
    "add-doc-couple": "Assurez-vous de joindre le permis de conduire français ou étranger de votre conjoint {0}.",
    "valid": "en cours de validité",
  }
}
</i18n>
