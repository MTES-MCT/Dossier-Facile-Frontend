import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AnalysisPreview from '../validateStep/AnalysisPreview.vue'

const { mockStore } = vi.hoisted(() => {
  return {
    mockStore: {
      user: {
        id: 1,
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
  }
}

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
})
