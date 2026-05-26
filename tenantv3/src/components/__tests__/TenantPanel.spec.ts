import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TenantPanel from '../account/TenantPanel.vue'

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    user: { id: 1, documents: [] }
  })
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  }),
  createI18n: () => ({})
}))

vi.mock('../../services/UtilsService', () => ({
  UtilsService: {
    tenantFullName: () => 'Tenant Full Name'
  }
}))

vi.mock('@/services/DocumentService', () => ({
  DocumentService: {
    getDoc: () => undefined
  }
}))

vi.mock('../../services/AnalyticsService', () => ({
  AnalyticsService: {
    editFromAccount: vi.fn()
  }
}))

vi.mock('../mainActivity/lib/useMainActivityLink', () => ({
  makeActivityLink: () => '/stub'
}))

vi.mock('../residency/lib/useResidencyLink', () => ({
  makeResidencyLink: () => '/stub'
}))

vi.mock('../identityDocument/lib/identityDocumentLink', () => ({
  makeIdentityDocumentLink: () => '/stub'
}))

vi.mock('../tax/lib/taxLink', () => ({
  makeTaxLink: () => '/stub'
}))

const CLARIFICATION_LABEL = 'tenantpanel.clarification-title'

const globalStubs = {
  RowListItem: {
    props: ['to', 'label', 'subLabel', 'canEdit'],
    template: '<li data-test="row-list-item" :data-label="label">{{ label }}</li>'
  },
  FileRowListItem: { template: '<li data-test="file-row-list-item" />' },
  GuarantorsSection: { template: '<div data-test="guarantors-section" />' }
}

function mountPanel(
  tenant: Record<string, unknown>,
  isCotenant: boolean,
  isCouple = false
) {
  return mount(TenantPanel, {
    props: { tenant, isCotenant, isCouple },
    global: { stubs: globalStubs }
  })
}

function hasClarificationRow(wrapper: ReturnType<typeof mountPanel>) {
  return wrapper.find(`[data-label="${CLARIFICATION_LABEL}"]`).exists()
}

describe('TenantPanel — "Mot du locataire" row visibility', () => {
  it('shows the row when the user is viewing their own panel and is the file creator (CREATE)', () => {
    const tenant = { id: 1, tenantType: 'CREATE', documents: [], clarification: 'Hello' }

    const wrapper = mountPanel(tenant, false)

    expect(hasClarificationRow(wrapper)).toBe(true)
  })

  it('hides the row when the user is viewing their own panel but has joined the file (JOIN)', () => {
    const tenant = { id: 1, tenantType: 'JOIN', documents: [] }

    const wrapper = mountPanel(tenant, false)

    expect(hasClarificationRow(wrapper)).toBe(false)
  })

  it('hides the row when viewing the panel of another tenant of the same file, even if that tenant is the CREATE', () => {
    const tenant = { id: 2, tenantType: 'CREATE', documents: [] }

    const wrapper = mountPanel(tenant, true)

    expect(hasClarificationRow(wrapper)).toBe(false)
  })

  it('hides the row when viewing the panel of another JOIN tenant', () => {
    const tenant = { id: 2, tenantType: 'JOIN', documents: [] }

    const wrapper = mountPanel(tenant, true)

    expect(hasClarificationRow(wrapper)).toBe(false)
  })
})
