<template>
  <BackLinkRow
    :label="t(textKey + '.you-owner')"
    to="../2"
    @edit="AnalyticsService.editSituation(category, 'owner')"
  />
  <i18n-t :keypath="textKey + '.please-provide'" tag="p">
    <template #notice>
      <strong>{{ t('tax-notice', [taxYear]) }}</strong>
    </template>
    <template #link>
      <a
        href="https://www.impots.gouv.fr/accueil"
        :title="`${t('tax-website')} - ${t('new-window')}`"
        target="_blank"
        >{{ t('tax-website') }}</a
      >
    </template>
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
            :text="t('banner-info-text', [taxYear])"
            text-class="success-text"
          />
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
    :previous-step="previousStep"
    :before-submit="analysisWrapper?.beforeSubmit"
    :next-disabled="analysisWrapper?.nextDisabled"
    :next-label="analysisWrapper?.nextLabel"
    :on-submit-action="submit"
  />
</template>

<script setup lang="ts">
import { taxYear } from '@/components/residency/lib/taxYear'
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
    "banner-info-text": "Property tax {0} (minimum 2 pages)",
    "tax-notice": "{0} property tax notice",
    "tax-website": "tax website",
    "valid-docs": "Only the latest property tax notice is a valid document here. Any other document (older notice, for example) will be refused.",
    "tenant": {
      "you-owner": "You are the owner",
      "please-provide": "Please provide your {notice}. You can download it from the {link}."
    },
    "couple": {
      "you-owner": "You are the owner",
      "please-provide": "Please provide your {notice}. You can download it from the {link}."
    }
  },
  "fr": {
    "banner-info-text": "Taxe foncière {0} (2 pages minimum)",
    "tax-notice": "avis de taxe foncière {0}",
    "tax-website": "site internet des impôts",
    "valid-docs": "Seul le dernier avis de taxe foncière est un document valide ici. Tout autre document (avis plus ancien par exemple) sera refusé.",
    "tenant": {
      "you-owner": "Vous êtes propriétaire",
      "please-provide": "Veuillez fournir votre {notice}. Vous pouvez le télécharger sur le {link}."
    },
    "couple": {
      "you-owner": "Votre conjoint est propriétaire",
      "please-provide": "Veuillez fournir son {notice}. Vous pouvez le télécharger sur le {link}."
    }
  }
}
</i18n>
