import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import AnalysisFinalForm from '../validateStep/AnalysisFinalForm.vue'

const mockPush = vi.fn()
const mockValidateFile = vi.fn().mockResolvedValue(undefined)
const mockLoadUser = vi.fn().mockResolvedValue(undefined)

const defaultUserState = () => ({
  applicationType: 'ALONE',
  honorDeclaration: false,
  clarification: '',
  tenantType: 'CREATE',
  guarantors: [],
  apartmentSharing: {
    tenants: []
  }
})

const mockStore = {
  user: defaultUserState(),
  validateFile: mockValidateFile,
  loadUser: mockLoadUser
}

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  })
}))

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => mockStore
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

vi.mock('vue-loading-overlay', () => ({
  useLoading: () => ({
    show: () => ({
      hide: vi.fn()
    })
  })
}))

vi.mock('@/components/toast/toastUtils', () => ({
  toast: {
    error: vi.fn()
  }
}))

const DsfrCheckboxStub = defineComponent({
  name: 'DsfrCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: false,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        id: props.id,
        type: 'checkbox',
        checked: props.modelValue,
        onChange: (event: Event) => {
          const target = event.target as HTMLInputElement
          emit('update:modelValue', target.checked)
        }
      })
  }
})

function mountComponent() {
  return mount(AnalysisFinalForm, {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        NakedCard: true,
        DsfrCheckboxSet: true,
        DsfrCheckbox: DsfrCheckboxStub
      }
    }
  })
}

function setUserState(partialUser: Partial<typeof mockStore.user>) {
  mockStore.user = {
    ...defaultUserState(),
    ...partialUser,
    apartmentSharing: {
      ...defaultUserState().apartmentSharing,
      ...(partialUser.apartmentSharing ?? {})
    }
  }
}

describe('AnalysisFinalForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setUserState({})
  })

  it('does not pre-check honor declaration for COUPLE when one tenant is false', async () => {
    setUserState({
      applicationType: 'COUPLE',
      honorDeclaration: true,
      apartmentSharing: {
        tenants: [
          { id: 1, honorDeclaration: true },
          { id: 2, honorDeclaration: false }
        ] as never
      }
    })

    const wrapper = mountComponent()
    await flushPromises()

    const honorCheckbox = wrapper.get('#input-honor')
    expect((honorCheckbox.element as HTMLInputElement).checked).toBe(false)
  })

  it('pre-checks honor declaration for COUPLE when both tenants are true', async () => {
    setUserState({
      applicationType: 'COUPLE',
      honorDeclaration: true,
      apartmentSharing: {
        tenants: [
          { id: 1, honorDeclaration: true },
          { id: 2, honorDeclaration: true }
        ] as never
      }
    })

    const wrapper = mountComponent()
    await flushPromises()

    const honorCheckbox = wrapper.get('#input-honor')
    expect((honorCheckbox.element as HTMLInputElement).checked).toBe(true)
  })

  it('submits when aggregated COUPLE honor declaration changes', async () => {
    setUserState({
      applicationType: 'COUPLE',
      honorDeclaration: true,
      apartmentSharing: {
        tenants: [
          { id: 1, honorDeclaration: true },
          { id: 2, honorDeclaration: false }
        ] as never
      }
    })

    const wrapper = mountComponent()
    await flushPromises()

    await wrapper.get('#input-honor').setValue(true)
    await wrapper.get('#input-consent').setValue(true)
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockValidateFile).toHaveBeenCalledTimes(1)
    expect(mockValidateFile).toHaveBeenCalledWith({
      honorDeclaration: true,
      clarification: ''
    })
    expect(mockLoadUser).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/account')
  })

  it('keeps ALONE behavior by pre-checking from user honorDeclaration', async () => {
    setUserState({
      applicationType: 'ALONE',
      honorDeclaration: true
    })

    const wrapper = mountComponent()
    await flushPromises()

    const honorCheckbox = wrapper.get('#input-honor')
    expect((honorCheckbox.element as HTMLInputElement).checked).toBe(true)
  })

  it('keeps GROUP behavior by using current user honorDeclaration only', async () => {
    setUserState({
      applicationType: 'GROUP',
      honorDeclaration: true,
      apartmentSharing: {
        tenants: [
          { id: 1, honorDeclaration: true },
          { id: 2, honorDeclaration: false }
        ] as never
      }
    })

    const wrapper = mountComponent()
    await flushPromises()

    const honorCheckbox = wrapper.get('#input-honor')
    expect((honorCheckbox.element as HTMLInputElement).checked).toBe(true)
  })
})
