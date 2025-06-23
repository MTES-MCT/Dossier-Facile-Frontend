<template>
  <BackLinkRow :label="t('permit')" :to="parent" category="residency-permit" />
  <p class="fr-mb-0">{{ t('add-id-card') }}</p>
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

const parent = useParentRoute()
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "add-id-card": "Be sure to enclose your residence permit:",
    "valid": "valid",
    "both-sides": "both sides",
    "permit-list": "List of residence permits"
  },
  "fr": {
    "add-id-card": "Assurez-vous de joindre votre carte ou titre de séjour :",
    "valid": "en cours de validité",
    "both-sides": "recto-verso",
    "permit-list": "Liste de carte ou titre de séjour"
  }
}
</i18n>
