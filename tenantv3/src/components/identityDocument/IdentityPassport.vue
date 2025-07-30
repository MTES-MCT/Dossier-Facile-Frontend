<template>
  <BackLinkRow :label="t('passport')" :to="parent" category="passport" />
  <p class="fr-mb-0">{{ t('add-passport-' + textKey) }}</p>
  <ul>
    <li class="bold">{{ t('valid') }}</li>
    <li class="bold">{{ t('pages-2-3') }}</li>
  </ul>
  <DsfrAlert type="info" small class="fr-mb-3w">
    <i18n-t :keypath="'if-visa-' + textKey" tag="p">
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
import { useIdentificationState } from './lib/identityDocumentState'

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
    "if-visa-tenant": "If you hold {0}, your must have a valid passport.",
    "if-visa-guarantor": "If your guarantor holds {0}, their valid passport is mandatory.",
    "if-visa-couple": "If your spouse holds {0}, their valid passport is mandatory.",
    "if-visa-couple-guarantor": "If their guarantor holds {0}, their valid passport is mandatory.",
    "a-visa": "a visa"
  },
  "fr": {
    "add-passport-tenant": "Assurez-vous de joindre votre passeport français ou étranger :",
    "add-passport-guarantor": "Assurez-vous de joindre le passeport français ou étranger de votre garant :",
    "add-passport-couple": "Assurez-vous de joindre le passeport français ou étranger de votre conjoint :",
    "add-passport-couple-guarantor": "Assurez-vous de joindre le passeport français ou étranger de son garant :",
    "valid": "en cours de validité",
    "pages-2-3": "les pages 2 et 3 pour faire apparaître la signature",
    "if-visa-tenant": "Si vous êtes titulaire {0}, votre passeport en cours de validité est obligatoire.",
    "if-visa-guarantor": "Si votre garant est titulaire {0}, son passeport en cours de validité est obligatoire.",
    "if-visa-couple": "Si votre conjoint est titulaire {0}, son passeport en cours de validité est obligatoire.",
    "if-visa-couple-guarantor": "Si son garant est titulaire {0}, son passeport en cours de validité est obligatoire.",
    "a-visa": "d’un visa"
  }
}
</i18n>
