<template>
  <div class="fr-mb-5w">
    <Form name="form" @submit="goNext">
      <NakedCard class="fr-p-md-5w fr-m-3v">
        <TenantBadge />
        <h1 class="fr-h6">{{ t('tax-page.title') }}</h1>
        <div class="fr-mt-3w">
          <SimpleRadioButtons
            name="application-type-selector"
            :value="taxDocument"
            :elements="mapDocuments()"
            @input="onSelectChange($event)"
          ></SimpleRadioButtons>
        </div>
      </NakedCard>

      <NakedCard
        v-if="taxDocument.key && taxDocument.key === 'other-tax'"
        class="fr-p-md-5w fr-mt-md-3w fr-m-3v"
      >
        <label class="fr-label" for="customText">{{ t('tax-page.custom-text') }}</label>
        <Field
          id="customText"
          v-slot="{ field, meta }"
          v-model="customText"
          name="customText"
          :rules="{
            required: true
          }"
        >
          <textarea
            v-bind="field"
            class="form-control fr-input validate-required"
            :class="{
              'fr-input--valid': meta.valid,
              'fr-input--error': !meta.valid
            }"
            placeholder=""
            type="text"
            required
            maxlength="2000"
            rows="4"
          />
        </Field>
        <ErrorMessage v-slot="{ message }" name="customText">
          <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
        </ErrorMessage>
      </NakedCard>
      <ProfileFooter @on-back="goBack"></ProfileFooter>
    </Form>

    <NakedCard
      v-if="taxDocument.key === 'my-name' || taxFiles().length > 0"
      class="fr-p-md-5w fr-mt-md-3w fr-m-3v"
    >
      <div v-if="taxDocument.key === 'my-name'" class="fr-mb-3w fr-mt-3w">
        <div class="fr-mb-3w">
          <div class="fr-mb-2w" v-html="t('explanation-text.tenant.my-name')"></div>
          <WarningTaxDeclaration />
        </div>
      </div>
      <AllDeclinedMessages
        :document="tenantTaxDocument"
        :document-denied-reasons="tenantTaxDocument?.documentDeniedReasons"
        :document-status="documentStatus"
      ></AllDeclinedMessages>
      <div v-if="taxFiles().length > 0" class="fr-col-12 fr-mb-3w">
        <ListItem
          v-for="file in taxFiles()"
          :key="file.id"
          :file="file"
          :watermark-url="documentWatermarkUrl"
          doc-category="tax"
          @remove="remove(file)"
        />
      </div>
      <div v-if="taxDocument.key === 'my-name'">
        <div class="fr-mb-3w">
          <FileUpload
            :current-status="fileUploadStatus"
            @add-files="addFiles"
            @reset-files="resetFiles"
          ></FileUpload>
        </div>
      </div>
    </NakedCard>
    <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t('tax-page.will-delete-files') }}</span>
    </ConfirmModal>
    <Modal
      v-if="isWarningTaxSituationModalVisible"
      @close="isWarningTaxSituationModalVisible = false"
    >
      <template #body>
        <div class="warning-tax-modal fr-pl-md-3w fr-pr-md-3w fr-pb-md-3w">
          <h1 class="avis-title fr-h4 display--flex align-items--center">
            <RiAlarmWarningLine class="bold-icon fr-mr-1w" />
            {{ t('tax-page.avis-detected') }}
          </h1>
          <p>
            {{ t('tax-page.avis-text1') }}
          </p>
          <hr class="mobile" />
          <div class="btn-align">
            <DfButton :primary="true" @click="isWarningTaxSituationModalVisible = false">{{
              t('tax-page.avis-btn')
            }}</DfButton>
          </div>
          <div class="btn-align fr-mt-2w">
            <a
              href="https://aide.dossierfacile.logement.gouv.fr/fr/article/5-avis-dimposition-eg82wt/"
              rel="noopener"
              target="_blank"
              >{{ t('tax-page.avis-link-to-doc') }}</a
            >
          </div>
        </div>
      </template>
    </Modal>
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
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import { AnalyticsService } from '../../../services/AnalyticsService'
import ProfileFooter from '../../footer/ProfileFooter.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import { PdfAnalysisService } from '../../../services/PdfAnalysisService'
import Modal from 'df-shared-next/src/components/ModalComponent.vue'
import WarningTaxDeclaration from '../../../components/documents/share/WarningTaxDeclaration.vue'
import { UtilsService } from '../../../services/UtilsService'
import SimpleRadioButtons from 'df-shared-next/src/Button/SimpleRadioButtons.vue'
import { computed, onBeforeMount, ref } from 'vue'
import { useTenantStore } from '../../../stores/tenant-store'
import { useI18n } from 'vue-i18n'
import { ToastService } from '../../../services/ToastService'
import { useLoading, type ActiveLoader } from 'vue-loading-overlay'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { RiAlarmWarningLine } from '@remixicon/vue'
import TenantBadge from '@/components/common/TenantBadge.vue'

