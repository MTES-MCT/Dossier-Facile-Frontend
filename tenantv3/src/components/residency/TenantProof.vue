<template>
  <BackLinkRow
    :label="t(textKey + '.you-tenant')"
    to="../../2"
    @edit="AnalyticsService.editSituation(category, 'tenant')"
  />
  <BackLinkRow
    :label="t(textKey + '.have-proof')"
    to="../tenant"
    @edit="AnalyticsService.editSituation2(category, 'tenant', 'proof')"
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
        sub-category="TENANT"
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
import { useI18n } from 'vue-i18n'
import AnalysisWrapper from '../analysis/AnalysisWrapper.vue'
import BannerIconTextLine from '../analysis/BannerIconTextLine.vue'
import UploadFileWithAnalysis from '../analysis/UploadFileWithAnalysis.vue'
import AnalysisFooter from '../footer/AnalysisFooter.vue'
import BackLinkRow from './lib/BackLinkRow.vue'
import ResidencyAnalysisErrorBannerContent from './lib/ResidencyAnalysisErrorBannerContent.vue'
import { useResidencyState } from './residencyState'

import { useTenantStore } from '@/stores/tenant-store'
import { computed, provide, useTemplateRef } from 'vue'
import { documentFormKey } from '../documents/documentFormState'
import { useRouter } from 'vue-router'

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
    formData.append('categoryStep', 'TENANT_PROOF')
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
    "tenant": {
      "you-tenant": "You are a tenant",
      "have-proof": "You have proof of good payment of rent",
      "please-provide": "Please provide proof of good rental payment {0}.",
      "less-3-months": "less than 3 months old",
      "valid-docs": "Only rental payment certificates are valid documents here. All other documents will be refused."
    },
    "banner-info-text": "Proof of good payment of rent less than 3 months old",
    "couple": {
      "you-tenant": "Your spouse is a tenant",
      "have-proof": "Your spouse has proof of good payment of rent",
      "please-provide": "Please provide proof of good rental payment {0}.",
      "less-3-months": "less than 3 months old",
      "valid-docs": "Only rental payment certificates are valid documents here. All other documents will be refused."
    }
  },
  "fr": {
    "tenant": {
      "you-tenant": "Vous êtes locataire",
      "have-proof": "Vous avez une attestation de bon paiement des loyers",
      "please-provide": "Veuillez fournir votre attestation de bon paiement des loyers {0}.",
      "less-3-months": "de moins de 3 mois",
      "valid-docs": "Seules les attestations de bon paiement des loyers sont des documents valides ici. Tout autre document sera refusé."
    },
    "banner-info-text": "Attestation de bon paiement des loyers de moins de 3 mois",
    "couple": {
      "you-tenant": "Votre conjoint est locataire",
      "have-proof": "Votre conjoint a une attestation de bon paiement des loyers",
      "please-provide": "Veuillez fournir son attestation de bon paiement des loyers {0}.",
      "less-3-months": "de moins de 3 mois",
      "valid-docs": "Seules les attestations de bon paiement des loyers sont des documents valides ici. Tout autre document sera refusé."
    }
  }
}
</i18n>
