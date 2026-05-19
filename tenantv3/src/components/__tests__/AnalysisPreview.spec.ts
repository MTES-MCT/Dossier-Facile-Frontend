import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AnalysisPreview from '../validateStep/AnalysisPreview.vue'

const { mockStore } = vi.hoisted(() => {
  return {
    mockStore: {
      user: {
        id: 1,
        applicationType: undefined as string | undefined,
        apartmentSharing: {
          tenants: [] as Array<{
            id: number
            guarantors?: Array<{ id?: number }>
          }>
        }
      },
      coTenants: [] as Array<unknown>
    }
  }
})

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => mockStore
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key
    })
  }
})

const globalStubs = {
  NakedCard: {
    template: '<div data-test="naked-card"><slot /></div>'
  },
  DocumentPreviewCard: {
    template: '<div data-test="document-preview-card" />'
  },
  GuarantorBadge: {
    template: '<div data-test="guarantor-badge" />'
  },
  DsfrBadge: {
    props: ['label'],
    template: '<div data-test="dsfr-badge">{{ label }}</div>'
  },
  ConfirmModal: {
    template: '<div data-test="confirm-modal" />'
  }
}

const DELETE_BUTTON_SELECTOR = 'button.fr-btn--tertiary.fr-btn--sm'

function mountComponent(user: Record<string, unknown>, isTenant: boolean) {
  return mount(AnalysisPreview, {
    props: {
      user,
      isTenant,
      documentAnalysisStatus: []
    },
    global: {
      stubs: globalStubs
    }
  })
}

describe('AnalysisPreview', () => {
  beforeEach(() => {
    mockStore.user = {
      id: 1,
      applicationType: undefined,
      apartmentSharing: {
        tenants: []
      }
    }
    mockStore.coTenants = []
  })

  it('shows guarantor identity block for tenant guarantor with missing identity', () => {
    const guarantor = {
      id: 10,
      typeGuarantor: 'NATURAL_PERSON',
      firstName: '',
      lastName: undefined,
      documents: []
    }

    const wrapper = mountComponent(guarantor, false)

    expect(wrapper.find('[data-test="dsfr-badge"]').text()).toBe('to-correct-label')
    expect(wrapper.text()).toContain('guarantor-identity-label')
    expect(wrapper.find('a.fr-btn').attributes('href')).toBe('/info-garant/0/10')
  })

  it('hides guarantor identity block when identity is fully defined', () => {
    const guarantor = {
      id: 11,
      typeGuarantor: 'NATURAL_PERSON',
      firstName: 'Alice',
      lastName: 'Martin',
      documents: []
    }

    const wrapper = mountComponent(guarantor, false)

    expect(wrapper.text()).not.toContain('guarantor-identity-label')
    expect(wrapper.find('a.fr-btn').exists()).toBe(false)
  })

  it('uses co-tenant guarantor edit link when guarantor belongs to a co-tenant', () => {
    mockStore.user = {
      id: 1,
      apartmentSharing: {
        tenants: [
          {
            id: 2,
            guarantors: [{ id: 20 }]
          }
        ]
      }
    }

    const guarantor = {
      id: 20,
      typeGuarantor: 'NATURAL_PERSON',
      firstName: '',
      lastName: '',
      documents: []
    }

    const wrapper = mountComponent(guarantor, false)

    expect(wrapper.find('a.fr-btn').attributes('href')).toBe('/info-garant-locataire/2/20/5/0')
  })

  it('hides guarantor identity block for ORGANISM guarantor', () => {
    const guarantor = {
      id: 30,
      typeGuarantor: 'ORGANISM',
      firstName: undefined,
      lastName: undefined,
      documents: []
    }

    const wrapper = mountComponent(guarantor, false)

    expect(wrapper.text()).not.toContain('guarantor-identity-label')
    expect(wrapper.find('a.fr-btn').exists()).toBe(false)
  })

  describe('delete guarantor button visibility', () => {
    it('hides the delete button on the tenant own card', () => {
      const tenant = {
        id: 1,
        firstName: 'Alice',
        lastName: 'Martin',
        documents: []
      }

      const wrapper = mountComponent(tenant, true)

      expect(wrapper.find(DELETE_BUTTON_SELECTOR).exists()).toBe(false)
    })

    it('shows the delete button for a guarantor of the current user', () => {
      mockStore.user = {
        id: 1,
        applicationType: 'ALONE',
        apartmentSharing: { tenants: [] }
      }

      const guarantor = {
        id: 40,
        typeGuarantor: 'NATURAL_PERSON',
        firstName: 'Bob',
        lastName: 'Durand',
        documents: []
      }

      const wrapper = mountComponent(guarantor, false)

      expect(wrapper.find(DELETE_BUTTON_SELECTOR).exists()).toBe(true)
    })

    it('shows the delete button for a co-tenant guarantor when applicationType is COUPLE', () => {
      mockStore.user = {
        id: 1,
        applicationType: 'COUPLE',
        apartmentSharing: {
          tenants: [
            {
              id: 2,
              guarantors: [{ id: 50 }]
            }
          ]
        }
      }

      const guarantor = {
        id: 50,
        typeGuarantor: 'NATURAL_PERSON',
        firstName: 'Carla',
        lastName: 'Petit',
        documents: []
      }

      const wrapper = mountComponent(guarantor, false)

      expect(wrapper.find(DELETE_BUTTON_SELECTOR).exists()).toBe(true)
    })

    it('hides the delete button for a co-tenant guarantor when applicationType is GROUP', () => {
      mockStore.user = {
        id: 1,
        applicationType: 'GROUP',
        apartmentSharing: {
          tenants: [
            {
              id: 2,
              guarantors: [{ id: 60 }]
            }
          ]
        }
      }

      const guarantor = {
        id: 60,
        typeGuarantor: 'NATURAL_PERSON',
        firstName: 'David',
        lastName: 'Leroy',
        documents: []
      }

      const wrapper = mountComponent(guarantor, false)

      expect(wrapper.find(DELETE_BUTTON_SELECTOR).exists()).toBe(false)
    })
  })
})
