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
    <FinancialFooterContent :previous-step="state.recap" :disabled="document.files?.length === 0" />
  </form>
  <template v-if="showFiles">
    <slot name="incomeFilled"></slot>
    <AllDeclinedMessages
      :document="document"
      :document-denied-reasons="document.documentDeniedReasons"
      :document-status="document.documentStatus"
    />
    <ListItem
      v-for="file in document.files"
      :key="file.id"
      :file="file"
      :watermark-url="document.name"
      :doc-category="state.category"
      @remove="remove(file)"
      @ask-confirm="AnalyticsService.deleteDocument(state.category)"
      @cancel="AnalyticsService.cancelDelete(state.category)"
    />
    <FileUpload
      v-if="!noUpload"
      ref="fileUpload"
      :current-status="uploadStatus"
      @add-files="addFiles"
    />
    <p class="fr-message fr-message--info fr-mt-3w">{{ t('i-authorize-corrections') }}</p>
  </template>
  <slot v-else name="emptyIncome"></slot>
  <ModalComponent v-if="showInsufficientModal" @close="showInsufficientModal = false">
    <template #header>
      <h2 class="fr-h3 fr-mb-0">{{ t('insufficient-number-of-docs') }}</h2>
    </template>
    <template #body>
      <i18n-t tag="p" keypath="you-added-docs" class="fr-mb-2w">
        <strong>{{ t('less-than-x-docs', [minFiles]) }}</strong>
      </i18n-t>
      <p class="fr-mb-0">{{ t('for-complete-file', [minFiles]) }}</p>
    </template>
    <template #footer>
      <ul class="fr-btns-group fr-btns-group--inline-md btns-group">
        <li>
          <DfButton primary @click="showInsufficientModal = false">{{
            t('add-more-docs')
          }}</DfButton>
        </li>
        <li>
          <DfButton @click="goNext">{{ t('go-next-step') }}</DfButton>
        </li>
      </ul>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import AllDeclinedMessages from '@/components/documents/share/AllDeclinedMessages.vue'
import FileUpload from '@/components/uploads/FileUpload.vue'
import ListItem from '@/components/uploads/ListItem.vue'
import { DfDocument, type FinancialStep } from 'df-shared-next/src/models/DfDocument'
import { computed, ref, useTemplateRef } from 'vue'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { RegisterService } from '@/services/RegisterService'
import type { DfFile } from 'df-shared-next/src/models/DfFile'
import { useLoading } from 'vue-loading-overlay'
import { useTenantStore } from '@/stores/tenant-store'
import { UtilsService } from '@/services/UtilsService'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import FinancialFooterContent from './FinancialFooterContent.vue'
import { useFinancialState } from '../financialState'
import ModalComponent from 'df-shared-next/src/components/ModalComponent.vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { toast } from '@/components/toast/toastUtils'

const MAX_FILE_COUNT = 10

type Props = {
  noUpload?: boolean
  minFiles?: number
}
type PropsWithStep = Props & {
  category: 'SALARY' | 'SOCIAL_SERVICE' | 'RENT' | 'PENSION'
  step: FinancialStep
}
type PropsWithoutStep = Props & {
  category: 'SCHOLARSHIP'
}

const props = defineProps<PropsWithStep | PropsWithoutStep>()

const uploadStatus = ref(UploadStatus.STATUS_INITIAL)
const showInsufficientModal = ref(false)
const store = useTenantStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const inputSumElt = useTemplateRef('inputSumElt')
const fileUpload = useTemplateRef('fileUpload')
const state = useFinancialState()

const document = computed(
  () => state.documents.value.find((d) => d.id === Number(route.params.docId)) || makeNewDocument()
)

const showFiles = ref(Boolean(document.value.monthlySum))

const { errors, defineField, handleSubmit } = useForm({
  initialValues: { sum: document.value.monthlySum?.toString() || '' },
  validationSchema: { sum: validateSum }
})
const [sum, sumAttr] = defineField('sum')

let monthlySumChanged = false

const inputSum = computed({
  get: () => sum.value,
  set(val) {
    sum.value = val
    const monthlySum = Number(sum.value.replace(/\s+/g, '')) || 0
    document.value.monthlySum = monthlySum
    showFiles.value = true
    monthlySumChanged = true
  }
})

function validateSum(input: string) {
  if (!input) {
    return 'field-required'
  }
  if (/^[0-9 ,.]+$/.test(input) && /[,.]/.test(input)) {
    return 'round-it'
  }
  if (!/^[0-9 ]+$/.test(input)) {
    return 'regex-not-valid'
  }
  if (Number(input) === 0) {
    return 'amount-zero'
  }
  return true
}

function makeNewDocument() {
  const document = new DfDocument()
  document.documentCategory = 'FINANCIAL'
  document.documentSubCategory = props.category
  if ('step' in props) {
    document.documentCategoryStep = props.step
  }
  document.files = []
  return document
}

