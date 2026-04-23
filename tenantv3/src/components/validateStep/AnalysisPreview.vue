<template>
  <NakedCard class="fr-mt-3w">
    <DsfrBadge v-if="isTenant" class="fr-mb-1w" type="new" :label="t('badge-loc')" no-icon />
    <GuarantorBadge v-else />
    <h1 class="fr-h6">
      {{ nameToDisplay }}
    </h1>
    <div
      v-if="showGuarantorIdentityBlock"
      class="fr-p-1w document-preview-card document-preview-card--error fr-mb-2w"
    >
      <DsfrBadge type="warning" :label="t('to-correct-label')" class="fr-mb-1w" />
      <p class="fr-text--md fr-mb-1w">{{ t('guarantor-identity-label') }}</p>
      <div class="fr-grid-row fr-grid-row--right">
        <a :href="guarantorIdentityLink" class="fr-btn fr-btn--secondary">
          {{ t('correct') }}
        </a>
      </div>
    </div>
    <DocumentPreviewCard
      v-for="doc in documents"
      :key="doc.document?.id || doc.documentCategory"
      :preview-document="doc"
      :guarantor-id="guarantorId"
      :co-tenant-id="coTenantId"
      class="fr-mb-2w"
    />
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { allTenantDocumentCategories, type DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import type { DocumentAnalysisStatus, PreviewDocument, User } from 'df-shared-next/src/models/User'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DocumentPreviewCard from './DocumentPreviewCard.vue'
import { useTenantStore } from '@/stores/tenant-store'
import { DsfrBadge } from '@gouvminint/vue-dsfr'
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'

const props = defineProps<{
  user: User | Guarantor
  documentAnalysisStatus: DocumentAnalysisStatus[]
  isTenant: boolean
}>()

const { t } = useI18n()

const store = useTenantStore()

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

const showGuarantorIdentityBlock = computed(() => {
  if (props.isTenant || !('typeGuarantor' in props.user)) {
    return false
  }

  if (props.user.typeGuarantor === 'ORGANISM') {
    return false
  }

  return !props.user.firstName?.trim() || !props.user.lastName?.trim()
})

const coTenantIdForGuarantor = computed(() => {
  if (props.isTenant || !('typeGuarantor' in props.user)) {
    return undefined
  }

  const guarantorId = props.user.id
  if (!guarantorId) {
    return undefined
  }

  const coTenants =
    store.user.apartmentSharing?.tenants.filter((tenant) => tenant.id !== store.user.id) ?? []

  const coTenant = coTenants.find((tenant) =>
    (tenant.guarantors ?? []).some((guarantor) => guarantor.id === guarantorId)
  )

  return coTenant?.id
})

const guarantorIdentityLink = computed(() => {
  const guarantorId = props.user.id
  if (!guarantorId) {
    return '#'
  }

  const coTenantId = coTenantIdForGuarantor.value
  if (coTenantId) {
    return `/info-garant-locataire/${coTenantId}/${guarantorId}/5/0`
  }

  return `/info-garant/0/${guarantorId}`
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
</script>

<style scoped lang="scss">
.document-preview-card {
  background-color: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);

  &--error {
    background-color: var(--background-default-grey);
    border: 1px solid var(--red-marianne-main-472);
  }
}
</style>

<i18n>
{
  "en": {
    "documents-of": "Documents of {firstName} {lastName}",
    "document-of-organization": "Documents of the organization",
    "badge-loc": "TENANT FILE",
    "badge-guarantor": "GUARANTOR FILE",
    "to-correct-label": "TO CORRECT",
    "guarantor-identity-label": "Guarantor identity",
    "correct": "Correct"
  },
  "fr": {
    "documents-of": "Documents de {firstName} {lastName}",
    "document-of-organization": "Documents de l'organisme",
    "badge-loc": "DOSSIER LOCATAIRE",
    "badge-guarantor": "DOSSIER GARANT",
    "to-correct-label": "À CORRIGER",
    "guarantor-identity-label": "Identité du garant",
    "correct": "Corriger"
  }
}
</i18n>
