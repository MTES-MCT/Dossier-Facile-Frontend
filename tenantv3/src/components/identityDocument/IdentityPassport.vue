<template>
  <BackLinkRow :label="t('passport')" :to="parent" category="passport" />
  <p class="fr-mb-0">{{ t('add-passport-' + textKey) }}</p>
  <ul>
    <li class="bold">{{ t('valid') }}</li>
    <li class="bold">{{ t('pages-2-3') }}</li>
  </ul>
  <InfoVisa />
  <UploadFilesIdentity category="FRENCH_PASSPORT" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import BackLinkRow from './lib/IdentityBackRow.vue'
import UploadFilesIdentity from './lib/UploadFilesIdentity.vue'
import { useIdentificationState } from './lib/identityDocumentState'
import InfoVisa from './lib/InfoVisa.vue'

const parent = useParentRoute()
const { t } = useI18n()
const { textKey } = useIdentificationState()
</script>

<i18n>
{
  "en": {
    "add-passport-tenant": "Be sure to enclose your French or foreign passport:",
    "add-passport-guarantor": "Be sure to enclose your guarantor's French or foreign passport:",
    "add-passport-couple": "Be sure to enclose your spouse's French or foreign passport:",
    "add-passport-couple-guarantor": "Be sure to enclose their guarantor's French or foreign passport:",
    "valid": "valid",
    "pages-2-3": "pages 2 and 3 to show signature",
  },
  "fr": {
    "add-passport-tenant": "Assurez-vous de joindre votre passeport français ou étranger :",
    "add-passport-guarantor": "Assurez-vous de joindre le passeport français ou étranger de votre garant :",
    "add-passport-couple": "Assurez-vous de joindre le passeport français ou étranger de votre conjoint :",
    "add-passport-couple-guarantor": "Assurez-vous de joindre le passeport français ou étranger de son garant :",
    "valid": "en cours de validité",
    "pages-2-3": "les pages 2 et 3 pour faire apparaître la signature",
  }
}
</i18n>
