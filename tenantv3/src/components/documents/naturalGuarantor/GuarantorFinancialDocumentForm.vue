<template>
  <div>
    <Form name="form" @submit="goNext">
      <Modal v-show="isNoIncomeAndFiles" @close="isNoIncomeAndFiles = false">
        <template #body>
          <div class="fr-container">
            <div class="fr-grid-row justify-content-center">
              <div class="fr-col-12">
                <p>
                  {{ t('guarantorfinancialdocumentform.warning-no-income-and-file') }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </Modal>
      <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
        <span>{{ t(`explanation-text.${guarantorKey()}.will-delete-files`) }}</span>
      </ConfirmModal>
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <h1 class="fr-h6">
          {{ t(`guarantorfinancialdocumentform.title.${guarantorKey()}`) }}
        </h1>
        <div>
          <div>
            <div class="fr-mt-3w">
              <SimpleRadioButtons
                name="application-type-selector"
                :value="financialDocument.documentType"
                @input="onSelectChange"
                :elements="mapDocuments()"
              ></SimpleRadioButtons>
            </div>
          </div>
        </div>
        <div class="fr-mt-3w" v-if="financialDocument.documentType?.key">
          <div>
            <div class="fr-input-group">
              <label for="monthlySum" class="fr-label"> {{ getMonthlySumLabel() }} : </label>
              <Field
                name="monthlySum"
                v-slot="{ field, meta }"
                :value="financialDocument.monthlySum"
                @input="financialDocument.monthlySum = $event.target.value.replace(/\s+/g, '')"
                :rules="{
                  required: true,
                  regex: /^[0-9 ]+$/
                }"
              >
                <input
                  id="monthlySum"
                  :placeholder="t('guarantorfinancialdocumentform.monthlySum.placeholder')"
                  v-bind="field"
                  name="monthlySum"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  required
                />
              </Field>
              <ErrorMessage name="monthlySum" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
              <span class="fr-error-text" v-if="(financialDocument.monthlySum || 0) > 10000">
                {{ t('guarantorfinancialdocumentform.high-salary') }}
              </span>
              <span
                class="fr-error-text"
                v-if="
                  financialDocument.monthlySum !== undefined && financialDocument.monthlySum <= 0
                "
              >
                {{ t('guarantorfinancialdocumentform.low-salary') }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="fr-mt-3w"
          v-if="
            financialDocument.documentType?.key !== 'no-income' &&
            financialDocument.monthlySum !== undefined &&
            financialDocument.monthlySum >= 0
          "
        >
          <div class="fr-mb-3w">
            <p
              v-html="t(`explanation-text.${guarantorKey()}.${financialDocument.documentType.key}`)"
            ></p>
          </div>
          <AllDeclinedMessages
            class="fr-mb-3w"
            :user-id="user?.id"
            :document="financialDocument"
            :document-denied-reasons="documentDeniedReasons"
            :document-status="documentStatus"
          ></AllDeclinedMessages>
          <div v-if="financialFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
            <ListItem
              v-for="(file, k) in financialFiles()"
              :key="k"
              :file="file"
              @remove="remove(financialDocument, file)"
            />
          </div>
          <div class="fr-mb-3w">
            <FileUpload
              :current-status="financialDocument.fileUploadStatus"
              @add-files="addFiles(financialDocument, $event)"
              @reset-files="resetFiles(financialDocument)"
            ></FileUpload>
          </div>
          <div class="fr-col-12 fr-mb-3w bg-purple fr-checkbox-group">
            <input
              type="checkbox"
              id="noDocument"
              value="false"
              v-model="financialDocument.noDocument"
            />
            <label for="noDocument">
              {{
                t(
                  `explanation-text.${guarantorKey()}.${getCheckboxLabel(
                    financialDocument.documentType.key
                  )}`
                )
              }}
            </label>
          </div>
          <div class="fr-mb-5w" v-if="financialDocument.noDocument">
            <div class="fr-input-group">
              <label class="fr-label" for="customText">
                {{
                  t(
                    `explanation-text.${guarantorKey()}.${getCustomTextLabel(
                      financialDocument.documentType.key
                    )}`
                  )
                }}
              </label>
              <Field
                name="customText"
                v-slot="{ field, meta }"
                v-model="financialDocument.customText"
                :rules="{
                  required: true
                }"
              >
                <input
                  v-bind="field"
                  class="form-control fr-input validate-required"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid
                  }"
                  id="customText"
                  placeholder=""
                  type="text"
                  required
                />
              </Field>
              <ErrorMessage name="customText" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </div>
        </div>
      </NakedCard>
      <ProfileFooter @on-back="goBack"></ProfileFooter>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { DocumentType } from 'df-shared-next/src/models/Document'
