<template>
  <form class="fr-mb-2w" @submit="onSubmit">
    <input
      id="monthlySum"
      ref="inputSumElt"
      v-model="inputSum"
      v-bind="sumAttr"
      :placeholder="t('amount')"
      name="monthlySum"
      class="fr-input fr-mb-2w"
      required
      autocomplete="off"
      data-cy="monthlySum"
      aria-describedby="monthlySum-desc"
      @blur="AnalyticsService.writeText(state.category)"
    />
    <span v-if="errors.sum" role="alert" class="fr-error-text">{{ t(errors.sum) }}</span>
  </form>
  <slot name="incomeFilled" />
  <AnalysisWrapper
    ref="analysis-wrapper"
    :is-uploading="uploadFileWithAnalysisRef?.isUploading ?? false"
    :polling-timeout-ms="30000"
  >
    <template #analysisBannerError="{ rule, index, notMatchingLabel, explainLinkLabel, onExplain }">
      <FinancialAnalysisErrorBannerContent
        :rule="rule"
        :index="index"
        :not-matching-label="notMatchingLabel"
        :explain-link-label="explainLinkLabel"
        @explain="onExplain"
      />
    </template>
    <template #fileUploader>
      <UploadFileWithAnalysis
        ref="upload-file-with-analysis"
        :doc-category="state.category"
        :sub-category="salarySubCategory"
        step="SALARY_EMPLOYED_MORE_3_MONTHS"
        :max-file-count="10"
        :analysis-in-progress="analysisWrapper?.analysisInProgress ?? false"
        :before-save="beforeUploadSave"
        :before-open="beforeUploadOpen"
        @saved="onFileSaved"
      />
    </template>
  </AnalysisWrapper>
  <p class="fr-message fr-message--info fr-mt-3w">{{ t('i-authorize-corrections') }}</p>
  <AnalysisFooter
    :previous-step="state.recap"
    :next-disabled="analysisFooterNextDisabled"
    :next-label="analysisWrapper?.nextLabel"
    :before-submit="analysisWrapper?.beforeSubmit"
    :on-submit-action="onAnalysisFooterSubmit"
  />
  <DsfrModalPatch
    v-model:is-opened="isModalOpened"
    :title="t('insufficient-number-of-docs')"
    :actions="modalActions"
    size="xl"
  >
    <i18n-t tag="p" keypath="you-added-docs" class="fr-mb-2w">
      <strong>{{ t('less-than-x-docs', [minFiles]) }}</strong>
    </i18n-t>
    <p class="fr-mb-0">{{ t('for-complete-file', [minFiles]) }}</p>
  </DsfrModalPatch>
</template>

<script setup lang="ts">
import AnalysisWrapper from '@/components/analysis/AnalysisWrapper.vue'
import UploadFileWithAnalysis from '@/components/analysis/UploadFileWithAnalysis.vue'
import { documentFormKey } from '@/components/documents/documentFormState'
import type { FinancialCategory } from '@/components/documents/share/DocumentTypeConstants'
import AnalysisFooter from '@/components/footer/AnalysisFooter.vue'
import { toast } from '@/components/toast/toastUtils'
import { useHandleValidationNavigation } from '@/composables/useInternalNavigation'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'
import DsfrModalPatch from 'df-shared-next/src/components/patches/DsfrModalPatch.vue'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { useForm } from 'vee-validate'
import { computed, provide, ref, useTemplateRef, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useFinancialState } from '../financialState'
import FinancialAnalysisErrorBannerContent from './analysisBanner/FinancialAnalysisErrorBannerContent.vue'

const props = withDefaults(
  defineProps<{
    minFiles?: number
  }>(),
  {
    minFiles: 3
  }
)

const store = useTenantStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { getNavigationNextStep } = useHandleValidationNavigation()
const state = useFinancialState()
const salarySubCategory: FinancialCategory = 'SALARY'

const inputSumElt = useTemplateRef<HTMLInputElement>('inputSumElt')
const analysisWrapper = useTemplateRef('analysis-wrapper')
const uploadFileWithAnalysisRef = useTemplateRef<{
  isUploading?: boolean
  forceUploadPendingFiles?: () => Promise<boolean>
}>('upload-file-with-analysis')

const document = computed(
  () => state.documents.value.find((d) => d.id === Number(route.params.docId)) ?? makeNewDocument()
)
const isModalOpened = ref(false)

const modalActions: ComputedRef<DsfrButtonProps[]> = computed(() => [
  {
    label: t('add-more-docs'),
    onClick() {
      isModalOpened.value = false
    },
    secondary: true
  },
  {
    label: t('go-next-step'),
    onClick() {
      void goNext()
    }
  }
])

const analysisFooterNextDisabled = computed(() => {
  const busy = Boolean(analysisWrapper.value?.nextDisabled)
  const noFiles = (document.value.files?.length ?? 0) === 0
  return busy || noFiles
})

provide(documentFormKey, {
  category: 'FINANCIAL',
  textKey: state.textKey,
  previousStep: state.recap,
  nextStep: getNavigationNextStep(state.recap),
  document,
  formFieldValue: 'typeDocumentFinancial',
  storeAction: state.action,
  userId: state.userId ?? store.user.id,
  addData(formData) {
    const d = document.value
    formData.append('monthlySum', Math.trunc(parsedMonthlySum.value).toString())
    formData.append('customText', d.customText || '')
    formData.append('noDocument', d.noDocument ? 'true' : 'false')
    if (d.id) {
      formData.append('id', d.id.toString())
    }
    state.addData?.(formData)
  }
})

