<template>
  <div>
    <NakedCard class="fr-p-md-5w fr-m-3v">
      <TenantBadge />
      <h1 class="fr-h6">
        <slot name="title"></slot>
      </h1>
      <slot name="description"></slot>

      <div class="fr-mt-3w">
        <div v-if="listType == 'dropDownList'">
          <select
            id="select"
            :value="document.key"
            class="fr-select fr-mb-3w fr-mt-3w"
            @change="onSelectChange($event.target)"
          >
            <option v-if="!document.key" selected disabled></option>
            <option v-for="d in documentsDefinitions" :key="d.key" :value="d.key">
              {{ t(translationKeyPrefix + d.key) }}
            </option>
          </select>
        </div>
        <SimpleRadioButtons
          v-if="listType !== 'dropDownList'"
          name="application-type-selector"
          :value="document"
          :elements="mapDocuments()"
          @input="onEventChange"
        ></SimpleRadioButtons>
      </div>
    </NakedCard>
    <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t('documentdownloader.will-delete-files') }}</span>
    </ConfirmModal>

    <slot name="after-select-block"></slot>
    <NakedCard
      v-if="showDownloader && (document.key || documentFiles.length > 0)"
      class="fr-p-md-5w fr-mt-md-3w"
    >
      <div class="fr-mb-3w">
        <p v-html="t(`explanation-text.cotenant.${document.key}`)"></p>
      </div>
      <WarningTaxDeclaration v-if="document.key === 'my-name'" class="fr-mb-3w" />

      <AllDeclinedMessages
        :user-id="selectedCoTenant?.id"
        :document="dfDocument"
        :document-denied-reasons="dfDocument?.documentDeniedReasons"
        :document-status="documentStatus"
      ></AllDeclinedMessages>

      <div v-if="!noDocument || forceShowDownloader">
        <div v-if="documentFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
          <ListItem
            v-for="file in documentFiles()"
            ref="list-item"
            :key="file.id"
            :file="file"
            :doc-category="analyticDocType"
            :watermark-url="documentWatermarkUrl"
            @remove="remove(file)"
          />
        </div>

        <div class="fr-mb-3w">
          <FileUpload
            ref="file-upload"
            :current-status="fileUploadStatus"
            :page="4"
            @add-files="addFiles"
          ></FileUpload>
        </div>
      </div>
      <div v-if="allowNoDocument" class="fr-col-12 fr-mb-3w bg-purple fr-checkbox-group">
        <input
          id="noDocument"
          v-model="noDocument"
          type="checkbox"
          value="false"
          @click="changeNoDocument"
        />
        <label for="noDocument">
          {{
            document ? t('noDocument-' + document.key) : t('documentdownloader.noDocument-default')
          }}
        </label>
      </div>

      <div
        v-if="!forceShowDownloader && (dfDocument ? dfDocument.noDocument : null)"
        class="fr-mb-5w"
      >
        <div class="fr-input-group">
          <label class="fr-label" for="customText">
            {{ t(`cotenantfinancialform.customText-${document.key}`) }}
          </label>
          <Field
            v-slot="{ field, meta }"
            v-model="dfDocument.customText"
            name="customText"
            :rules="{
              required: true
            }"
          >
            <textarea
              v-bind="field"
              id="customText"
              class="form-control fr-input validate-required"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
              name="customText"
              placeholder=""
              maxlength="2000"
              rows="3"
              required
            />
            <span
              >{{ dfDocument ? (dfDocument.customText ? dfDocument.customText.length : 0) : 0 }} /
              2000</span
            >
          </Field>
          <ErrorMessage v-slot="{ message }" name="customText">
            <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
          </ErrorMessage>
        </div>
      </div>

      <slot name="after-downloader"></slot>
    </NakedCard>
    <Modal v-show="showIsNoDocumentAndFiles" @close="showIsNoDocumentAndFiles = false">
      <template #body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ t('documentdownloader.warning-no-document-and-files') }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
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
import WarningTaxDeclaration from '@/components/documents/share/WarningTaxDeclaration.vue'
import {
  DocumentType as DocumentTypeEnum,
  DocumentTypeTranslations
} from '@/components/editmenu/documents/DocumentType'
import { RegisterService } from '@/services/RegisterService'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore, type DispatchNames } from '@/stores/tenant-store'
import { RiAlarmWarningLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import SimpleRadioButtons from 'df-shared-next/src/Button/SimpleRadioButtons.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import Modal from 'df-shared-next/src/components/ModalComponent.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { DfFile } from 'df-shared-next/src/models/DfFile'
import { DocumentType } from 'df-shared-next/src/models/Document'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { User } from 'df-shared-next/src/models/User'
import { ErrorMessage, Field } from 'vee-validate'
import { computed, onBeforeMount, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading, type ActiveLoader } from 'vue-loading-overlay'
import { AnalyticsService, type DocumentCategory } from '../../../services/AnalyticsService'
import { PdfAnalysisService } from '../../../services/PdfAnalysisService'
import FileUpload from '../../uploads/FileUpload.vue'
import ListItem from '../../uploads/ListItem.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import TenantBadge from '@/components/common/TenantBadge.vue'
import { toast } from '@/components/toast/toastUtils'

const { t } = useI18n()
const store = useTenantStore()

const props = withDefaults(
  defineProps<{
    coTenantId: number
    documentsDefinitions: DocumentType[]
    documentCategory: DocumentTypeEnum
    editedDocumentId?: number
    dispatchMethodName: DispatchNames
    typeDocument: string
    listType?: string
    showDownloader?: boolean
    allowNoDocument?: boolean
    forceShowDownloader?: boolean
    testAvisSituation?: boolean
    translationKeyPrefix?: string
  }>(),
  {
    editedDocumentId: undefined,
    listType: 'default',
    showDownloader: true,
    allowNoDocument: false,
    forceShowDownloader: false,
    testAvisSituation: false,
    translationKeyPrefix: 'documents.'
  }
)

const localEditedDocumentId = ref(props.editedDocumentId)
const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const document = ref(new DocumentType())
const isDocDeleteVisible = ref(false)
const selectedCoTenant = ref<CoTenant>(new User())

const dfDocument = ref(new DfDocument())
const noDocument = ref(false)
const showIsNoDocumentAndFiles = ref(false)
const newFiles = ref([] as File[])
const isWarningTaxSituationModalVisible = ref(false)

const fileUpload = useTemplateRef('file-upload')
const listItem = useTemplateRef('list-item')

const emit = defineEmits<{
  'on-change-document': [doc: DocumentType, dfDoc: DfDocument]
  'enrich-form-data': [formData: FormData]
}>()

let loader: ActiveLoader | undefined

onBeforeMount(() => {
  loadDocument()
  noDocument.value = dfDocument.value?.noDocument == true
})

function changeNoDocument() {
  if (!noDocument.value && Number(dfDocument.value?.files?.length) > 0) {
    showIsNoDocumentAndFiles.value = true
    dfDocument.value.noDocument = noDocument.value
    return true
  } else {
    noDocument.value = !noDocument.value
    dfDocument.value.noDocument = noDocument.value
  }
  emit('on-change-document', document.value, dfDocument.value)
  return true
}
function onSelectChange(target: EventTarget | null) {
  const value = target instanceof HTMLSelectElement ? target.value : null
  const d = props.documentsDefinitions.find((d) => d.key === value)
  if (d) {
    onEventChange(d)
  }
}

function onEventChange($event: DocumentType) {
  document.value = $event
  if (selectedCoTenant.value?.documents !== null) {
    const doc = getDocument()
    if (doc !== undefined) {
      isDocDeleteVisible.value =
        (doc.files?.length || 0) > 0 && doc.documentSubCategory !== document.value.value
    }
  }
  emit('on-change-document', document.value, dfDocument.value)
  // why ? no
  noDocument.value = dfDocument.value?.noDocument == true
  return false
}

const documentStatus = computed(() => {
  return getDocument()?.documentStatus
})
function documentFiles(): DfFile[] {
  return getDocument().files ?? []
}

const documentWatermarkUrl = computed(() => {
  return getDocument()?.name
})

const analyticDocType = computed<DocumentCategory>(() => {
  const translation = DocumentTypeTranslations[props.documentCategory]

  return `cotenant-${translation}`
})

function loadDocument(forceLoadLast?: boolean) {
  selectedCoTenant.value = store.getTenant(Number(props.coTenantId))
  if (localEditedDocumentId.value) {
    const doc = selectedCoTenant.value.documents
      ? selectedCoTenant.value.documents.find((d: DfDocument) => {
          return (
            d.documentCategory === props.documentCategory && d.id === localEditedDocumentId.value
          )
        })
      : undefined

    dfDocument.value = doc ? doc : new DfDocument()
    if (localEditedDocumentId.value == -1 && forceLoadLast) {
      const docs =
        selectedCoTenant.value.documents?.filter((d: DfDocument) => {
          return d.documentCategory === props.documentCategory
        }) || []

      dfDocument.value = docs[docs.length - 1]
      localEditedDocumentId.value = dfDocument.value.id
    }
  } else {
    const doc = selectedCoTenant.value.documents
      ? selectedCoTenant.value.documents.find((d: DfDocument) => {
          return d.documentCategory === props.documentCategory
        })
      : undefined

    dfDocument.value = doc ? doc : new DfDocument()
  }

  // loadDocType
  const localDoc = props.documentsDefinitions.find((d: DocumentType) => {
    return d.value === dfDocument.value.documentSubCategory
  })
  if (localDoc !== undefined) {
    document.value = localDoc
  }

  emit('on-change-document', document.value, dfDocument.value)
}

function getDocument(): DfDocument {
  return dfDocument.value
}

function undoSelect() {
  if (selectedCoTenant.value?.documents !== null) {
    const doc = getDocument()
    if (doc !== undefined) {
      const localDoc = props.documentsDefinitions.find((d: DocumentType) => {
        return d.value === doc.documentSubCategory
      })
      if (localDoc !== undefined) {
        document.value = localDoc
      }
    }
  }
  isDocDeleteVisible.value = false
}

function validSelect() {
  isDocDeleteVisible.value = false
  if (selectedCoTenant.value.documents !== null) {
    const doc = getDocument()
    if (doc?.files !== undefined) {
      for (const f of doc.files) {
        if (f.id) {
          remove(f)
        }
      }
    }
    doc.customText = undefined
    localEditedDocumentId.value = -1
  }
}

async function addFiles(fileList: File[]) {
  newFiles.value = fileList
  showLoader()
  if (
    props.testAvisSituation &&
    (await PdfAnalysisService.includesRejectedTaxDocuments(fileList))
  ) {
    isWarningTaxSituationModalVisible.value = true
    hideLoader()
  } else {
    saveNewFiles()
  }
}

function saveNewFiles() {
  const filesToAdd = Array.from(newFiles.value).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  if (!filesToAdd || filesToAdd.length <= 0) {
    return
  }
  const futurLength = filesToAdd.length + documentFiles().length
  if (document.value.maxFileCount && futurLength > document.value.maxFileCount) {
    toast.maxFileError(futurLength, document.value.maxFileCount, fileUpload.value?.inputFile)
    return
  }
  const formData = _buildFormData(filesToAdd)

  fileUploadStatus.value = UploadStatus.STATUS_SAVING

  showLoader()
  store
    .dispatchByName(props.dispatchMethodName, formData)
    .then(() => {
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      loadDocument(true)
      toast.success(t('save-success'), fileUpload.value?.inputFile)
    })
    .catch((err: unknown) => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      UtilsService.handleCommonSaveError(err, fileUpload.value?.inputFile)
    })
    .finally(() => {
      hideLoader()
    })
}