import FileUpload from '../../uploads/FileUpload.vue'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import ListItem from '../../uploads/ListItem.vue'
import { DfFile } from 'df-shared-next/src/models/DfFile'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { RegisterService } from '../../../services/RegisterService'
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { FinancialDocument } from 'df-shared-next/src/models/FinancialDocument'
import Modal from 'df-shared-next/src/components/ModalComponent.vue'
import ProfileFooter from '../../footer/ProfileFooter.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { AnalyticsService } from '../../../services/AnalyticsService'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import { DocumentDeniedReasons } from 'df-shared-next/src/models/DocumentDeniedReasons'
import { UtilsService } from '../../../services/UtilsService'
import SimpleRadioButtons from 'df-shared-next/src/Button/SimpleRadioButtons.vue'
import useTenantStore from '../../../stores/tenant-store'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToastService } from '../../../services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { Form, Field, ErrorMessage } from 'vee-validate'

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => store.userToEdit)

const selectedGuarantor = computed(() => {
  return store.selectedGuarantor
})
const guarantorFinancialDocumentSelected = computed(() => {
  return store.guarantorFinancialDocumentSelected
})

const props = defineProps<{
  tenantId?: number
}>()

const financialDocument = ref(new FinancialDocument())
const documentDeniedReasons = ref(new DocumentDeniedReasons())
const documents = ref(DocumentTypeConstants.GUARANTOR_FINANCIAL_DOCS)
const isDocDeleteVisible = ref(false)
const selectedDoc = ref(new FinancialDocument())
const isNoIncomeAndFiles = ref(false)

onBeforeMount(() => {
  if (guarantorFinancialDocumentSelected.value) {
    financialDocument.value = {
      ...structuredClone(guarantorFinancialDocumentSelected.value)
    }
  }
  const doc = guarantorFinancialDocument()
  if (doc?.documentDeniedReasons) {
    documentDeniedReasons.value = structuredClone(doc?.documentDeniedReasons)
  }
})

const documentStatus = computed(() => {
  return guarantorFinancialDocument()?.documentStatus
})

function guarantorFinancialDocument() {
  return store.getGuarantorDocuments?.find((d: DfDocument) => {
    return d.id === financialDocument.value.id
  })
}

function onSelectChange(docType: DocumentType) {
  financialDocument.value.documentType = docType
  if (financialDocument.value.id === null) {
    return false
  }

  const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
    return d.id === financialDocument.value.id
  })
  if (doc === undefined) {
    return false
  }

  isDocDeleteVisible.value =
    (doc.files?.length || 0) > 0 &&
    doc.documentSubCategory !== financialDocument.value.documentType.value

  if (isDocDeleteVisible.value) {
    selectedDoc.value = financialDocument.value
  }
  return false
}

function undoSelect() {
  if (selectedGuarantor.value?.documents === null) {
    return
  }
  const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
    return d.id === selectedDoc.value?.id
  })
  if (doc !== undefined) {
    const localDoc = documents.value.find((d: DocumentType) => {
      return d.value === doc.documentSubCategory
    })
    if (localDoc !== undefined && selectedDoc.value) {
      selectedDoc.value.documentType = localDoc
    }
  }
  isDocDeleteVisible.value = false
}

async function validSelect() {
  isDocDeleteVisible.value = false
  if (selectedGuarantor.value?.documents === null) {
    return
  }
  const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
    return d.id === selectedDoc.value?.id
  })
  if (doc?.files !== undefined) {
    for (const f of doc.files) {
      if (f.id && selectedDoc.value) {
        await remove(selectedDoc.value, f, true)
      }
    }
  }
}

function addFiles(f: FinancialDocument, fileList: File[]) {
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  f.files = [...f.files, ...nf]
  save()
}

function resetFiles(f: FinancialDocument) {
  f.fileUploadStatus = UploadStatus.STATUS_INITIAL
}

