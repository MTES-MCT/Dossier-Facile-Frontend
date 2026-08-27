import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject, ref } from 'vue'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import UploadFilesMainActivity from '../mainActivity/lib/UploadFilesMainActivity.vue'
import { documentFormKey } from '@/components/documents/documentFormState'
import { ProfessionalAnalysisErrorStrategy } from '../analysis/strategies/ProfessionalAnalysisErrorStrategy'

const ROUTE_PREVIOUS = '/previous-step'
const ROUTE_NEXT = '/next-step'

const { routerPushMock, validateFunnelStepMock, stateAddDataMock } = vi.hoisted(() => ({
  routerPushMock: vi.fn(),
  validateFunnelStepMock: vi.fn(),
  stateAddDataMock: vi.fn()
}))

const saveExplanationMock = vi.fn().mockResolvedValue(undefined)

let analysisWrapperExpose = {
  analysisInProgress: false,
  beforeSubmit: vi.fn(() => true),
  nextDisabled: false,
  nextLabel: 'next.label',
  saveExplanation: saveExplanationMock
}

let uploadFileExpose = {
  isUploading: false
}

let capturedDocumentFormState:
  | {
      addData?: (formData: FormData) => void
      textKey: string
      storeAction: string
      category: string
      formFieldValue: string
    }
  | undefined

const mockDocument = ref<DfDocument | undefined>({
  id: 1,
  files: [{ id: 10, name: 'contrat.pdf', size: 1000 }]
})

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPushMock
  })
}))

vi.mock('@/services/AnalyticsService', () => ({
  AnalyticsService: {
    validateFunnelStep: validateFunnelStepMock
  }
}))

vi.mock('../mainActivity/lib/mainActivityState', () => ({
  useMainActivityState: () => ({
    document: mockDocument,
    category: 'professional',
    textKey: 'tenant',
    previousStep: ROUTE_PREVIOUS,
    nextStep: ROUTE_NEXT,
    action: 'saveTenantProfessional',
    userId: 42,
    addData: stateAddDataMock
  })
}))

const AnalysisWrapperStub = defineComponent({
  name: 'AnalysisWrapper',
  props: ['isUploading', 'pollingTimeoutMs', 'strategy'],
  setup(props, { slots, expose }) {
    expose(analysisWrapperExpose)
    return () => h('div', { class: 'analysis-wrapper-stub' }, slots.fileUploader?.())
  }
})

const UploadFileWithAnalysisStub = defineComponent({
  name: 'UploadFileWithAnalysis',
  props: ['docCategory', 'subCategory', 'analysisInProgress', 'maxFileCount', 'analysisTime'],
  setup(_props, { expose }) {
    capturedDocumentFormState = inject(documentFormKey)
    expose(uploadFileExpose)
    return () => h('div', { class: 'upload-file-with-analysis-stub' })
  }
})

const AnalysisFooterStub = defineComponent({
  name: 'AnalysisFooter',
  props: ['previousStep', 'beforeSubmit', 'nextDisabled', 'nextLabel', 'onSubmitAction'],
  emits: ['on-next'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'analysis-footer-stub' }, [
        h(
          'button',
          {
            class: 'submit-btn',
            disabled: props.nextDisabled,
            onClick: async () => {
              if (!props.beforeSubmit || props.beforeSubmit()) {
                await props.onSubmitAction?.()
                emit('on-next')
              }
            }
          },
          props.nextLabel || 'Continue'
        )
      ])
  }
})

describe('UploadFilesMainActivity.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    capturedDocumentFormState = undefined
    analysisWrapperExpose = {
      analysisInProgress: false,
      beforeSubmit: vi.fn(() => true),
      nextDisabled: false,
      nextLabel: 'next.label',
      saveExplanation: saveExplanationMock
    }
  })

  function createWrapper(category: any = 'CDI') {
    return mount(UploadFilesMainActivity, {
      props: { category },
      global: {
        stubs: {
          AnalysisWrapper: AnalysisWrapperStub,
          UploadFileWithAnalysis: UploadFileWithAnalysisStub,
          AnalysisFooter: AnalysisFooterStub
        }
      }
    })
  }

  it('provides ProfessionalAnalysisErrorStrategy for supported AI categories (CDI, CDD, ALTERNATION, INTERNSHIP, INTERMITTENT)', () => {
    const aiCategories = ['CDI', 'CDD', 'ALTERNATION', 'INTERNSHIP', 'INTERMITTENT'] as const
    for (const cat of aiCategories) {
      const wrapper = createWrapper(cat)
      const wrapperStub = wrapper.findComponent(AnalysisWrapperStub)
      expect(wrapperStub.props('strategy')).toBeInstanceOf(ProfessionalAnalysisErrorStrategy)
      expect(wrapperStub.props('strategy').subCategory).toBe(cat.toLowerCase())
    }
  })

  it('provides undefined strategy for non-AI categories (e.g. STUDENT, PUBLIC, RETIRED)', () => {
    const nonAiCategories = ['STUDENT', 'PUBLIC', 'RETIRED', 'UNEMPLOYED', 'CTT'] as const
    for (const cat of nonAiCategories) {
      const wrapper = createWrapper(cat)
      const wrapperStub = wrapper.findComponent(AnalysisWrapperStub)
      expect(wrapperStub.props('strategy')).toBeUndefined()
    }
  })

  it('provides documentFormKey correctly to children', () => {
    createWrapper('CDI')
    expect(capturedDocumentFormState).toBeDefined()
    expect(capturedDocumentFormState?.category).toBe('PROFESSIONAL')
    expect(capturedDocumentFormState?.formFieldValue).toBe('typeDocumentProfessional')
    expect(capturedDocumentFormState?.storeAction).toBe('saveTenantProfessional')

    const formData = new FormData()
    capturedDocumentFormState?.addData?.(formData)
    expect(stateAddDataMock).toHaveBeenCalledWith(formData)
  })

  it('submits explanation and navigates on footer submit action', async () => {
    const wrapper = createWrapper('CDI')
    const submitBtn = wrapper.find('.submit-btn')
    await submitBtn.trigger('click')

    expect(saveExplanationMock).toHaveBeenCalled()
    expect(validateFunnelStepMock).toHaveBeenCalledWith('professional')
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE_NEXT)
  })
})
