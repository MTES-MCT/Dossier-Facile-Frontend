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
          name: 'https://api.example.com/api/application/links/abc-123/document/doc-uuid'
        }
      }
    })
    const link = wrapper.find(
      'a[href="https://api.example.com/api/application/links/abc-123/document/doc-uuid"]'
    )
    expect(link.exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(false)
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
