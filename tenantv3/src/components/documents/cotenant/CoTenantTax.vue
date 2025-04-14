<template>
  <div>
    <DocumentDownloader
      :co-tenant-id="tenantId"
      :documents-definitions="documentsDefinitions"
      :document-category="DocumentTypeEnum.TAX"
      dispatch-method-name="saveTenantTax"
      type-document="typeDocumentTax"
      translation-key-prefix="cotenanttax."
      list-type="grid"
      :show-downloader="showDownloader"
      :force-show-downloader="forceShowDownloader"
      :test-avis-situation="true"
      @on-change-document="changeDocument"
      @enrich-form-data="enrichFormData"
    >
      <template #title>
        {{ t('cotenanttax.title') }}
      </template>
      <template #after-select-block>
        <NakedCard
          v-if="documentType ? documentType.key === 'other-tax' : false"
          class="fr-p-md-5w fr-mb-3w fr-mt-3w"
        >
          <div class="fr-input-group">
            <label class="fr-label" for="customText">{{ t('cotenanttax.custom-text') }}</label>
            <textarea
              id="customText"
              v-model="document.customText"
              class="form-control fr-input validate-required"
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
      <BackNext :show-back="true" @on-next="goNext" @on-back="goToFinancial"> </BackNext>
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
import { useTenantStore } from '@/stores/tenant-store'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { DocumentType as DocumentTypeEnum } from '@/components/editmenu/documents/DocumentType'
import { useRoute, useRouter } from 'vue-router'

const documentsDefinitions = DocumentTypeConstants.TAX_DOCS

const store = useTenantStore()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const documentType = ref(new DocumentType())
const showDownloader = ref(false)
const forceShowDownloader = ref(false)
const document = ref(new DfDocument())
const tenantId = computed(() => Number(route.params.tenantId))

function changeDocument(docType: DocumentType, doc: DfDocument) {
  if (docType) {
    documentType.value = docType
  }
  document.value = doc
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

function goToFinancial() {
  router.push({
    name: 'CoupleFinancial',
    params: {
      tenantId: tenantId.value
    }
  })
}

function getRegisteredDoc() {
  const coTenant = store.getTenant(tenantId.value)
  if (coTenant.documents !== null) {
    const doc = coTenant.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'TAX'
    })
    return doc
  }
  return undefined
}

function goToGuarantors() {
  router.push({
    name: 'TenantGuarantors',
    params: {
      tenantId: tenantId.value,
      step: '5'
    }
  })
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
  if (
    documentType.value?.value === d?.documentSubCategory &&
    document.value.customText === d?.customText
  ) {
    goToGuarantors()
    return true
  }

  formData.append('typeDocumentTax', documentType.value?.value)
  if (document.value.id && document.value.id > 0) {
    formData.append('id', document.value.id.toString())
  }
  formData.append('tenantId', String(tenantId.value))
  const $loading = useLoading({})
  const loader = $loading.show()

  store
    .saveTenantTax(formData)
    .then(() => {
      ToastService.saveSuccess()
      goToGuarantors()
    })
    .catch((err) => {
      UtilsService.handleCommonSaveError(err)
    })
    .finally(() => {
      loader.hide()
    })
}
</script>