const { errors, defineField, handleSubmit, validate } = useForm({
  initialValues: { sum: document.value.monthlySum?.toString() || '' },
  validationSchema: { sum: validateSum }
})
const [sum, sumAttr] = defineField('sum')
const parsedMonthlySum = computed(() => Number(sum.value.replaceAll(/\s+/g, '')) || 0)

let monthlySumChanged = false

const inputSum = computed({
  get: () => sum.value,
  set(val) {
    sum.value = val
    monthlySumChanged = true
  }
})

function onFileSaved() {
  const currentDocId = Number(route.params.docId)
  if (state.documents.value.some((d) => d.id === currentDocId)) return

  const latestDoc = [...state.documents.value]
    .filter(
      (d) =>
        d.documentCategory === 'FINANCIAL' &&
        d.documentSubCategory === 'SALARY' &&
        d.documentCategoryStep === 'SALARY_EMPLOYED_MORE_3_MONTHS'
    )
    .sort((a, b) => (b.id || 0) - (a.id || 0))[0]

  if (!latestDoc?.id) return

  if (route.path.includes('/ajouter/')) {
    router.replace(route.path.replace('ajouter', String(latestDoc.id)))
  } else if (currentDocId) {
    router.replace(route.path.replace(String(currentDocId), String(latestDoc.id)))
  }
}

function validateSum(input: string) {
  if (!input) return 'field-required'
  if (/^[0-9 ,.]+$/.test(input) && /[,.]/.test(input)) return 'round-it'
  if (!/^[0-9 ]+$/.test(input)) return 'regex-not-valid'
  if (Number(input) === 0) return 'amount-zero'
  return true
}

function makeNewDocument() {
  const doc = new DfDocument()
  doc.documentCategory = 'FINANCIAL'
  doc.documentSubCategory = 'SALARY'
  doc.documentCategoryStep = 'SALARY_EMPLOYED_MORE_3_MONTHS'
  doc.files = []
  return doc
}

function beforeUploadOpen() {
  if (parsedMonthlySum.value > 0) return true
  validate()
  inputSumElt.value?.focus()
  return false
}

function beforeUploadSave() {
  if (parsedMonthlySum.value <= 0) {
    validate()
    inputSumElt.value?.focus()
    return false
  }
  return true
}

async function saveMonthlySumOnly() {
  const financialDocument = document.value
  if (!monthlySumChanged) return true
  if (!financialDocument.id) return false
  const formData = new FormData()
  formData.append('id', financialDocument.id.toString())
  formData.append('typeDocumentFinancial', financialDocument.documentSubCategory || '')
  formData.append('categoryStep', financialDocument.documentCategoryStep || '')
  formData.append('noDocument', financialDocument.noDocument ? 'true' : 'false')
  formData.append('customText', financialDocument.customText || '')
  formData.append('monthlySum', Math.trunc(parsedMonthlySum.value).toString())
  state.addData?.(formData)
  await store[state.action](formData)
  monthlySumChanged = false
  return true
}

async function goNext() {
  const nextStep = getNavigationNextStep(state.recap)
  if (monthlySumChanged) {
    const saved = await saveMonthlySumOnly()
    if (!saved) {
      return
    }
  }
  await router.push(nextStep)
}

async function submit() {
  if ((document.value.files?.length || 0) === 0) {
    toast.error(t('errors.no-file'), undefined)
    return
  }
  if ((document.value.files?.length || 0) < props.minFiles) {
    isModalOpened.value = true
    return
  }
  await goNext()
}

const onSubmit = handleSubmit(submit, () => {
  inputSumElt.value?.focus()
})

async function onAnalysisFooterSubmit() {
  await analysisWrapper.value?.saveExplanation()
  await onSubmit()
}

defineExpose({
  get isUploading() {
    return uploadFileWithAnalysisRef.value?.isUploading ?? false
  },
  async forceUploadPendingFiles() {
    return (await uploadFileWithAnalysisRef.value?.forceUploadPendingFiles?.()) ?? false
  }
})
</script>

<i18n>
{
  "en": {
    "round-it": "Round to the nearest euro",
    "amount": "Amount in euros",
    "valid-monthly-sum": "Please enter a valid amount",
    "amount-zero": "You have entered an amount of 0€. Are you sure you have entered your monthly income?",
    "insufficient-number-of-docs": "Insufficient number of supporting documents",
    "you-added-docs": "You have added {0}.",
    "less-than-x-docs": "fewer than {0} supporting documents",
    "for-complete-file": "For a complete file, we recommend you add {0}.",
    "add-more-docs": "Add more documents",
    "go-next-step": "Go to next step",
    "i-authorize-corrections": "By continuing, I authorize a DossierFacile operator to correct any errors in the income amounts declared, based on the supporting documents provided, in order to ensure that my file is compliant."
  },
  "fr": {
    "round-it": "Arrondir à l'euro",
    "amount": "Montant en euros",
    "valid-monthly-sum": "Veuillez saisir un montant valide",
    "amount-zero": "Vous avez saisi un montant à 0€. Êtes-vous sûr d'avoir saisi votre revenu mensuel ?",
    "insufficient-number-of-docs": "Nombre de justificatifs insuffisant",
    "you-added-docs": "Vous avez ajouté {0}.",
    "less-than-x-docs": "moins de {0} justificatifs",
    "for-complete-file": "Pour un dossier complet, nous vous recommandons d'en ajouter {0}.",
    "add-more-docs": "Ajouter d'autres documents",
    "go-next-step": "Passer à l'étape suivante",
    "i-authorize-corrections": "En continuant, j'autorise un opérateur DossierFacile à corriger les montants de revenus déclarés en cas d'erreur, sur la base des justificatifs fournis, afin de garantir la conformité de mon dossier."
  }
}
</i18n>
