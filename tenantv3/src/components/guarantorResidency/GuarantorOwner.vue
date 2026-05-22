<template>
  <BackLinkRow
    :label="t(textKey + '.garantor-owner')"
    :to="parentRoute"
    @edit="AnalyticsService.editSituation(category, 'owner')"
  />
  <i18n-t keypath="please-provide" tag="p" class="fr-mb-0">
    <strong>{{ t('your-choice') }}</strong>
  </i18n-t>
  <ul>
    <i18n-t :keypath="textKey + '.choice-1'" tag="li">
      <strong>{{ t('tax-notice', [taxYear]) }}</strong>
    </i18n-t>
    <i18n-t keypath="choice-2" tag="li">
      <strong>{{ t('recent-proof') }}</strong>
    </i18n-t>
  </ul>
  <AnalysisWrapper ref="analysis-wrapper" :is-uploading="isUploading">
    <template #analysisBannerError="{ rule, notMatchingLabel, explainLinkLabel, onExplain }">
      <ResidencyAnalysisErrorBannerContent
        :rule="rule"
        :document="document"
        :title="t(`${textKey}.analysis-error-title`)"
        :first-sub-title="t('analysis-error-sub-title')"
        :not-matching-label="notMatchingLabel"
        :explain-link-label="explainLinkLabel"
        @explain="onExplain"
      >
        <template #expected-doc>
          <BannerIconTextLine
            icon-name="ri:check-line"
            icon-color="#18753c"
            :text="t('banner-info-text')"
            text-class="success-text"
          />
          <ul class="expected-doc-list">
            <li v-for="(item, i) in expectedDocuments" :key="i" class="expected-doc-item">
              {{ item }}
            </li>
          </ul>
        </template>
      </ResidencyAnalysisErrorBannerContent>
    </template>
    <template #fileUploader>
      <UploadFileWithAnalysis
        ref="upload-file-with-analysis"
        doc-category="residency"
        sub-category="OWNER"
        :analysis-in-progress="analysisInProgress"
      />
    </template>
  </AnalysisWrapper>
  <AnalysisFooter
    :previous-step="residencyState.previousStep"
    :before-submit="analysisWrapper?.beforeSubmit"
    :next-disabled="analysisWrapper?.nextDisabled"
    :next-label="analysisWrapper?.nextLabel"
    :on-submit-action="submit"
  />
</template>

<script setup lang="ts">
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AnalysisWrapper from '@/components/analysis/AnalysisWrapper.vue'
import BannerIconTextLine from '@/components/analysis/BannerIconTextLine.vue'
import UploadFileWithAnalysis from '@/components/analysis/UploadFileWithAnalysis.vue'
import { documentFormKey } from '@/components/documents/documentFormState'
import AnalysisFooter from '@/components/footer/AnalysisFooter.vue'
import BackLinkRow from '@/components/residency/lib/BackLinkRow.vue'
import ResidencyAnalysisErrorBannerContent from '@/components/residency/lib/ResidencyAnalysisErrorBannerContent.vue'
import { useParentRoute } from '@/components/common/lib/useParentRoute'
import { useResidencyState } from '../residency/residencyState'
import { taxYear } from '@/components/residency/lib/taxYear'

const { t } = useI18n()
const router = useRouter()
const store = useTenantStore()
const parentRoute = useParentRoute()
const residencyState = useResidencyState()
const { category, textKey, document, nextStep } = residencyState

const uploadFileWithAnalysis = useTemplateRef('upload-file-with-analysis')
const analysisWrapper = useTemplateRef('analysis-wrapper')

const isUploading = computed(() => uploadFileWithAnalysis.value?.isUploading ?? false)
const analysisInProgress = computed(() => analysisWrapper.value?.analysisInProgress ?? false)

const expectedDocuments = computed(() => [
  t('expected-documents.tax-notice', [taxYear]),
  t('expected-documents.utility-bill'),
  t('expected-documents.home-insurance')
])

provide(documentFormKey, {
  category: 'RESIDENCY',
  textKey: textKey === 'couple' ? 'couple-guarantor' : 'guarantor',
  previousStep: residencyState.previousStep,
  nextStep: nextStep,
  formFieldValue: 'typeDocumentResidency',
  document: document,
  storeAction: 'saveGuarantorResidency',
  userId: store.user.id,
  addData(formData) {
    residencyState.addData?.(formData)
  }
})

const submit = async () => {
  await analysisWrapper.value?.saveExplanation()
  AnalyticsService.validateFunnelStep(category)
  await router.push(nextStep)
}
</script>

<style scoped>
.expected-doc-list {
  margin: 0 0 0 1rem;
  list-style: none;
  padding-left: 0;
}

.expected-doc-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
  margin-left: 1rem;
  color: #18753c;
}

.expected-doc-list > .expected-doc-item::marker {
  content: none;
}

.expected-doc-item::before {
  content: '•';
  font-size: 1.25rem;
  line-height: 1;
  color: #18753c;
}
</style>

<i18n lang="json">
{
  "en": {
    "analysis-error-sub-title": "Expected document",
    "banner-info-text": "A document among the following:",
    "expected-documents": {
      "tax-notice": "Property tax {0} (minimum 2 pages)",
      "utility-bill": "Utility bill (electricity, gas, water) less than 3 months old",
      "home-insurance": "Home insurance certificate less than 3 months old"
    },
    "please-provide": "Please add one of the following documents here:",
    "your-choice": "",
    "tax-notice": "{0} property tax notice",
    "recent-proof": "or proof of address less than 3 months old",
    "choice-2": "{0} in their name, such as a telephone, electricity or water bill, or proof of home insurance.",
    "tenant": {
      "garantor-owner": "Your guarantor is an owner",
      "choice-1": "your guarantor's {0}",
      "analysis-error-title": "Add your guarantor's proof of address"
    },
    "couple": {
      "garantor-owner": "Their guarantor is an owner",
      "choice-1": "their guarantor's {0}",
      "analysis-error-title": "Add their guarantor's proof of address"
    }
  },
  "fr": {
    "analysis-error-sub-title": "Document attendu",
    "banner-info-text": "Un document parmi les suivants :",
    "expected-documents": {
      "tax-notice": "Taxe foncière {0} (2 pages minimum)",
      "utility-bill": "Facture (électricité, gaz, eau) de moins de 3 mois",
      "home-insurance": "Attestation d'assurance habitation de moins de 3 mois"
    },
    "please-provide": "Merci d'ajouter ici l'un des documents suivants, {0} :",
    "your-choice": "au choix",
    "tax-notice": "l'avis de taxe foncière {0}",
    "recent-proof": "ou un justificatif de domicile de moins de 3 mois",
    "choice-2": "{0} à son nom : facture de téléphone, d'électricité, d'eau ou attestation d'assurance habitation par exemple",
    "tenant": {
      "garantor-owner": "Votre garant est propriétaire",
      "choice-1": "{0} de votre garant",
      "analysis-error-title": "Ajoutez les justificatifs de domicile de votre garant"
    },
    "couple": {
      "garantor-owner": "Son garant est propriétaire",
      "choice-1": "{0} de son garant",
      "analysis-error-title": "Ajoutez les justificatifs de domicile de son garant"
    }
  }
}
</i18n>
