<template>
  <NakedCard v-if="!allTenantDocumentsPreValidated() || !namesFilled()" class="fr-mt-3w fr-p-md-5w">
    <template v-if="!namesFilled()">
      <h2 class="fr-h6">
        {{ t(`fileerrors.${keyprefix}-invalid-names`) }}
      </h2>
      <UpdateComponent :to="namePage">{{ t('fileerrors.update') }}</UpdateComponent>
    </template>

    <h2 v-if="!allTenantDocumentsPreValidated()" class="fr-h6">
      {{ t(`fileerrors.${keyprefix}-invalid-document`) }}
    </h2>
    <ul>
      <li v-for="[key, value] of invalidCategories" :key="value.step">
        <UpdateComponent
          :to="getTenantPage(value.step)"
          :user-id="user.id"
          :document="getDocument(key)"
          >{{ t(`fileerrors.${key}`) }}</UpdateComponent
        >
      </li>
    </ul>
  </NakedCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '../../stores/tenant-store'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import UpdateComponent from './UpdateComponent.vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { useTenantStep } from '../residency/lib/useTenantStep'
import { COUPLE_ROUTES } from '../documents/cotenant/coupleRoutes'
import { DocumentService } from '@/services/DocumentService'
import type { DocumentCategory } from 'df-shared-next/src/models/DfDocument'
import { computed } from 'vue'

const store = useTenantStore()
const { t } = useI18n()
const { getPage } = useTenantStep()

const props = defineProps<{
  user: CoTenant
  keyprefix: 'my' | 'tenant'
}>()

const namePage = computed(() => {
  if (props.keyprefix === 'tenant') {
    return {
      name: 'CoupleName',
      params: { tenantId: props.user.id.toString(), step: '4' }
    }
  }
  return { name: 'TenantName' }
})

const allCategories = ['IDENTIFICATION', 'RESIDENCY', 'PROFESSIONAL', 'FINANCIAL', 'TAX'] as const

function namesFilled() {
  const u = props.user
  return u?.firstName && u?.lastName
}

function allTenantDocumentsPreValidated() {
  for (const v of allCategories) {
    if (!isDocumentValid(v)) {
      return false
    }
  }
  return true
}

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
      isValid: isDocumentValid(cat),
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

function getDocument(docType: DocumentCategory) {
  return DocumentService.getDoc(docType, props.user.documents)
}

function isDocumentValid(docType: string) {
  return store.isTenantDocumentValid(docType, props.user)
}

function getTenantPage(substep: number) {
  if (props.keyprefix === 'tenant') {
    return {
      name: COUPLE_ROUTES[substep + 1],
      params: { tenantId: props.user.id.toString(), step: '4' }
    }
  }
  return getPage(substep)
}
</script>
