<template>
  <div>
    <Form name="form" @submit="goNext">
      <DocumentDownloader
        :co-tenant-id="coTenantId"
        :documents-definitions="documentsDefinitions()"
        :edited-document-id="modelValue.id ? modelValue.id : -1"
        :document-category="DocumentTypeEnum.FINANCIAL"
        dispatch-method-name="saveTenantFinancial"
        type-document="typeDocumentFinancial"
        :show-downloader="showDownloader"
        :allow-no-document="true"
        @enrich-form-data="enrichFormData"
        @on-change-document="changeDocument"
      >
        <template #title>
          {{ t('cotenantfinancialform.title') }}
        </template>
        <template #after-select-block>
          <NakedCard
            v-if="documentType && documentType.key ? documentType.key !== 'no-income' : false"
            class="fr-p-md-5w fr-mb-3w fr-mt-3w"
          >
            <div>
              <div class="fr-input-group">
                <Field
                  v-slot="{ field, meta }"
                  name="monthlySum"
                  :value="modelValue.monthlySum"
                  :rules="{
                    required: true,
                    regex: /^[0-9 ]+$/
                  }"
                  @input="setMonthlySum($event)"
                >
                  <label for="monthlySum" class="fr-label"> {{ getMonthlySumLabel() }} : </label>
                  <input
                    id="monthlySum"
                    :placeholder="t('cotenantfinancialform.monthlySum.placeholder')"
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
                <ErrorMessage v-slot="{ message }" name="monthlySum">
                  <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
                </ErrorMessage>
                <span
                  v-if="
                    modelValue
                      ? modelValue.monthlySum
                        ? modelValue.monthlySum > 10000
                        : false
                      : false
                  "
                  class="fr-error-text"
                >
                  {{ t('cotenantfinancialform.high-salary') }}
                </span>
              </div>
            </div>
          </NakedCard>

          <NakedCard
            v-else-if="documentType ? documentType.key === 'no-income' : false"
            class="fr-p-md-5w fr-mb-3w fr-mt-3w"
          >
            <div class="fr-input-group">
              <label class="fr-label" for="customTextNoDocument">
                {{ t('cotenantfinancialform.has-no-income') }}
              </label>
              <Field
                v-slot="{ field, meta }"
                v-model="document.customText"
                name="customTextNoDocument"
              >
                <textarea
                  v-bind="field"
                  id="customTextNoDocument"
                  maxlength="2000"
                  rows="3"
                  class="form-control fr-input validate-required"
                  :class="{
                    'fr-input--valid': meta.valid
                  }"
                  name="customText"
                  placeholder=""
                  type="text"
                />
                <span
                  >{{ document && document.customText ? document.customText.length : 0 }} /
                  2000</span
                >
              </Field>
              <ErrorMessage v-slot="{ message }" name="customTextNoDocument">
                <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
              </ErrorMessage>
            </div>
          </NakedCard>
        </template>
        <template #after-downloader> </template>
      </DocumentDownloader>
      <FooterContainer>
        <BackNext :show-back="true" @on-back="goBack"> </BackNext>
      </FooterContainer>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { DocumentType as DocumentTypeEnum } from '@/components/editmenu/documents/DocumentType'
import { ToastService } from '@/services/ToastService'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore } from '@/stores/tenant-store'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { DocumentType } from 'df-shared-next/src/models/Document'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading } from 'vue-loading-overlay'
import BackNext from '../../footer/BackNext.vue'
import FooterContainer from '../../footer/FooterContainer.vue'
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import DocumentDownloader from './DocumentDownloader.vue'
const store = useTenantStore()
const emit = defineEmits<{ 'on-next': []; 'on-back': []; 'update:modelValue': [doc: DfDocument] }>()
const { t } = useI18n()

const props = defineProps<{
  coTenantId: number
  modelValue: DfDocument
  allowNoIncome: boolean
}>()

const documentType = ref(new DocumentType())
const document = ref(new DfDocument())
const showDownloader = ref(false)

function documentsDefinitions() {
  return DocumentTypeConstants.FINANCIAL_DOCS.filter((d: DocumentType) => {
    return d.key !== 'no-income' || props.allowNoIncome
  })
}

function changeDocument(docType: DocumentType, doc: DfDocument) {
  if (!docType) {
    return
  }

  documentType.value = docType
  document.value = doc
  updateMonthlySum()
}

function updateMonthlySum() {
  showDownloader.value = Boolean(
    documentType.value?.key &&
      documentType.value?.key !== 'no-income' &&
      !!props.modelValue.monthlySum &&
      props.modelValue.monthlySum >= 0
  )
}

function enrichFormData(formData: FormData) {
  if (documentType.value?.key === 'no-income') {
    document.value.noDocument = true
    document.value.monthlySum = 0
  }
  formData.append('noDocument', document.value?.noDocument === true ? 'true' : 'false')
  if (documentType.value?.key === 'no-income' && !document.value.customText) {
    formData.append('customText', '-')
  } else if (document.value.customText) {
    formData.append('customText', document.value.customText)
  }
  if (props.modelValue.monthlySum !== undefined && props.modelValue.monthlySum >= 0) {
    formData.append('monthlySum', props.modelValue.monthlySum.toString())
  }
}

function setMonthlySum($event: Event & { target: { value: string } }) {
  document.value.monthlySum = Math.trunc(Number($event.target.value.replace(/\s+/g, '')))
  emit('update:modelValue', document.value)
  updateMonthlySum()
}

function getMonthlySumLabel() {
  const docType = documentType.value?.key
  let label = t('cotenantfinancialform.monthlySum.label')
  if (docType === 'salary' || docType === 'pension' || docType === 'rent') {
    label += ' '
    label += t('cotenantfinancialform.monthlySum.label-tax')
  }
  return label
}

function goBack() {
  emit('on-back')
}

function goNext() {
  // push data if there is not files in documents - noDocument
  // TODO : we should have local value for monthlySum and customText and check for update
  // to know if we have to save or not
  if (
    document.value?.noDocument === true ||
    documentType.value?.key === 'no-income' ||
    (props.modelValue.monthlySum !== undefined && props.modelValue.monthlySum > 0) ||
    (document.value.customText !== undefined && document.value.customText.length > 0)
  ) {
    if (!document.value.noDocument) {
      if (!document.value.files?.length && documentType.value?.key !== 'no-income') {
        ToastService.error('financialdocumentform.missing-file')
        document.value.files = []
        return false
      }
    }

    const formData = new FormData()
    enrichFormData(formData)

    formData.append('typeDocumentFinancial', documentType.value?.value)
    if (document.value.id && document.value.id > 0) {
      formData.append('id', document.value.id.toString())
    }
    formData.append('tenantId', props.coTenantId.toString())
    const $loading = useLoading({})
    const loader = $loading.show()

    store
      .saveTenantFinancial(formData)
      .then(() => {
        ToastService.saveSuccess()
      })
      .catch((err) => {
        UtilsService.handleCommonSaveError(err)
      })
      .finally(() => {
        loader.hide()
        emit('on-next')
      })
  } else {
    emit('on-next')
  }
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
</style>
