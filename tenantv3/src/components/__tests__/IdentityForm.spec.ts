import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import IdentityForm from '../identity/IdentityForm.vue'

interface MockUser {
  id?: number
  ownerType?: 'SELF' | 'THIRD_PARTY'
  firstName?: string
  lastName?: string
  preferredName?: string
  zipCode?: string
  beneficiaryEmail?: string
  franceConnect?: boolean
}

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('@gouvminint/vue-dsfr', () => ({
  DsfrAlert: { template: '<div />' },
  DsfrCheckbox: {
    template: '<input :id="name" type="checkbox" :checked="modelValue === true" />',
    props: ['name', 'value', 'label', 'modelValue']
  }
}))

vi.mock('@/router', () => ({ router: { push: vi.fn() } }))
vi.mock('@/services/AnalyticsService', () => ({ AnalyticsService: { confirmName: vi.fn() } }))
vi.mock('vue-loading-overlay', () => ({
  useLoading: () => ({ show: () => ({ hide: vi.fn() }) })
}))

const { mockUser, setNames } = vi.hoisted(() => {
  const { ref } = require('vue')
  return {
    mockUser: ref({} as MockUser),
    setNames: vi.fn()
  }
})

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    get user() {
      return mockUser.value
    },
    setNames
  })
}))

// TextField stub exposing its validation rules and type as data attributes so
// tests can assert them; ids match the field names like the real TextField.
const stubs = {
  Form: { template: '<form @submit.prevent><slot :meta="{ valid: true }" /></form>' },
  Field: {
    template: '<div><slot /></div>',
    props: ['modelValue', 'name', 'rules', 'type']
  },
  TextField: defineComponent({
    template:
      '<input :id="name" :data-rules="validationRules" :type="type" :value="modelValue" @input="onInput" />',
    props: ['modelValue', 'fieldLabel', 'name', 'validationRules', 'readonly', 'hint', 'type', 'autocomplete'],
    emits: ['update:modelValue'],
    methods: {
      onInput(e: Event) {
        this.$emit('update:modelValue', (e.target as HTMLInputElement).value)
      }
    }
  }),
  ProfileFooter: { template: '<button type="submit">Next</button>' }
}

function mountForm(textKey: 'self' | 'third-party') {
  return mount(IdentityForm, {
    props: { textKey },
    global: { stubs }
  })
}

describe('IdentityForm', () => {
  beforeEach(() => {
    mockUser.value = {}
    setNames.mockReset()
    setNames.mockResolvedValue(undefined)
  })

  it('requires the beneficiary email in third-party mode', () => {
    const wrapper = mountForm('third-party')

    const emailInput = wrapper.find('#beneficiaryEmail')
    expect(emailInput.exists()).toBe(true)
    expect(emailInput.attributes('data-rules')).toBe('required|email')
    expect(emailInput.attributes('type')).toBe('email')
  })

  it('does not show the beneficiary email in self mode', () => {
    const wrapper = mountForm('self')

    expect(wrapper.find('#beneficiaryEmail').exists()).toBe(false)
  })

  it('prefills the beneficiary email from the store', () => {
    mockUser.value = {
      ownerType: 'THIRD_PARTY',
      firstName: 'Marie',
      lastName: 'Curie',
      beneficiaryEmail: 'beneficiary@example.com'
    }

    const wrapper = mountForm('third-party')

    expect((wrapper.find('#beneficiaryEmail').element as HTMLInputElement).value).toBe(
      'beneficiary@example.com'
    )
  })

  it('sends the beneficiary email on third-party submit', async () => {
    const wrapper = mountForm('third-party')

    await wrapper.find('#lastname').setValue('Curie')
    await wrapper.find('#firstName').setValue('Marie')
    await wrapper.find('#beneficiaryEmail').setValue('beneficiary@example.com')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(mockUser.value.ownerType).toBe('THIRD_PARTY')
    expect(mockUser.value.beneficiaryEmail).toBe('beneficiary@example.com')
    expect(setNames).toHaveBeenCalledTimes(1)
  })

  it('clears the beneficiary email on self submit', async () => {
    mockUser.value = {
      ownerType: 'SELF',
      firstName: 'John',
      lastName: 'Doe',
      beneficiaryEmail: 'stale@example.com'
    }

    const wrapper = mountForm('self')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(mockUser.value.ownerType).toBe('SELF')
    expect(mockUser.value.beneficiaryEmail).toBeUndefined()
    expect(setNames).toHaveBeenCalledTimes(1)
  })
})
