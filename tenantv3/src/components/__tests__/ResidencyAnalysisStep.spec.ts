import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject, nextTick } from 'vue'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import ResidencyAnalysisStep from '../residency/lib/ResidencyAnalysisStep.vue'
import { documentFormKey } from '@/components/documents/documentFormState'

const ROUTE_PREVIOUS = '/previous-step'
const ROUTE_NEXT = '/next-step'
const BANNER_TITLE = 'banner.title'
const BANNER_SUBTITLE = 'banner.subtitle'
const BANNER_INFO = 'banner.info'
const NOT_MATCHING_LABEL = 'banner.not-matching'
const EXPLAIN_LINK_LABEL = 'banner.explain-link'
const SUB_CATEGORY = 'TENANT'
const CATEGORY_STEP = 'TENANT_PROOF'

const { routerPushMock, validateFunnelStepMock, stateAddDataMock } = vi.hoisted(() => ({
  routerPushMock: vi.fn(),
  validateFunnelStepMock: vi.fn(),
  stateAddDataMock: vi.fn()
}))
const onExplainMock = vi.fn()
const onSubmitActionMock = vi.fn().mockResolvedValue(undefined)
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
    }
  | undefined

const mockDocument = { id: 1 } as DfDocument

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPushMock
  })
}))

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    user: {
      id: 123
    }
  })
}))

vi.mock('../residency/residencyState', () => ({
  useResidencyState: () => ({
    document: { value: mockDocument },
    category: 'residency',
    textKey: 'tenant',
    nextStep: ROUTE_NEXT,
    addData: stateAddDataMock
  })
}))

vi.mock('@/services/AnalyticsService', () => ({
  AnalyticsService: {
    validateFunnelStep: validateFunnelStepMock
  }
}))

const AnalysisWrapperStub = defineComponent({
  name: 'AnalysisWrapper',
  props: {
    isUploading: { type: Boolean, default: false }
  },
  setup(_, { slots, expose }) {
    expose(analysisWrapperExpose)

    return () =>
      h('div', { class: 'analysis-wrapper-stub' }, [
        slots.analysisBannerError?.({
          rule: {
            rule: 'R_TEST',
            message: 'R_TEST',
            level: 'ERROR',
            ruleData: null
          } as DocumentRule,
          notMatchingLabel: NOT_MATCHING_LABEL,
          explainLinkLabel: EXPLAIN_LINK_LABEL,
          onExplain: onExplainMock
        }),
        slots.fileUploader?.()
      ])
  }
})

const UploadFileWithAnalysisStub = defineComponent({
  name: 'UploadFileWithAnalysis',
  props: {
    docCategory: { type: String, default: '' },
    subCategory: { type: String, default: '' },
    analysisInProgress: { type: Boolean, default: false }
  },
  setup(_, { expose }) {
    expose(uploadFileExpose)

    const injected = inject(documentFormKey)
    capturedDocumentFormState = injected
      ? {
          addData: injected.addData,
          textKey: injected.textKey,
          storeAction: injected.storeAction
        }
      : undefined

    return () => h('div', { class: 'upload-file-stub' })
  }
})

const AnalysisFooterStub = defineComponent({
  name: 'AnalysisFooter',
  props: {
    previousStep: { type: [String, Object], required: true },
    beforeSubmit: { type: Function, default: undefined },
    nextDisabled: { type: Boolean, default: false },
    nextLabel: { type: String, default: '' },
    onSubmitAction: { type: Function, default: undefined }
  },
  setup(props) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          class: 'footer-submit',
          onClick: async () => {
            if (typeof props.onSubmitAction === 'function') {
              await props.onSubmitAction()
            }
          }
        },
        String(props.nextLabel)
      )
  }
})

const ResidencyAnalysisErrorBannerContentStub = defineComponent({
  name: 'ResidencyAnalysisErrorBannerContent',
  props: {
    title: { type: String, required: true },
    firstSubTitle: { type: String, required: true },
    notMatchingLabel: { type: String, required: true },
    explainLinkLabel: { type: String, required: true }
  },
  emits: ['explain'],
  setup(_, { emit, slots }) {
    return () =>
      h('div', { class: 'residency-banner-stub' }, [
        h(
          'button',
          {
            type: 'button',
            class: 'emit-explain',
            onClick: () => emit('explain')
          },
          'emit'
        ),
        slots['expected-doc']?.()
      ])
  }
})

