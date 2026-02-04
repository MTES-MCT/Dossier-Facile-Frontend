<template>
          <h2 class="fr-h2">{{ t('analyse-finished.title') }}</h2>
  <div class="fr-container fr-my-3w">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <div v-if="isAnalyseFinished">
          <!-- Analyse terminée -->
          <h2 class="fr-h2">{{ t('analyse-finished.title') }}</h2>
          <p>{{ t('analyse-finished.description') }}</p>
        </div>

        <div v-else>
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
      </div>
      <div class="fr-col-12">
        <AnalysisPreview
          :user="user"
          :document-analysis-status="analysisResults.documentAnalysisStatus"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '../stores/tenant-store'
// import ProfileFooter from './footer/ProfileFooter.vue'

// Keeping useful imports for later
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import AnalysisProgress from './validateStep/AnalysisProgress.vue'
import AnalysisPreview from './validateStep/AnalysisPreview.vue'

const { t } = useI18n()
const store = useTenantStore()

const isAnalyseFinished = computed(() => false)

const user = computed(() => store.user)

const analysisResults = ref({
  numberOfDocuments: 5,
  numberOfAnalysedDocuments: 1,
  documentAnalysisStatus: [
    {
      id: 722,
      isFinished: true,
      isValid: true
    },
    {
      id: 716,
      isFinished: false,
      isValid: false
    },
    {
      id: 727,
      isFinished: true,
      isValid: false
    }
  ]
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
      "title": "Analysis finished",
      "description": "The analysis of your file is finished."
    },
    "analyse-in-progress": {
      "title": "Automatic analysis of your file",
      "description": "Our system automatically analyses your documents to help you complete your file. It will then be verified by our team."
    }
  },
  "fr": {
    "analyse-finished": {
      "title": "Analyse terminée",
      "description": "L'analyse de votre dossier est terminée."
    },
    "analyse-in-progress": {
      "title": "Analyse automatique de votre dossier",
      "description": "Notre système analyse automatiquement vos documents pour vous aider à constituer un dossier complet. Il sera ensuite vérifié par notre équipe."
    }
  }
}
</i18n>