async function goNext() {
  if (monthlySumChanged ? await save('form.financial.amount-saved') : true) {
    router.push(state.recap)
  }
}

async function submit() {
  if ((document.value.files || []).length === 0) {
    toast.error(t('errors.no-file'), fileUpload.value?.inputFile)
    return
  }
  if ((document.value.files?.length || 0) < (props.minFiles || 0)) {
    showInsufficientModal.value = true
    return
  }
  await goNext()
}

const onSubmit = handleSubmit(submit)

async function addFiles(fileList: File[]) {
  AnalyticsService.uploadFile(state.category, props.category, document.value.documentCategoryStep)
  const nf = Array.from(fileList).map((f) => ({ name: f.name, file: f, size: f.size }))
  document.value.files?.push(...nf)
  const saveSuccess = await save()
  if (!saveSuccess) {
    document.value.files?.splice(-nf.length)
  }
  if (saveSuccess && route.path.includes('/ajouter/')) {
    updateURL()
  }
}

function updateURL() {
  // Sort documents by id to have newest one at end
  state.documents.value.sort((a, b) => (a.id || 0) - (b.id || 0))
  const docId = state.documents.value.at(-1)?.id
  if (docId) {
    router.push(route.path.replace('ajouter', String(docId)))
  }
}

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile(state.category)
  if (!file.id) {
    return
  }
  if (
    document.value.files?.length === 1 &&
    document.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
  ) {
    AnalyticsService.removeDeniedDocument(document.value.documentSubCategory || '')
  }
  const docId = document.value.id
  await RegisterService.deleteFile(file.id, silent)
  if (docId && !document.value.id) {
    await router.push(route.path.replace(`/${docId}/`, '/ajouter/'))
    document.value.monthlySum = Number(sum.value.replace(/\s+/g, '') || 0)
  }
}

async function save(successMsgKey = 'save-success') {
  const formData = new FormData()
  const financialDocument = document.value
  const financialFiles = financialDocument.files || []

  // Check validity
  if (!financialDocument.monthlySum) {
    toast.error(t('valid-monthly-sum'), inputSumElt.value)
    console.info('Save: invalid monthlySum')
    return false
  }
  if (financialFiles.length === 0) {
    toast.error(t('errors.no-file'), fileUpload.value?.inputFile)
    financialDocument.files = []
    console.info('Save: no files')
    return false
  }
  if (financialFiles.length > MAX_FILE_COUNT) {
    toast.maxFileError(financialFiles.length, MAX_FILE_COUNT, fileUpload.value?.inputFile)
    console.info('Save: too many files')
    return false
  }

  // Build form
  const newFiles = financialFiles.filter((f) => !f.id)
  for (const [key, newFile] of newFiles.entries()) {
    const f = newFile.file || new File([], '')
    formData.append(`documents[${key}]`, f, newFile.name)
  }
  formData.append('typeDocumentFinancial', financialDocument.documentSubCategory || '')
  formData.append('categoryStep', financialDocument.documentCategoryStep || '')
  formData.append('noDocument', financialDocument.noDocument ? 'true' : 'false')
  formData.append('customText', financialDocument.customText || '')
  formData.append('monthlySum', Math.trunc(financialDocument.monthlySum || 0).toString())
  if (financialDocument.id) {
    formData.append('id', financialDocument.id.toString())
  }
  state.addData?.(formData)

  // Upload
  uploadStatus.value = UploadStatus.STATUS_SAVING
  const $loading = useLoading()
  const loader = $loading.show()
  try {
    await store[state.action](formData)
    toast.success(t(successMsgKey), fileUpload.value?.inputFile)
    uploadStatus.value = UploadStatus.STATUS_INITIAL
    monthlySumChanged = false
    return true
  } catch (err) {
    uploadStatus.value = UploadStatus.STATUS_FAILED
    UtilsService.handleCommonSaveError(err, fileUpload.value?.inputFile)
    return false
  } finally {
    loader.hide()
  }
}
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
    "round-it": "Arrondir à l’euro",
    "amount": "Montant en euros",
    "valid-monthly-sum": "Veuillez saisir un montant valide",
    "amount-zero": "Vous avez saisi un montant à 0€. Êtes-vous sûr d’avoir saisi votre revenu mensuel ?",
    "insufficient-number-of-docs": "Nombre de justificatifs insuffisant",
    "you-added-docs": "Vous avez ajouté {0}.",
    "less-than-x-docs": "moins de {0} justificatifs",
    "for-complete-file": "Pour un dossier complet, nous vous recommandons d’en ajouter {0}.",
    "add-more-docs": "Ajouter d’autres documents",
    "go-next-step": "Passer à l’étape suivante",
    "i-authorize-corrections": "En continuant, j’autorise un opérateur DossierFacile à corriger les montants de revenus déclarés en cas d’erreur, sur la base des justificatifs fournis, afin de garantir la conformité de mon dossier."
  }
}
</i18n>