const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()
const { t } = useI18n()

const store = useTenantStore()
const user = computed(() => store.user)
const tenantTaxDocument = computed(() => store.getTenantTaxDocument)

const documents = ref(DocumentTypeConstants.TAX_DOCS)

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref([] as DfFile[])
const taxDocument = ref(new DocumentType())

const customText = ref('')

const isDocDeleteVisible = ref(false)
const isWarningTaxSituationModalVisible = ref(false)
const newFiles = ref([] as File[])

const $loading = useLoading({})
let loader: ActiveLoader | undefined

const documentStatus = computed(() => {
  return tenantTaxDocument.value?.documentStatus
})

onBeforeMount(() => {
  if (user.value?.documents !== null) {
    if (tenantTaxDocument.value !== undefined) {
      customText.value = tenantTaxDocument.value.customText || ''
      const localDoc = documents.value.find((d: DocumentType) => {
        return d.value === tenantTaxDocument.value?.documentSubCategory
      })
      if (localDoc !== undefined) {
        taxDocument.value = localDoc
        localStorage.setItem(getLocalStorageKey(), taxDocument.value.key || '')
      }
    } else {
      const key = localStorage.getItem(getLocalStorageKey())
      if (key) {
        const localDoc = documents.value.find((d: DocumentType) => {
          return d.key === key
        })
        if (localDoc !== undefined) {
          taxDocument.value = localDoc
        }
      }
    }
  }
})

function getLocalStorageKey() {
  return 'tax_guarantor_' + user.value?.email
}

function onSelectChange($event: DocumentType) {
  taxDocument.value = $event
  localStorage.setItem(getLocalStorageKey(), taxDocument.value.key)
  if (user.value?.documents !== null) {
    const doc = tenantTaxDocument.value
    if (doc !== undefined) {
      isDocDeleteVisible.value =
        (doc?.files?.length || 0) > 0 && doc?.documentSubCategory !== taxDocument.value.value
    }
  }
  return false
}

function getRegisteredDoc() {
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'TAX'
    })
    return doc
  }
  return undefined
}

function undoSelect() {
  if (user.value?.documents !== null) {
    const doc = tenantTaxDocument.value
    if (doc !== undefined) {
      const localDoc = documents.value.find((d: DocumentType) => {
        return d.value === doc?.documentSubCategory
      })
      if (localDoc !== undefined) {
        taxDocument.value = localDoc
      }
    }
  }
  isDocDeleteVisible.value = false
}

async function validSelect() {
  isDocDeleteVisible.value = false
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'TAX'
    })
    if (doc?.files !== undefined) {
      for (const f of doc.files) {
        if (f.id) {
          await remove(f, true)
        }
      }
    }
  }
}

async function addFiles(fileList: File[]) {
  newFiles.value = fileList
  showLoader()
  if (await PdfAnalysisService.includesRejectedTaxDocuments(fileList)) {
    isWarningTaxSituationModalVisible.value = true
    hideLoader()
  } else {
    saveNewFiles(false)
  }
}

