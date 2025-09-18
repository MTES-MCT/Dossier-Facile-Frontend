<template>
  <NakedCard v-if="!allTenantDocumentsPreValidated() || !namesFilled()" class="fr-mt-3w fr-p-md-5w">
    <template v-if="!namesFilled()">
      <div class="fr-text--bold">
        {{ t(`fileerrors.${keyprefix}-invalid-names`) }}
      </div>
      <UpdateComponent :to="namePage">{{ t('fileerrors.update') }}</UpdateComponent>
    </template>

    <div v-if="!allTenantDocumentsPreValidated()" class="fr-text--bold">
      {{ t(`fileerrors.${keyprefix}-invalid-document`) }}
    </div>
    <template
      v-for="(category, k) in [
        'IDENTIFICATION',
        'RESIDENCY',
        'PROFESSIONAL',
        'FINANCIAL',
        'TAX'
      ] as const"
      :key="k"
    >
      <UpdateComponent
        v-if="!isDocumentValid(category)"
        :to="getTenantPage(k)"
        :user-id="user.id"
        :document="getDocument(category)"
        >{{ t(`fileerrors.${category}`) }}</UpdateComponent
      >
    </template>
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
  keyprefix: string
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

function namesFilled() {
  const u = props.user
  return u?.firstName && u?.lastName
}

function allTenantDocumentsPreValidated() {
  for (const v of ['IDENTIFICATION', 'RESIDENCY', 'PROFESSIONAL', 'FINANCIAL', 'TAX']) {
    if (!isDocumentValid(v)) {
      return false
    }
  }
  return true
}

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
