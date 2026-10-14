<template>
  <BackLinkRow
    :label="t('guarantor-other')"
    :to="parentRoute"
    @edit="AnalyticsService.editSituation(category, 'other')"
  />

  <DsfrAlert type="info" small class="fr-mb-3w">
    <ul class="fr-mb-0">
      <li>
        <i18n-t :keypath="textKey + '.redirect-guest'" tag="span">
          <button type="button" class="fr-link" @click="switchTo('guest')">
            {{ t('guest-option') }}
          </button>
        </i18n-t>
      </li>
      <li>
        <i18n-t :keypath="textKey + '.redirect-tenant'" tag="span">
          <button type="button" class="fr-link" @click="switchTo('tenant')">
            {{ t('tenant-option') }}
          </button>
        </i18n-t>
      </li>
    </ul>
  </DsfrAlert>
  <ConfirmDeleteModal
    v-model:is-opened="isModalOpened"
    document-category="residency"
    @confirm="confirmSwitch"
  />

  <TextAreaWithCounter
    ref="custom-text"
    v-model="value"
    name="customText"
    :max="1000"
    rows="4"
    :is-required="true"
    :class="meta.touched && !meta.valid ? 'fr-input--error' : ''"
    counter-id="guarantor-customtext-counter"
    :extra-aria-described-by="errorMessage ? errorId : undefined"
  >
    <template #label>{{ t(textKey + '.describe-situation') }}</template>
    <template #hint>{{ t(textKey + '.describe-hint') }}</template>
  </TextAreaWithCounter>
  <span v-if="errorMessage" :id="errorId" role="alert" class="fr-error-text">{{
    t(errorMessage)
  }}</span>

  <i18n-t :keypath="textKey + '.you-can-add-docs'" tag="p" class="fr-mt-3w">
    <a
      href="https://www.service-public.gouv.fr/simulateur/calcul/AttestationHonneur"
      :title="`${t('sworn-statement')} - ${t('new-window')}`"
      target="_blank"
      rel="noopener"
      >{{ t('sworn-statement') }}</a
    >
  </i18n-t>

  <UploadFiles
    v-if="showUpload"
    ref="upload-files"
    category="OTHER_RESIDENCY"
    :custom-text="value"
    guarantor
  />
  <DfButton v-else class="mx-auto" @click="showUploadZone">{{ t('add-document') }}</DfButton>

  <GuarantorResidencyFooter :on-submit="submit" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UploadFiles from '@/components/residency/lib/UploadFiles.vue'
import BackLinkRow from '@/components/residency/lib/BackLinkRow.vue'
import { ref, useId, useTemplateRef } from 'vue'
import GuarantorResidencyFooter from './GuarantorResidencyFooter.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useField } from 'vee-validate'
import { useTenantStore } from '@/stores/tenant-store'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useResidencyState } from '../residency/residencyState'
import { UtilsService } from '@/services/UtilsService'
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import TextAreaWithCounter from 'df-shared-next/src/components/TextAreaWithCounter.vue'
import ConfirmDeleteModal from 'df-shared-next/src/components/ConfirmDeleteModal.vue'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const errorId = useId()
const store = useTenantStore()
const parentRoute = useParentRoute()
const { addData, category, textKey, document } = useResidencyState()
const uploadFiles = useTemplateRef('upload-files')
const customText = useTemplateRef('custom-text')

const initialText = document.value?.customText || ''
const { errorMessage, meta, value, validate } = useField<string>(
  'customText',
  { required: true },
  { initialValue: initialText }
)

// The upload zone is optional: show it right away when files exist or when the
// operator declined the document, so that the declined messages stay visible
const showUpload = ref(
  (document.value?.files?.length || 0) > 0 || document.value?.documentStatus === 'DECLINED'
)

// Switching to another situation goes through the same confirmation as the
// "Modifier" link: the saved document must be deleted first, otherwise the next
// screen keeps reusing it and the situation stays OTHER_RESIDENCY
const isModalOpened = ref(false)
const switchTarget = ref('')

