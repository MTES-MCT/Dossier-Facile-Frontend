<template>
  <NakedCard class="fr-mt-3w">
    <DsfrBadge v-if="isTenant" class="fr-mb-1w" type="new" :label="t('badge-loc')" no-icon />
    <GuarantorBadge v-else />
    <div class="analysis-preview-header">
      <h1 class="fr-h6 fr-mb-0">
        {{ nameToDisplay }}
      </h1>
      <button
        v-if="canDeleteGuarantor"
        ref="delete-guarantor-btn"
        type="button"
        class="fr-btn fr-btn--secondary fr-btn--sm"
        :disabled="isDeletingGuarantor"
        @click="openDeleteConfirmModal"
      >
        {{ deleteLabel }}
      </button>
    </div>
    <DocumentPreviewCard
      v-for="doc in documents"
      :key="doc.document?.id || doc.documentCategory"
      :preview-document="doc"
      :guarantor-id="guarantorId"
      :co-tenant-id="coTenantId"
      class="fr-mb-2w"
    />
    <ConfirmModal
      v-model:is-opened="isDeleteConfirmModalOpened"
      :title="deleteConfirmTitle"
      @valid="deleteSelectedGuarantor()"
      @cancel="closeDeleteConfirmModal"
    />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { allTenantDocumentCategories, type DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import type { DocumentAnalysisStatus, PreviewDocument, User } from 'df-shared-next/src/models/User'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DocumentPreviewCard from './DocumentPreviewCard.vue'
import { useTenantStore } from '@/stores/tenant-store'
import { DsfrBadge } from '@gouvminint/vue-dsfr'
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'
import { useGuarantorDeleteAction } from './useGuarantorDeleteAction'

const props = defineProps<{
  user: User | Guarantor
  documentAnalysisStatus: DocumentAnalysisStatus[]
  isTenant: boolean
}>()

const { t } = useI18n()

const store = useTenantStore()
const {
  isDeleteConfirmModalOpened,
  isDeletingGuarantor,
  deleteLabel,
  deleteConfirmTitle,
  openDeleteModalForGuarantor,
  closeDeleteConfirmModal,
  deleteSelectedGuarantor
} = useGuarantorDeleteAction()

const guarantorId = computed(() => {
  if (props.isTenant) {
    return undefined
  } else {
    return props.user.id
  }
})

const coTenantId = computed(() => {
  if (!props.isTenant || props.user.id === store.user.id) {
    return undefined
  } else {
    return props.user.id
  }
})

const canDeleteGuarantor = computed(() => !props.isTenant)

const nameToDisplay = computed(() => {
  if (
    props.isTenant ||
    (!props.isTenant &&
      'typeGuarantor' in props.user &&
      props.user.typeGuarantor === 'NATURAL_PERSON')
  ) {
    return t('documents-of', { firstName: props.user.firstName, lastName: props.user.lastName })
  }
  if (
    !props.isTenant &&
    'typeGuarantor' in props.user &&
    props.user.typeGuarantor === 'LEGAL_PERSON'
  ) {
    return t('documents-of', { firstName: props.user.firstName, lastName: props.user.lastName })
  }
  if (!props.isTenant && 'typeGuarantor' in props.user && props.user.typeGuarantor === 'ORGANISM') {
    return t('document-of-organization')
  }
  return t('documents-of')
})

const getDocumentCategories = () => {
  if (!props.isTenant && 'typeGuarantor' in props.user) {
    if (props.user.typeGuarantor === 'LEGAL_PERSON') {
      return ['IDENTIFICATION_LEGAL_PERSON', 'IDENTIFICATION']
    } else if (props.user.typeGuarantor === 'ORGANISM') {
      return ['GUARANTEE_PROVIDER_CERTIFICATE']
    }
  }
  return allTenantDocumentCategories
}

const getFinancialDocuments = (userDocuments: DfDocument[]) => {
  const financialDocs = userDocuments.filter((d) => d.documentCategory === 'FINANCIAL')
  if (financialDocs.length > 0) {
    return financialDocs.map((doc) => ({
      documentCategory: 'FINANCIAL',
      document: doc,
      documentAnalysisStatus: props.documentAnalysisStatus.find((status) => status.id === doc.id)
    })) as PreviewDocument[]
  }
  return [
    {
      documentCategory: 'FINANCIAL',
      document: undefined,
      documentAnalysisStatus: undefined
    }
  ] as PreviewDocument[]
}

const getStandardDocument = (category: string, userDocuments: DfDocument[]) => {
  const doc = userDocuments.find((d) => d.documentCategory === category)
  return {
    documentCategory: category,
    document: doc,
    documentAnalysisStatus: doc
      ? props.documentAnalysisStatus.find((status) => status.id === doc.id)
      : undefined
  } as PreviewDocument
}

const documents = computed(() => {
  const userDocuments: DfDocument[] = props.user.documents || []
  const categories = getDocumentCategories()

  const docs: PreviewDocument[] = []
  for (const category of categories) {
    if (category === 'FINANCIAL') {
      docs.push(...getFinancialDocuments(userDocuments))
    } else {
      docs.push(getStandardDocument(category, userDocuments))
    }
  }
  return docs
})

const openDeleteConfirmModal = () => {
  if (props.isTenant || !('typeGuarantor' in props.user)) {
    return
  }
  openDeleteModalForGuarantor(props.user)
}
</script>

<style scoped lang="scss">
.analysis-preview-header {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
}
</style>

<i18n>
{
  "en": {
    "documents-of": "Documents of {firstName} {lastName}",
    "document-of-organization": "Documents of the organization",
    "badge-loc": "TENANT FILE",
    "badge-guarantor": "GUARANTOR FILE"
  },
  "fr": {
    "documents-of": "Documents de {firstName} {lastName}",
    "document-of-organization": "Documents de l'organisme",
    "badge-loc": "DOSSIER LOCATAIRE",
    "badge-guarantor": "DOSSIER GARANT"
  }
}
</i18n>
