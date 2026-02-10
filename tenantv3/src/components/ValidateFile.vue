<template>
          <h2 class="fr-h2">{{ t('analyse-finished.title') }}</h2>
  <div class="fr-container fr-my-3w">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <div v-if="isAnalyseInProgress">
          <NakedCard>
            <h1 class="fr-h6 fr-mb-1w">{{ t('analyse-in-progress.title') }}</h1>
            <p>
              {{ t('analyse-in-progress.description') }}
            </p>
          </NakedCard>

          <AnalysisProgress
            :number-of-documents="analysisResults.numberOfDocuments"
            :number-of-analysed-documents="analysisResults.numberOfAnalysedDocuments"
          />
        </div>
        <div v-if="!isAnalyseInProgress">
          <div v-if="isApplicationOk">
            <NakedCard>
              <h1 class="fr-h6 fr-mb-1w">{{ t('analyse-finished.title') }}</h1>
              <p>
                {{ t('analyse-finished.description') }}
              </p>
            </NakedCard>
          </div>
          <div v-if="hasErrors">
            <AnalysisReportError
              :document-analysis-status="analysisResults.documentAnalysisStatus"
            />
          </div>
        </div>
      </div>
      <div class="fr-col-12">
        <AnalysisPreview
          :user="user"
          is-tenant
          :document-analysis-status="analysisResults.documentAnalysisStatus"
        />
      </div>
      <div class="fr-col-12">
        <AnalysisPreview
          v-for="tenantGuarantor in primaryGuarantor"
          :key="tenantGuarantor.id"
          :user="tenantGuarantor"
          :is-tenant="false"
          :document-analysis-status="analysisResults.documentAnalysisStatus"
        />
      </div>
      <div class="fr-col-12">
        <AnalysisPreview
          v-for="coTenant in coTenants"
          :key="coTenant.id"
          :user="coTenant"
          is-tenant
          :document-analysis-status="analysisResults.documentAnalysisStatus"
        />
      </div>
      <div class="fr-col-12">
        <AnalysisPreview
          v-for="coTenantGuarantor in coTenantGuarantors"
          :key="coTenantGuarantor.id"
          :user="coTenantGuarantor"
          :is-tenant="false"
          :document-analysis-status="analysisResults.documentAnalysisStatus"
        />
      </div>
      <div v-if="isApplicationOk" class="fr-col-12">
        <AnalysisFinalForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '../stores/tenant-store'
import { useApplicationAnalysis } from '../composables/useApplicationAnalysis'
// import ProfileFooter from './footer/ProfileFooter.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import AnalysisPreview from './validateStep/AnalysisPreview.vue'
import AnalysisProgress from './validateStep/AnalysisProgress.vue'
import AnalysisReportError from './validateStep/AnalysisReportError.vue'
import AnalysisFinalForm from './validateStep/AnalysisFinalForm.vue'

const { t } = useI18n()
const store = useTenantStore()

const { analysisResults, isAnalyseInProgress, isApplicationOk, hasErrors } =
  useApplicationAnalysis()

const user = computed(() => store.user)

const coTenants = computed(() => store.coTenants)

const primaryGuarantor = computed(() => store.user.guarantors)

const coTenantGuarantors = computed(() => {
  const guarantors = []
  for (const coTenant of store.coTenants) {
    if (coTenant.guarantors) {
      guarantors.push(...coTenant.guarantors)
    }
  }
  return guarantors
})
</script>

<style scoped lang="scss">
.grey-container {
  background-color: var(--background-default-grey);
}
</style>

<i18n>
{
  "en": {
    "analyse-finished": {
      "title": "Your file is complete",
      "description": "You can now submit it. It will be reviewed by our team."
    },
    "analyse-in-progress": {
      "title": "Automatic analysis of your file",
      "description": "Our system automatically analyses your documents to help you complete your file. It will then be verified by our team."
    }
  },
  "fr": {
    "analyse-finished": {
      "title": "Votre dossier est complet",
      "description": "Vous pouvez maintenant le soumettre. Il sera examiné par notre équipe."
    },
    "analyse-in-progress": {
      "title": "Analyse automatique de votre dossier",
      "description": "Notre système analyse automatiquement vos documents pour vous aider à constituer un dossier complet. Il sera ensuite vérifié par notre équipe."
    }
  }
}
</i18n>
