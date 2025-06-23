<template>
  <BackLinkRow :label="t('other-doc')" :to="parent" category="other" />
  <p>{{ t('add-valid-doc') }}</p>
  <DsfrAlert type="info" small class="fr-mb-3w">
    <i18n-t keypath="if-visa" tag="p">
      <strong>{{ t('a-visa') }}</strong>
    </i18n-t>
  </DsfrAlert>
  <UploadFilesIdentity category="OTHER_IDENTIFICATION" />
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
    "other-doc": "Other document",
    "add-valid-doc": "Make sure your document is valid.",
    "if-visa": "If you hold {0}, be sure to enclose your valid passport.",
    "a-visa": "a visa"
  },
  "fr": {
    "other-doc": "Autre document",
    "add-valid-doc": "Assurez-vous que votre document est en cours de validité.",
    "if-visa": "Si vous êtes titulaire {0}, assurez-vous de joindre votre passeport en cours de validité.",
    "a-visa": "d’un visa"
  }
}
</i18n>
