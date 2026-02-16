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

  describe('Polling - démarrage au mount', () => {
    it('appelle getDocumentAnalysisStatus au montage', async () => {
      mockAnalysisResponse(AnalysisStatus.NO_ANALYSIS_SCHEDULED)
      mountComponent()
      await flushPromises()

      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(1)
    })
  })

  describe('Polling - arrêt quand COMPLETED', () => {
    it('arrête le polling et remplit analysisFailedRules', async () => {
      const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
      mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

      const wrapper = mountComponent()
      await flushPromises()

      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.analysisFailedRules).toEqual(rules)
      expect(wrapper.vm.analysisInProgress).toBe(false)

      // Avancer le temps : pas de nouvel appel (polling arrêté)
      await vi.advanceTimersByTimeAsync(6000)
      await flushPromises()
      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(1)
    })
  })

  describe('Polling - arrêt quand NO_ANALYSIS_SCHEDULED', () => {
    it('arrête le polling et met analysisInProgress à false', async () => {
      mockAnalysisResponse(AnalysisStatus.NO_ANALYSIS_SCHEDULED)

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.vm.analysisInProgress).toBe(false)
      expect(wrapper.vm.analysisFailedRules).toEqual([])

      // Avancer le temps : pas de nouvel appel
      await vi.advanceTimersByTimeAsync(6000)
      await flushPromises()
      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(1)
    })
  })

  describe('Polling - timeout après POLLING_TIMEOUT_MS', () => {
    it('arrête le polling après le timeout même si IN_PROGRESS', async () => {
      mockAnalysisResponse(AnalysisStatus.IN_PROGRESS)

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.vm.analysisInProgress).toBe(true)

      // Avancer au-delà du timeout (10s)
      await vi.advanceTimersByTimeAsync(11000)
      await flushPromises()

      expect(wrapper.vm.analysisInProgress).toBe(false)

      // Vérifier que le polling ne continue plus
      const callCount = vi.mocked(AnalysisService.getDocumentAnalysisStatus).mock.calls.length
      await vi.advanceTimersByTimeAsync(6000)
      await flushPromises()
      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(callCount)
    })
  })

  describe('Polling - continue tant que IN_PROGRESS', () => {
    it('continue à appeler le service toutes les 3s', async () => {
      mockAnalysisResponse(AnalysisStatus.IN_PROGRESS)

      const wrapper = mountComponent()
      await flushPromises()

      // Appel initial au mount
      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.analysisInProgress).toBe(true)

      // Avancer de 3s → 2e appel
      await vi.advanceTimersByTimeAsync(3000)
      await flushPromises()
      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(2)

      // Avancer de 3s → 3e appel
      await vi.advanceTimersByTimeAsync(3000)
      await flushPromises()
      expect(AnalysisService.getDocumentAnalysisStatus).toHaveBeenCalledTimes(3)

      expect(wrapper.vm.analysisInProgress).toBe(true)
    })
  })


  describe('Suppression - reset de l\'état d\'analyse', () => {
    it('réinitialise analysisInProgress, analysisFailedRules et explainText', async () => {
      // D'abord monter avec COMPLETED + failedRules
      const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
      mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

      const wrapper = mountComponent()
      await flushPromises()

      expect(wrapper.vm.analysisFailedRules).toEqual(rules)

      // Préparer le mock pour le polling qui redémarre après remove
      mockAnalysisResponse(AnalysisStatus.NO_ANALYSIS_SCHEDULED)

      // Simuler un remove via l'événement du ListItem
      // On accède directement à la fonction expose n'est pas suffisant, on appelle remove via le composant
      const file = { id: 1, name: 'tax.pdf', size: 1000 }
      await wrapper.vm.$.setupState.remove(file)
      await flushPromises()

      expect(RegisterService.deleteFile).toHaveBeenCalledWith(1, false)
      expect(wrapper.vm.analysisInProgress).toBe(false)
      expect(wrapper.vm.analysisFailedRules).toEqual([])
    })
  })

  describe('Explication - sauvegarde du commentaire', () => {
    it('appelle commentAnalysis avec les bons paramètres', async () => {
      const rules = [{ rule: 'R_TAX_YEARS', message: 'Bad year', level: 'ERROR', ruleData: null }]
      mockAnalysisResponse(AnalysisStatus.COMPLETED, rules)

      const wrapper = mountComponent()
      await flushPromises()

      // Accéder à saveExplanation via le setup state interne
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
  })
})
