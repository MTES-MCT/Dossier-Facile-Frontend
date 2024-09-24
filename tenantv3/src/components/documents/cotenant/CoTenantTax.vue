<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      documentCategory="TAX"
      dispatchMethodName="saveTenantTax"
      typeDocument="typeDocumentTax"
      translationKeyPrefix="cotenanttax."
      listType="grid"
      :showDownloader="showDownloader"
      :forceShowDownloader="forceShowDownloader"
      :testAvisSituation="true"
      @on-change-document="changeDocument"
      @enrich-form-data="enrichFormData"
    >
      <template v-slot:title>
        {{ t('cotenanttax.title') }}
      </template>
      <template v-slot:after-select-block>
        <NakedCard
          class="fr-p-md-5w fr-mb-3w fr-mt-3w"
          v-if="documentType ? documentType.key === 'other-tax' : false"
        >
          <div class="fr-input-group">
            <label class="fr-label" for="customText">{{ t('cotenanttax.custom-text') }}</label>
            <textarea
              v-model="document.customText"
              class="form-control fr-input validate-required"
              id="customText"
              name="customText"
              placeholder=""
              type="text"
              required
              maxlength="2000"
              rows="4"
            />
          </div>
        </NakedCard>
      </template>
    </DocumentDownloader>
    <FooterContainer>
      <BackNext :showBack="true" @on-next="goNext" @on-back="goBack"> </BackNext>
    </FooterContainer>
  </div>
</template>

<script setup lang="ts">
import { DocumentType } from 'df-shared-next/src/models/Document'
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import DocumentDownloader from './DocumentDownloader.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import FooterContainer from '../../footer/FooterContainer.vue'
import BackNext from '../../footer/BackNext.vue'
import { UtilsService } from '@/services/UtilsService'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import useTenantStore from '@/stores/tenant-store'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const documentsDefinitions = DocumentTypeConstants.TAX_DOCS

const props = defineProps<{
  coTenantId: number
}>()
const emit = defineEmits(['on-back', 'on-next'])
const store = useTenantStore()
const { t } = useI18n()

const documentType = ref(new DocumentType())
const showDownloader = ref(false)
const forceShowDownloader = ref(false)
const document = ref(new DfDocument())

function changeDocument(docType?: DocumentType, doc?: DfDocument) {
  if (docType) {
    documentType.value = docType
  }
  document.value = doc as DfDocument
  showDownloader.value = documentType.value?.key === 'my-name'
  forceShowDownloader.value = documentType.value?.key === 'my-name'
}

function enrichFormData(formData: FormData) {
  if (documentType.value?.key === 'my-name') {
    formData.append('noDocument', 'false')
  } else {
    formData.append('noDocument', 'true')
  }
}

function goBack() {
  emit('on-back')
}

function getRegisteredDoc() {
  const coTenant = store.getTenant(Number(props.coTenantId))
  if (coTenant.documents !== null) {
    const doc = coTenant.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'TAX'
    })
    return doc
  }
  return undefined
}

function goNext() {
  const formData = new FormData()

  if (documentType.value?.key === 'other-tax') {
    if (document.value.customText) {
      formData.append('customText', document.value.customText)
    } else {
      // TODO : replace by form and validation
      ToastService.error('cotenanttax.custom-text-required')
      return
    }
  }

  enrichFormData(formData)

  const d = getRegisteredDoc()
  if (documentType.value?.value === d?.subCategory && document.value.customText === d?.customText) {
    emit('on-next')
    return true
  }

  formData.append('typeDocumentTax', documentType.value?.value as string)
  if (document.value.id && document.value.id > 0) {
    formData.append('id', document.value.id.toString())
  }
  formData.append('tenantId', props.coTenantId.toString())
  const $loading = useLoading({})
  const loader = $loading.show()

  store
    .saveTenantTax(formData)
    .then(() => {
      ToastService.saveSuccess()
      emit('on-next')
    })
    .catch((err) => {
      UtilsService.handleCommonSaveError(err)
    })
    .finally(() => {
      loader.hide()
    })
}
</script>
