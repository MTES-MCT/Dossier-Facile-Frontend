import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import AnalysisWrapper from '../analysis/AnalysisWrapper.vue'
import { AnalysisService, AnalysisStatus } from '@/services/AnalysisService'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  })
}))

vi.mock('@/services/AnalysisService', () => ({
  AnalysisStatus: {
    NO_ANALYSIS_SCHEDULED: 'NO_ANALYSIS_SCHEDULED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED'
  },
  AnalysisService: {
    getDocumentAnalysisStatus: vi.fn()
  }
}))

vi.mock('@/services/AnalyticsService', () => ({
  AnalyticsService: {
    document_analysis_timeout: vi.fn(),
    document_analysis_show_comment: vi.fn(),
    document_analysis_show_comment_from_link: vi.fn(),
    document_analysis_save_comment: vi.fn()
  }
}))

const mockCommentAnalysis = vi.fn().mockResolvedValue({})

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    user: { id: 123 },
    commentAnalysis: mockCommentAnalysis
  })
}))

vi.mock('@/components/toast/toastUtils', () => ({
  toast: {
    success: vi.fn()
  }
}))

const mockDocument = ref<DfDocument | undefined>({
  id: 42,
  files: [{ id: 1, name: 'tax.pdf', size: 1000 }],
  documentStatus: 'TO_PROCESS',
  documentAnalysisReport: undefined
} as unknown as DfDocument)

vi.mock('../documents/documentFormState', () => ({
  useDocumentFormKey: () => ({
    document: mockDocument
  })
}))

const mockBannersFocus = vi.fn()

const AnalysisBannersStub = defineComponent({
  name: 'AnalysisBanners',
  props: {
    failedRules: { type: Array, default: () => [] }
  },
  emits: ['explain'],
  setup(_, { emit, expose }) {
    expose({
      focus: mockBannersFocus
    })
    return () =>
      h('button', {
        type: 'button',
        class: 'emit-explain',
        onClick: () => emit('explain')
      })
  }
})

const DsfrButtonStub = defineComponent({
  name: 'DsfrButton',
  props: {
    label: { type: String, default: '' }
  },
  emits: ['click'],
  setup(props, { emit, attrs }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          onClick: () => emit('click')
        },
        props.label
      )
  }
})

function mountComponent(props?: { isUploading?: boolean; pollingTimoutMs?: number }) {
  return mount(AnalysisWrapper, {
    props,
    slots: {
      fileSpecificDescription: '<div class="description-slot"></div>',
      fileUploader: '<div class="uploader-slot"></div>'
    },
    global: {
      stubs: {
        AnalysisBanners: AnalysisBannersStub,
        DsfrBadge: true,
        DsfrButton: DsfrButtonStub
      }
    }
  })
}

function mockAnalysisResponse(status: string, failedRules?: unknown[]) {
  vi.mocked(AnalysisService.getDocumentAnalysisStatus).mockResolvedValue({
    data: {
      documentId: 42,
      status,
      analysisReport: failedRules ? { failedRules } : undefined
    }
  } as never)
}

describe('analysisWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    mockDocument.value = {
      id: 42,
      files: [{ id: 1, name: 'tax.pdf', size: 1000 }],
      documentStatus: 'TO_PROCESS',
      documentAnalysisReport: undefined
    } as unknown as DfDocument
    mockAnalysisResponse(AnalysisStatus.NO_ANALYSIS_SCHEDULED)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls getDocumentAnalysisStatus on mount', async () => {
    mountComponent()
    await flushPromises()

    expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(1)
    expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledWith(42)
  })

  it('stops polling and populates analysisFailedRules on COMPLETED', async () => {
    const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
    mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

    const wrapper = mountComponent()
    await flushPromises()

    expect(wrapper.vm.analysisFailedRules).toEqual(rules)
    expect(wrapper.vm.analysisInProgress).toBe(false)

    const initialCallCount = vi.mocked(AnalysisService.getDocumentAnalysisStatus).mock.calls.length

    await vi.advanceTimersByTimeAsync(6000)
    await flushPromises()
    expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(initialCallCount)
  })

  it('continues polling while IN_PROGRESS then stops on timeout', async () => {
    mockAnalysisResponse(AnalysisStatus.IN_PROGRESS)

    const wrapper = mountComponent()
    await flushPromises()

    expect(wrapper.vm.analysisInProgress).toBe(true)
    const initialCallCount = vi.mocked(AnalysisService.getDocumentAnalysisStatus).mock.calls.length

    await vi.advanceTimersByTimeAsync(3000)
    await flushPromises()
    expect(vi.mocked(AnalysisService.getDocumentAnalysisStatus).mock.calls.length).toBeGreaterThan(
      initialCallCount
    )

    await vi.advanceTimersByTimeAsync(8000)
    await flushPromises()

    expect(wrapper.vm.analysisInProgress).toBe(false)

    const countAfterTimeout = vi.mocked(AnalysisService.getDocumentAnalysisStatus).mock.calls.length
    await vi.advanceTimersByTimeAsync(6000)
    await flushPromises()
    expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(countAfterTimeout)
  })

  it('blocks submit and focuses banners when unresolved errors remain', async () => {
    const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
    mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

    const wrapper = mountComponent()
    await flushPromises()

    expect(wrapper.vm.beforeSubmit()).toBe(false)
    expect(mockBannersFocus).toHaveBeenCalledOnce()
  })

  it('blocks submit when upload is in progress', async () => {
    const wrapper = mountComponent({ isUploading: true })
    await flushPromises()

    expect(wrapper.vm.nextDisabled).toBe(true)
    expect(wrapper.vm.nextLabel).toBe('uploading')
    expect(wrapper.vm.beforeSubmit()).toBe(false)
  })

  it('saves explanation when text is provided', async () => {
    const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
    mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

    const wrapper = mountComponent()
    await flushPromises()

    await wrapper.find('.emit-explain').trigger('click')
    await flushPromises()

    const textarea = wrapper.find('#explainText')
    await textarea.setValue('Mon explication')
    await wrapper.find('.explain-form-actions button').trigger('click')
    await flushPromises()

    expect(mockCommentAnalysis).toHaveBeenCalledWith({
      documentId: 42,
      tenantId: 123,
      comment: 'Mon explication'
    })
    expect(wrapper.vm.explanationSubmitted).toBe(true)
  })

  it('shows error and does not save explanation when empty', async () => {
    const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
    mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

    const wrapper = mountComponent()
    await flushPromises()

    await wrapper.find('.explain-btn').trigger('click')
    await flushPromises()

    const textarea = wrapper.find('#explainText')
    await textarea.setValue('   ')
    await wrapper.find('.explain-form-actions button').trigger('click')
    await flushPromises()

    expect(mockCommentAnalysis).not.toHaveBeenCalled()
    expect(wrapper.find('#explainText-error').exists()).toBe(true)
  })
})
