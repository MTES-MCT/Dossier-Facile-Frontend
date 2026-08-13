import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FileRowListItem from '../documents/FileRowListItem.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('@/components/toast/toastUtils', () => ({
  toast: { error: vi.fn() }
}))

vi.mock('@/services/UtilsService', () => ({
  UtilsService: {
    getFileNameFromHeaders: vi.fn(() => 'document.pdf')
  }
}))

vi.mock('@/services/ApiService', () => ({
  apiService: {
    get: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
  }
}))

describe('FileRowListItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a direct link for unauthenticated link URL ', () => {
    const wrapper = mount(FileRowListItem, {
      global: { stubs: { RouterLink: true } },
      props: {
        label: 'Identification',
        enableDownload: true,
        document: {
          documentStatus: 'VALIDATED',
          name: 'https://api.example.com/api/application/links/abc-123/documents/doc-uuid'
        }
      }
    })
    const link = wrapper.find(
      'a[href="https://api.example.com/api/application/links/abc-123/documents/doc-uuid"]'
    )
    expect(link.exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('labels a submitted document as completed when the dossier is COMPLETED', () => {
    const wrapper = mount(FileRowListItem, {
      global: { stubs: { RouterLink: true } },
      props: {
        label: 'Identification',
        document: { documentStatus: 'TO_PROCESS' },
        dossierStatus: 'COMPLETED'
      }
    })

    expect(wrapper.text()).toContain('documents.status.COMPLETED')
  })

  it('keeps the regular label when the dossier is not COMPLETED', () => {
    const wrapper = mount(FileRowListItem, {
      global: { stubs: { RouterLink: true } },
      props: {
        label: 'Identification',
        document: { documentStatus: 'TO_PROCESS' },
        dossierStatus: 'TO_PROCESS'
      }
    })

    expect(wrapper.text()).toContain('documents.status.TO_PROCESS')
  })

  it('does not alter a validated document of a COMPLETED dossier', () => {
    const wrapper = mount(FileRowListItem, {
      global: { stubs: { RouterLink: true } },
      props: {
        label: 'Identification',
        document: { documentStatus: 'VALIDATED' },
        dossierStatus: 'COMPLETED'
      }
    })

    expect(wrapper.text()).toContain('documents.status.VALIDATED')
  })

  it('renders a button for authenticated direct document URL', () => {
    const wrapper = mount(FileRowListItem, {
      global: { stubs: { RouterLink: true } },
      props: {
        label: 'Identification',
        enableDownload: true,
        document: {
          documentStatus: 'VALIDATED',
          name: 'https://api.example.com/api/document/resource/doc-uuid'
        }
      }
    })
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('type')).toBe('button')
    expect(wrapper.find('a[href*="document/resource"]').exists()).toBe(false)
  })
})
