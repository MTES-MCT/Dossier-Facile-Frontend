// Todo : fr-sr-only
<template>
  <NakedCard class="fr-p-3w">
    <div>
      <DsfrBadge type="warning" :label="t('title-badge')" class="fr-mb-2w" />
      <h1 class="fr-h6 fr-mb-1w">
        {{ t('title', { count: failedDocuments.length }) }}
      </h1>
      <p class="fr-mb-2w">
        {{ t('description') }}
      </p>
      <DsfrAccordion :title="t('accordion-title')" title-tag="h2">
        <ol class="fr-mt-0 links-list fr-pl-0">
          <li v-for="(doc, k) in failedDocuments" :key="k" class="failed-item">
            <a
              class="fr-btn fr-btn--tertiary-no-outline fr-p-0 text-left"
              :href="getDocLink(doc)"
              @click="onDocClick(doc)"
            >
              {{ doc.label }}
            </a>
          </li>
        </ol>
      </DsfrAccordion>
    </div>
  </NakedCard>
</template>

<script setup lang="ts">
import { DsfrAccordion, DsfrBadge } from '@gouvminint/vue-dsfr'
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
import { useTenantStore } from '../../stores/tenant-store'
import { getDocumentLabel, getDocumentSubTitle } from './useDocumentPreview'
import { AnalyticsService } from '@/services/AnalyticsService'

const props = defineProps<{
  documentAnalysisStatus: DocumentAnalysisStatus[]
}>()

const { t } = useI18n()
const store = useTenantStore()

type FailedDoc = {
  label: string
  doc?: DfDocument | undefined
  documentCategory: DocumentCategory | undefined
  owner: User | Guarantor
}

const failedDocuments = computed(() => {
  const errors = props.documentAnalysisStatus.filter((s) => s.isFinished && !s.isValid)
  const result: FailedDoc[] = []

  const checkUserDocs = (user: User | Guarantor, requiredCategories: DocumentCategory[]) => {
    const userDocs: FailedDoc[] = []

    // 1. Check for failed analysis
    user.documents?.forEach((d) => {
      if (errors.some((e) => e.id === d.id)) {
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
        const username =
          user.lastName === undefined ? user.firstName : `${user.firstName} ${user.lastName}`
        userDocs.push({
          label: t('doc-owner', {
            docName: catLabel,
            name: username
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
  const username =
    owner.lastName === undefined ? owner.firstName : `${owner.firstName} ${owner.lastName}`

  return t('doc-owner', { docName: finalName, name: username })
}

const getDocLink = (failedDoc: FailedDoc) => {
  const isGuarantor = 'typeGuarantor' in failedDoc.owner
  const isTenant = failedDoc.owner.id === store.user.id

  const suffix = failedDoc.doc ? failedDoc.doc.id : failedDoc.documentCategory

  if (isGuarantor) {
    return `#document-guarantor-${failedDoc.owner.id}-${suffix}`
  }
  if (isTenant) {
    return `#document-${suffix}`
  }
  return `#document-cotenant-${failedDoc.owner.id}-${suffix}`
}

const onDocClick = (doc: FailedDoc) => {
  if (doc.owner.id === store.user.id) {
    AnalyticsService.validate_anchor_error_click(
      'tenant',
      doc.doc?.documentCategory || doc.documentCategory || 'unknown'
    )
  } else if ('typeGuarantor' in doc.owner) {
    AnalyticsService.validate_anchor_error_click(
      'guarantor',
      doc.doc?.documentCategory || doc.documentCategory || 'unknown'
    )
  } else {
    AnalyticsService.validate_anchor_error_click(
      'couple',
      doc.doc?.documentCategory || doc.documentCategory || 'unknown'
    )
  }
}
</script>

<style scoped lang="scss">
.links-list {
  counter-reset: item;
  li {
    padding-bottom: 0;
    display: flex;
    align-items: flex-start;
    color: var(--text-action-high-blue-france);
    &:before {
      content: counter(item) '. ';
      counter-increment: item;
      margin-right: 0.5rem;
      font-weight: bold;
    }
    a {
      min-height: auto;
    }
  }
  li + li {
    margin-top: 0.5rem;
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
    "doc-owner": "{docName} of {name}",
    "accordion-title": "List of documents with errors"
  },
  "fr": {
    "title-badge": "ACTION REQUISE",
    "title": "{count} document à corriger | {count} documents à corriger",
    "description": "Des erreurs ont été détectées. Corrigez-les pour soumettre votre dossier.",
    "doc-owner": "{docName} de {name}",
    "accordion-title": "Liste des documents en erreurs"
  }
}
</i18n>
