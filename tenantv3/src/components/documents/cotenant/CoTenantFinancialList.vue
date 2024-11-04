<template>
  <div>
    <div v-if="editFinancialDocument">
      <CoTenantFinancialForm
        :coTenantId="coTenantId"
        v-model="financialDocument"
        :allowNoIncome="allowNoIncome()"
        @on-edit="setEditFinancialDocument"
        @on-next="goNext"
        @on-back="goBack"
      ></CoTenantFinancialForm>
    </div>
    <div v-else>
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <div>
          <h1 class="fr-h6">{{ t('cotenantfinanciallist.title') }}</h1>
          <div>{{ t('cotenantfinanciallist.subtitle') }}</div>
        </div>
      </NakedCard>
      <div v-for="f in tenantFinancialDocuments" :key="f.id">
        <CardRow
          @edit="selectFinancialDocument(f)"
          @remove="removeFinancial(f)"
          :danger="documentStatus(f) === 'DECLINED'"
        >
          <template v-slot:tag>
            <div class="fixed-width">
              <ColoredTag :text="getDocumentName(f)" :status="documentStatus(f)"></ColoredTag>
            </div>
          </template>
          <template v-slot:text>
            <div
              class="text-bold"
              :class="{ declined: documentStatus(f) }"
              :title="t('cotenantfinanciallist.net-monthly')"
              v-show="f.documentType.key !== 'no-income'"
            >
              {{ f.monthlySum }} {{ t('cotenantfinanciallist.monthly') }}
            </div>
          </template>
          <template v-slot:bottom>
            <AllDeclinedMessages
              class="fr-mb-3w"
              :documentDeniedReasons="documentDeniedReasons(f)"
              :documentStatus="documentStatus(f)"
            ></AllDeclinedMessages>
          </template>
        </CardRow>
      </div>
      <div v-if="financialDocument.documentType.key !== 'no-income'">
        <button @click="addFinancialDocument()" class="add-income-btn">
          {{ t('cotenantfinanciallist.add-income') }}
        </button>
      </div>
      <SimulationCaf class="fr-mt-4w" />
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FinancialDocument } from 'df-shared-next/src/models/FinancialDocument'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import ProfileFooter from '../../footer/ProfileFooter.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import CardRow from 'df-shared-next/src/components/CardRow.vue'
import CoTenantFinancialForm from './CoTenantFinancialForm.vue'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import SimulationCaf from '../share/SimulationCaf.vue'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useTenantStore from '@/stores/tenant-store'

const props = defineProps<{
  coTenantId: number
}>()
const { t } = useI18n()
const store = useTenantStore()
const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

const tenantFinancialDocuments = ref([] as FinancialDocument[])
const tenantOriginalDocuments = ref([] as DfDocument[])
const financialDocument = ref(new FinancialDocument())
const editFinancialDocument = ref(false)

function getOriginalDocuments(): DfDocument[] {
  const tenant = store.getTenant(Number(props.coTenantId))

  if (tenant.documents) {
    const docs = tenant.documents?.filter((d: DfDocument) => {
      return d.documentCategory === 'FINANCIAL'
    })
    if (docs !== undefined && docs.length > 0) {
      docs.sort((a: DfDocument, b: DfDocument) => {
        return (a?.id || 0) - (b?.id || 0)
      })
      return docs
    }
  }
  return []
}

function getTenantFinancialDocuments(documents: DfDocument[]): FinancialDocument[] {
  const financialDocuments: FinancialDocument[] = []
  if (documents.length > 0) {
    documents.forEach((d: DfDocument) => {
      const f = new FinancialDocument()
      f.noDocument = d.noDocument || false
      f.customText = d.customText || ''
      if (f.customText === '-') {
        f.customText = ''
      }
      f.monthlySum = d.monthlySum || 0
      f.id = d.id

      const localDoc = DocumentTypeConstants.FINANCIAL_DOCS.find((d2) => {
        return d2.value === d.documentSubCategory
      })
      if (localDoc !== undefined) {
        f.documentType = localDoc
      }
      financialDocuments.push(f)
    })
  }

  return financialDocuments
}

function setEditFinancialDocument(value: boolean) {
  editFinancialDocument.value = value
}

onBeforeMount(() => {
  initialize()
})

function hasNoIncome(financialDocuments?: FinancialDocument[]): boolean {
  return (
    (financialDocuments &&
      financialDocuments.length > 0 &&
      financialDocuments.find((f) => {
        return f.documentType && f.documentType.key !== 'no-income'
      }) === undefined) ||
    false
  )
}

function initialize() {
  tenantOriginalDocuments.value = getOriginalDocuments()
  tenantFinancialDocuments.value = getTenantFinancialDocuments(tenantOriginalDocuments.value)
  if (hasNoIncome(tenantFinancialDocuments.value)) {
    financialDocument.value =
      tenantFinancialDocuments.value.find((f) => {
        return f.documentType && f.documentType.key === 'no-income'
      }) || new FinancialDocument()
  } else {
    financialDocument.value = new FinancialDocument()
    editFinancialDocument.value = !hasFinancial()
  }
}

function documentDeniedReasons(f: FinancialDocument) {
  const d = tenantOriginalDocuments.value?.find((d: DfDocument) => f.id === d.id)

  return d ? d.documentDeniedReasons : null
}

function documentStatus(f: FinancialDocument) {
  const d = tenantOriginalDocuments.value?.find((d: DfDocument) => f.id === d.id)
  return d ? d.documentStatus : 'EMPTY'
}

function hasFinancial() {
  const tenant = store.getTenant(Number(props.coTenantId))
  if (tenant === undefined) {
    return false
  }
  const docs = tenant.documents?.filter((d: DfDocument) => {
    return d.documentCategory === 'FINANCIAL'
  })
  return docs?.length !== 0
}

function addFinancialDocument() {
  financialDocument.value = new FinancialDocument()
  editFinancialDocument.value = true
}

function selectFinancialDocument(f?: FinancialDocument) {
  financialDocument.value = f ? f : new FinancialDocument()
  editFinancialDocument.value = true
}

function removeFinancial(f?: FinancialDocument) {
  if (!f?.id) {
    return
  }
  const $loading = useLoading({})
  const loader = $loading.show()
  store
    .deleteDocument(f?.id)
    .then(
      () => {
        tenantFinancialDocuments.value = tenantFinancialDocuments.value?.filter(
          (d) => d.id != f?.id
        )
      },
      () => {
        ToastService.error()
      }
    )
    .finally(() => {
      loader.hide()
      initialize()
    })
}

function goBack() {
  emit('on-back')
}

function goNext() {
  if (editFinancialDocument.value) {
    editFinancialDocument.value = false
    initialize()
  } else {
    emit('on-next')
  }
}

function getDocumentName(document: FinancialDocument): string {
  return t(`documents.${document.documentType.key}`).toString()
}

function allowNoIncome(): boolean {
  return !hasFinancial() || financialDocument.value?.documentType?.key === 'no-income'
}
</script>

<style scoped lang="scss">
.add-income-btn {
  border-radius: 0.5rem;
  padding: 1.75rem;
  color: var(--primary);
  border: 1px solid var(--primary);
  width: 100%;
  font-size: 16px;
  background: var(--blue-france-925);
  &:hover {
    background: var(--blue-france-hover);
  }
  &:active {
    background: var(--blue-france-active);
  }
}

.fixed-width {
  width: 180px;
}
</style>
