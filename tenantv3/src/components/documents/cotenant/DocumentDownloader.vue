<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6">
          <slot name="title"></slot>
        </h1>
        <slot name="description"></slot>

        <div class="fr-mt-3w">
          <div v-if="listType == 'dropDownList'">
            <select
              :value="document.key"
              @change="onSelectChange($event.target)"
              class="fr-select fr-mb-3w fr-mt-3w"
              id="select"
              as="select"
            >
              <option v-if="!document.key" selected disabled></option>
              <option v-for="d in documentsDefinitions" :value="d.key" :key="d.key">
                {{ $t(d.key) }}
              </option>
            </select>
          </div>
          <SimpleRadioButtons
            v-if="listType !== 'dropDownList'"
            name="application-type-selector"
            :value="document"
            @input="onEventChange($event)"
            :elements="mapDocuments()"
          ></SimpleRadioButtons>
        </div>
      </div>
    </NakedCard>
    <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ $t('documentdownloader.will-delete-files') }}</span>
    </ConfirmModal>

    <slot name="after-select-block"></slot>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="showDownloader && (document.key || documentFiles.length > 0)"
    >
      <div class="fr-mb-3w">
        <p v-html="$t(`explanation-text.cotenant.${document.key}`)"></p>
      </div>
      <WarningTaxDeclaration class="fr-mb-3w" v-if="document.key === 'my-name'" />

      <AllDeclinedMessages
        class="fr-mb-3w"
        :user-id="selectedCoTenant?.id"
        :document="dfDocument"
        :documentDeniedReasons="documentDeniedReasons"
        :documentStatus="documentStatus"
      ></AllDeclinedMessages>

      <div v-if="!noDocument || forceShowDownloader">
        <div v-if="documentFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
          <ListItem
            v-for="(file, k) in documentFiles()"
            :key="k"
            :file="file"
            @remove="remove(file)"
          />
        </div>

        <div class="fr-mb-3w">
          <FileUpload
            :current-status="fileUploadStatus"
            :page="4"
            @add-files="addFiles"
            @reset-files="resetFiles"
          ></FileUpload>
        </div>
      </div>
      <div v-if="allowNoDocument" class="fr-col-12 fr-mb-3w bg-purple fr-checkbox-group">
        <input
          type="checkbox"
          id="noDocument"
          v-model="noDocument"
          value="false"
          @click="changeNoDocument($event)"
        />
        <label for="noDocument">
          {{
            document
              ? $t('noDocument-' + document.key)
              : $t('documentdownloader.noDocument-default')
          }}
        </label>
      </div>

      <div
        class="fr-mb-5w"
        v-if="!forceShowDownloader && (dfDocument ? dfDocument.noDocument : null)"
      >
        <div class="fr-input-group">
          <label class="fr-label" for="customText">
            {{ $t(`cotenantfinancialform.customText-${document.key}`) }}
          </label>
          <Field
            name="customText"
            v-model="dfDocument.customText"
            v-slot="{ field, meta }"
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
              id="customText"
              name="customText"
              placeholder=""
              type="text"
              maxlength="2000"
              rows="3"
              required
            />
            <span
              >{{ dfDocument ? (dfDocument.customText ? dfDocument.customText.length : 0) : 0 }} /
              2000</span
            >
          </Field>
          <ErrorMessage name="customText" v-slot="{ message }">
            <span role="alert" class="fr-error-text">{{ $t(message || '') }}</span>
          </ErrorMessage>
        </div>
      </div>

      <slot name="after-downloader"></slot>
    </NakedCard>
    <Modal v-show="showIsNoDocumentAndFiles" @close="showIsNoDocumentAndFiles = false">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ $t('documentdownloader.warning-no-document-and-files') }}
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
      <template v-slot:body>
        <div class="warning-tax-modal fr-pl-md-3w fr-pr-md-3w fr-pb-md-3w">
          <h1 class="avis-title fr-h4">
            <i class="ri-alarm-warning-line"></i>

            {{ $t('tax-page.avis-detected') }}
          </h1>
          <p>
            {{ $t('tax-page.avis-text1') }}
          </p>
          <hr class="mobile" />
          <div class="btn-align">
            <DfButton @on-click="isWarningTaxSituationModalVisible = false" :primary="true">{{
              $t('tax-page.avis-btn')
            }}</DfButton>
          </div>
          <div class="btn-align fr-mt-2w">
            <a
              href="https://docs.dossierfacile.logement.gouv.fr/article/88-avis-dimposition"
              rel="noopener"
              target="_blank"
              >{{ $t('tax-page.avis-link-to-doc') }}</a
            >
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { RegisterService } from '@/services/RegisterService'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { DfFile } from 'df-shared-next/src/models/DfFile'
import { DocumentType } from 'df-shared-next/src/models/Document'
import { DocumentDeniedReasons } from 'df-shared-next/src/models/DocumentDeniedReasons'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { User } from 'df-shared-next/src/models/User'
import { cloneDeep } from 'lodash'
import FileUpload from '../../uploads/FileUpload.vue'
import ListItem from '../../uploads/ListItem.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import DfButton from 'df-shared-next/src/Button/Button.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import Modal from 'df-shared-next/src/components/Modal.vue'
import { UtilsService } from '@/services/UtilsService'
import { PdfAnalysisService } from '../../../services/PdfAnalysisService'
import WarningTaxDeclaration from '@/components/documents/share/WarningTaxDeclaration.vue'
import SimpleRadioButtons from 'df-shared-next/src/Button/SimpleRadioButtons.vue'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { computed, onBeforeMount, ref } from 'vue'
import useTenantStore from '@/stores/tenant-store'
import { Field, ErrorMessage } from 'vee-validate'
import { AnalyticsService } from '../../../services/AnalyticsService'

