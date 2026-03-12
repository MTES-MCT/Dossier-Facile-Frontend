import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import FrenchTaxForm from '../tax/FrenchTaxForm.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  }),
  createI18n: () => ({
    global: { t: (key: string) => key }
  })
}))

vi.mock('@/components/common/lib/useParentRoute', () => ({
  useParentRoute: () => ref('/')
}))

vi.mock('../tax/lib/taxYear', () => ({
  taxYear: 2025
}))

vi.mock('../documents/documentFormState', () => ({
  useDocumentFormKey: () => ({
    previousStep: '/',
    nextStep: '/next',
    document: ref(undefined),
    category: 'tax' as const,
    textKey: 'tenant' as const,
    userId: 123,
    action: 'saveTenantTax' as const
  })
}))

const mockAnalysisFailedRules = ref<unknown[]>([])
const mockExplanationSubmitted = ref(false)
const mockAnalysisInProgress = ref(false)
const mockIsUploading = ref(false)
const mockOpenExplainSection = vi.fn()
const mockBannersFocus = vi.fn()

const FakeAnalysisWrapper = defineComponent({
  name: 'AnalysisWrapper',
  setup(_, { expose, slots }) {
    expose({
      analysisFailedRules: mockAnalysisFailedRules,
      explanationSubmitted: mockExplanationSubmitted,
      analysisInProgress: mockAnalysisInProgress,
      openExplainSection: mockOpenExplainSection,
      focusBanners: mockBannersFocus
    })
    return () => h('div', [slots.fileSpecificDescription?.(), slots.fileUploader?.()])
  }
})

const FakeUploadFileTaxWithAnalysis = defineComponent({
  name: 'UploadFileTaxWithAnalysis',
  setup(_, { expose }) {
    expose({
      isUploading: mockIsUploading,
      currentDocument: ref(undefined)
    })
    return () => null
  }
})

const globalStubs = {
  BackLinkRow: true,
  TaxFooter: true,
  DfButton: true,
  DsfrAlert: true,
  VIcon: true,
  ModalComponent: true,
  'i18n-t': true
}

function mountComponent() {
  return mount(FrenchTaxForm, {
    global: {
      stubs: {
        ...globalStubs,
        AnalysisWrapper: FakeAnalysisWrapper,
        UploadFileTaxWithAnalysis: FakeUploadFileTaxWithAnalysis
      }
    }
  })
}

function getTaxFooterProps(wrapper: ReturnType<typeof mountComponent>) {
  const taxFooter = wrapper.findComponent({ name: 'TaxFooter' })
  return taxFooter.props() as {
    nextDisabled?: boolean
    nextLabel?: string
    beforeSubmit?: () => boolean
  }
}

describe('FrenchTaxForm - Continue button states', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAnalysisFailedRules.value = []
    mockExplanationSubmitted.value = false
    mockAnalysisInProgress.value = false
    mockIsUploading.value = false
  })

  it('uploading: nextLabel = uploading, nextDisabled = true, beforeSubmit blocks', async () => {
    mockIsUploading.value = true

    const wrapper = mountComponent()
    await flushPromises()

    const props = getTaxFooterProps(wrapper)
    expect(props.nextDisabled).toBe(true)
    expect(props.nextLabel).toBe('uploading')
    expect(props.beforeSubmit).toBeDefined()
    expect(props.beforeSubmit!()).toBe(false)
    expect(mockBannersFocus).not.toHaveBeenCalled()
  })

  it('analysis in progress: nextLabel = analyzing, nextDisabled = true, beforeSubmit blocks', async () => {
    mockAnalysisInProgress.value = true

    const wrapper = mountComponent()
    await flushPromises()

    const props = getTaxFooterProps(wrapper)
    expect(props.nextDisabled).toBe(true)
    expect(props.nextLabel).toBe('analyzing')
    expect(props.beforeSubmit).toBeDefined()
    expect(props.beforeSubmit!()).toBe(false)
    expect(mockBannersFocus).not.toHaveBeenCalled()
  })

  it('unresolved errors: nextDisabled = false, beforeSubmit focuses banners and blocks', async () => {
    mockAnalysisFailedRules.value = [
      { rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }
    ]
    mockExplanationSubmitted.value = false

    const wrapper = mountComponent()
    await flushPromises()

    const props = getTaxFooterProps(wrapper)
    expect(props.nextDisabled).toBe(false)
    expect(props.nextLabel).toBeUndefined()
    expect(props.beforeSubmit).toBeDefined()
    expect(props.beforeSubmit!()).toBe(false)
    expect(mockBannersFocus).toHaveBeenCalledOnce()
  })

  it('ready (no errors): nextDisabled = false, beforeSubmit allows submit', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const props = getTaxFooterProps(wrapper)
    expect(props.nextDisabled).toBe(false)
    expect(props.nextLabel).toBeUndefined()
    expect(props.beforeSubmit).toBeDefined()
    expect(props.beforeSubmit!()).toBe(true)
    expect(mockBannersFocus).not.toHaveBeenCalled()
  })

  it('ready (errors with explanation submitted): nextDisabled = false, beforeSubmit allows submit', async () => {
    mockAnalysisFailedRules.value = [
      { rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }
    ]
    mockExplanationSubmitted.value = true

    const wrapper = mountComponent()
    await flushPromises()

    const props = getTaxFooterProps(wrapper)
    expect(props.nextDisabled).toBe(false)
    expect(props.nextLabel).toBeUndefined()
    expect(props.beforeSubmit).toBeDefined()
    expect(props.beforeSubmit!()).toBe(true)
    expect(mockBannersFocus).not.toHaveBeenCalled()
  })
})
