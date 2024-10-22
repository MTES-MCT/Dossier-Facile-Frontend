<template>
  <div>
    <div v-if="editFinancialDocument">
      <GuarantorFinancialDocumentForm :tenantId="tenantId"></GuarantorFinancialDocumentForm>
    </div>
    <div v-if="!editFinancialDocument">
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <div>
          <h1 class="fr-h6">{{ t('guarantorfinancial.title') }}</h1>
          <div>{{ t('guarantorfinancial.subtitle') }}</div>
        </div>
      </NakedCard>
      <div v-for="(f, k) in financialDocuments" :key="k">
        <CardRow
          @edit="selectFinancialDocument(f)"
          @remove="removeFinancial(f)"
          :danger="guarantorFinancialDocument(f)?.documentStatus === 'DECLINED'"
        >
          <template v-slot:tag>
            <div class="fixed-width">
              <ColoredTag
                :text="getDocumentName(f)"
                :status="guarantorFinancialDocument(f)?.documentStatus"
              ></ColoredTag>
            </div>
          </template>
          <template v-slot:text>
            <div
              class="text-bold"
              :title="t('guarantorfinancial.net-monthly')"
              v-show="f.documentType.key !== 'no-income'"
            >
              {{ f.monthlySum }} {{ t('guarantorfinancial.monthly') }}
            </div>
          </template>
          <template v-slot:bottom>
            <AllDeclinedMessages
              class="fr-mb-0"
              :user-id="user?.id"
              :document="f"
              :documentDeniedReasons="documentDeniedReasons(f)"
              :documentStatus="documentStatus(f)"
            ></AllDeclinedMessages>
          </template>
        </CardRow>
      </div>
      <div>
        <button @click="addAndSelectFinancial()" v-if="!hasNoIncome()" class="add-income-btn">
          {{ t('guarantorfinancial.add-income') }}
        </button>
      </div>
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
import GuarantorFinancialDocumentForm from './GuarantorFinancialDocumentForm.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import ColoredTag from 'df-shared-next/src/components/ColoredTag.vue'
import useTenantStore from '@/stores/tenant-store'
import { computed, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'

const { t } = useI18n()

const store = useTenantStore()
const editFinancialDocument = computed(() => store.getEditGuarantorFinancialDocument)
const financialDocuments = computed(() => store.guarantorFinancialDocuments)
const user = computed(() => store.userToEdit)

const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

defineProps<{ tenantId?: number }>()

onBeforeMount(() => {
  initialize()
})

function initialize() {
  store.selectGuarantorDocumentFinancial(undefined)
  if (financialDocuments.value.length === 0) {
    addAndSelectFinancial()
  }
}

function documentDeniedReasons(f: FinancialDocument) {
  return guarantorFinancialDocument(f)?.documentDeniedReasons
}

function documentStatus(f: FinancialDocument) {
  return guarantorFinancialDocument(f)?.documentStatus
}

function guarantorFinancialDocument(f: FinancialDocument) {
  return store.getGuarantorDocuments?.find((d: DfDocument) => {
    return d.id === f.id
  })
}

async function addAndSelectFinancial() {
  await store.createGuarantorDocumentFinancial()
}

function removeFinancial(f: DfDocument) {
  if (!f.id) {
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
  store.selectGuarantorDocumentFinancial(undefined)
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
  await store.selectGuarantorDocumentFinancial(f)
}

function getDocumentName(document: FinancialDocument): string {
  return t(`documents.${document.documentType.key}`).toString()
}
</script>

<style scoped lang="scss">
.fr-tag {
  background-color: #2a7ffe;
  color: var(--text-inverted-grey);
  max-width: 210px;
}

.add-income-btn {
  border-radius: 0.5rem;
  padding: 1.75rem;
  color: var(--primary);
  border: 1px solid var(--primary);
  font-size: 16px;
  background: var(--blue-france-925);
  &:hover {
    background: var(--blue-france-hover);
  }
  &:active {
    background: var(--blue-france-active);
  }
  margin: 0.5rem 1rem;
  width: calc(100% - 2rem);
  @media (min-width: 768px) {
    margin: 0.5rem 0;
    width: calc(100%);
  }
}

.fixed-width {
  width: 180px;
}
</style>
