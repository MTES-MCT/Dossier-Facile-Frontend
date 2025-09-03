<template>
  <NakedCard v-if="!allTenantDocumentsPreValidated() || !namesFilled()" class="fr-mt-3w fr-p-md-5w">
    <template v-if="!namesFilled()">
      <div class="fr-text--bold">
        {{ t(`fileerrors.${keyprefix}-invalid-names`) }}
      </div>
      <UpdateComponent @on-update="openTenant(-1)">{{ t('fileerrors.update') }}</UpdateComponent>
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
        :user-id="user.id"
        :document="getDocument(category)"
        @on-update="openTenant(k)"
        >{{ t(`fileerrors.${category}`) }}</UpdateComponent
      >
    </template>
  </NakedCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '../../stores/tenant-store'
import { useRouter } from 'vue-router'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import UpdateComponent from './UpdateComponent.vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import { useTenantStep } from '../residency/lib/useTenantStep'
import { COUPLE_ROUTES } from '../documents/cotenant/coupleRoutes'
import { DocumentService } from '@/services/DocumentService'
import type { DocumentCategory } from 'df-shared-next/src/models/DfDocument'

const store = useTenantStore()
const { t } = useI18n()
const router = useRouter()
const { goToStep } = useTenantStep()

const props = defineProps<{
  user: CoTenant
  keyprefix: string
}>()
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

function openTenant(substep: number) {
  if (props.keyprefix === 'tenant') {
    router.push({
      name: COUPLE_ROUTES[substep + 1],
      params: { tenantId: props.user.id.toString(), step: '4' }
    })
    return
  }
  if (substep === -1) {
    router.push({
      name: 'TenantName'
    })
  } else {
    goToStep(substep)
  }
}
</script>
