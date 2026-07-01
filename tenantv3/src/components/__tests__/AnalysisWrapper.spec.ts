import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import AnalysisWrapper from '../analysis/AnalysisWrapper.vue'
import { AnalysisService, AnalysisStatus } from '@/services/AnalysisService'
import { toast } from '@/components/toast/toastUtils'
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

const saveDocumentCommentImpl = async (params: {
  documentId: number
  tenantId: number
  comment: string
}) => {
  const report = mockStoreDocument.value?.documentAnalysisReport
  if (report) {
    report.comment = params.comment
  }
}
const mockSaveDocumentComment = vi.fn(saveDocumentCommentImpl)

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    user: { id: 123 },
    saveDocumentComment: mockSaveDocumentComment,
    updateDocumentAnalysisReport: vi.fn()
  })
}))

vi.mock('@/components/toast/toastUtils', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const mockStoreDocument = ref<DfDocument | undefined>({
  id: 42,
  files: [{ id: 1, name: 'tax.pdf', size: 1000 }],
  documentStatus: 'TO_PROCESS',
  documentAnalysisReport: undefined
} as unknown as DfDocument)

vi.mock('../documents/documentFormState', () => ({
  useDocumentFormKey: () => ({
    document: mockStoreDocument
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

function mountComponent(props?: { isUploading?: boolean; pollingTimeoutMs?: number }) {
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
    // Restore the default impl: a previous test may have overridden it via mockReturnValue.
    mockSaveDocumentComment.mockImplementation(saveDocumentCommentImpl)
    vi.useFakeTimers()
    mockStoreDocument.value = {
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
    mockStoreDocument.value = {
      ...mockStoreDocument.value,
      documentAnalysisReport: { failedRules: rules }
    } as unknown as DfDocument
    mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

    const wrapper = mountComponent()
    await flushPromises()

    // No auto-focus on mount: banners were already present from the document report
    expect(mockBannersFocus).not.toHaveBeenCalled()

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

    expect(wrapper.vm.beforeSubmit()).toBe(true)
    await wrapper.vm.saveExplanation()
    await flushPromises()

    expect(mockSaveDocumentComment).toHaveBeenCalledWith({
      documentId: 42,
      tenantId: 123,
      comment: 'Mon explication'
    })
    expect(wrapper.vm.explanationSubmitted).toBe(true)
  })

  it('blocks submit and shows error when explain form is open but text is empty', async () => {
    const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
    mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

    const wrapper = mountComponent()
    await flushPromises()

    await wrapper.find('.explain-btn').trigger('click')
    await flushPromises()

    const textarea = wrapper.find('#explainText')
    await textarea.setValue('   ')

    expect(wrapper.vm.beforeSubmit()).toBe(false)
    await flushPromises()
    expect(wrapper.find('#explainText-error').exists()).toBe(true)
    expect(mockSaveDocumentComment).not.toHaveBeenCalled()
  })

  it('skips save when no explain form is shown', async () => {
    mockAnalysisResponse(AnalysisStatus.NO_ANALYSIS_SCHEDULED)

    const wrapper = mountComponent()
    await flushPromises()

    await wrapper.vm.saveExplanation()
    await flushPromises()

    expect(mockSaveDocumentComment).not.toHaveBeenCalled()
  })

  // This test simulates a user clicking twice on the next button
  it('does not save twice when called concurrently', async () => {
    let resolveApi!: () => void
    const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
    mockStoreDocument.value = {
      ...mockStoreDocument.value,
      documentAnalysisReport: { failedRules: rules }
    } as unknown as DfDocument
    // Keep the first POST in flight so the second call lands while a save is still running.
    mockSaveDocumentComment.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveApi = resolve
        })
    )
    mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

    const wrapper = mountComponent()
    await flushPromises()

    await wrapper.find('.emit-explain').trigger('click')
    await flushPromises()
    await wrapper.find('#explainText').setValue('Mon explication')

    // First call flushes the debounce and starts the single in-flight POST.
    const first = wrapper.vm.saveExplanation()
    await flushPromises()
    // Second concurrent call finds nothing pending to flush and just awaits the same save.
    const second = wrapper.vm.saveExplanation()

    resolveApi()
    await first
    await second
    await flushPromises()

    expect(mockSaveDocumentComment).toHaveBeenCalledTimes(1)
  })

  it('saves updated explanation when comment was already submitted', async () => {
    const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
    mockStoreDocument.value = {
      ...mockStoreDocument.value,
      documentAnalysisReport: { failedRules: rules, comment: 'ancien commentaire' }
    } as unknown as DfDocument
    mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

    const wrapper = mountComponent()
    await flushPromises()

    expect(wrapper.find('#explainText').element).toHaveProperty('value', 'ancien commentaire')
    expect(wrapper.vm.explanationSubmitted).toBe(true)

    await wrapper.find('#explainText').setValue('nouveau commentaire')
    await wrapper.vm.saveExplanation()
    await flushPromises()

    expect(mockSaveDocumentComment).toHaveBeenCalledWith({
      documentId: 42,
      tenantId: 123,
      comment: 'nouveau commentaire'
    })
  })

  it('skips save when text matches the existing document comment', async () => {
    const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
    mockStoreDocument.value = {
      ...mockStoreDocument.value,
      documentAnalysisReport: { failedRules: rules, comment: 'même texte' }
    } as unknown as DfDocument
    mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

    const wrapper = mountComponent()
    await flushPromises()

    expect(wrapper.find('#explainText').element).toHaveProperty('value', 'même texte')

    await wrapper.vm.saveExplanation()
    await flushPromises()

    expect(mockSaveDocumentComment).not.toHaveBeenCalled()
  })

  async function mountWithOpenExplainForm() {
    const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
    mockStoreDocument.value = {
      ...mockStoreDocument.value,
      documentAnalysisReport: { failedRules: rules }
    } as unknown as DfDocument
    mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

    const wrapper = mountComponent()
    await flushPromises()
    await wrapper.find('.emit-explain').trigger('click')
    await flushPromises()
    return wrapper
  }

  it('auto-saves while typing after the debounce delay', async () => {
    const wrapper = await mountWithOpenExplainForm()

    await wrapper.find('#explainText').setValue('Explication auto')
    expect(mockSaveDocumentComment).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1000)
    await flushPromises()

    expect(mockSaveDocumentComment).toHaveBeenCalledTimes(1)
    expect(mockSaveDocumentComment).toHaveBeenCalledWith({
      documentId: 42,
      tenantId: 123,
      comment: 'Explication auto'
    })
  })

  it('coalesces rapid keystrokes into a single save', async () => {
    const wrapper = await mountWithOpenExplainForm()

    const textarea = wrapper.find('#explainText')
    await textarea.setValue('A')
    await textarea.setValue('AB')
    await textarea.setValue('ABC')

    await vi.advanceTimersByTimeAsync(1000)
    await flushPromises()

    expect(mockSaveDocumentComment).toHaveBeenCalledTimes(1)
    expect(mockSaveDocumentComment).toHaveBeenCalledWith({
      documentId: 42,
      tenantId: 123,
      comment: 'ABC'
    })
  })

  it('flushes the pending save immediately on blur', async () => {
    const wrapper = await mountWithOpenExplainForm()

    const textarea = wrapper.find('#explainText')
    await textarea.setValue('Avant navigation')
    expect(mockSaveDocumentComment).not.toHaveBeenCalled()

    await textarea.trigger('blur')
    await flushPromises()

    expect(mockSaveDocumentComment).toHaveBeenCalledTimes(1)
    expect(mockSaveDocumentComment).toHaveBeenCalledWith({
      documentId: 42,
      tenantId: 123,
      comment: 'Avant navigation'
    })
  })

  it('shows a success toast when the explanation is saved', async () => {
    const wrapper = await mountWithOpenExplainForm()

    const textarea = wrapper.find('#explainText')
    await textarea.setValue('Texte enregistré')
    await textarea.trigger('blur')
    await flushPromises()

    expect(toast.success).toHaveBeenCalledWith('explanation-saved', undefined)
  })

  it('does not auto-save empty text', async () => {
    const wrapper = await mountWithOpenExplainForm()

    await wrapper.find('#explainText').setValue('   ')
    await vi.advanceTimersByTimeAsync(1000)
    await flushPromises()

    expect(mockSaveDocumentComment).not.toHaveBeenCalled()
  })

  it('cancels the pending debounced save on unmount', async () => {
    const wrapper = await mountWithOpenExplainForm()

    await wrapper.find('#explainText').setValue('Sera annulé')
    wrapper.unmount()

    await vi.advanceTimersByTimeAsync(1000)
    await flushPromises()

    expect(mockSaveDocumentComment).not.toHaveBeenCalled()
  })

  // "Continue" awaits saveExplanation; a rejection lets the footer block navigation.
  it('rejects and shows a toast when the save fails', async () => {
    mockSaveDocumentComment.mockRejectedValueOnce(new Error('network'))
    const wrapper = await mountWithOpenExplainForm()

    await wrapper.find('#explainText').setValue('Explication')

    await expect(wrapper.vm.saveExplanation()).rejects.toThrow()
    await flushPromises()

    expect(toast.error).toHaveBeenCalled()
  })

  it('blocks submit when a previously-saved explanation is cleared', async () => {
    const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
    mockStoreDocument.value = {
      ...mockStoreDocument.value,
      documentAnalysisReport: { failedRules: rules, comment: 'ancien commentaire' }
    } as unknown as DfDocument
    mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

    const wrapper = mountComponent()
    await flushPromises()

    // Pre-filled with the saved explanation: submit is allowed.
    expect(wrapper.find('#explainText').element).toHaveProperty('value', 'ancien commentaire')
    expect(wrapper.vm.beforeSubmit()).toBe(true)

    // Clearing the field must block submit again and surface the error.
    await wrapper.find('#explainText').setValue('')
    expect(wrapper.vm.beforeSubmit()).toBe(false)
    await flushPromises()
    expect(wrapper.find('#explainText-error').exists()).toBe(true)
  })
})
