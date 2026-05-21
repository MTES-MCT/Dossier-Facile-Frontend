<template>
  <BackLinkRow
    :label="t(textKey + '.you-hosted')"
    to="../../2"
    @edit="AnalyticsService.editSituation(category, 'guest')"
  />
  <BackLinkRow
    :label="t(textKey + '.accomodation-proof')"
    to="../guest"
    @edit="AnalyticsService.editSituation2(category, 'guest', 'proof')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <strong>{{ t(textKey + '.less-3-months') }}</strong>
  </i18n-t>
  <AnalysisWrapper ref="analysis-wrapper" :is-uploading="isUploading">
    <template #analysisBannerError="{ rule, notMatchingLabel, explainLinkLabel, onExplain }">
      <ResidencyAnalysisErrorBannerContent
        :rule="rule"
        :document="document"
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
    :previous-step="previousStep"
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
import AnalysisWrapper from '../analysis/AnalysisWrapper.vue'
import BannerIconTextLine from '../analysis/BannerIconTextLine.vue'
import UploadFileWithAnalysis from '../analysis/UploadFileWithAnalysis.vue'
import { documentFormKey } from '../documents/documentFormState'
import AnalysisFooter from '../footer/AnalysisFooter.vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyAnalysisErrorBannerContent from './lib/ResidencyAnalysisErrorBannerContent.vue'
import { useResidencyState } from './residencyState'

const { t } = useI18n()
const router = useRouter()
const store = useTenantStore()
const state = useResidencyState()
const { document, category, textKey, nextStep } = state

const uploadFileWithAnalysis = useTemplateRef('upload-file-with-analysis')
const analysisWrapper = useTemplateRef('analysis-wrapper')

const isUploading = computed(() => uploadFileWithAnalysis.value?.isUploading ?? false)
const analysisInProgress = computed(() => analysisWrapper.value?.analysisInProgress ?? false)

const previousStep = { name: 'TenantIdentification' }

provide(documentFormKey, {
  category: 'RESIDENCY',
  textKey: textKey,
  previousStep: previousStep,
  nextStep: nextStep,
  formFieldValue: 'typeDocumentResidency',
  document: document,
  storeAction: 'saveTenantResidency',
  userId: store.user.id,
  addData(formData) {
    formData.append('categoryStep', 'GUEST_PROOF')
    state.addData?.(formData)
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
    "banner-info-text": "Proof of accommodation less than 3 months old",
    "tenant": {
      "you-hosted": "You are hosted",
      "accomodation-proof": "You have a proof of accomodation less than 3 months old",
      "please-provide": "Please provide proof of free accomodation {0}.",
      "less-3-months": "less than 3 months old"
    },
    "couple": {
      "you-hosted": "Your spouse is hosted",
      "accomodation-proof": "Your spouse has a proof of accomodation less than 3 months old",
      "please-provide": "Please provide proof of free accomodation {0} of your spouse.",
      "less-3-months": "less than 3 months old"
    }
  },
  "fr": {
    "banner-info-text": "Attestation d'hébergement de moins de 3 mois",
    "tenant": {
      "you-hosted": "Vous êtes hébergé",
      "accomodation-proof": "Vous avez une attestation d'hébergement de moins de 3 mois",
      "please-provide": "Veuillez fournir votre attestation d'hébergement à titre gratuit {0}.",
      "less-3-months": "de moins de 3 mois"
    },
    "couple": {
      "you-hosted": "Votre conjoint est hébergé",
      "accomodation-proof": "Votre conjoint a une attestation d'hébergement de moins de 3 mois",
      "please-provide": "Veuillez fournir l'attestation d'hébergement à titre gratuit {0} de votre conjoint.",
      "less-3-months": "de moins de 3 mois"
    }
  }
}
</i18n>
