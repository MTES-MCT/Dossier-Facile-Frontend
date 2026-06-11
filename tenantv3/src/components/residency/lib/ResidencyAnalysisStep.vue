<template>
  <AnalysisWrapper ref="analysis-wrapper" :is-uploading="isUploading">
    <template #analysisBannerError="{ rule, notMatchingLabel, explainLinkLabel, onExplain }">
      <ResidencyAnalysisErrorBannerContent
        :rule="rule"
        :document="document"
        :title="bannerTitle"
        :first-sub-title="bannerSubTitle"
        :not-matching-label="notMatchingLabel"
        :explain-link-label="explainLinkLabel"
        @explain="onExplain"
      >
        <template #expected-doc>
          <slot name="expected-doc">
            <BannerIconTextLine
              icon-name="ri:check-line"
              icon-color="#18753c"
              :text="bannerInfoText"
              text-class="success-text"
            />
            <ul v-if="expectedItems.length > 0" class="expected-list">
              <li v-for="(item, index) in expectedItems" :key="index" class="expected-list-item">
                {{ item }}
              </li>
            </ul>
          </slot>
        </template>
      </ResidencyAnalysisErrorBannerContent>
    </template>
    <template #fileUploader>
      <UploadFileWithAnalysis
        ref="upload-file-with-analysis"
        doc-category="residency"
        :sub-category="subCategory"
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
import { useTenantStore, type StoreAction } from '@/stores/tenant-store'
import type { DocumentCategoryStep } from 'df-shared-next/src/models/DfDocument'
import { computed, provide, useTemplateRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import AnalysisWrapper from '@/components/analysis/AnalysisWrapper.vue'
import BannerIconTextLine from '@/components/analysis/BannerIconTextLine.vue'
import UploadFileWithAnalysis from '@/components/analysis/UploadFileWithAnalysis.vue'
import { documentFormKey } from '@/components/documents/documentFormState'
import type { DocumentSubCategory } from '@/components/documents/share/DocumentTypeConstants'
import AnalysisFooter from '@/components/footer/AnalysisFooter.vue'
import ResidencyAnalysisErrorBannerContent from './ResidencyAnalysisErrorBannerContent.vue'
import { useResidencyState } from '../residencyState'

const props = withDefaults(
  defineProps<{
    previousStep: RouteLocationRaw
    subCategory: DocumentSubCategory
    bannerInfoText: string
    bannerTitle: string
    bannerSubTitle: string
    categoryStep?: DocumentCategoryStep
    expectedItems?: string[]
    onSubmitAction?: () => Promise<void> | void
    storeAction?: StoreAction
    textKey?: 'tenant' | 'couple' | 'guarantor' | 'couple-guarantor'
  }>(),
  {
    categoryStep: undefined,
    expectedItems: () => [],
    onSubmitAction: undefined,
    storeAction: 'saveTenantResidency',
    textKey: undefined
  }
)

const router = useRouter()
const store = useTenantStore()
const state = useResidencyState()
const { document, category, textKey: stateTextKey, nextStep } = state

const uploadFileWithAnalysis = useTemplateRef('upload-file-with-analysis')
const analysisWrapper = useTemplateRef('analysis-wrapper')

const isUploading = computed(() => uploadFileWithAnalysis.value?.isUploading ?? false)
const analysisInProgress = computed(() => analysisWrapper.value?.analysisInProgress ?? false)

provide(documentFormKey, {
  category: 'RESIDENCY',
  textKey: props.textKey ?? stateTextKey,
  previousStep: props.previousStep,
  nextStep: nextStep,
  formFieldValue: 'typeDocumentResidency',
  document: document,
  storeAction: props.storeAction,
  userId: store.user.id,
  addData(formData) {
    if (props.categoryStep) {
      formData.append('categoryStep', props.categoryStep)
    }
    state.addData?.(formData)
  }
})

const submit = async () => {
  await analysisWrapper.value?.saveExplanation()
  if (props.onSubmitAction) {
    await props.onSubmitAction()
    return
  }
  AnalyticsService.validateFunnelStep(category)
  await router.push(nextStep)
}
</script>

<style scoped>
.success-text {
  color: var(--text-default-success);
}

.expected-list {
  margin: 0 0 0 1rem;
  list-style: none;
  padding-left: 0;
}

.expected-list-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
  margin-left: 1rem;
  color: var(--text-default-success);
}

.expected-list > .expected-list-item::marker {
  content: none;
}

.expected-list-item::before {
  content: '•';
  font-size: 1.25rem;
  line-height: 1;
  color: var(--text-default-success);
}
</style>
