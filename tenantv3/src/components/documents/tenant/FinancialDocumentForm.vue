<template>
  <Form name="form" @submit="saveAndGoNext">
    <div>
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <div>
          <h1 class="fr-h6">
            {{ t('financialdocumentform.title') }}
          </h1>

          <div class="fr-mt-3w">
            <SimpleRadioButtons
              name="application-type-selector"
              :value="financialDocument.documentType"
              @input="onSelectChange($event)"
              :elements="mapDocuments()"
            ></SimpleRadioButtons>
          </div>
        </div>
      </NakedCard>
      <NakedCard
        class="fr-p-md-5w fr-mb-3w"
        v-if="
          financialDocument.documentType.key && financialDocument.documentType.key !== 'no-income'
        "
      >
        <div>
          <div>
            <div
              v-if="
                financialDocument.documentType &&
                financialDocument.documentType.key &&
                financialDocument.documentType.key !== 'no-income'
              "
            >
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
                      :placeholder="t('financialdocumentform.monthlySum.placeholder')"
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
                    {{ t('financialdocumentform.high-salary') }}
                  </span>
                  <span
                    class="fr-error-text"
                    v-if="
                      financialDocument.monthlySum !== undefined &&
                      financialDocument.monthlySum <= 0
                    "
                  >
                    {{ t('financialdocumentform.low-salary') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="fr-mt-3w"
          v-if="
            financialDocument.documentType.key &&
            financialDocument.documentType.key !== 'no-income' &&
            financialDocument.monthlySum !== undefined &&
            financialDocument.monthlySum >= 0
          "
        >
          <div>
            <div class="fr-mb-3w">
              <p v-html="t(`explanation-text.tenant.${financialDocument.documentType.key}`)"></p>
            </div>
            <AllDeclinedMessages
              :document-denied-reasons="tenantFinancialDocument?.documentDeniedReasons"
              :document-status="documentStatus"
            ></AllDeclinedMessages>
            <div
              v-if="
                financialDocument.documentType.key &&
                financialDocument.documentType.key !== 'no-income' &&
                financialFiles().length > 0
              "
              class="fr-col-md-12 fr-mb-3w"
            >
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
                @add-files="addFiles($event)"
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
                {{ t(getCheckboxLabel(financialDocument.documentType.key)) }}
              </label>
            </div>
            <div class="fr-mb-5w" v-if="financialDocument.noDocument">
              <div class="fr-input-group">
                <label class="fr-label" for="customText">
                  {{ t(`financialdocumentform.customText-${financialDocument.documentType.key}`) }}
                </label>
                <Field
                  name="customText"
                  v-slot="{ field, meta }"
                  v-model="financialDocument.customText"
                  :rules="{
                    required: true
                  }"
                >
                  <textarea
                    v-bind="field"
                    class="form-control fr-input validate-required"
                    id="customText"
                    placeholder=""
                    type="text"
                    maxlength="2000"
                    rows="3"
                    :class="{
                      'fr-input--valid': meta.valid,
                      'fr-input--error': !meta.valid
                    }"
                    required
                  />
                  <span>{{ financialDocument.customText.length }} / 2000</span>
                </Field>
                <ErrorMessage name="customText" v-slot="{ message }">
                  <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
                </ErrorMessage>
              </div>
            </div>
          </div>
        </div>
      </NakedCard>
      <div
        v-if="
          financialDocument.documentType.key && financialDocument.documentType.key === 'no-income'
        "
      >
        <NakedCard class="fr-p-md-5w fr-mb-3w">
          <div class="fr-input-group">
            <label class="fr-label" for="customTextNoDocument">
              {{ t('financialdocumentform.has-no-income') }}
            </label>
            <textarea
              v-model="financialDocument.customText"
              maxlength="2000"
              rows="3"
              class="form-control fr-input validate-required"
              id="customTextNoDocument"
              name="customText"
              placeholder=""
              type="text"
            />
            <span>{{ financialDocument.customText.length }} / 2000</span>
          </div>
        </NakedCard>
      </div>
      <ProfileFooter @on-back="goBack"></ProfileFooter>
      <Modal v-show="isNoIncomeAndFiles" @close="isNoIncomeAndFiles = false">
        <template #body>
          <div class="fr-container">
            <div class="fr-grid-row justify-content-center">
              <div class="fr-col-12">
                <p>
                  {{ t('financialdocumentform.warning-no-income-and-file') }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </Modal>
      <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
        <span>{{ t('financialdocumentform.will-delete-files') }}</span>
      </ConfirmModal>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { DocumentType } from 'df-shared-next/src/models/Document'
import FileUpload from '../../uploads/FileUpload.vue'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { FinancialDocument } from 'df-shared-next/src/models/FinancialDocument'
import ListItem from '../../uploads/ListItem.vue'
import { DfFile } from 'df-shared-next/src/models/DfFile'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { RegisterService } from '../../../services/RegisterService'
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import Modal from 'df-shared-next/src/components/ModalComponent.vue'
import { AnalyticsService } from '../../../services/AnalyticsService'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import ProfileFooter from '../../footer/ProfileFooter.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import { UtilsService } from '@/services/UtilsService'
import SimpleRadioButtons from 'df-shared-next/src/Button/SimpleRadioButtons.vue'
import { useI18n } from 'vue-i18n'
import useTenantStore from '@/stores/tenant-store'
import { computed, onBeforeMount, ref, toRaw } from 'vue'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { Form, Field, ErrorMessage } from 'vee-validate'

const store = useTenantStore()
const user = computed(() => {
  return store.userToEdit
})
const financialDocumentSelected = computed(() => {
  return store.financialDocumentSelected
})
const tenantFinancialDocuments = computed(() => {
  return store.tenantFinancialDocuments
})

const { t } = useI18n()
const documents = DocumentTypeConstants.FINANCIAL_DOCS

const isDocDeleteVisible = ref(false)
const selectedDoc = ref(new FinancialDocument())
const isNoIncomeAndFiles = ref(false)
const financialDocument = ref(new FinancialDocument())

onBeforeMount(() => {
  financialDocument.value = { ...structuredClone(toRaw(financialDocumentSelected.value)) }
})

const tenantFinancialDocument = computed(() =>
  store.getTenantDocuments?.find((d: DfDocument) => {
    return d.id === financialDocument.value.id
  })
)

const documentStatus = computed(() => {
  return tenantFinancialDocument.value?.documentStatus
})

function onSelectChange($event: DocumentType) {
  financialDocument.value.documentType = $event
  if (financialDocument.value.id === null) {
    return false
  }

  const doc = user.value?.documents?.find((d: DfDocument) => {
    return d.id === financialDocument.value.id
  })
  if (doc === undefined) {
    return false
  }

  selectedDoc.value = financialDocument.value
  isDocDeleteVisible.value =
    (doc.files?.length || 0) > 0 &&
    doc.documentSubCategory !== financialDocument.value.documentType.value
  return false
}

function undoSelect() {
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.id === selectedDoc.value?.id
    })
    if (doc !== undefined) {
      const localDoc = documents.find((d: DocumentType) => {
        return d.value === doc.documentSubCategory
      })
      if (localDoc !== undefined && selectedDoc.value) {
        selectedDoc.value.documentType = localDoc
      }
    }
  }
  isDocDeleteVisible.value = false
}

