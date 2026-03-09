import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import UploadFilesTax from '../tax/lib/UploadFilesTax.vue'
import { AnalysisService, AnalysisStatus } from '@/services/AnalysisService'
import { RegisterService } from '@/services/RegisterService'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  })
}))

// Mock AnalysisService
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

// Mock RegisterService
vi.mock('@/services/RegisterService', () => ({
  RegisterService: {
    deleteFile: vi.fn().mockResolvedValue(undefined)
  }
}))

// Mock AnalyticsService
vi.mock('@/services/AnalyticsService', () => ({
  AnalyticsService: {
    uploadFile: vi.fn(),
    deleteDocument: vi.fn(),
    cancelDelete: vi.fn(),
    deleteFile: vi.fn(),
    removeDeniedDocument: vi.fn()
  }
}))

// Mock PdfAnalysisService
vi.mock('@/services/PdfAnalysisService', () => ({
  PdfAnalysisService: {
    includesRejectedTaxDocuments: vi.fn().mockResolvedValue(false)
  }
}))

// Mock UtilsService
vi.mock('@/services/UtilsService', () => ({
  UtilsService: {
    handleCommonSaveError: vi.fn()
  }
}))

// Mock vue-loading-overlay
vi.mock('vue-loading-overlay', () => ({
  useLoading: () => ({
    show: () => ({ hide: vi.fn() })
  })
}))

// Mock toast
vi.mock('@/components/toast/toastUtils', () => ({
  toast: {
    success: vi.fn(),
    maxFileError: vi.fn(),
    deleteFileFailed: vi.fn()
  }
}))

// Mock taxState
const mockDocument = ref<DfDocument | undefined>({
  id: 42,
  files: [{ id: 1, name: 'tax.pdf', size: 1000 }],
  documentStatus: 'TO_PROCESS',
  documentAnalysisReport: undefined
} as unknown as DfDocument)

const mockTaxState = {
  previousStep: '/',
  nextStep: '/',
  document: mockDocument,
  category: 'tax' as const,
  textKey: 'tenant' as const,
  userId: 123,
  action: 'saveTenantTax' as const
}

vi.mock('../tax/lib/taxState', () => ({
  useTaxState: () => mockTaxState
}))

// Mock tenant store
const mockCommentAnalysis = vi.fn().mockResolvedValue({})
const mockSaveTenantTax = vi.fn().mockResolvedValue({})

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    saveTenantTax: mockSaveTenantTax,
    saveGuarantorTax: vi.fn(),
    commentAnalysis: mockCommentAnalysis
  })
}))

const globalStubs = {
  FileUpload: true,
  ListItem: true,
  AllDeclinedMessages: true,
  TaxAnalysisBanners: true,
  ModalComponent: true,
  DfButton: true,
  RiAlarmWarningLine: true,
  RiContractUpDownLine: true,
  RiInformationFill: true
}

