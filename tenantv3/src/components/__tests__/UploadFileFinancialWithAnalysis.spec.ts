import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import UploadFileFinancialWithAnalysis from '../financial/lib/UploadFileFinancialWithAnalysis.vue'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'

type InternalSetup = {
  validateSum: (input: string) => string | true
  beforeUploadSave: () => boolean
  submit: () => Promise<void>
  isModalOpened: boolean
}
function setup(wrapper: VueWrapper): InternalSetup {
  return (wrapper.vm.$ as unknown as { setupState: InternalSetup }).setupState
}

const {
  mockPush,
  mockReplace,
  mockRoute,
  mockSaveTenantFinancial,
  mockToastError,
  mockDocuments,
  mockAddData
} = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return {
    mockPush: vi.fn().mockResolvedValue(undefined),
    mockReplace: vi.fn(),
    mockRoute: {
      params: { docId: 'ajouter' } as { docId: string },
      path: '/documents-locataire/4/ajouter/travail/salarie/plus-3-mois'
    },
    mockSaveTenantFinancial: vi.fn().mockResolvedValue({}),
    mockToastError: vi.fn(),
    mockDocuments: ref<DfDocument[]>([]),
    mockAddData: vi.fn()
  }
})

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key
    })
  }
})

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({ push: mockPush, replace: mockReplace })
}))

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    user: { id: 123 },
    saveTenantFinancial: mockSaveTenantFinancial
  })
}))

vi.mock('@/services/AnalyticsService', () => ({
  AnalyticsService: {
    writeText: vi.fn()
  }
}))

vi.mock('@/components/toast/toastUtils', () => ({
  toast: {
    error: mockToastError,
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  }
}))

vi.mock('@/composables/useInternalNavigation', () => ({
  useHandleValidationNavigation: () => ({
    getNavigationNextStep: () => '/next-step'
  })
}))

vi.mock('../financial/financialState', () => ({
  financialKey: Symbol('financialKey'),
  useFinancialState: () => ({
    previousStep: '/recap',
    nextStep: '/next',
    recap: '/recap',
    documents: mockDocuments,
    category: 'financial',
    textKey: 'tenant',
    userId: 123,
    action: 'saveTenantFinancial',
    addData: mockAddData,
    suffix: 'tenant'
  })
}))

const globalStubs = {
  AnalysisWrapper: true,
  UploadFileWithAnalysis: true,
  AnalysisFooter: true,
  DsfrModalPatch: true,
  'i18n-t': true
}

function makeDocument(overrides: Partial<DfDocument> = {}): DfDocument {
  return {
    id: 42,
    documentCategory: 'FINANCIAL',
    documentSubCategory: 'SALARY',
    documentCategoryStep: 'SALARY_EMPLOYED_MORE_3_MONTHS',
    monthlySum: 2000,
    files: [],
    ...overrides
  } as unknown as DfDocument
}

function mountComponent(props?: { minFiles?: number }) {
  return mount(UploadFileFinancialWithAnalysis, {
    props: { ...props },
    global: { stubs: globalStubs }
  })
}

