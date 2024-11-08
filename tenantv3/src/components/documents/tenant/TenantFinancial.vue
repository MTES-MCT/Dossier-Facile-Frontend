<template>
  <div>
    <div v-if="editFinancialDocument">
      <FinancialDocumentForm></FinancialDocumentForm>
    </div>
    <div v-if="!editFinancialDocument">
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <div>
          <h1 class="fr-h6">{{ t('financial-page.title') }}</h1>
          <div>{{ t('financial-page.subtitle') }}</div>
        </div>
      </NakedCard>
      <div v-for="(f, k) in financialDocuments" :key="k">
        <CardRow
          @edit="selectFinancialDocument(f)"
          @remove="removeFinancial(f)"
          :danger="tenantFinancialDocument(f)?.documentStatus === 'DECLINED'"
        >
          <template #tag>
            <div class="fixed-width">
              <ColoredTag
                :text="getDocumentName(f)"
                :status="tenantFinancialDocument(f)?.documentStatus"
              ></ColoredTag>
            </div>
          </template>
          <template #text>
            <div
              class="text-bold"
              :class="{ declined: tenantFinancialDocument(f)?.documentStatus }"
              :title="t('financial-page.net-monthly')"
              v-show="f.documentType.key !== 'no-income'"
            >
              {{ f.monthlySum }} {{ t('financial-page.monthly') }}
            </div>
          </template>
          <template #bottom>
            <AllDeclinedMessages
              class="fr-mb-3w"
              :document-denied-reasons="documentDeniedReasons(f)"
              :document-status="documentStatus(f)"
            ></AllDeclinedMessages>
          </template>
        </CardRow>
      </div>
      <div>
        <button @click="addAndSelectFinancial()" v-if="!hasNoIncome()" class="add-income-btn">
          {{ t('financial-page.add-income') }}
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
import ProfileFooter from '../../footer/ProfileFooter.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import CardRow from 'df-shared-next/src/components/CardRow.vue'
import FinancialDocumentForm from './FinancialDocumentForm.vue'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import SimulationCaf from '../share/SimulationCaf.vue'
import { computed, onBeforeMount } from 'vue'
import useTenantStore from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'

const { t } = useI18n()
const store = useTenantStore()
const editFinancialDocument = computed(() => store.editFinancialDocument)
const financialDocuments = computed(() => store.tenantFinancialDocuments)

const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

onBeforeMount(() => {
  initialize()
})

function documentDeniedReasons(f: FinancialDocument) {
  return tenantFinancialDocument(f)?.documentDeniedReasons
}

function documentStatus(f: FinancialDocument) {
  return tenantFinancialDocument(f)?.documentStatus
}

function initialize() {
  store.selectDocumentFinancial(undefined)
  if (financialDocuments.value.length === 0) {
    addAndSelectFinancial()
  }
}

function tenantFinancialDocument(f: FinancialDocument) {
  return store.getTenantDocuments?.find((d: DfDocument) => {
    return d.id === f.id
  })
}

async function addAndSelectFinancial() {
  await store.createDocumentFinancial()
}

function removeFinancial(f: DfDocument) {
  if (f.id === undefined) {
    return
  }
  const $loading = useLoading({})
  const loader = $loading.show()
  store
    .deleteDocument(f.id)
    .then(null, () => {
      ToastService.error()
    })
    .finally(() => {
      loader.hide()
      initialize()
    })
  store.selectDocumentFinancial(undefined)
}

function hasNoIncome() {
  return (
    financialDocuments.value.length > 0 &&
    financialDocuments.value.find((f) => {
      return f.documentType && f.documentType.key !== 'no-income'
    }) === undefined
  )
}

function goBack() {
  emit('on-back')
}

function goNext() {
  emit('on-next')
}

async function selectFinancialDocument(f: FinancialDocument) {
  await store.selectDocumentFinancial(f)
}

function getDocumentName(document: FinancialDocument): string {
  return t(`documents.${document.documentType.key}`).toString()
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
