import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CoupleInformation from '../CoupleInformation.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
  createI18n: () => ({ global: { t: (key: string) => key } })
}))

vi.mock('@gouvminint/vue-dsfr', () => ({
  DsfrButton: { template: '<button><slot /></button>' }
}))

const { mockUser } = vi.hoisted(() => {
  const { ref } = require('vue')
  return {
    mockUser: ref({
      id: 1,
      email: 'main@example.com',
      apartmentSharing: { tenants: [] as any[] }
    })
  }
})

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    get user() { return mockUser.value },
    spouseAuthorize: false
  })
}))

const stubs = {
  NakedCard: { template: '<div><slot /></div>' },
  TextField: {
    template: '<input :value="modelValue" :disabled="disabled" @input="onInput" />',
    props: ['modelValue', 'fieldLabel', 'name', 'validationRules', 'disabled'],
    emits: ['update:modelValue', 'input'],
    methods: {
      onInput(e: InputEvent) {
        this.$emit('update:modelValue', (e.target as HTMLInputElement).value)
        this.$emit('input', e)
      }
    }
  },
  FieldLabel: { template: '<label><slot /></label>' },
  CoupleInformationHelp: { template: '<div />' },
  DsfrModalPatch: { template: '<div />' },
  Field: {
    template: '<div><slot :field="fieldBindings" :meta="{ valid: true }" /></div>',
    props: ['modelValue', 'name', 'rules', 'type', 'value'],
    emits: ['update:modelValue'],
    computed: {
      fieldBindings() {
        const self = this as any
        return {
          value: self.modelValue,
          onInput(e: InputEvent) {
            self.$emit('update:modelValue', (e.target as HTMLInputElement).value)
          }
        }
      }
    }
  },
  ErrorMessage: { template: '<span />' }
}

describe('CoupleInformation', () => {
  beforeEach(() => {
    mockUser.value = {
      id: 1,
      email: 'main@example.com',
      apartmentSharing: { tenants: [] as any[] }
    }
  })

  it('syncs coTenant to model when names are filled then email is typed', async () => {
    const wrapper = mount(CoupleInformation, {
      props: { hasSubmited: false, modelValue: [] },
      global: { stubs }
    })

    const [lastNameInput, firstNameInput] = wrapper.findAll('input').slice(0, 2)
    const emailInput = wrapper.find('#email')

    await lastNameInput.setValue('Dupont')
    await firstNameInput.setValue('Marie')

    let emitted = wrapper.emitted('update:modelValue')!
    expect(emitted.length).toBeGreaterThan(0)
    const afterNames = emitted[emitted.length - 1][0] as any[]
    expect(afterNames[0].lastName).toBe('Dupont')
    expect(afterNames[0].firstName).toBe('Marie')

    await emailInput.setValue('marie@example.com')

    emitted = wrapper.emitted('update:modelValue')!
    const afterEmail = emitted[emitted.length - 1][0] as any[]
    expect(afterEmail[0].email).toBe('marie@example.com')
  })

  it('syncs email for returning user with pre-filled disabled names', async () => {
    const existingPartner = {
      id: 42,
      firstName: 'Marie',
      lastName: 'Dupont',
      email: '',
      guarantors: []
    }

    mockUser.value = {
      id: 1,
      email: 'main@example.com',
      apartmentSharing: {
        tenants: [
          { id: 1, email: 'main@example.com', guarantors: [] },
          existingPartner
        ]
      }
    }

    const wrapper = mount(CoupleInformation, {
      props: { hasSubmited: false, modelValue: [] },
      global: { stubs }
    })
    await flushPromises()

    // Name fields should be disabled (pre-filled from store)
    const [lastNameInput, firstNameInput] = wrapper.findAll('input').slice(0, 2)
    expect(lastNameInput.element.disabled).toBe(true)
    expect(firstNameInput.element.disabled).toBe(true)

    // Type email — this is the bug scenario: names already saved, email is the only editable field
    const emailInput = wrapper.find('#email')
    await emailInput.setValue('marie@example.com')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const lastEmit = emitted![emitted!.length - 1][0] as any[]
    expect(lastEmit[0].email).toBe('marie@example.com')
    expect(lastEmit[0].firstName).toBe('Marie')
    expect(lastEmit[0].lastName).toBe('Dupont')
  })
})
