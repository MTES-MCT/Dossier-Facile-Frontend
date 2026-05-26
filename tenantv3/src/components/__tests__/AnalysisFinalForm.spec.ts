import { describe, expect, it, vi, beforeEach } from 'vitest'
import {mount } from '@vue/test-utils'
import AnalysisFinalForm from '../validateStep/AnalysisFinalForm.vue'

const { mockStore, mockRouterPush } = vi.hoisted(() => {
  return {
    mockStore: {
      user: {
        tenantType: 'CREATE' as 'CREATE' | 'JOIN',
        applicationType: 'ALONE' as string,
        honorDeclaration: false,
        clarification: '' as string | undefined,
        guarantors: [] as unknown[]
      },
      validateFile: vi.fn(() => Promise.resolve()),
      loadUser: vi.fn(() => Promise.resolve())
    },
    mockRouterPush: vi.fn()
  }
})

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => mockStore
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  })
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush })
}))

vi.mock('vue-loading-overlay', () => ({
  useLoading: () => ({
    show: () => ({ hide: vi.fn() })
  })
}))

vi.mock('@/components/toast/toastUtils', () => ({
  toast: { error: vi.fn() }
}))

const globalStubs = {
  NakedCard: { template: '<div><slot /></div>' },
  DsfrCheckboxSet: { template: '<div><slot name="legend" /><slot /></div>' },
  DsfrCheckbox: {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template:
      '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />'
  }
}

function mountComponent() {
  return mount(AnalysisFinalForm, {
    global: { stubs: globalStubs }
  })
}

describe('AnalysisFinalForm', () => {
  beforeEach(() => {
    mockStore.user = {
      tenantType: 'CREATE',
      applicationType: 'ALONE',
      honorDeclaration: false,
      clarification: '',
      guarantors: []
    }
    mockStore.validateFile.mockClear()
    mockStore.loadUser.mockClear()
    mockRouterPush.mockClear()
  })

  describe('clarification textarea visibility', () => {
    it('shows the textarea when the connected tenant is the file creator (CREATE)', () => {
      mockStore.user.tenantType = 'CREATE'

      const wrapper = mountComponent()

      expect(wrapper.find('textarea#message').exists()).toBe(true)
    })

    it('hides the textarea when the connected tenant has joined the file (JOIN)', () => {
      mockStore.user.tenantType = 'JOIN'

      const wrapper = mountComponent()

      expect(wrapper.find('textarea#message').exists()).toBe(false)
    })
  })
})
