<template>
  <BackLinkRow
    :label="t('guarantor-other')"
    :to="previousPage"
    guarantor
    @edit="AnalyticsService.editSituation('guarantor-residency', 'other')"
  />
  <i18n-t keypath="please-provide" tag="p">
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
      <p class="fr-text--sm">{{ t('no-doc-long') }}</p>
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
  <GuarantorResidencyFooter :previous-page="previousPage" :on-submit="submit" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UploadFiles from '@/components/residency/lib/UploadFiles.vue'
import BackLinkRow from '@/components/residency/lib/BackLinkRow.vue'
import { useGuarantorId } from './useGuarantorId'
import { computed, ref, useId } from 'vue'
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useField } from 'vee-validate'
import useTenantStore from '@/stores/tenant-store'
import { ToastService } from '@/services/ToastService'

const { t } = useI18n()
const guarantorId = useGuarantorId()
const previousPage = computed(() => `/info-garant/2/${guarantorId.value}`)
const checkboxId = useId()
const store = useTenantStore()
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
  formData.append('guarantorId', guarantorId.value)
  try {
    await store.saveGuarantorResidency(formData)
    return true
  } catch (error) {
    console.error(error)
    ToastService.error()
    return false
  }
}
</script>

<i18n>
{
  "en": {
    "guarantor-other": "Other",
    "please-provide" : "Please provide {0} attesting to your guarantor's housing situation.",
    "recent-proof": "a document less than 3 months old",
    "advice": "If you don't have one, please add an affidavit explaining your situation. You can use the model available on the {0} website.",
    "no-doc": "You cannot provide a document",
    "no-doc-long": "You don't have proof of your guarantor's accommodation status? Please explain the reasons in the text field and add a sworn statement."
  },
  "fr": {
    "guarantor-other": "Autre",
    "please-provide" : "Veuillez fournir {0} attestant la situation d'hébergement de votre garant.",
    "recent-proof": "un document de moins de 3 mois",
    "advice": "Si vous n'en avez pas, veuillez ajouter une attestation sur l’honneur expliquant sa situation. Vous pouvez utiliser le modèle disponible sur le site {0}",
    "no-doc": "Vous ne pouvez pas fournir de document",
    "no-doc-long": "Vous n’avez pas de document attestant la situation d’hébergement de votre garant ? Veuillez en expliquer les raisons dans le champ texte et ajouter une attestation sur l’honneur."
  }
}
</i18n>
