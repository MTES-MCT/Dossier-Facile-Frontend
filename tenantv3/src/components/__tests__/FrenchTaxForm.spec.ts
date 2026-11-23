import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { computed, defineComponent, h, ref, type PropType } from 'vue'
import FrenchTaxForm from '../tax/FrenchTaxForm.vue'
import TaxAnalysisGuidance from '../tax/lib/TaxAnalysisGuidance.vue'
import { TaxAnalysisErrorStrategy } from '../analysis/strategies/TaxAnalysisErrorStrategy'
import type { User } from 'df-shared-next/src/models/User'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'

const mockRouterPush = vi.fn()
const mockRoute = { params: { tenantId: '12', guarantorId: '34', step: '4' } }
const mockUser: Pick<User, 'ownerType' | 'tenantType' | 'franceConnect'> = {}
vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({ user: mockUser, isFranceConnected: mockUser.franceConnect })
}))
let mockTextKey: 'tenant' | 'couple' | 'guarantor' | 'couple-guarantor' = 'tenant'
vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue-router')>()),
  useRouter: () => ({ push: mockRouterPush }),
  useRoute: () => mockRoute
}))
vi.mock('@/services/AnalyticsService', () => ({
  AnalyticsService: { validateFunnelStep: vi.fn() }
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  }),
  createI18n: () => ({
    global: { t: (key: string) => key }
  })
}))

vi.mock('@/components/common/lib/useParentRoute', () => ({
  useParentRoute: () => ref('/tax-root')
}))

vi.mock('../tax/lib/taxYear', () => ({
  taxYear: 2025,
  getTaxYearPeriod: () => ({
    period: 'JULY_TO_SEPTEMBER',
    taxYear: 2025,
    incomeYear: 2024,
    nextTaxYear: 2026,
    nextIncomeYear: 2025
  })
}))

vi.mock('../documents/documentFormState', () => ({
  useDocumentFormKey: () => ({
    previousStep: '/',
    nextStep: '/next',
    document: ref(undefined),
    category: 'tax' as const,
    textKey: mockTextKey,
    userId: 123,
    action: 'saveTenantTax' as const
  })
}))

vi.mock('../tax/lib/taxState', () => ({
  useTaxState: () => ({
    previousStep: '/',
    nextStep: '/next',
    category: 'tax' as const
  })
}))

const mockAnalysisFailedRules = ref<DocumentRule[]>([])
const mockExplanationSubmitted = ref(false)
const mockAnalysisInProgress = ref(false)
const mockIsUploading = ref(false)
const mockSaveExplanation = vi.fn()
const mockBannersFocus = vi.fn()

