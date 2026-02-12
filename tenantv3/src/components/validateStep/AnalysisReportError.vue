// Todo : fr-sr-only
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
      <DsfrAccordion title="Liste des documents en erreurs">
        <ul class="fr-pl-0 fr-mt-0 links-list">
          <li v-for="(doc, k) in failedDocuments" :key="k" class="failed-item">
            <a class="fr-btn fr-btn--tertiary-no-outline fr-p-0 text-left" :href="getDocLink(doc)">
              {{ k + 1 }}. {{ doc.label }}
            </a>
          </li>
        </ul>
      </DsfrAccordion>
    </div>
  </NakedCard>
</template>

<script setup lang="ts">
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import type { DocumentAnalysisStatus, User } from 'df-shared-next/src/models/User'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '../../stores/tenant-store'
import { getDocumentLabel, getDocumentSubTitle } from './useDocumentPreview'
import { DsfrAccordion } from '@gouvminint/vue-dsfr'

const props = defineProps<{
  documentAnalysisStatus: DocumentAnalysisStatus[]
}>()

const { t } = useI18n()
const store = useTenantStore()

type FailedDoc = {
  label: string
  doc: DfDocument
  owner: User | Guarantor
}

const failedDocuments = computed(() => {
  const errors = props.documentAnalysisStatus.filter((s) => s.isFinished && !s.isValid)
  const result: FailedDoc[] = []

  const checkUserDocs = (user: User | Guarantor, requiredCategories: DocumentCategory[]) => {
    const userDocs: FailedDoc[] = []

    // 1. Check for failed analysis
    user.documents?.forEach((d) => {
      if (errors.find((e) => e.id === d.id)) {
        if (d.documentAnalysisReport?.comment === undefined) {
          userDocs.push({
            label: getDocLabel(d, user),
            doc: d,
            documentCategory: d.documentCategory,
            owner: user
          })
        }
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
        userDocs.push({
          label: t('doc-owner', {
            docName: catLabel,
            name: `${user.firstName} ${user.lastName}`
          }),
          documentCategory: category,
          owner: user
        })
      }
    })

    userDocs.sort((a, b) => {
      const idxA = a.documentCategory ? requiredCategories.indexOf(a.documentCategory) : -1
      const idxB = b.documentCategory ? requiredCategories.indexOf(b.documentCategory) : -1
      return idxA - idxB
    })

    result.push(...userDocs)
  }

  // Tenant
  findDocInUser(store.user)
  // Guarantors
  store.user.guarantors?.forEach((g) => findDocInUser(g))
  // Cotenants
  store.coTenants?.forEach((co) => {
    findDocInUser(co)
    co.guarantors?.forEach((g) => findDocInUser(g))
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

const getDocLink = (failedDoc: FailedDoc) => {
  // We need to construct a link for a specific document
  if (failedDoc.doc) {
    // The document error represent a guarantor
    if ('typeGuarantor' in failedDoc.owner) {
      return `#document-guarantor-${failedDoc.owner.id}-${failedDoc.doc.id}`
    } else {
      // The document is for the current user
      if (failedDoc.owner.id == store.user.id) {
        return `#document-${failedDoc.doc.id}`
      } else {
        // The document is for the coTenant
        return `#document-cotenant-${failedDoc.owner.id}-${failedDoc.doc.id}`
      }
    }
  }
  // It's a missing file :
  else {
    // If the missing doc is for a guarantor
    if ('typeGuarantor' in failedDoc.owner) {
      return `#document-guarantor-${failedDoc.owner.id}-${failedDoc.documentCategory}`
    } else {
      // If the missing doc is for the tenant
      if (failedDoc.owner.id == store.user.id) {
        return `#document-${failedDoc.documentCategory}`
      } else {
        // The document is for the coTenant
        return `#document-cotenant-${failedDoc.owner.id}-${failedDoc.documentCategory}`
      }
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
