<template>
  <DsfrAlert type="info" small class="fr-mb-3w">
    <i18n-t :keypath="'if-visa-' + textKey" tag="p">
      <strong>{{ t('a-visa') }}</strong>
    </i18n-t>
  </DsfrAlert>
</template>

<script setup lang="ts">
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import { useI18n } from 'vue-i18n'
import { useIdentificationState } from './identityDocumentState'

const { t } = useI18n()
const { textKey } = useIdentificationState()
</script>

<i18n>
{
  "en": {
    "if-visa-tenant": "If you hold {0}, your must have a valid passport.",
    "if-visa-guarantor": "If your guarantor holds {0}, their valid passport is mandatory.",
    "if-visa-couple": "If your spouse holds {0}, their valid passport is mandatory.",
    "if-visa-couple-guarantor": "If their guarantor holds {0}, their valid passport is mandatory.",
    "a-visa": "a visa"
  },
  "fr": {
    "if-visa-tenant": "Si vous êtes titulaire {0}, votre passeport en cours de validité est obligatoire.",
    "if-visa-guarantor": "Si votre garant est titulaire {0}, son passeport en cours de validité est obligatoire.",
    "if-visa-couple": "Si votre conjoint est titulaire {0}, son passeport en cours de validité est obligatoire.",
    "if-visa-couple-guarantor": "Si son garant est titulaire {0}, son passeport en cours de validité est obligatoire.",
    "a-visa": "d’un visa"
  }
}
</i18n>
