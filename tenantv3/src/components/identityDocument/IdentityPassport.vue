<template>
  <BackLinkRow :label="t('passport')" :to="parent" category="passport" />
  <p class="fr-mb-0">{{ t('add-passport') }}</p>
  <ul>
    <li class="bold">{{ t('valid') }}</li>
    <li class="bold">{{ t('pages-2-3') }}</li>
  </ul>
  <DsfrAlert type="info" small class="fr-mb-3w">
    <i18n-t keypath="if-visa" tag="p">
      <strong>{{ t('a-visa') }}</strong>
    </i18n-t>
  </DsfrAlert>
  <UploadFilesIdentity category="FRENCH_PASSPORT" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import BackLinkRow from './lib/IdentityBackRow.vue'
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import UploadFilesIdentity from './lib/UploadFilesIdentity.vue'

const parent = useParentRoute()
const { t } = useI18n()
</script>

<i18n>
{
  "en": {
    "add-passport": "Be sure to enclose your French or foreign passport:",
    "valid": "valid",
    "pages-2-3": "pages 2 and 3 to show signature",
    "if-visa": "If you hold {0}, be sure to enclose your valid passport.",
    "a-visa": "a visa"
  },
  "fr": {
    "add-passport": "Assurez-vous de joindre votre passeport français ou étranger :",
    "valid": "en cours de validité",
    "pages-2-3": "les pages 2 et 3 pour faire apparaître la signature",
    "if-visa": "Si vous êtes titulaire {0}, assurez-vous de joindre votre passeport en cours de validité.",
    "a-visa": "d’un visa"
  }
}
</i18n>
