<template>
  <form class="fr-mb-2w" @submit="onSubmit">
    <input
      v-model="inputSum"
      v-bind="sumAttr"
      :placeholder="t('amount')"
      name="monthlySum"
      class="fr-input fr-mb-2w"
      required
    />
    <span v-if="errors.sum" role="alert" class="fr-error-text">{{ t(errors.sum) }}</span>
    <FinancialFooterContent />
  </form>
  <template v-if="showFiles">
    <slot name="incomeFilled"></slot>
    <AllDeclinedMessages
      :document-denied-reasons="document.documentDeniedReasons"
      :document-status="document.documentStatus"
    />
    <ListItem
      v-for="file in document.files"
      :key="file.id"
      :file="file"
      :watermark-url="document.name"
      doc-category="financial"
      @remove="remove(file)"
      @ask-confirm="AnalyticsService.deleteDocument('financial')"
      @cancel="AnalyticsService.cancelDelete('financial')"
    />
    <FileUpload :current-status="uploadStatus" @add-files="addFiles" />
  </template>
  <slot v-else name="emptyIncome"></slot>
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import AllDeclinedMessages from '@/components/documents/share/AllDeclinedMessages.vue'
import FileUpload from '@/components/uploads/FileUpload.vue'
import ListItem from '@/components/uploads/ListItem.vue'
import { DfDocument, type FinancialStep } from 'df-shared-next/src/models/DfDocument'
import { computed, ref } from 'vue'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { RegisterService } from '@/services/RegisterService'
import type { DfFile } from 'df-shared-next/src/models/DfFile'
import { useLoading } from 'vue-loading-overlay'
import { useTenantStore } from '@/stores/tenant-store'
import { ToastService } from '@/services/ToastService'
import { UtilsService } from '@/services/UtilsService'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import FinancialFooterContent from './FinancialFooterContent.vue'

const MAX_FILE_COUNT = 10

type PropsWithStep = {
  category: 'SALARY' | 'SOCIAL_SERVICE' | 'RENT' | 'PENSION'
  step: FinancialStep
}
type PropsWithoutStep = {
  category: 'SCHOLARSHIP'
}

const props = defineProps<PropsWithStep | PropsWithoutStep>()

const uploadStatus = ref(UploadStatus.STATUS_INITIAL)
const store = useTenantStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const document = computed(
  () =>
    store.financialDocuments.find((d) => d.id === Number(route.params.docId)) || makeNewDocument()
)
const showFiles = ref(Boolean(document.value.monthlySum))

const { errors, defineField, handleSubmit } = useForm({
  initialValues: { sum: document.value.monthlySum?.toString() || '' },
  validationSchema: { sum: validateSum }
})
const [sum, sumAttr] = defineField('sum')

const inputSum = computed({
  get: () => sum.value,
  set(val) {
    sum.value = val
    const monthlySum = Number(sum.value.replace(/\s+/g, '')) || 0
    document.value.monthlySum = monthlySum
    showFiles.value = true
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

function submit() {
  if ((document.value.files || []).length === 0) {
    ToastService.error('financialdocumentform.missing-file')
    return
  }
  router.push({ name: 'TenantFinancial' })
}

const onSubmit = handleSubmit(submit)

async function addFiles(fileList: File[]) {
  AnalyticsService.uploadFile('financial')
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
  const docId = store.financialDocuments.at(-1)?.id
  if (docId) {
    router.push(route.path.replace('ajouter', String(docId)))
  }
}

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile('financial')
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
    router.push(route.path.replace(`/${docId}/`, '/ajouter/'))
  }
}

async function save() {
  const formData = new FormData()
  const financialDocument = document.value
  const financialFiles = financialDocument.files || []

  // Check validity
  if (!financialDocument.monthlySum) {
    ToastService.errorf(t('valid-monthly-sum'))
    console.info('Save: invalid monthlySum')
    return false
  }
  if (financialFiles.length === 0) {
    ToastService.error('financialdocumentform.missing-file')
    financialDocument.files = []
    console.info('Save: no files')
    return false
  }
  if (financialFiles.length > MAX_FILE_COUNT) {
    ToastService.maxFileError(financialFiles.length, MAX_FILE_COUNT)
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

  // Upload
  uploadStatus.value = UploadStatus.STATUS_SAVING
  const $loading = useLoading()
  const loader = $loading.show()
  try {
    await store.saveTenantFinancial(formData)
    ToastService.saveSuccess()
    uploadStatus.value = UploadStatus.STATUS_INITIAL
    return true
  } catch (err) {
    uploadStatus.value = UploadStatus.STATUS_FAILED
    UtilsService.handleCommonSaveError(err)
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
    "valid-monthly-sum": "Please enter a valid amount"
  },
  "fr": {
    "round-it": "Arrondir à l’euro",
    "amount": "Montant en euros",
    "valid-monthly-sum": "Merci de saisir un montant valide"
  }
}
</i18n>
