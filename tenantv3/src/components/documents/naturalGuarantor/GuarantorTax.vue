<template>
  <div>
    <Form name="form">
      <NakedCard class="fr-p-md-5w">
        <h1 class="fr-h6" v-if="isCotenant">
          {{ t('guarantortax.title-cotenant') }}
        </h1>
        <h1 class="fr-h6" v-else>{{ t('guarantortax.title') }}</h1>
        <div class="fr-mt-3w">{{ t('guarantortax.situation') }}</div>

        <div class="fr-mt-3w">
          <SimpleRadioButtons
            name="application-type-selector"
            :value="taxDocument"
            @input="onSelectChange($event)"
            :elements="mapDocuments()"
          ></SimpleRadioButtons>
        </div>
        <div class="fr-mb-3w" v-if="taxDocument.key && taxDocument.key === 'other-tax'">
          <div class="fr-input-group">
            <label class="fr-label" for="customText">{{ t('guarantortax.custom-text') }}</label>
            <Field
              name="customText"
              v-model="customText"
              v-slot="{ field, meta }"
              :rules="{ required: true }"
            >
              <textarea
                v-bind="field"
                class="form-control fr-input validate-required"
                id="customText"
                name="customText"
                placeholder=""
                type="text"
                required
                maxlength="2000"
                :class="{
                  'fr-input--valid': meta.valid,
                  'fr-input--error': !meta.valid
                }"
                rows="4"
              />
              <ErrorMessage name="customText" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </Field>
          </div>
        </div>
      </NakedCard>
    </Form>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="taxDocument.key === 'my-name' || taxFiles().length > 0"
    >
      <div class="fr-mb-3w">
        <p v-html="t(`explanation-text.${guarantorKey()}.${taxDocument.key}`)"></p>
      </div>
      <AllDeclinedMessages
        class="fr-mb-3w"
        :user-id="user?.id"
        :document="guarantorTaxDocument()"
        :documentDeniedReasons="documentDeniedReasons"
        :documentStatus="documentStatus"
      ></AllDeclinedMessages>
      <WarningTaxDeclaration />

      <div v-if="taxFiles().length > 0" class="fr-col-md-12 fr-mt-3w">
        <ListItem v-for="(file, k) in taxFiles()" :key="k" :file="file" @remove="remove(file)" />
      </div>
      <div class="fr-mb-3w fr-mt-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </NakedCard>
    <GuarantorFooter @on-back="goBack" @on-next="goNext"></GuarantorFooter>
    <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t('guarantortax.will-delete-files') }}</span>
    </ConfirmModal>
    <Modal
      v-if="isWarningTaxSituationModalVisible"
      @close="isWarningTaxSituationModalVisible = false"
    >
      <template v-slot:body>
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
            <DfButton @on-click="isWarningTaxSituationModalVisible = false" :primary="true">{{
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
import GuarantorFooter from '../../footer/GuarantorFooter.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import { DocumentDeniedReasons } from 'df-shared-next/src/models/DocumentDeniedReasons'
import { cloneDeep } from 'lodash'
import { PdfAnalysisService } from '../../../services/PdfAnalysisService'
import { AnalyticsService } from '../../../services/AnalyticsService'
import Modal from 'df-shared-next/src/components/Modal.vue'
import DfButton from 'df-shared-next/src/Button/Button.vue'
import WarningTaxDeclaration from '@/components/documents/share/WarningTaxDeclaration.vue'
import { UtilsService } from '@/services/UtilsService'
import SimpleRadioButtons from 'df-shared-next/src/Button/SimpleRadioButtons.vue'
import { computed, onMounted, ref } from 'vue'
import useTenantStore from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'
import { ToastService } from '@/services/ToastService'
import { useLoading, type ActiveLoader } from 'vue-loading-overlay'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { RiAlarmWarningLine } from '@remixicon/vue'

const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

const { t } = useI18n()
const store = useTenantStore()
const selectedGuarantor = computed(() => {
  return store.selectedGuarantor
})
const user = computed(() => {
  return store.userToEdit
})

const props = withDefaults(
  defineProps<{
    tenantId?: number
    isCotenant?: boolean
  }>(),
  {
    isCotenant: false
  }
)

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref([] as DfFile[])
const taxDocument = ref(new DocumentType())
const documentDeniedReasons = ref(new DocumentDeniedReasons())

const customText = ref('')

const documents = ref(DocumentTypeConstants.GUARANTOR_TAX_DOCS)
const isDocDeleteVisible = ref(false)
const newFiles = ref([] as File[])
const isWarningTaxSituationModalVisible = ref(false)

let loader: ActiveLoader | undefined

function getRegisteredDoc() {
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'TAX'
    })
    return doc
  }
  return undefined
}

