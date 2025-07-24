<template>
  <BackLinkRow :label="t('other-doc')" :to="parent" category="other" />
  <i18n-t :keypath="'add-valid-doc-' + textKey" tag="p"
    ><strong>{{ t('valid-doc') }}</strong></i18n-t
  >
  <DsfrAlert type="info" small class="fr-mb-3w">
    <i18n-t :keypath="'if-visa-' + textKey" tag="p">
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
import { useIdentificationState } from './lib/identityDocumentState'

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
    "if-visa-tenant": "If you hold {0}, be sure to enclose your valid passport.",
    "if-visa-guarantor": "If your guarantor holds {0}, be sure to enclose their valid passport.",
    "if-visa-couple": "If your spouse holds {0}, be sure to enclose their valid passport.",
    "if-visa-couple-guarantor": "If their guarantor holds {0}, be sure to enclose their valid passport.",
    "a-visa": "a visa"
  },
  "fr": {
    "other-doc": "Autre document",
    "add-valid-doc-tenant": "Assurez-vous que votre document est {0}.",
    "add-valid-doc-guarantor": "Assurez-vous que le document de votre garant est {0}.",
    "add-valid-doc-couple": "Assurez-vous que le document de votre conjoint est {0}.",
    "add-valid-doc-couple-guarantor": "Assurez-vous que le document de son garant est {0}.",
    "valid-doc": "en cours de validité",
    "if-visa-tenant": "Si vous êtes titulaire {0}, assurez-vous de joindre votre passeport en cours de validité.",
    "if-visa-guarantor": "Si votre garant est titulaire {0}, assurez-vous de joindre son passeport en cours de validité.",
    "if-visa-couple": "Si votre conjoint est titulaire {0}, assurez-vous de joindre son passeport en cours de validité.",
    "if-visa-couple-guarantor": "Si son garant est titulaire {0}, assurez-vous de joindre son passeport en cours de validité.",
    "a-visa": "d’un visa"
  }
}
</i18n>