async function save(): Promise<boolean> {
  const fieldName = 'documents'
  const formData = new FormData()
  if (financialDocument.value.documentType?.key === undefined) {
    return Promise.resolve(true)
  }

  if (financialDocument.value.id) {
    const original = store.guarantorFinancialDocuments?.find((d: DfDocument) => {
      return d.id === financialDocument.value.id
    })
    if (
      financialDocument.value.noDocument === original?.noDocument &&
      financialDocument.value.monthlySum === original?.monthlySum &&
      financialDocument.value.files.length === original?.files.length
    ) {
      return Promise.resolve(true)
    }
  }
  AnalyticsService.registerFile('guarantor-financial')
  if (!financialDocument.value.noDocument) {
    if (!financialFiles().length) {
      ToastService.error('guarantorfinancialdocumentform.missing-file')
      return Promise.reject(new Error('err'))
    }

    if (
      financialDocument.value.documentType.maxFileCount &&
      financialFiles().length > financialDocument.value.documentType.maxFileCount
    ) {
      ToastService.maxFileError(
        financialFiles().length,
        financialDocument.value.documentType.maxFileCount
      )
      financialDocument.value.files = []
      return Promise.reject(new Error('max-file'))
    }

    const newFiles = financialDocument.value.files.filter((f) => {
      return !f.id
    })
    Array.from(Array(newFiles.length).keys()).forEach((x) => {
      const f: File = newFiles[x].file || new File([], '')
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name)
    })
  } else if (financialFiles().length > 0) {
    isNoIncomeAndFiles.value = true
    return Promise.reject(new Error('err'))
  }

  const typeDocumentFinancial = financialDocument.value.documentType?.value || ''
  formData.append('typeDocumentFinancial', typeDocumentFinancial)

  formData.append('noDocument', financialDocument.value.noDocument ? 'true' : 'false')
  formData.append('customText', financialDocument.value.customText)

  if (financialDocument.value.monthlySum) {
    formData.append('monthlySum', Math.trunc(financialDocument.value.monthlySum).toString())
  } else {
    return Promise.reject(new Error('err'))
  }
  if (financialDocument.value.id) {
    formData.append('documentId', financialDocument.value.id.toString())
  }
  if (financialDocument.value.customText != '') {
    formData.append('customText', financialDocument.value.customText)
  }

  financialDocument.value.fileUploadStatus = UploadStatus.STATUS_SAVING
  formData.append('guarantorId', store.guarantor?.id?.toString() || '')
  if (props.tenantId) {
    formData.append('tenantId', props.tenantId.toString())
  }
  const $loading = useLoading({})
  const loader = $loading.show()
  const res = await store
    .saveGuarantorFinancial(formData)
    .then(() => {
      if (guarantorFinancialDocumentSelected.value) {
        financialDocument.value = structuredClone(guarantorFinancialDocumentSelected.value)
      }
      ToastService.saveSuccess()
      return Promise.resolve(true)
    })
    .catch((err) => {
      financialDocument.value.fileUploadStatus = UploadStatus.STATUS_FAILED
      UtilsService.handleCommonSaveError(err)
      return Promise.reject(new Error('err'))
    })
    .finally(() => {
      loader.hide()
    })
  return res
}

function financialFiles() {
  const newFiles = financialDocument.value.files.map((file: DfFile) => {
    return {
      documentSubCategory: financialDocument.value.documentType?.value,
      id: file.id,
      name: file.name,
      size: file.size
    }
  })
  const existingFiles =
    store.getGuarantorDocuments?.find((d: DfDocument) => {
      return d.id === financialDocument.value.id
    })?.files || []
  return [...newFiles, ...existingFiles]
}

function remove(f: FinancialDocument, file: DfFile, silent = false) {
  if (file.id) {
    if (
      f.files.length === 1 &&
      guarantorFinancialDocumentSelected.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(
        guarantorFinancialDocumentSelected.value.documentSubCategory || ''
      )
    }
    RegisterService.deleteFile(file.id, silent)
  } else {
    const firstIndex = f.files.findIndex((lf) => {
      return lf.name === file.name && !lf.path
    })
    f.files.splice(firstIndex, 1)
  }
}

function goBack() {
  store.selectGuarantorDocumentFinancial(undefined)
}

function goNext() {
  save().then(() => {
    store.selectGuarantorDocumentFinancial(undefined)
  })
}

function getCheckboxLabel(key: string) {
  if (key === 'guarantor_salary') {
    return 'noDocument-salary'
  }
  if (key === 'pension') {
    return 'noDocument-pension'
  }
  if (key === 'rent') {
    return 'noDocument-rent'
  }
  if (key === 'scholarship') {
    return 'noDocument-scholarship'
  }
  if (key === 'social-service') {
    return 'noDocument-social'
  }
  return ''
}

function getCustomTextLabel(key: string) {
  if (key === 'guarantor_salary') {
    return 'customText-salary'
  }
  if (key === 'pension') {
    return 'customText-pension'
  }
  if (key === 'rent') {
    return 'customText-rent'
  }
  if (key === 'scholarship') {
    return 'customText-scholarship'
  }
  if (key === 'social-service') {
    return 'customText-social'
  }
  return ''
}

function guarantorKey() {
  if (props.tenantId != null) {
    return 'cotenant-guarantor'
  }
  return 'guarantor'
}

function getMonthlySumLabel() {
  const docType = financialDocument.value?.documentType.key
  let label = t('guarantorfinancialdocumentform.monthlySum.label')
  if (docType === 'guarantor_salary' || docType === 'pension' || docType === 'rent') {
    label += ' '
    label += t('guarantorfinancialdocumentform.monthlySum.label-tax')
  }
  return label
}

function mapDocuments() {
  return documents.value.map((d) => {
    return {
      id: d.key,
      labelKey: 'documents.' + d.key,
      value: d
    }
  })
}
</script>
