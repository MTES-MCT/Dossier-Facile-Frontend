<template>
  <BackLinkRow :label="t('permit')" :to="parent" category="residency-permit" />
  <p class="fr-mb-0">{{ t('add-id-card-' + textKey) }}</p>
  <ul>
    <li class="bold">{{ t('valid') }}</li>
    <li class="bold">{{ t('both-sides') }}</li>
  </ul>
  <a
    href="https://www.service-public.fr/particuliers/vosdroits/N110#2_0"
    target="_blank"
    class="fr-mb-3w inline-block"
    >{{ t('permit-list') }}</a
  >
  <UploadFilesIdentity category="FRENCH_RESIDENCE_PERMIT" />
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
    "add-id-card-tenant": "Be sure to enclose your residence permit:",
    "add-id-card-guarantor": "Be sure to enclose your guarantor's residence permit:",
    "add-id-card-couple": "Be sure to enclose your spouse's residence permit:",
    "valid": "valid",
    "both-sides": "both sides",
    "permit-list": "List of residence permits"
  },
  "fr": {
    "add-id-card-tenant": "Assurez-vous de joindre votre carte ou titre de séjour :",
    "add-id-card-guarantor": "Assurez-vous de joindre la carte ou titre de séjour de votre garant :",
    "add-id-card-couple": "Assurez-vous de joindre la carte ou titre de séjour de votre conjoint :",
    "valid": "en cours de validité",
    "both-sides": "recto-verso",
    "permit-list": "Liste de carte ou titre de séjour"
  }
}
</i18n>