const store = useTenantStore()

const props = withDefaults(
  defineProps<{
    coTenantId: number
    documentsDefinitions: any
    documentCategory: string
    editedDocumentId?: number
    dispatchMethodName: string
    typeDocument: string
    listType?: string
    showDownloader?: boolean
    allowNoDocument?: boolean
    forceShowDownloader?: boolean
    testAvisSituation?: boolean
    translationKeyPrefix?: string
  }>(),
  {
    listType: 'default',
    showDownloader: true,
    allowNoDocument: false,
    forceShowDownloader: false,
    testAvisSituation: false,
    translationKeyPrefix: 'documents.'
  }
)

const localEditedDocumentId = ref(props.editedDocumentId)
const documentDeniedReasons = ref(new DocumentDeniedReasons())
const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const document = ref(new DocumentType())
const isDocDeleteVisible = ref(false)
const selectedCoTenant = ref(new User())

const dfDocument = ref(new DfDocument())
const noDocument = ref(false)
const showIsNoDocumentAndFiles = ref(false)
const newFiles = ref([] as File[])
const isWarningTaxSituationModalVisible = ref(false)

const emit = defineEmits(['on-change-document', 'enrich-form-data'])

var loader: any

onBeforeMount(() => {
  loadDocument()
  noDocument.value = dfDocument.value?.noDocument == true
})

function changeNoDocument(event: Event) {
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
function onSelectChange($event: any) {
  const d = props.documentsDefinitions.find((d: any) => d.key === $event?.value)
  onEventChange(d)
}

function onEventChange($event: any) {
  document.value = $event
  if (selectedCoTenant.value?.documents !== null) {
    const doc = getDocument()
    if (doc !== undefined) {
      isDocDeleteVisible.value =
        (doc.files?.length || 0) > 0 && doc.subCategory !== document.value.value
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
  return getDocument().files ? (getDocument().files as DfFile[]) : []
}

function loadDocument(forceLoadLast?: boolean) {
  selectedCoTenant.value = store.getTenant(Number(props.coTenantId))
  if (localEditedDocumentId.value) {
    const doc = selectedCoTenant.value.documents
      ? (selectedCoTenant.value.documents.find((d: DfDocument) => {
          return (
            d.documentCategory === props.documentCategory && d.id === localEditedDocumentId.value
          )
        }) as DfDocument)
      : undefined

    dfDocument.value = doc ? doc : new DfDocument()
    if (localEditedDocumentId.value == -1 && forceLoadLast) {
      const docs = selectedCoTenant.value.documents?.filter((d: DfDocument) => {
        return d.documentCategory === props.documentCategory
      }) as DfDocument[]

      dfDocument.value = docs[docs.length - 1]
      localEditedDocumentId.value = dfDocument.value.id
    }
  } else {
    const doc = selectedCoTenant.value.documents
      ? (selectedCoTenant.value.documents.find((d: DfDocument) => {
          return d.documentCategory === props.documentCategory
        }) as DfDocument)
      : undefined

    dfDocument.value = doc ? doc : new DfDocument()
  }

  // loadDocType
  const localDoc = props.documentsDefinitions.find((d: DocumentType) => {
    return d.value === dfDocument.value.subCategory
  })
  if (localDoc !== undefined) {
    document.value = localDoc
  }

  if (dfDocument.value?.documentDeniedReasons) {
    documentDeniedReasons.value = cloneDeep(
      dfDocument.value?.documentDeniedReasons
    ) as DocumentDeniedReasons
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
        return d.value === doc.subCategory
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
    saveNewFiles(false)
  }
}

function saveNewFiles(avisDetected: boolean) {
  const filesToAdd = Array.from(newFiles.value).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  if (!filesToAdd || filesToAdd.length <= 0) {
    return
  }
  const futurLength = filesToAdd.length + documentFiles().length
  if (document.value.maxFileCount && futurLength > document.value.maxFileCount) {
    ToastService.maxFileError(futurLength, document.value.maxFileCount)
    return
  }
  const formData = _buildFormData(filesToAdd, avisDetected)

  fileUploadStatus.value = UploadStatus.STATUS_SAVING

  showLoader()
  store
    .dispatchByName(props.dispatchMethodName, formData)
    .then(() => {
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      loadDocument(true)
      ToastService.saveSuccess()
    })
    .catch((err: any) => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      UtilsService.handleCommonSaveError(err)
    })
    .finally(() => {
      hideLoader()
    })
}

function _buildFormData(filesToAdd: any, avisDetected: boolean): FormData {
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
  if (avisDetected) {
    formData.append('avisDetected', 'true')
  } else {
    formData.append('avisDetected', 'false')
  }

  return formData
}

function resetFiles() {
  fileUploadStatus.value = UploadStatus.STATUS_INITIAL
}

function remove(file: DfFile) {
  if (file.id) {
    showLoader()
    RegisterService.deleteFileById(Number(file.id))
      .then(() => {
        dfDocument.value.files = dfDocument.value.files?.filter((f) => file.id != f.id)
        if (
          dfDocument.value.files?.length === 0 &&
          dfDocument.value.documentAnalysisReport?.analysisStatus === 'DENIED'
        ) {
          AnalyticsService.removeDeniedDocument(dfDocument.value.subCategory || '')
        }

        ToastService.saveSuccess()
      })
      .catch((err) => {
        console.log('Unable to delete last element?', err)
        ToastService.saveFailed()
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
  return props.documentsDefinitions.map((d: any) => {
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
