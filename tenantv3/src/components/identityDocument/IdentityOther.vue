<template>
  <BackLinkRow :label="t('other-doc')" :to="parent" category="other" />
  <i18n-t :keypath="'add-valid-doc-' + textKey" tag="p"
    ><strong>{{ t('valid-doc') }}</strong></i18n-t
  >
  <InfoVisa />
  <UploadFilesIdentity category="OTHER_IDENTIFICATION" />
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
    "other-doc": "Other document",
    "add-valid-doc-tenant": "Make sure your document is {0}.",
    "add-valid-doc-guarantor": "Make sure your guarantor's document is {0}.",
    "add-valid-doc-couple": "Make sure your spouse's document is {0}.",
    "add-valid-doc-couple-guarantor": "Make sure their guarantor's document is {0}.",
    "valid-doc": "valid",
  },
  "fr": {
    "other-doc": "Autre document",
    "add-valid-doc-tenant": "Assurez-vous que votre document est {0}.",
    "add-valid-doc-guarantor": "Assurez-vous que le document de votre garant est {0}.",
    "add-valid-doc-couple": "Assurez-vous que le document de votre conjoint est {0}.",
    "add-valid-doc-couple-guarantor": "Assurez-vous que le document de son garant est {0}.",
    "valid-doc": "en cours de validité",
  }
}
</i18n>
