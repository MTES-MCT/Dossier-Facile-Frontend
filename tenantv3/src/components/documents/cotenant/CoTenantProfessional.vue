<template>
  <DocumentDownloader
    :co-tenant-id="tenantId"
    :documents-definitions="documentsDefinitions"
    :document-category="DocumentType.PROFESSIONAL"
    dispatch-method-name="saveTenantProfessional"
    type-document="typeDocumentProfessional"
    list-type="dropDownList"
  >
    <template #title>
      {{ t('cotenantprofessional.title') }}
    </template>
  </DocumentDownloader>
  <FooterContainer>
    <BackNext show-back @on-next="goToFinancial" @on-back="goToResidency"> </BackNext>
  </FooterContainer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import DocumentDownloader from './DocumentDownloader.vue'
import { DocumentType } from '@/components/editmenu/documents/DocumentType'
import FooterContainer from '@/components/footer/FooterContainer.vue'
import BackNext from '@/components/footer/BackNext.vue'
import { useTenantStore } from '@/stores/tenant-store'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { makeResidencyLink } from '@/components/residency/lib/useResidencyLink'

const { t } = useI18n()
const store = useTenantStore()
const route = useRoute()
const router = useRouter()

const documentsDefinitions = DocumentTypeConstants.PROFESSIONAL_DOCS
const tenantId = computed(() => Number(route.params.tenantId))

function goToResidency() {
  const cotenant = store.getTenant(tenantId.value)
  const step = Number(route.params.step) || 0
  const link = makeResidencyLink(cotenant, `/documents-colocataire/${tenantId.value}/${step}/2`)
  router.push(link)
}

function goToFinancial() {
  router.push({
    name: 'CoupleFinancial',
    params: {
      tenantId: tenantId.value
    }
  })
}
</script>
