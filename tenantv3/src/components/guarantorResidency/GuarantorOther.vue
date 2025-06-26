<template>
  <BackLinkRow
    :label="t('guarantor-other')"
    :to="parentRoute"
    @edit="AnalyticsService.editSituation(category, 'other')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <strong>{{ t('recent-proof') }}</strong>
  </i18n-t>
  <i18n-t keypath="advice" tag="p">
    <a href="https://www.service-public.fr/simulateur/calcul/AttestationHebergement" target="_blank"
      >service-public.fr</a
    >
  </i18n-t>

  <UploadFiles category="OTHER_RESIDENCY" guarantor />

  <div class="fr-checkbox-group fr-mb-2w">
    <input :id="checkboxId" v-model="noDoc" type="checkbox" />
    <label :for="checkboxId" class="fr-label">{{ t('no-doc') }}</label>
  </div>
  <template v-if="noDoc">
    <div class="fr-highlight fr-ml-0">
      <p class="fr-text--sm">{{ t(textKey + '.no-doc-long') }}</p>
    </div>
    <textarea
      v-model="value"
      class="form-control fr-input validate-required"
      :class="meta.valid ? 'fr-input--valid' : 'fr-input--error'"
      name="customText"
      type="text"
      maxlength="2000"
      rows="3"
      required
    />
    <span v-if="errorMessage" role="alert" class="fr-error-text">{{ t(errorMessage || '') }}</span>
  </template>
  <GuarantorResidencyFooter :on-submit="submit" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UploadFiles from '@/components/residency/lib/UploadFiles.vue'
import BackLinkRow from '@/components/residency/lib/BackLinkRow.vue'
import { ref, useId } from 'vue'
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useField } from 'vee-validate'
import { useTenantStore } from '@/stores/tenant-store'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useResidencyState } from '../residency/residencyState'
import { UtilsService } from '@/services/UtilsService'

const { t } = useI18n()
const checkboxId = useId()
const store = useTenantStore()
const parentRoute = useParentRoute()
const { addData, category, textKey } = useResidencyState()
const initialText = store.getGuarantorResidencyDocument?.customText || ''
const { errorMessage, meta, value, validate } = useField<string>(
  'customText',
  { required: true },
  { initialValue: initialText }
)

const noDoc = ref(initialText !== '')

async function submit() {
  if (noDoc.value) {
    const result = await validate()
    if (!result.valid) {
      return false
    }
  }
  const formData = new FormData()
  formData.append('customText', value.value)
  formData.append('typeDocumentResidency', 'OTHER_RESIDENCY')
  addData?.(formData)
  try {
    await store.saveGuarantorResidency(formData)
    return true
  } catch (error) {
    UtilsService.handleCommonSaveError(error)
    return false
  }
}
</script>

<i18n>
{
  "en": {
    "guarantor-other": "Other",
    "recent-proof": "a document less than 3 months old",
    "advice": "If you don't have one, please add an affidavit explaining your situation. You can use the model available on the {0} website.",
    "no-doc": "You cannot provide a document",
    "tenant": {
      "please-provide" : "Please provide {0} attesting to your guarantor's housing situation.",
      "no-doc-long": "You don't have proof of your guarantor's accommodation status? Please explain the reasons in the text field and add a sworn statement."
    },
    "couple": {
      "please-provide" : "Please provide {0} attesting to their guarantor's housing situation.",
      "no-doc-long": "You don't have proof of the accommodation status of your spouse's guarantor? Please explain the reasons in the text field and add a sworn statement."
    }
  },
  "fr": {
    "guarantor-other": "Autre",
    "recent-proof": "un document de moins de 3 mois",
    "advice": "Si vous n'en avez pas, veuillez ajouter une attestation sur l’honneur expliquant sa situation. Vous pouvez utiliser le modèle disponible sur le site {0}",
    "no-doc": "Vous ne pouvez pas fournir de document",
    "tenant": {
      "please-provide" : "Veuillez fournir {0} attestant la situation d’hébergement de votre garant.",
      "no-doc-long": "Vous n’avez pas de document attestant la situation d’hébergement de votre garant ? Veuillez en expliquer les raisons dans le champ texte et ajouter une attestation sur l’honneur."
    },
    "couple": {
      "please-provide" : "Veuillez fournir {0} attestant la situation d’hébergement de son garant.",
      "no-doc-long": "Vous n’avez pas de document attestant la situation d’hébergement du garant de votre conjoint ? Veuillez en expliquer les raisons dans le champ texte et ajouter une attestation sur l’honneur."
    }
  }
}
</i18n>
