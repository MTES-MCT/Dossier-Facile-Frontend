<template>
  <div>
    <DocumentDownloader
      :coTenantId="coTenantId"
      :documentsDefinitions="documentsDefinitions"
      documentCategory="RESIDENCY"
      listType="dropDownList"
      dispatchMethodName="saveTenantResidency"
      typeDocument="typeDocumentResidency"
      :showDownloader="showDownloader"
      @on-change-document="changeDocument"
    >
      <template v-slot:title>
        {{ t('cotenantresidency.title') }}
      </template>
      <template v-slot:after-select-block>
        <NakedCard
          class="fr-p-md-5w fr-mb-3w fr-mt-3w"
          v-if="documentType.key === 'other-residency'"
        >
          <div class="fr-alert fr-alert--warning fr-mb-3w">
            {{ t('residency-page.warning-other-residency') }}
          </div>
          <div class="fr-input-group">
            <label class="fr-label" for="customText">{{ t('residency-page.custom-text') }}</label>
            <Field
              name="customText"
              v-model="document.customText"
              v-slot="{ field, meta, errors }"
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
                placeholder=""
                type="text"
                required
                maxlength="2000"
                rows="4"
              ></textarea>
              <div v-if="errors[0]">
                <span role="alert" class="fr-error-text">{{ t(errors[0] || '') }}</span>
              </div>
            </Field>
          </div>
        </NakedCard>
      </template>
    </DocumentDownloader>
    <FooterContainer>
      <BackNext
        :showBack="true"
        @on-next="(documentType.key !== 'other-residency' || !invalidCustomText) && goNext()"
        @on-back="goBack()"
      >
      </BackNext>
    </FooterContainer>
  </div>
</template>

<script setup lang="ts">
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import DocumentDownloader from './DocumentDownloader.vue'
import { DocumentType } from 'df-shared-next/src/models/Document'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import FooterContainer from '@/components/footer/FooterContainer.vue'
import BackNext from '@/components/footer/BackNext.vue'
import { DocumentService } from '@/services/DocumentService'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { ref } from 'vue'
import useTenantStore from '@/stores/tenant-store'
import { Field, useFieldError } from 'vee-validate'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const invalidCustomText = useFieldError('customText')

const props = defineProps<{
  coTenantId: number
}>()
const store = useTenantStore()
const emit = defineEmits(['on-back', 'on-next'])

const documentsDefinitions = DocumentTypeConstants.RESIDENCY_DOCS
const documentType = ref(new DocumentType())
const document = ref(new DfDocument())
const showDownloader = ref(false)

function changeDocument(docType: DocumentType, doc: DfDocument) {
  documentType.value = docType
  document.value = doc as DfDocument
  document.value.noDocument = docType?.key === 'other-residency'
  showDownloader.value = docType?.key !== 'other-residency'
}

function goBack() {
  emit('on-back')
}

function goNext() {
  if (documentType.value?.key !== 'other-residency' || documentHasNotChanged()) {
    emit('on-next')
    return true
  }

  if (!document.value.customText) {
    return
  }

  const formData = new FormData()
  formData.append('noDocument', 'true')
  formData.append('customText', document.value.customText)
  formData.append('typeDocumentResidency', documentType.value?.value)

  if (document.value.id && document.value.id > 0) {
    formData.append('id', document.value.id.toString())
  }
  formData.append('tenantId', props.coTenantId.toString())
  const $loading = useLoading({})
  const loader = $loading.show()

  store
    .saveTenantResidency(formData)
    .then(() => {
      ToastService.saveSuccess()
      emit('on-next')
    })
    .catch(() => {
      ToastService.saveFailed()
    })
    .finally(() => {
      loader.hide()
    })
}

function documentHasNotChanged() {
  const doc = DocumentService.getCoTenantDocument(props.coTenantId, 'RESIDENCY')
  return (
    documentType.value?.value === doc?.documentSubCategory && document.value.customText === doc?.customText
  )
}
</script>