function saveNewFiles(force: boolean) {
  AnalyticsService.uploadFile('tax')
  const nf = Array.from(newFiles.value).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  files.value = [...files.value, ...nf]
  save(force)
}

function resetFiles() {
  fileUploadStatus.value = UploadStatus.STATUS_INITIAL
}

async function goNext() {
  const res = await save()
  if (res) {
    emit('on-next')
  }
}

function goBack() {
  emit('on-back')
}

async function save(force = false): Promise<boolean> {
  if (taxDocument.value.key === undefined) {
    return true
  }
  const fieldName = 'documents'
  const formData = new FormData()
  const newFiles = files.value.filter((f) => {
    return !f.id
  })
  if (newFiles.length) {
    if (taxDocument.value.maxFileCount && taxFiles().length > taxDocument.value.maxFileCount) {
      ToastService.maxFileError(taxFiles().length, taxDocument.value.maxFileCount)
      files.value = []
      hideLoader()
      return false
    }

    Array.from(Array(newFiles.length).keys()).forEach((x) => {
      const f: File = newFiles[x].file || new File([], '')
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name)
    })
  }

  const d = getRegisteredDoc()
  if (
    taxDocument.value.value === d?.documentSubCategory &&
    customText.value === (d?.customText || '') &&
    newFiles.length <= 0
  ) {
    return true
  }

  if (taxDocument.value.key === 'my-name') {
    formData.append('noDocument', 'false')
  } else {
    formData.append('noDocument', 'true')
  }

  if (formData.get('noDocument') === 'false' && newFiles.length <= 0 && taxFiles().length <= 0) {
    ToastService.noFileError()
    hideLoader()
    return false
  }

  formData.append('typeDocumentTax', taxDocument.value.value)

  if (taxDocument.value.key === 'other-tax') {
    if (!customText.value || customText.value === '') {
      return false
    }
    formData.append('customText', customText.value)
  }

  if (force) {
    formData.append('avisDetected', 'true')
  } else {
    const filteredFiles = files.value.map((f) => f.file).filter((f) => f !== undefined)
    if (!(await PdfAnalysisService.includesRejectedTaxDocuments(filteredFiles))) {
      formData.append('avisDetected', 'false')
    }
  }

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  showLoader()
  return await store
    .saveTenantTax(formData)
    .then(() => {
      files.value = []
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      ToastService.saveSuccess()
      return true
    })
    .catch((err) => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      UtilsService.handleCommonSaveError(err)
      return false
    })
    .finally(() => {
      hideLoader()
    })
}

function taxFiles(): DfFile[] {
  const newFiles = files.value.map((f) => {
    return {
      documentSubCategory: taxDocument.value.value,
      id: f.id,
      name: f.name,
      file: f.file,
      size: f.size
    }
  })
  const existingFiles =
    store.getTenantDocuments?.find((d: DfDocument) => {
      return d.documentCategory === 'TAX'
    })?.files || []
  return [...newFiles, ...existingFiles]
}

const documentWatermarkUrl = computed(() => tenantTaxDocument.value?.name)

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile('tax')
  if (file.id) {
    if (
      tenantTaxDocument.value?.files?.length === 1 &&
      tenantTaxDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(tenantTaxDocument.value?.documentSubCategory || '')
    }
    await RegisterService.deleteFile(file.id, silent)
  } else {
    const firstIndex = files.value.findIndex((f) => {
      return f.name === file.name && !f.path
    })
    files.value.splice(firstIndex, 1)
  }
}

function showLoader() {
  if (loader === undefined) {
    loader = $loading.show()
  }
}

function hideLoader() {
  loader?.hide()
  loader = undefined
}

function mapDocuments() {
  return documents.value.map((d) => {
    return { id: d.key, labelKey: d.key, value: d }
  })
}
</script>