function switchTo(situation: 'guest' | 'tenant') {
  switchTarget.value = `${parentRoute.value}/${situation}`
  if (document.value) {
    AnalyticsService.showWarningModale(category)
    isModalOpened.value = true
  } else {
    router.push(switchTarget.value)
  }
}

async function confirmSwitch() {
  AnalyticsService.confirmModale(category)
  const docId = document.value?.id
  if (docId) {
    await store.deleteDocument(docId)
  }
  router.push(switchTarget.value)
}

async function validateText() {
  const result = await validate()
  if (!result.valid) {
    customText.value?.textareaEl?.focus()
  }
  return result.valid
}

// Files are saved on drop together with the explanation, which the API requires:
// make sure the text is filled before letting the user upload
async function showUploadZone() {
  if (await validateText()) {
    showUpload.value = true
  }
}

async function submit() {
  if (!(await validateText())) {
    return false
  }
  // Files whose upload failed are still listed: send them again, along with the text
  if (uploadFiles.value?.hasPendingFiles) {
    return uploadFiles.value.save()
  }
  const formData = new FormData()
  formData.append('customText', UtilsService.stripNewlines(value.value))
  formData.append('typeDocumentResidency', 'OTHER_RESIDENCY')
  addData?.(formData)
  try {
    await store.saveGuarantorResidency(formData)
    return true
  } catch (error) {
    UtilsService.handleCommonSaveError(error, uploadFiles.value?.inputFile)
    return false
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "guarantor-other": "Other",
    "guest-option": "Hosted by someone",
    "tenant-option": "Tenant",
    "sworn-statement": "sworn statement",
    "add-document": "Add document",
    "tenant": {
      "redirect-guest": "Your guarantor is hosted for free by a relative? Choose {0}.",
      "redirect-tenant": "Your guarantor is a tenant without their latest rent receipts? Choose {0}.",
      "describe-situation": "Explain your guarantor's housing situation",
      "describe-hint": "Tell us where your guarantor lives and why you cannot provide a standard proof.",
      "you-can-add-docs": "You can add any document that helps to understand their situation, for example a {0}."
    },
    "couple": {
      "redirect-guest": "Your spouse's guarantor is hosted for free by a relative? Choose {0}.",
      "redirect-tenant": "Your spouse's guarantor is a tenant without their latest rent receipts? Choose {0}.",
      "describe-situation": "Explain the housing situation of your spouse's guarantor",
      "describe-hint": "Tell us where this guarantor lives and why you cannot provide a standard proof.",
      "you-can-add-docs": "You can add any document that helps to understand their situation, for example a {0}."
    }
  },
  "fr": {
    "guarantor-other": "Autre",
    "guest-option": "Hébergé chez quelqu'un",
    "tenant-option": "Locataire",
    "sworn-statement": "attestation sur l’honneur",
    "add-document": "Ajouter un document",
    "tenant": {
      "redirect-guest": "Votre garant est hébergé gratuitement chez un proche ? Choisissez {0}.",
      "redirect-tenant": "Votre garant est locataire sans ses dernières quittances ? Choisissez {0}.",
      "describe-situation": "Expliquez la situation de logement de votre garant",
      "describe-hint": "Indiquez où vit votre garant et pourquoi vous ne pouvez pas fournir de justificatif classique.",
      "you-can-add-docs": "Vous pouvez ajouter tout document permettant de comprendre sa situation, par exemple une {0}."
    },
    "couple": {
      "redirect-guest": "Le garant de votre conjoint est hébergé gratuitement chez un proche ? Choisissez {0}.",
      "redirect-tenant": "Le garant de votre conjoint est locataire sans ses dernières quittances ? Choisissez {0}.",
      "describe-situation": "Expliquez la situation de logement du garant de votre conjoint",
      "describe-hint": "Indiquez où vit ce garant et pourquoi vous ne pouvez pas fournir de justificatif classique.",
      "you-can-add-docs": "Vous pouvez ajouter tout document permettant de comprendre sa situation, par exemple une {0}."
    }
  }
}
</i18n>
