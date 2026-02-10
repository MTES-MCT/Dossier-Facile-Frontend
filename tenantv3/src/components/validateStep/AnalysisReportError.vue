<template>
  <NakedCard class="fr-p-3w">
    <div>
      <p class="fr-badge fr-badge--warning fr-mb-2w">
        {{ t('title-badge') }}
      </p>
      <h1 class="fr-h6 fr-mb-1w">
        {{ t('title', { count: failedDocuments.length }) }}
      </h1>
      <p class="fr-mb-2w">
        {{ t('description') }}
      </p>
      <hr class="fr-pb-2w" />
      <ul class="fr-pl-0 fr-mt-0 links-list">
        <li v-for="(doc, k) in failedDocuments" :key="k" class="failed-item">
          <button
            class="fr-btn fr-btn--tertiary-no-outline fr-p-0 text-left"
            @click="goToEdit(doc)"
          >
            {{ k + 1 }}. {{ doc.label }}
          </button>
        </li>
      </ul>
    </div>
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import {
  allTenantDocumentCategories,
  guarantorLegalPersonCategories,
  guarantorOrganismCategories,
  type DfDocument,
  type DocumentCategory
} from 'df-shared-next/src/models/DfDocument'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import type { DocumentAnalysisStatus, User } from 'df-shared-next/src/models/User'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useTenantStore } from '../../stores/tenant-store'
import {
  DocumentType,
  GUARANTOR_COMPONENTS,
  TENANT_COMPONENTS
} from '../editmenu/documents/DocumentType'
import { getDocumentLabel, getDocumentSubTitle } from './useDocumentPreview'

const props = defineProps<{
  documentAnalysisStatus: DocumentAnalysisStatus[]
}>()

const { t } = useI18n()
const store = useTenantStore()
const router = useRouter()

type FailedDoc = {
  label: string
  doc?: DfDocument
  documentCategory: DocumentCategory | undefined
  owner: User | Guarantor
}

const failedDocuments = computed(() => {
  const errors = props.documentAnalysisStatus.filter((s) => s.isFinished && !s.isValid)
  const result: FailedDoc[] = []

  const checkUserDocs = (user: User | Guarantor, requiredCategories: DocumentCategory[]) => {
    // 1. Check for failed analysis
    user.documents?.forEach((d) => {
      if (errors.find((e) => e.id === d.id)) {
        result.push({
          label: getDocLabel(d, user),
          doc: d,
          documentCategory: d.documentCategory,
          owner: user
        })
      }
    })

    // 2. Check for missing documents
    requiredCategories.forEach((category) => {
      // Check if user has AT LEAST one document of this category
      const hasDoc = user.documents?.some(
        (d) =>
          d.documentCategory === category &&
          (d.documentStatus === 'TO_PROCESS' || d.documentStatus === 'VALIDATED')
      )

      if (!hasDoc) {
        // Special label for missing doc
        const catLabel = getDocumentLabel(category, t)
        result.push({
          label: t('doc-owner', {
            docName: catLabel,
            name: `${user.firstName} ${user.lastName}`
          }),
          documentCategory: category,
          owner: user
        })
      }
    })
  }

  // Tenant
  checkUserDocs(store.user, allTenantDocumentCategories)

  const processGuarantor = (g: Guarantor) => {
    let categories: DocumentCategory[] = []
    if (g.typeGuarantor === 'NATURAL_PERSON') {
      categories = allTenantDocumentCategories
    } else if (g.typeGuarantor === 'LEGAL_PERSON') {
      categories = guarantorLegalPersonCategories
    } else if (g.typeGuarantor === 'ORGANISM') {
      categories = guarantorOrganismCategories
    }
    checkUserDocs(g, categories)
  }

  // Guarantors
  store.user.guarantors?.forEach(processGuarantor)

  // Cotenants
  store.coTenants?.forEach((co) => {
    checkUserDocs(co, allTenantDocumentCategories)
    co.guarantors?.forEach(processGuarantor)
  })

  return result
})

const getDocLabel = (doc: DfDocument, owner: User | Guarantor) => {
  const docLabel = getDocumentLabel(doc.documentCategory, t)
  const docSubTitle = getDocumentSubTitle(doc, doc.documentCategory, doc.documentCategoryStep, t)

  let finalName = ''
  if (docSubTitle) {
    finalName = `${docLabel} (${docSubTitle})`
  } else {
    finalName = docLabel
  }
  return t('doc-owner', { docName: finalName, name: `${owner.firstName} ${owner.lastName}` })
}

const goToEdit = (failedDoc: FailedDoc) => {
  const type =
    failedDoc.documentCategory === 'IDENTIFICATION'
      ? DocumentType.IDENTITY
      : (failedDoc.documentCategory as DocumentType)

  if (failedDoc.owner.id === store.user.id || 'applicationType' in failedDoc.owner) {
    // Is Tenant or CoTenant
    const routeName = TENANT_COMPONENTS[type]
    if (routeName) {
      if (failedDoc.owner.id !== store.user.id) {
        // CoTenant
        // TODO: Handle co-tenant navigation if specific params are needed
        // Assuming we can just switch user or router needs params
      }
      router.push({ name: routeName })
    }
  } else {
    // Is Guarantor
    const routeName = GUARANTOR_COMPONENTS[type]
    if (routeName) {
      router.push({
        name: routeName,
        params: { guarantorId: failedDoc.owner.id }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.links-list {
  list-style: none;
  li {
    margin-bottom: 0.5rem;
  }
  .failed-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .text-left {
    text-align: left;
    justify-content: flex-start;
    white-space: normal;
    height: auto;
  }
}
</style>

<i18n>
{
  "en": {
    "title-badge": "ACTION REQUIRED",
    "title": "{count} document to correct | {count} documents to correct",
    "description": "Errors have been detected. Correct them to submit your file.",
    "doc-owner": "{docName} of {name}"
  },
  "fr": {
    "title-badge": "ACTION REQUISE",
    "title": "{count} document à corriger | {count} documents à corriger",
    "description": "Des erreurs ont été détectées. Corrigez-les pour soumettre votre dossier.",
    "doc-owner": "{docName} de {name}"
  }
}
</i18n>
