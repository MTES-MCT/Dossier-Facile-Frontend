<template>
  <BackLinkRow
    :label="t(textKey + '.garantor-tenant')"
    :to="parentRoute"
    @edit="AnalyticsService.editSituation(category, 'tenant')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <strong>{{ t('recent-proof') }}</strong>
  </i18n-t>
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
        sub-category="TENANT"
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
  t('expected-documents.receipt'),
  t('expected-documents.rent-notice'),
  t('expected-documents.utility-bill')
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
    "recent-proof": "proof of address less than 3 months old",
    "analysis-error-sub-title": "Expected document",
    "banner-info-text": "A document less than 3 months old among the following:",
    "expected-documents": {
      "receipt": "Rent receipt",
      "rent-notice": "Rent due notice",
      "utility-bill": "Utility bill (electricity, gas, water)"
    },
    "tenant": {
      "garantor-tenant": "Your guarantor is a tenant",
      "please-provide": "Please provide {0} in your guarantor's name, such as a telephone, electricity or water bill, or proof of home insurance.",
      "analysis-error-title": "Add a proof of address for your guarantor"
    },
    "couple": {
      "garantor-tenant": "Their guarantor is a tenant",
      "please-provide": "Please provide {0} in their guarantor's name, such as a telephone, electricity or water bill, or proof of home insurance.",
      "analysis-error-title": "Add a proof of address for their guarantor"
    }
  },
  "fr": {
    "recent-proof": "justificatif de domicile de moins de 3 mois",
    "analysis-error-sub-title": "Document attendu",
    "banner-info-text": "Un document de moins de 3 mois parmi les suivants :",
    "expected-documents": {
      "receipt": "Quittance de loyer",
      "rent-notice": "Avis d'échéance",
      "utility-bill": "Facture (électricité, gaz, eau)"
    },
    "tenant": {
      "garantor-tenant": "Votre garant est locataire",
      "please-provide": "Veuillez fournir ici un {0} au nom de votre garant : facture de téléphone, d'électricité, d'eau ou attestation d'assurance habitation par exemple.",
      "analysis-error-title": "Ajoutez un justificatif de domicile pour votre garant"
    },
    "couple": {
      "garantor-tenant": "Son garant est locataire",
      "please-provide": "Veuillez fournir ici un {0} au nom de son garant : facture de téléphone, d'électricité, d'eau ou attestation d'assurance habitation par exemple.",
      "analysis-error-title": "Ajoutez un justificatif de domicile pour son garant"
    }
  }
}
</i18n>