function mountComponent() {
  return mount(UploadFilesTax, {
    props: { category: 'my-new-tax' as never },
    global: {
      stubs: globalStubs
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

describe('UploadFilesTax', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    mockDocument.value = {
      id: 42,
      files: [{ id: 1, name: 'tax.pdf', size: 1000 }],
      documentStatus: 'TO_PROCESS',
      documentAnalysisReport: undefined
    } as unknown as DfDocument
    // Default: no analysis scheduled
    mockAnalysisResponse(AnalysisStatus.NO_ANALYSIS_SCHEDULED)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Polling - start on mount', () => {
    it('calls getDocumentAnalysisStatus on mount', async () => {
      mockAnalysisResponse(AnalysisStatus.NO_ANALYSIS_SCHEDULED)
      mountComponent()
      await flushPromises()

      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(1)
    })
  })

  describe('Polling - stops when COMPLETED', () => {
    it('stops polling and populates analysisFailedRules', async () => {
      const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
      mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

      const wrapper = mountComponent()
      await flushPromises()

      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.analysisFailedRules).toEqual(rules)
      expect(wrapper.vm.analysisInProgress).toBe(false)

      // Fast-forward time: no new call (polling stopped)
      await vi.advanceTimersByTimeAsync(6000)
      await flushPromises()
      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(1)
    })
  })

  describe('Polling - stops when NO_ANALYSIS_SCHEDULED', () => {
    it('stops polling and sets analysisInProgress to false', async () => {
      mockAnalysisResponse(AnalysisStatus.NO_ANALYSIS_SCHEDULED)

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.vm.analysisInProgress).toBe(false)
      expect(wrapper.vm.analysisFailedRules).toEqual([])

      // Fast-forward time: no new call
      await vi.advanceTimersByTimeAsync(6000)
      await flushPromises()
      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(1)
    })
  })

  describe('Polling - timeout after POLLING_TIMEOUT_MS', () => {
    it('stops polling after timeout even if IN_PROGRESS', async () => {
      mockAnalysisResponse(AnalysisStatus.IN_PROGRESS)

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.vm.analysisInProgress).toBe(true)

      // Fast-forward beyond timeout (10s)
      await vi.advanceTimersByTimeAsync(11000)
      await flushPromises()

      expect(wrapper.vm.analysisInProgress).toBe(false)

      // Verify polling no longer continues
      const callCount = vi.mocked(AnalysisService.getDocumentAnalysisStatus).mock.calls.length
      await vi.advanceTimersByTimeAsync(6000)
      await flushPromises()
      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(callCount)
    })
  })

  describe('Polling - continues while IN_PROGRESS', () => {
    it('keeps calling the service every 3s', async () => {
      mockAnalysisResponse(AnalysisStatus.IN_PROGRESS)

      const wrapper = mountComponent()
      await flushPromises()

      // Initial call on mount
      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.analysisInProgress).toBe(true)

      // Fast-forward 3s -> 2nd call
      await vi.advanceTimersByTimeAsync(3000)
      await flushPromises()
      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(2)

      // Fast-forward 3s -> 3rd call
      await vi.advanceTimersByTimeAsync(3000)
      await flushPromises()
      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(3)

      expect(wrapper.vm.analysisInProgress).toBe(true)
    })
  })

  describe('Deletion - resets analysis state', () => {
    it('resets analysisInProgress, analysisFailedRules and explainText', async () => {
      // First mount with COMPLETED + failedRules
      const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
      mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.vm.analysisFailedRules).toEqual(rules)

      // Prepare mock for polling restart after remove
      mockAnalysisResponse(AnalysisStatus.NO_ANALYSIS_SCHEDULED)

      // Simulate remove via the component's internal function
      const file = { id: 1, name: 'tax.pdf', size: 1000 }
      await wrapper.vm.$.setupState.remove(file)
      await flushPromises()

      expect(RegisterService.deleteFile).toHaveBeenCalledWith(1, false)
      expect(wrapper.vm.analysisInProgress).toBe(false)
      expect(wrapper.vm.analysisFailedRules).toEqual([])
    })
  })

  describe('Explanation - save comment', () => {
    it('calls commentAnalysis with correct parameters', async () => {
      const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
      mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

      const wrapper = mountComponent()
      await flushPromises()

      // Access saveExplanation via internal setup state
      // setupState auto-unwraps refs, so assign directly without .value
      wrapper.vm.$.setupState.explainText = 'Mon explication'
      wrapper.vm.$.setupState.saveExplanation()
      await flushPromises()

      expect(mockCommentAnalysis).toHaveBeenCalledWith({
        documentId: 42,
        tenantId: 123,
        comment: 'Mon explication'
      })
      expect(wrapper.vm.explanationSubmitted).toBe(true)
    })

    it('shows error and does not call API when explanation is empty', async () => {
      const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
      mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

      const wrapper = mountComponent()
      await flushPromises()

      wrapper.vm.$.setupState.explainText = ''
      wrapper.vm.$.setupState.saveExplanation()
      await flushPromises()

      expect(mockCommentAnalysis).not.toHaveBeenCalled()
      expect(wrapper.vm.$.setupState.showExplainError).toBe(true)
    })

    it('shows error and does not call API when explanation is whitespace only', async () => {
      const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
      mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

      const wrapper = mountComponent()
      await flushPromises()

      wrapper.vm.$.setupState.explainText = '   '
      wrapper.vm.$.setupState.saveExplanation()
      await flushPromises()

      expect(mockCommentAnalysis).not.toHaveBeenCalled()
      expect(wrapper.vm.$.setupState.showExplainError).toBe(true)
    })
  })
})
