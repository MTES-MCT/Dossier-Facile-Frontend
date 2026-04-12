import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CoupleInformation from '../CoupleInformation.vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

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
      apartmentSharing: { tenants: [] as CoTenant[] }
    })
  }
})

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    get user() { return mockUser.value },
    spouseAuthorize: false
  })
}))

// TextField stub intentionally omits 'input' from emits so that the parent's
// @input listener falls through to the root <input> via Vue 3 attribute
// fallthrough — matching the real TextField's behavior.
const stubs = {
  NakedCard: { template: '<div><slot /></div>' },
  TextField: {
    template: '<input :value="modelValue" :disabled="disabled" @input="onInput" />',
    props: ['modelValue', 'fieldLabel', 'name', 'validationRules', 'disabled'],
    emits: ['update:modelValue'],
    methods: {
      onInput(e: InputEvent) {
        this.$emit('update:modelValue', (e.target as HTMLInputElement).value)
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
      apartmentSharing: { tenants: [] as CoTenant[] }
    }
  })

  it('includes email in model when filling the form from scratch', async () => {
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
    const afterNames = emitted[emitted.length - 1][0] as CoTenant[]
    expect(afterNames[0].lastName).toBe('Dupont')
    expect(afterNames[0].firstName).toBe('Marie')

    await emailInput.setValue('marie@example.com')

    emitted = wrapper.emitted('update:modelValue')!
    const afterEmail = emitted[emitted.length - 1][0] as CoTenant[]
    expect(afterEmail[0].email).toBe('marie@example.com')
  })

  it('includes email in model when adding it to an existing co-tenant', async () => {
    // Simulate a returning user whose co-tenant already has names saved.
    // onMounted will load the partner into the local coTenant ref and disable
    // the name fields. The coTenants model (bound to the parent) is a separate
    // object — only handleInput() unifies them.
    mockUser.value = {
      id: 1,
      email: 'main@example.com',
      apartmentSharing: {
        tenants: [
          { id: 1, email: 'main@example.com', guarantors: [] },
          { id: 42, firstName: 'Marie', lastName: 'Dupont', email: '', guarantors: [] }
        ]
      }
    }

    const wrapper = mount(CoupleInformation, {
      props: { hasSubmited: false, modelValue: [] },
      global: { stubs }
    })
    await flushPromises()

    const [lastNameInput, firstNameInput] = wrapper.findAll('input').slice(0, 2)
    expect(lastNameInput.element.disabled).toBe(true)
    expect(firstNameInput.element.disabled).toBe(true)

    const emailInput = wrapper.find('#email')
    await emailInput.setValue('marie@example.com')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const lastEmit = emitted![emitted!.length - 1][0] as CoTenant[]
    expect(lastEmit[0].email).toBe('marie@example.com')
    expect(lastEmit[0].firstName).toBe('Marie')
    expect(lastEmit[0].lastName).toBe('Dupont')
  })
})