const documentStatus = computed(() => {
  return guarantorTaxDocument()?.documentStatus
})

function guarantorTaxDocument() {
  return store.getGuarantorTaxDocument
}

function onSelectChange($event: DocumentType) {
  taxDocument.value = $event
  if (user.value?.documents !== null) {
    const doc = guarantorTaxDocument()
    if (doc !== undefined) {
      isDocDeleteVisible.value =
        (doc?.files?.length || 0) > 0 && doc?.documentSubCategory !== taxDocument.value.value
    }
  }
  return false
}

function undoSelect() {
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'TAX'
    })
    if (doc !== undefined) {
      const localDoc = documents.value.find((d: DocumentType) => {
        return d.value === doc.documentSubCategory
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
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
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

function updateGuarantorData() {
  if (selectedGuarantor.value?.documents !== null) {
    if (guarantorTaxDocument() !== undefined) {
      customText.value = guarantorTaxDocument()?.customText || ''
      const localDoc = documents.value.find((d: DocumentType) => {
        return d.value === guarantorTaxDocument()?.documentSubCategory
      })
      if (localDoc !== undefined) {
        taxDocument.value = localDoc
      }
      const docDeniedReasons = guarantorTaxDocument()?.documentDeniedReasons
      if (docDeniedReasons !== undefined) {
        documentDeniedReasons.value = cloneDeep(docDeniedReasons)
      }
    }
  }
}

onMounted(() => {
  updateGuarantorData()
})

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

async function save(force = false) {
  if (!taxDocument.value.key) {
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

  if (force) {
    formData.append('avisDetected', 'true')
  } else {
    const filesToSave = files.value.map((f) => f.file).filter((f) => f !== undefined)
    if (!(await PdfAnalysisService.includesRejectedTaxDocuments(filesToSave))) {
      formData.append('avisDetected', 'false')
    }
  }

  formData.append('typeDocumentTax', taxDocument.value.value)

  if (taxDocument.value.key === 'other-tax') {
    if (!customText.value || customText.value === '') {
      return false
    }
    formData.append('customText', customText.value)
  }

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  if (store.guarantor?.id) {
    formData.append('guarantorId', store.guarantor.id.toString())
  }

  if (props.tenantId) {
    formData.append('tenantId', props.tenantId.toString())
  }
  showLoader()
  await store
    .saveGuarantorTax(formData)
    .then(() => {
      files.value = []
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      ToastService.saveSuccess()
    })
    .catch((err) => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      UtilsService.handleCommonSaveError(err)
    })
    .finally(() => {
      hideLoader()
    })
  return true
}

function taxFiles(): DfFile[] {
  const newFiles = files.value.map((f) => {
    return {
      documentSubCategory: taxDocument.value.value,
      id: f.id,
      name: f.name,
      file: f,
      size: f.size
    }
  })
  const existingFiles =
    store.getGuarantorDocuments?.find((d: DfDocument) => {
      return d.documentCategory === 'TAX'
    })?.files || []
  return [...newFiles, ...existingFiles]
}

async function remove(file: DfFile, silent = false) {
  if (file.id) {
    if (
      files.value.length === 1 &&
      guarantorTaxDocument()?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(guarantorTaxDocument()?.documentCategory || '')
    }
    await RegisterService.deleteFile(file.id, silent)
  } else {
    const firstIndex = files.value.findIndex((f) => {
      return f.name === file.name && !f.path
    })
    files.value.splice(firstIndex, 1)
  }
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

function guarantorKey() {
  if (props.isCotenant) {
    return 'cotenant-guarantor'
  }
  return 'guarantor'
}

function showLoader() {
  if (loader === undefined) {
    const $loading = useLoading({})
    loader = $loading.show()
  }
}

function hideLoader() {
  loader?.hide()
  loader = undefined
}

function mapDocuments() {
  const suffixKey = props.isCotenant ? '-cotenant' : ''
  return documents.value.map((d) => {
    return {
      id: d.key,
      labelKey: 'guarantortax.' + d.key + suffixKey,
      value: d
    }
  })
}
</script>

<style scoped lang="scss">
.spa {
  min-height: 2rem;
  @media all and (min-width: 768px) {
    width: 14rem;
  }
}
</style>
