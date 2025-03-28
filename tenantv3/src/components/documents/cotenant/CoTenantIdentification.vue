<template>
  <DocumentDownloader
    :co-tenant-id="tenantId"
    :documents-definitions="documentsDefinitions"
    :document-category="DocumentType.IDENTIFICATION"
    dispatch-method-name="saveTenantIdentification"
    type-document="typeDocumentIdentification"
  >
    <template #title>
      {{ t('cotenantidentification.title') }}
    </template>
    <template #description>
      <p>{{ t('cotenantidentification.description') }}</p>
    </template>
  </DocumentDownloader>
  <FooterContainer>
    <BackNext show-back @on-next="goToResidency" @on-back="goToName"> </BackNext>
  </FooterContainer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import DocumentDownloader from './DocumentDownloader.vue'
import { DocumentType } from '@/components/editmenu/documents/DocumentType'
import FooterContainer from '@/components/footer/FooterContainer.vue'
import BackNext from '@/components/footer/BackNext.vue'
import { useRoute, useRouter } from 'vue-router'
import { useTenantStore } from '@/stores/tenant-store'
import { makeResidencyLink } from '@/components/residency/lib/useResidencyLink'
import { computed } from 'vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useTenantStore()

const documentsDefinitions = DocumentTypeConstants.IDENTIFICATION_DOCS

const tenantId = computed(() => Number(route.params.tenantId))

function goToResidency() {
  const cotenant = store.getTenant(tenantId.value)
  const step = Number(route.params.step) || 0
  const link = makeResidencyLink(cotenant, `/documents-colocataire/${tenantId.value}/${step}/2`)
  router.push(link)
}

function goToName() {
  router.push({
    name: 'CoupleName',
    params: {
      tenantId: tenantId.value
    }
  })
}
</script>
