<template>
  <BackLinkRow :label="t('drivers-license')" :to="parent" category="driving-licence" />
  <i18n-t keypath="add-doc" tag="p"
    ><strong>{{ t('valid') }}</strong></i18n-t
  >
  <UploadFilesIdentity category="DRIVERS_LICENSE" />
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
    "add-doc": "Be sure to enclose your {0} French or foreign driver's license.",
    "valid": "valid",
  },
  "fr": {
    "add-doc": "Assurez-vous de joindre votre permis de conduire français ou étranger {0}.",
    "valid": "en cours de validité",
  }
}
</i18n>