async function validSelect() {
  isDocDeleteVisible.value = false
  if (user.value?.documents === null) {
    return
  }
  const doc = user.value?.documents?.find((d: DfDocument) => {
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

function addFiles(fileList: File[]) {
  AnalyticsService.uploadFile('financial')
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  financialDocument.value.files = [...financialDocument.value.files, ...nf]
  save()
}

function resetFiles(f: FinancialDocument) {
  f.fileUploadStatus = UploadStatus.STATUS_INITIAL
}

async function save(): Promise<boolean> {
  const fieldName = 'documents'
  const formData = new FormData()
  if (financialDocument.value.documentType.key === undefined) {
    return Promise.resolve(true)
  }
  if (financialDocument.value.id) {
    const original = tenantFinancialDocuments.value?.find((d: DfDocument) => {
      return d.id === financialDocument.value.id
    })
    if (
      original &&
      financialDocument.value.documentType.key === original.documentType.key &&
      financialDocument.value.noDocument === original.noDocument &&
      financialDocument.value.monthlySum === original.monthlySum &&
      financialDocument.value.files.length === original.files.length &&
      financialDocument.value.customText === original.customText
    ) {
      return Promise.resolve(true)
    }
  }
  AnalyticsService.registerFile('financial')
  if (!financialDocument.value.noDocument) {
    if (!financialFiles().length && financialDocument.value.documentType.key !== 'no-income') {
      ToastService.error('financialdocumentform.missing-file')
      financialDocument.value.files = []
      return Promise.reject(new Error('missing-file'))
    }

    if (
      financialDocument.value.documentType.maxFileCount &&
      financialFiles().length > financialDocument.value.documentType.maxFileCount
    ) {
      ToastService.maxFileError(
        financialFiles().length,
        financialDocument.value.documentType.maxFileCount
      )
      return Promise.reject(new Error('max-file'))
    }

    const newFiles = financialDocument.value.files.filter((f) => {
      return !f.id
    })
    Array.from(Array(newFiles.length).keys()).forEach((x) => {
      const f: File = newFiles[x].file || new File([], '')
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name)
    })
  } else {
    if (financialFiles().length > 0) {
      isNoIncomeAndFiles.value = true
      financialDocument.value.files = []
      return Promise.reject(new Error('Financial - document found but "no document" was checked'))
    }
  }

  const typeDocumentFinancial = financialDocument.value.documentType?.value || ''
  formData.append('typeDocumentFinancial', typeDocumentFinancial)

  if (financialDocument.value.documentType.key === 'no-income') {
    financialDocument.value.noDocument = true
    financialDocument.value.monthlySum = 0
  }

  formData.append('noDocument', financialDocument.value.noDocument ? 'true' : 'false')
  if (
    financialDocument.value.documentType.key === 'no-income' &&
    !financialDocument.value.customText
  ) {
    formData.append('customText', '-')
  } else {
    formData.append('customText', financialDocument.value.customText)
  }

  if (financialDocument.value.monthlySum !== undefined && financialDocument.value.monthlySum >= 0) {
    if (
      financialDocument.value.documentType.key !== 'no-income' &&
      financialDocument.value.monthlySum === 0
    ) {
      ToastService.error('financialdocumentform.income-zero')
      return Promise.reject(new Error('Financial - zero income but noIncome is unchecked'))
    }
    formData.append('monthlySum', Math.trunc(financialDocument.value.monthlySum).toString())
  } else {
    return Promise.reject(new Error('Financial - income was not provided'))
  }
  if (financialDocument.value.id) {
    formData.append('id', financialDocument.value.id.toString())
  }

  financialDocument.value.fileUploadStatus = UploadStatus.STATUS_SAVING
  const $loading = useLoading({})
  const loader = $loading.show()
  const res = await store
    .saveTenantFinancial(formData)
    .then(() => {
      financialDocument.value = {
        ...structuredClone(toRaw(financialDocumentSelected.value))
      }
      ToastService.saveSuccess()
      return Promise.resolve(true)
    })
    .catch((err) => {
      financialDocument.value.fileUploadStatus = UploadStatus.STATUS_FAILED
      UtilsService.handleCommonSaveError(err)
      return Promise.reject(new Error(err))
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
    store.getTenantDocuments?.find((d: DfDocument) => {
      return d.id === financialDocument.value.id
    })?.files || []
  return [...newFiles, ...existingFiles]
}

function remove(f: FinancialDocument, file: DfFile, silent = false) {
  AnalyticsService.deleteFile('financial')
  if (file.id) {
    if (
      f.files.length === 1 &&
      financialDocumentSelected.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(
        financialDocumentSelected.value.documentSubCategory || ''
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

function getCheckboxLabel(key: string) {
  if (key === 'salary') {
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

function goBack() {
  store.selectDocumentFinancial(undefined)
}

function saveAndGoNext() {
  save().then(goNext)
}

function goNext() {
  store.selectDocumentFinancial(undefined)
}

function getMonthlySumLabel() {
  const docType = financialDocument.value?.documentType.key
  let label = t('financialdocumentform.monthlySum.label')
  if (docType === 'salary' || docType === 'pension' || docType === 'rent') {
    label += ' '
    label += t('financialdocumentform.monthlySum.label-tax')
  }
  return label
}

function mapDocuments() {
  return documents.map((d) => {
    return {
      id: d.key,
      labelKey: 'documents.' + d.key,
      value: d
    }
  })
}
</script>