const FakeAnalysisWrapper = defineComponent({
  name: 'AnalysisWrapper',
  props: {
    strategy: { type: Object as PropType<TaxAnalysisErrorStrategy>, required: true },
    errorHeadingLevel: { type: Number, default: 3 },
    isUploading: { type: Boolean, default: false }
  },
  setup(props, { expose, slots }) {
    const hasUnresolvedErrors = computed(
      () => mockAnalysisFailedRules.value.length > 0 && !mockExplanationSubmitted.value
    )
    const nextDisabled = computed(() => props.isUploading || mockAnalysisInProgress.value)
    const nextLabel = computed(() => {
      if (props.isUploading) return 'uploading'
      if (mockAnalysisInProgress.value) return 'analyzing'
      return undefined
    })

    function beforeSubmit() {
      if (nextDisabled.value) return false
      if (hasUnresolvedErrors.value) {
        mockBannersFocus()
        return false
      }
      return true
    }

    expose({
      analysisFailedRules: mockAnalysisFailedRules,
      explanationSubmitted: mockExplanationSubmitted,
      analysisInProgress: mockAnalysisInProgress,
      nextDisabled,
      nextLabel,
      beforeSubmit,
      saveExplanation: mockSaveExplanation,
      focusBanners: mockBannersFocus
    })
    return () =>
      h('div', [
        slots.errorGuidance?.({ failedRules: mockAnalysisFailedRules.value }),
        slots.fileUploader?.()
      ])
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
  TaxAnalysisGuidance: true,
  DsfrModalPatch: true,
  AnalysisFooter: defineComponent({
    name: 'AnalysisFooter',
    props: {
      previousStep: { type: [String, Object], default: undefined },
      nextDisabled: { type: Boolean, default: undefined },
      nextLabel: { type: String, default: undefined },
      beforeSubmit: { type: Function, default: undefined },
      onSubmitAction: { type: Function, default: undefined }
    },
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    }
  }),
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
  const footer = wrapper.findComponent({ name: 'AnalysisFooter' })
  return footer.props() as {
    previousStep?: string
    nextDisabled?: boolean
    nextLabel?: string
    beforeSubmit?: () => boolean
    onSubmitAction?: () => Promise<void> | void
  }
}

describe('FrenchTaxForm - Continue button states', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(mockUser, { ownerType: 'SELF', tenantType: 'CREATE', franceConnect: false })
    mockTextKey = 'tenant'
    mockSaveExplanation.mockResolvedValue(undefined)
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

  it.each([
    ['tenant', 'Tenant', {}],
    ['couple', 'Couple', { tenantId: '12', step: '4' }],
    ['guarantor', 'Guarantor', { guarantorId: '34' }],
    ['couple-guarantor', 'TenantGuarantor', { tenantId: '12', guarantorId: '34', step: '4' }]
  ] as const)(
    'wires the shared block and correction links for %s',
    async (context, prefix, params) => {
      mockTextKey = context
      const rules: DocumentRule[] = [
        { rule: 'R_TAX_NAMES', message: '', level: 'ERROR', ruleData: null }
      ]
      mockAnalysisFailedRules.value = rules
      const wrapper = mountComponent()
      await flushPromises()
      expect(wrapper.getComponent(FakeAnalysisWrapper).props('strategy')).toBeInstanceOf(
        TaxAnalysisErrorStrategy
      )
      expect(wrapper.getComponent(FakeAnalysisWrapper).props('errorHeadingLevel')).toBe(2)
      const guidance = wrapper.getComponent(TaxAnalysisGuidance)
      expect(guidance.props('failedRules')).toEqual(rules)
      expect(guidance.props('parentsTo')).toEqual({ name: `${prefix}TaxSansAvisParents` })
      const name = `${prefix}Name`
      expect(guidance.props('identityTo')).toEqual(
        context === 'tenant' ? { name } : { name, params }
      )
      expect(guidance.props('isSelf')).toBe(context === 'tenant')
    }
  )

  it.each([
    ['tenant', 'CREATE', 'SELF', true, undefined],
    ['tenant', 'JOIN', undefined, true, undefined],
    ['tenant', 'CREATE', 'THIRD_PARTY', false, 'TenantName'],
    ['guarantor', 'CREATE', 'SELF', false, 'GuarantorName']
  ] as const)(
    'uses the editable identity and wording for FranceConnect %s/%s/%s',
    (context, type, owner, isSelf, routeName) => {
      Object.assign(mockUser, { ownerType: owner, tenantType: type, franceConnect: true })
      mockTextKey = context
      const wrapper = mountComponent()
      const guidance = wrapper.getComponent(TaxAnalysisGuidance)
      expect(guidance.props('isSelf')).toBe(isSelf)
      if (routeName) expect(guidance.props('identityTo')).toMatchObject({ name: routeName })
      else expect(guidance.props('identityTo')).toBeUndefined()
      const strategy = wrapper.getComponent(FakeAnalysisWrapper).props('strategy')
      const nameRule: DocumentRule = {
        rule: 'R_TAX_NAMES',
        message: '',
        level: 'CRITICAL',
        ruleData: {
          type: 'R_TAX_NAMES',
          extractedIdentities: ['MARTIN Camille'],
          expectedName: { firstNames: 'Sam', lastName: 'Dupont', preferredName: null }
        }
      }
      expect(strategy.getHeaderTitle([nameRule], (key) => key)).toBe(
        isSelf ? 'tax-errors.names-title-tenant' : 'tax-errors.names-title-other'
      )
    }
  )

  it('waits for the explanation to be saved before navigating', async () => {
    let finishSave!: () => void
    mockSaveExplanation.mockReturnValue(
      new Promise<void>((resolve) => {
        finishSave = resolve
      })
    )
    const wrapper = mountComponent()
    await flushPromises()
    const submitted = getTaxFooterProps(wrapper).onSubmitAction!()
    expect(mockSaveExplanation).toHaveBeenCalledOnce()
    expect(mockRouterPush).not.toHaveBeenCalled()
    finishSave()
    await submitted
    expect(mockRouterPush).toHaveBeenCalledWith('/next')
  })

  it('stays on the tax form if saving the explanation fails', async () => {
    mockSaveExplanation.mockRejectedValue(new Error('save failed'))
    const wrapper = mountComponent()
    await flushPromises()
    await expect(getTaxFooterProps(wrapper).onSubmitAction!()).rejects.toThrow('save failed')
    expect(mockRouterPush).not.toHaveBeenCalled()
  })
})
