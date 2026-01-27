<template>
  <template v-if="g.typeGuarantor === 'NATURAL_PERSON'">
    <NakedCard
      v-if="!documentsGuarantorFilled(g) || !namesGuarantorFilled(g)"
      class="fr-mt-3w fr-p-md-5w"
    >
      <template v-if="!namesGuarantorFilled(g)">
        <h2 class="fr-h6">
          {{ t(`fileerrors.${keyprefix}-invalid-names-guarantor`) }}
        </h2>
        <UpdateComponent :user-id="user.id" :to="getGuarantorPage(g, 0)">{{
          t('fileerrors.user-names')
        }}</UpdateComponent>
      </template>
      <h2 v-if="!documentsGuarantorFilled(g)" class="fr-h6">
        {{ t(`fileerrors.${keyprefix}-invalid-document-guarantor`) }} {{ g.firstName }}
        {{ g.lastName }}
      </h2>

      <ul class="invalid-doc-list">
        <li v-for="[key, value] of invalidCategories" :key="value.step">
          <UpdateComponent
            :to="getGuarantorPage(g, value.step + 1)"
            :user-id="user.id"
            :document="getDocument(g, key)"
          >
            {{ t(`fileerrors.${key}`) }}
          </UpdateComponent>
        </li>
      </ul>
    </NakedCard>
  </template>
  <template v-if="g.typeGuarantor === 'LEGAL_PERSON'">
    <NakedCard
      v-if="!documentsGuarantorFilled(g) || !namesGuarantorFilled(g)"
      class="fr-mt-3w fr-p-md-5w"
    >
      <template v-if="!namesGuarantorFilled(g)">
        <p class="fr-text--bold">
          {{ t(`fileerrors.${keyprefix}-invalid-names-guarantor`) }}
        </p>
        <UpdateComponent :to="getGuarantorPage(g, 0)">{{
          t('fileerrors.user-names')
        }}</UpdateComponent>
      </template>
      <p class="fr-text--bold">
        {{ t(`fileerrors.${keyprefix}-invalid-document-guarantor`) }}
      </p>
      <UpdateComponent
        v-if="!isGuarantorDocumentValid('IDENTIFICATION')"
        :document="getDocument(g, 'IDENTIFICATION')"
        :to="getGuarantorPage(g, 1)"
        >{{ t('fileerrors.representative-identification') }}</UpdateComponent
      >
      <UpdateComponent
        v-if="!isGuarantorDocumentValid('IDENTIFICATION_LEGAL_PERSON')"
        :document="getDocument(g, 'IDENTIFICATION_LEGAL_PERSON')"
        :to="getGuarantorPage(g, 0)"
        >{{ t('fileerrors.corporation-identification') }}</UpdateComponent
      >
    </NakedCard>
  </template>
  <template v-if="g.typeGuarantor === 'ORGANISM'">
    <NakedCard v-if="!documentsGuarantorFilled(g)" class="fr-mt-3w fr-p-md-5w">
      <p class="fr-text--bold">
        {{ t(`fileerrors.${keyprefix}-invalid-document-guarantor`) }}
      </p>
      <UpdateComponent
        v-if="!isGuarantorDocumentValid('GUARANTEE_PROVIDER_CERTIFICATE')"
        :document="getDocument(g, 'GUARANTEE_PROVIDER_CERTIFICATE')"
        :to="getGuarantorPage(g, 1)"
        >{{ t('fileerrors.organism-cert') }}</UpdateComponent
      >
    </NakedCard>
  </template>
</template>

<script setup lang="ts">
import { User } from 'df-shared-next/src/models/User'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '../../stores/tenant-store'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { UtilsService } from '../../services/UtilsService'
import UpdateComponent from './UpdateComponent.vue'
import { computed, onMounted } from 'vue'
import { AnalyticsService } from '../../services/AnalyticsService'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import type { DocumentCategory } from 'df-shared-next/src/models/DfDocument'

const store = useTenantStore()
const { t } = useI18n()
const props = defineProps<{
  g: Guarantor
  user: User | CoTenant
  keyprefix: 'my' | 'tenant'
}>()

const allCategories = ['IDENTIFICATION', 'RESIDENCY', 'PROFESSIONAL', 'FINANCIAL', 'TAX'] as const

onMounted(() => {
  if (import.meta.env.VITE_FEATURE_FLIPPING_PRE_VALIDATE !== 'true') {
    return
  }
  for (const v of allCategories) {
    if (isGuarantorDocumentValid(v)) {
      AnalyticsService.prevalidationEvent(v, 'CHECKED')
    } else {
      AnalyticsService.prevalidationEvent(v, 'DENIED')
    }
  }
})

type CategoriesMap = Map<
  DocumentCategory,
  {
    isValid: boolean
    step: number
  }
>

const invalidCategories = computed(() => {
  const categoriesStatus: CategoriesMap = new Map()
  // map each category to its status (true/false) and step
  allCategories.forEach((cat, idx) =>
    categoriesStatus.set(cat, {
      isValid: isGuarantorDocumentValid(cat),
      step: idx
    })
  )
  // remove true (valid) categories
  for (const [key, value] of categoriesStatus) {
    if (value.isValid) {
      categoriesStatus.delete(key)
    }
  }

  return categoriesStatus
})

function getDocument(g: Guarantor, docType: DocumentCategory) {
  // TODO: handle multiple financial documents
  return g.documents?.find((d) => d.documentCategory === docType)
}

function isGuarantorDocumentValid(docType: DocumentCategory) {
  return UtilsService.isGuarantorDocumentValid(docType, props.g)
}
function namesGuarantorFilled(g: Guarantor) {
  return (
    (g.typeGuarantor === 'NATURAL_PERSON' && g.firstName && g.lastName) ||
    (g.typeGuarantor === 'LEGAL_PERSON' && g.legalPersonName) ||
    g.typeGuarantor === 'ORGANISM'
  )
}

function documentsGuarantorFilled(g: Guarantor) {
  return store.guarantorDocumentsFilled(g)
}

function getGuarantorPage(g: Guarantor, substep: number) {
  return store.getGuarantorPage(g, substep, props.user.id)
}
</script>
