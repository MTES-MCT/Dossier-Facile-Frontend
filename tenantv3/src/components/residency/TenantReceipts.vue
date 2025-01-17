<template>
  <BackLinkRow label="Vous êtes locataire" to="/documents-locataire/2" />
  <BackLinkRow
    label="Vous avez vos 3 dernières quittances de loyer"
    to="/documents-locataire/2/tenant"
  />
  <p>
    Veuillez fournir les quittances de <strong>septembre</strong>,<strong>octobre</strong> et
    <strong>novembre</strong>. Vous pouvez ajouter la quittance de décembre si vous l'avez.
  </p>
  <div class="fr-alert fr-alert--warning fr-mb-2w">
    <p>
      Seules les quittances de loyer sont des documents valides ici. Tout autre document sera
      refusé.
    </p>
  </div>
  <UploadFiles category="TENANT" />
  <ResidencyFooter :on-submit="checkFiles" />
  <ConfirmModal
    v-if="showNbDocumentsResidencyTenant"
    :validate-btn-text="t('uploaddocuments.accept-warning')"
    :cancel-btn-text="t('uploaddocuments.ignore-warning')"
    @cancel="ignoreAndgoNext()"
    @close="showNbDocumentsResidencyTenant = false"
    @valid="showNbDocumentsResidencyTenant = false"
  >
    <p v-html="t('uploaddocuments.warning-need-residency-documents-tenant')"></p>
  </ConfirmModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BackLinkRow from './lib/BackLinkRow.vue'
import UploadFiles from './lib/UploadFiles.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { AnalyticsService } from '@/services/AnalyticsService'
import { DocumentService } from '@/services/DocumentService'
import { useRouter } from 'vue-router'
import ResidencyFooter from './lib/ResidencyFooter.vue'

const { t } = useI18n()
const router = useRouter()
const showNbDocumentsResidencyTenant = ref(false)

function ignoreAndgoNext() {
  showNbDocumentsResidencyTenant.value = false
  AnalyticsService.forceMissingResidencyDocument()
  router.push({ name: 'TenantProfessional' })
}

function checkFiles() {
  const docs = DocumentService.getUserDocs('RESIDENCY')
  if (docs.length === 1) {
    const d = docs[0]
    if (d.documentSubCategory === 'TENANT') {
      const nbPages = d.files?.reduce((s, a) => s + (a.numberOfPages || 0), 0) || 0
      if (nbPages < 3) {
        showNbDocumentsResidencyTenant.value = true
        AnalyticsService.missingResidencyDocumentDetected()
        return
      }
    }
  }
  router.push({ name: 'TenantProfessional' })
}
</script>
