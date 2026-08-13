import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CompletedFileBanner from '../account/CompletedFileBanner.vue'

const { mockDownloadZip, mockAnalytics } = vi.hoisted(() => ({
  mockDownloadZip: vi.fn(() => Promise.resolve()),
  mockAnalytics: { optInDownloadZip: vi.fn() }
}))

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }))
vi.mock('@/composables/useZipDownload', () => ({
  useZipDownload: () => ({ downloadZip: mockDownloadZip })
}))
vi.mock('@/services/AnalyticsService', () => ({ AnalyticsService: mockAnalytics }))

const globalStubs = { VIcon: true, RiDownloadLine: true }

describe('CompletedFileBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('announces that the file is complete and shareable', () => {
    const wrapper = mount(CompletedFileBanner, { global: { stubs: globalStubs } })

    expect(wrapper.text()).toContain('badge')
    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('check-documents')
    expect(wrapper.text()).toContain('check-watermark')
    expect(wrapper.find('h2').exists()).toBe(true)
  })

  it('downloads the ZIP archive on click', async () => {
    const wrapper = mount(CompletedFileBanner, { global: { stubs: globalStubs } })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(mockAnalytics.optInDownloadZip).toHaveBeenCalled()
    expect(mockDownloadZip).toHaveBeenCalled()
  })
})
