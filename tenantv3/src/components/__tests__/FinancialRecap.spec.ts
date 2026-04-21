import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { config, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import FinancialRecap from '../financial/FinancialRecap.vue'
import FinancialRecapSource from '../financial/FinancialRecap.vue?raw'

const LOCALE = 'fr'

const inlineI18nMatch = FinancialRecapSource.match(/<i18n\s+lang="json"\s*>([\s\S]*?)<\/i18n>/)
const inlineI18nMessages = JSON.parse(inlineI18nMatch![1])
const messages = inlineI18nMessages[LOCALE]
const errorLabelOne = messages['errors-to-fix'].split('|')[0].trim().replace('{count}', '1')
const errorLabelMany = messages['errors-to-fix'].split('|')[1].trim().replace('{count}', '3')
const toProcessLabel = messages['to-process']

const { mockDocuments } = vi.hoisted(() => {
  const { ref } = require('vue') as typeof import('vue')
  return {
    mockDocuments: ref<DfDocument[]>([])
  }
})

vi.mock('vue-router', () => ({
  useRoute: () => ({ path: '/documents-locataire/4' }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  RouterLink: {
    props: ['to'],
    template: '<a :href="to"><slot /></a>'
  }
}))

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    user: { id: 1 },
    deleteDocument: vi.fn().mockResolvedValue(undefined)
  })
}))

vi.mock('@/services/AnalyticsService', () => ({
  AnalyticsService: {
    addIncome: vi.fn(),
    deleteIncome: vi.fn()
  }
}))

vi.mock('@/components/toast/toastUtils', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  }
}))

vi.mock('vue-loading-overlay', () => ({
  useLoading: () => ({ show: () => ({ hide: vi.fn() }) })
}))

vi.mock('@/composables/useInternalNavigation', () => ({
  CATEGORY_TO_PATH: {},
  STEP_TO_PATH: {}
}))

vi.mock('@/components/financial/financialState', () => ({
  financialKey: Symbol('financialKey'),
  useFinancialState: () => ({
    previousStep: '/previous',
    nextStep: '/next',
    recap: '/recap',
    documents: mockDocuments,
    category: 'financial',
    textKey: 'tenant',
    userId: 1,
    action: 'saveTenantFinancial',
    suffix: 'tenant'
  })
}))

const i18n = createI18n({
  legacy: false,
  locale: LOCALE,
  fallbackLocale: LOCALE,
  messages: { [LOCALE]: messages }
})

const globalStubs = {
  NakedCard: { template: '<div><slot /></div>' },
  SimulationCaf: true,
  FinancialFooter: { template: '<div><slot /></div>' },
  DsfrAlert: { template: '<div><slot /></div>' },
  DsfrModalPatch: true,
  TenantBadge: true,
  GuarantorBadge: true,
  RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' }
}

function reportWithFailedRules(
  count: number,
  comment?: string
): DfDocument['documentAnalysisReport'] {
  return {
    id: 1,
    analysisStatus: 'DENIED',
    failedRules: Array.from({ length: count }, (_, i) => ({
      rule: `R_RULE_${i}`,
      message: `message ${i}`,
      level: 'ERROR'
    })),
    passedRules: [],
    inconclusiveRules: [],
    comment,
    createdAt: '2026-04-20T00:00:00Z'
  } as unknown as DfDocument['documentAnalysisReport']
}

function makeDocument(overrides: Partial<DfDocument> = {}): DfDocument {
  return {
    id: 42,
    documentCategory: 'FINANCIAL',
    documentSubCategory: 'SALARY',
    documentCategoryStep: 'SALARY_EMPLOYED_MORE_3_MONTHS',
    documentStatus: 'TO_PROCESS',
    monthlySum: 1200,
    files: [],
    ...overrides
  } as DfDocument
}

function mountComponent(documents: DfDocument[]) {
  mockDocuments.value = documents
  return mount(FinancialRecap, {
    global: {
      stubs: globalStubs,
      plugins: [i18n]
    }
  })
}

describe('FinancialRecap - error badge', () => {
  const originalMocks = { ...config.global.mocks }

  beforeAll(() => {
    config.global.mocks = {}
  })

  afterAll(() => {
    config.global.mocks = originalMocks
  })

  const ERROR_BADGE_SELECTOR = '.fr-badge--warning'

  it('shows the "waiting to be processed" pill and no error badge when the document has no failed rules', () => {
    const wrapper = mountComponent([makeDocument()])

    const card = wrapper.get('.income-card')
    expect(card.find('.pill.to-process').exists()).toBe(true)
    expect(card.find(ERROR_BADGE_SELECTOR).exists()).toBe(false)
    expect(card.text()).toContain(toProcessLabel)
  })

  it('shows the error badge (singular) and hides the "waiting to be processed" pill when there is 1 failed rule', () => {
    const wrapper = mountComponent([
      makeDocument({
        documentAnalysisReport: reportWithFailedRules(1)
      })
    ])

    const card = wrapper.get('.income-card')
    const errorBadge = card.get(ERROR_BADGE_SELECTOR)
    expect(errorBadge.text()).toBe(errorLabelOne)
    expect(card.find('.pill.to-process').exists()).toBe(false)
  })

  it('uses the plural form when there are several failed rules', () => {
    const wrapper = mountComponent([
      makeDocument({
        documentAnalysisReport: reportWithFailedRules(3)
      })
    ])

    const errorBadge = wrapper.get(ERROR_BADGE_SELECTOR)
    expect(errorBadge.text()).toBe(errorLabelMany)
  })

  it('hides the error badge and keeps the "waiting to be processed" pill when an explanation was submitted', () => {
    const wrapper = mountComponent([
      makeDocument({
        documentAnalysisReport: reportWithFailedRules(2, 'explanation')
      })
    ])

    const card = wrapper.get('.income-card')
    expect(card.find(ERROR_BADGE_SELECTOR).exists()).toBe(false)
    expect(card.find('.pill.to-process').exists()).toBe(true)
    expect(card.text()).toContain(toProcessLabel)
  })

  it.each([
    { status: 'VALIDATED' as const, pillClass: '.pill.validated' },
    { status: 'DECLINED' as const, pillClass: '.pill.declined' }
  ])(
    'keeps the "$status" pill and hides the error badge even when the document has failed rules',
    ({ status, pillClass }) => {
      const wrapper = mountComponent([
        makeDocument({
          documentStatus: status,
          documentAnalysisReport: reportWithFailedRules(1)
        })
      ])

      const card = wrapper.get('.income-card')
      expect(card.find(ERROR_BADGE_SELECTOR).exists()).toBe(false)
      expect(card.find(pillClass).exists()).toBe(true)
    }
  )
})