describe('UploadFileFinancialWithAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDocuments.value = []
    mockRoute.params = { docId: 'ajouter' }
    mockRoute.path = '/documents-locataire/4/ajouter/travail/salarie/plus-3-mois'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('validateSum', () => {
    it.each([
      { input: '', expected: 'field-required' },
      { input: '1500.50', expected: 'round-it' },
      { input: '1500,50', expected: 'round-it' },
      { input: 'abc', expected: 'regex-not-valid' },
      { input: '0', expected: 'amount-zero' }
    ])('returns "$expected" for input "$input"', ({ input, expected }) => {
      const wrapper = mountComponent()
      expect(setup(wrapper).validateSum(input)).toBe(expected)
    })

    it('returns true for valid integer values (with or without spaces)', () => {
      const wrapper = mountComponent()
      expect(setup(wrapper).validateSum('1500')).toBe(true)
      expect(setup(wrapper).validateSum('1 500')).toBe(true)
    })
  })

  describe('beforeUploadSave', () => {
    it('returns false and triggers an error toast when monthlySum is 0', () => {
      // Default state: no document found → makeNewDocument with no monthlySum
      const wrapper = mountComponent()

      const result = setup(wrapper).beforeUploadSave()

      expect(result).toBe(false)
      expect(mockToastError).toHaveBeenCalledTimes(1)
      expect(mockToastError).toHaveBeenCalledWith('valid-monthly-sum', expect.anything())
    })

    it('returns true when monthlySum is correct', async () => {
      mockRoute.params = { docId: '42' }
      mockRoute.path = '/documents-locataire/4/42/travail/salarie/plus-3-mois'
      mockDocuments.value = [makeDocument({ monthlySum: 2000 })]

      const wrapper = mountComponent()
      await flushPromises()

      const result = setup(wrapper).beforeUploadSave()

      expect(result).toBe(true)
      expect(mockToastError).not.toHaveBeenCalled()
    })
  })

  describe('submit', () => {
    it('opens the "not enough docs" modal when files.length is below minFiles', async () => {
      mockRoute.params = { docId: '42' }
      mockRoute.path = '/documents-locataire/4/42/travail/salarie/plus-3-mois'
      mockDocuments.value = [
        makeDocument({
          files: [{ id: 1, name: 'p1.pdf', size: 100 }] as never
        })
      ]

      const wrapper = mountComponent({ minFiles: 3 })
      await flushPromises()

      await setup(wrapper).submit()

      expect(setup(wrapper).isModalOpened).toBe(true)
      expect(mockToastError).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('shows a "no-file" toast and does not open the modal when files is empty', async () => {
      mockRoute.params = { docId: '42' }
      mockRoute.path = '/documents-locataire/4/42/travail/salarie/plus-3-mois'
      mockDocuments.value = [makeDocument({ files: [] })]

      const wrapper = mountComponent({ minFiles: 3 })
      await flushPromises()

      await setup(wrapper).submit()

      expect(mockToastError).toHaveBeenCalledWith('errors.no-file', undefined)
      expect(setup(wrapper).isModalOpened).toBe(false)
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('watch on documents – route update on ID change', () => {
    it('replaces docId in route when store document ID changes', async () => {
      mockRoute.params = { docId: '791' }
      mockRoute.path = '/documents-locataire/4/791/travail/salarie/plus-3-mois'
      mockDocuments.value = [makeDocument({ id: 791 })]

      mountComponent()
      await flushPromises()

      mockDocuments.value = [makeDocument({ id: 792 })]
      await flushPromises()

      expect(mockReplace).toHaveBeenCalledWith(
        '/documents-locataire/4/792/travail/salarie/plus-3-mois'
      )
    })

    it('still works for /ajouter/ routes (existing behavior)', async () => {
      mockRoute.params = { docId: 'ajouter' }
      mockRoute.path = '/documents-locataire/4/ajouter/travail/salarie/plus-3-mois'

      mountComponent()
      await flushPromises()

      mockDocuments.value = [makeDocument({ id: 100 })]
      await flushPromises()

      expect(mockReplace).toHaveBeenCalledWith(
        '/documents-locataire/4/100/travail/salarie/plus-3-mois'
      )
    })

    it('does nothing when docId matches the store document', async () => {
      mockRoute.params = { docId: '42' }
      mockRoute.path = '/documents-locataire/4/42/travail/salarie/plus-3-mois'
      mockDocuments.value = [makeDocument({ id: 42 })]

      mountComponent()
      await flushPromises()

      mockDocuments.value = [makeDocument({ id: 42, monthlySum: 3000 })]
      await flushPromises()

      expect(mockReplace).not.toHaveBeenCalled()
    })
  })
})