function _buildFormData(filesToAdd: { file: File; name: string }[]): FormData {
  const formData = new FormData()
  const fieldName = 'documents'
  Array.from(Array(filesToAdd.length).keys()).forEach((x) => {
    const f: File = filesToAdd[x].file || new File([], '')
    formData.append(`${fieldName}[${x}]`, f, filesToAdd[x].name)
  })

  formData.append(props.typeDocument, document.value.value)
  formData.append('tenantId', props.coTenantId.toString())
  if (localEditedDocumentId.value && localEditedDocumentId.value > 0) {
    formData.append('id', localEditedDocumentId.value.toString())
  }
  emit('enrich-form-data', formData)
  formData.append('avisDetected', 'false')

  return formData
}

function remove(file: DfFile) {
  AnalyticsService.deleteFile(analyticDocType.value)
  if (file.id) {
    showLoader()
    RegisterService.deleteFileById(Number(file.id))
      .then(() => {
        dfDocument.value.files = dfDocument.value.files?.filter((f) => file.id != f.id)
        if (
          dfDocument.value.files?.length === 0 &&
          dfDocument.value.documentAnalysisReport?.analysisStatus === 'DENIED'
        ) {
          AnalyticsService.removeDeniedDocument(dfDocument.value.documentSubCategory || '')
        }

        toast.success(t('save-success'), fileUpload.value?.inputFile)
      })
      .catch((err) => {
        console.log('Unable to delete last element?', err)
        const index = (dfDocument.value.files || []).findIndex((f) => f.id === file.id)
        toast.error(t('delete-file-failed'), listItem.value?.at(index)?.removeButton)
      })
      .finally(() => {
        hideLoader()
      })
  }
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
  return props.documentsDefinitions.map((d) => {
    return {
      id: d.key,
      labelKey: props.translationKeyPrefix + d.key,
      value: d
    }
  })
}
</script>

<style scoped lang="scss">
table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid #ececec;
}
.spa {
  height: 3rem;
  @media all and (min-width: 768px) {
    width: 14rem;
  }
}
</style>
