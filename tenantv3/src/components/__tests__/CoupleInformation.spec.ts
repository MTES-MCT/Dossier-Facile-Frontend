import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CoupleInformation from '../CoupleInformation.vue'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
  createI18n: () => ({ global: { t: (key: string) => key } })
}))

vi.mock('@gouvminint/vue-dsfr', () => ({
  DsfrButton: { template: '<button><slot /></button>' },
  DsfrCheckbox: {
    template:
      '<input :id="id" type="checkbox" :checked="modelValue === true" :data-readonly="readonly ? \'true\' : undefined" />',
    props: ['id', 'name', 'required', 'value', 'label', 'errorMessage', 'modelValue', 'readonly']
  }
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
// fallthrough — matching the real TextField's behavior. It also exposes its
// validation rules as a data attribute so tests can assert them.
const stubs = {
  NakedCard: { template: '<div><slot /></div>' },
  TextField: defineComponent({
    template:
      '<input :id="name" :data-rules="validationRules" :value="modelValue" :disabled="disabled" @input="onInput" />',
    props: ['modelValue', 'fieldLabel', 'name', 'validationRules', 'disabled', 'hint', 'type'],
    emits: ['update:modelValue'],
    methods: {
      onInput(e: Event) {
        this.$emit('update:modelValue', (e.target as HTMLInputElement).value)
      }
    }
  }),
  CoupleInformationHelp: { template: '<div />' },
  DsfrModalPatch: { template: '<div />' },
  Field: {
    template: '<div><slot :errors="[]" :meta="{ valid: true }" /></div>',
    props: ['modelValue', 'name', 'rules', 'type', 'value'],
    emits: ['update:modelValue']
  }
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
      props: { modelValue: [] },
      global: { stubs }
    })

    const lastNameInput = wrapper.find('#coTenantLastName')
    const firstNameInput = wrapper.find('#coTenantFirstName')
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
      props: { modelValue: [] },
      global: { stubs }
    })
    await flushPromises()

    const lastNameInput = wrapper.find('#coTenantLastName')
    const firstNameInput = wrapper.find('#coTenantFirstName')
    expect((lastNameInput.element as HTMLInputElement).disabled).toBe(true)
    expect((firstNameInput.element as HTMLInputElement).disabled).toBe(true)

    const emailInput = wrapper.find('#email')
    await emailInput.setValue('marie@example.com')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const lastEmit = emitted![emitted!.length - 1][0] as CoTenant[]
    expect(lastEmit[0].email).toBe('marie@example.com')
    expect(lastEmit[0].firstName).toBe('Marie')
    expect(lastEmit[0].lastName).toBe('Dupont')
  })

  it('requires the email and rejects the main tenant own email', () => {
    const wrapper = mount(CoupleInformation, {
      props: { modelValue: [] },
      global: { stubs }
    })

    expect(wrapper.find('#email').attributes('data-rules')).toBe(
      'required|email|differentFrom:main@example.com'
    )
  })

  it('does not require the email once the co-tenant account exists', async () => {
    mockUser.value = {
      id: 1,
      email: 'main@example.com',
      apartmentSharing: {
        tenants: [
          { id: 1, email: 'main@example.com', guarantors: [] },
          { id: 42, firstName: 'Marie', lastName: 'Dupont', email: 'spouse@example.com', guarantors: [] }
        ]
      }
    }

    const wrapper = mount(CoupleInformation, {
      props: { modelValue: [] },
      global: { stubs }
    })
    await flushPromises()

    const emailInput = wrapper.find('#email')
    expect(emailInput.attributes('data-rules')).toBe('email')
    expect((emailInput.element as HTMLInputElement).disabled).toBe(true)
  })

  it('hides the consent block when the co-tenant account already exists', async () => {
    mockUser.value = {
      id: 1,
      email: 'main@example.com',
      apartmentSharing: {
        tenants: [
          { id: 1, email: 'main@example.com', guarantors: [] },
          { id: 42, firstName: 'Marie', lastName: 'Dupont', email: 'spouse@example.com', guarantors: [] }
        ]
      }
    }

    const wrapper = mount(CoupleInformation, {
      props: { modelValue: [] },
      global: { stubs }
    })
    await flushPromises()

    expect(wrapper.find('#authorize').exists()).toBe(false)
  })

  it('asks for the consent when the co-tenant is not invited yet', () => {
    const wrapper = mount(CoupleInformation, {
      props: { modelValue: [] },
      global: { stubs }
    })

    const checkbox = wrapper.find('#authorize')
    expect(checkbox.exists()).toBe(true)
    expect((checkbox.element as HTMLInputElement).checked).toBe(false)
  })

  it('renders the consent details as a list outside the checkbox label', () => {
    const wrapper = mount(CoupleInformation, {
      props: { modelValue: [] },
      global: { stubs }
    })

    const items = wrapper.find('ul').findAll('li')
    expect(items.map((li) => li.text())).toEqual(['acceptAuthorAccess', 'acceptAuthorShare'])
  })
})
