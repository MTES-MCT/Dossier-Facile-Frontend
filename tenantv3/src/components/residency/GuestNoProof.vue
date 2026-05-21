<template>
  <BackLinkRow
    :label="t(textKey + '.you-hosted')"
    to="../../2"
    @edit="AnalyticsService.editSituation(category, 'guest')"
  />
  <BackLinkRow
    :label="t(textKey + '.no-accomodation-proof')"
    to="../guest"
    @edit="AnalyticsService.editSituation2(category, 'guest', 'no-proof')"
  />
  <i18n-t :keypath="textKey + '.complete-certificate'" tag="p">
    <a
      href="https://www.service-public.fr/simulateur/calcul/AttestationHebergement"
      :title="`${t('this-certificate')} - ${t('new-window')}`"
      target="_blank"
      >{{ t('this-certificate') }}</a
    >
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
    formData.append('categoryStep', 'GUEST_NO_PROOF')
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
    "this-certificate": "this accomodation certificate",
    "tenant": {
      "you-hosted": "You are hosted",
      "no-accomodation-proof": "You have no proof of accomodation",
      "complete-certificate": "Please complete {0}, have it signed by your accomodation provider and then insert it below."
    },
    "couple": {
      "you-hosted": "Your spouse is hosted",
      "no-accomodation-proof": "Your spouse has no proof of accomodation",
      "complete-certificate": "Please tell your spouse to complete {0}, have it signed by his/her accomodation provider and then insert it below."
    }
  },
  "fr": {
    "banner-info-text": "Attestation d'hébergement de moins de 3 mois",
    "this-certificate": "cette attestation d'hébergement",
    "tenant": {
      "you-hosted": "Vous êtes hébergé",
      "no-accomodation-proof": "Vous n'avez pas d'attestation d'hébergement",
      "complete-certificate": "Veuillez remplir {0}, la faire signer par votre hébergeur puis la glisser ci-dessous."
    },
    "couple": {
      "you-hosted": "Votre conjoint est hébergé",
      "no-accomodation-proof": "Votre conjoint n'a pas d'attestation d'hébergement",
      "complete-certificate": "Veuillez indiquer à votre conjoint de remplir {0}, la faire signer par son hébergeur puis la glisser ci-dessous."
    }
  }
}
</i18n>