function createWrapper(
  customProps: Partial<InstanceType<typeof ResidencyAnalysisStep>['$props']> = {}
) {
  return mount(ResidencyAnalysisStep, {
    props: {
      previousStep: ROUTE_PREVIOUS,
      subCategory: SUB_CATEGORY,
      bannerInfoText: BANNER_INFO,
      bannerTitle: BANNER_TITLE,
      bannerSubTitle: BANNER_SUBTITLE,
      expectedItems: [],
      ...customProps
    },
    global: {
      stubs: {
        AnalysisWrapper: AnalysisWrapperStub,
        UploadFileWithAnalysis: UploadFileWithAnalysisStub,
        AnalysisFooter: AnalysisFooterStub,
        ResidencyAnalysisErrorBannerContent: ResidencyAnalysisErrorBannerContentStub,
        BannerIconTextLine: true
      }
    }
  })
}

describe('ResidencyAnalysisStep', () => {
  beforeEach(() => {
    routerPushMock.mockReset()
    validateFunnelStepMock.mockReset()
    onExplainMock.mockReset()
    stateAddDataMock.mockReset()
    onSubmitActionMock.mockReset()
    saveExplanationMock.mockReset()

    analysisWrapperExpose = {
      analysisInProgress: false,
      beforeSubmit: vi.fn(() => true),
      nextDisabled: false,
      nextLabel: 'next.label',
      saveExplanation: saveExplanationMock
    }

    uploadFileExpose = {
      isUploading: false
    }

    capturedDocumentFormState = undefined
  })

  it('passes loading states to wrapper and uploader', async () => {
    analysisWrapperExpose.analysisInProgress = true
    uploadFileExpose.isUploading = true

    const wrapper = createWrapper()
    await nextTick()
    await nextTick()

    const analysisWrapper = wrapper.findComponent({ name: 'AnalysisWrapper' })
    const uploader = wrapper.findComponent({ name: 'UploadFileWithAnalysis' })

    expect(analysisWrapper.props('isUploading')).toBe(true)
    expect(uploader.props('analysisInProgress')).toBe(true)
    expect(uploader.props('subCategory')).toBe(SUB_CATEGORY)
  })

  it('forwards banner props and explain event from wrapper slot', async () => {
    const wrapper = createWrapper()
    const banner = wrapper.findComponent({ name: 'ResidencyAnalysisErrorBannerContent' })

    expect(banner.props('title')).toBe(BANNER_TITLE)
    expect(banner.props('firstSubTitle')).toBe(BANNER_SUBTITLE)
    expect(banner.props('notMatchingLabel')).toBe(NOT_MATCHING_LABEL)
    expect(banner.props('explainLinkLabel')).toBe(EXPLAIN_LINK_LABEL)

    await banner.find('.emit-explain').trigger('click')
    expect(onExplainMock).toHaveBeenCalledOnce()
  })

  it('submits with default behavior when no custom submit action is provided', async () => {
    const wrapper = createWrapper()

    await wrapper.find('.footer-submit').trigger('click')

    expect(saveExplanationMock).toHaveBeenCalledOnce()
    expect(validateFunnelStepMock).toHaveBeenCalledOnce()
    expect(validateFunnelStepMock).toHaveBeenCalledWith('residency')
    expect(routerPushMock).toHaveBeenCalledOnce()
    expect(routerPushMock).toHaveBeenCalledWith(ROUTE_NEXT)
  })

  it('submits with custom behavior when onSubmitAction is provided', async () => {
    const wrapper = createWrapper({ onSubmitAction: onSubmitActionMock })

    await wrapper.find('.footer-submit').trigger('click')

    expect(saveExplanationMock).toHaveBeenCalledOnce()
    expect(onSubmitActionMock).toHaveBeenCalledOnce()
    expect(validateFunnelStepMock).not.toHaveBeenCalled()
    expect(routerPushMock).not.toHaveBeenCalled()
  })

  it('provides addData that appends categoryStep and delegates to residency state', () => {
    createWrapper({ categoryStep: CATEGORY_STEP })

    expect(capturedDocumentFormState).toBeDefined()
    const formData = new FormData()
    capturedDocumentFormState?.addData?.(formData)

    expect(formData.get('categoryStep')).toBe(CATEGORY_STEP)
    expect(stateAddDataMock).toHaveBeenCalledOnce()
  })
})
