<template>
  <BackLinkRow :label="t('identity-card')" :to="parent" category="identity-card" />
  <p class="fr-mb-0">{{ t('add-id-card') }}</p>
  <ul>
    <li class="bold">{{ t('valid') }}</li>
    <li class="bold">{{ t('both-sides') }}</li>
  </ul>
  <UploadFilesIdentity category="FRENCH_IDENTITY_CARD" />
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
    "add-id-card": "Be sure to enclose your French or foreign identity card:",
    "valid": "valid",
    "both-sides": "both sides"
  },
  "fr": {
    "add-id-card": "Assurez-vous de joindre votre carte d’identité française ou étrangère :",
    "valid": "en cours de validité",
    "both-sides": "recto-verso"
  }
}
</i18n>
