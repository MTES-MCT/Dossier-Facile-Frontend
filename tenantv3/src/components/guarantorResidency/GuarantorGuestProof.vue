<template>
  <BackLinkRow
    :label="t(textKey + '.guarantor-guest')"
    :to="grandparentRoute"
    @edit="AnalyticsService.editSituation(category, 'guest')"
  />
  <BackLinkRow
    :label="t(textKey + '.guarantor-guest-proof')"
    :to="parentRoute"
    @edit="AnalyticsService.editSituation2(category, 'guest', 'proof')"
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
        </template>
      </ResidencyAnalysisErrorBannerContent>
    </template>
    <template #fileUploader>
      <UploadFileWithAnalysis
        ref="upload-file-with-analysis"
        doc-category="residency"
        sub-category="GUEST"
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
const grandparentRoute = useParentRoute(2)
const residencyState = useResidencyState()
const { category, textKey, document, nextStep } = residencyState

const uploadFileWithAnalysis = useTemplateRef('upload-file-with-analysis')
const analysisWrapper = useTemplateRef('analysis-wrapper')

const isUploading = computed(() => uploadFileWithAnalysis.value?.isUploading ?? false)
const analysisInProgress = computed(() => analysisWrapper.value?.analysisInProgress ?? false)

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
    formData.append('categoryStep', 'GUEST_PROOF')
    residencyState.addData?.(formData)
  }
})

const submit = async () => {
  await analysisWrapper.value?.saveExplanation()
  AnalyticsService.validateFunnelStep(category)
  await router.push(nextStep)
}
</script>

<i18n lang="json">
{
  "en": {
    "recent-proof": "less than 3 months old",
    "analysis-error-sub-title": "Expected document",
    "banner-info-text": "Proof of accommodation less than 3 months old",
    "tenant": {
      "guarantor-guest": "Your guarantor is a lodger",
      "guarantor-guest-proof": "Your guarantor has proof of accommodation less than 3 months old",
      "please-provide": "Please provide proof of free accommodation from your guarantor, {0}.",
      "analysis-error-title": "Add your guarantor's proof of accommodation"
    },
    "couple": {
      "guarantor-guest": "Their guarantor is a lodger",
      "guarantor-guest-proof": "Their guarantor has proof of accommodation less than 3 months old",
      "please-provide": "Please provide proof of free accommodation from their guarantor, {0}.",
      "analysis-error-title": "Add their guarantor's proof of accommodation"
    }
  },
  "fr": {
    "recent-proof": "de moins de 3 mois",
    "analysis-error-sub-title": "Document attendu",
    "banner-info-text": "Attestation d'hébergement de moins de 3 mois",
    "tenant": {
      "guarantor-guest": "Votre garant est hébergé",
      "guarantor-guest-proof": "Votre garant a une attestation d'hébergement de moins de 3 mois",
      "please-provide": "Veuillez fournir l'attestation d'hébergement à titre gratuit {0} de votre garant.",
      "analysis-error-title": "Ajoutez l'attestation d'hébergement de votre garant"
    },
    "couple": {
      "guarantor-guest": "Son garant est hébergé",
      "guarantor-guest-proof": "Son garant a une attestation d'hébergement de moins de 3 mois",
      "please-provide": "Veuillez fournir l'attestation d'hébergement à titre gratuit {0} de son garant.",
      "analysis-error-title": "Ajoutez l'attestation d'hébergement de son garant"
    }
  }
}
</i18n>
