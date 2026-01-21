import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DownloadPdfSection from '../components/sharing/DownloadPdfSection.vue'
import { ProfileService } from '../services/ProfileService'

// Mock vue-i18n to just return keys
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  })
}))

// Mock ProfileService
vi.mock('../services/ProfileService', () => ({
  ProfileService: {
    getCurrentTenantFullData: vi.fn(),
    getCurrentTenantPdf: vi.fn(),
    postCreateCurrentTenantPdf: vi.fn()
  }
}))

// Mock UtilsService
vi.mock('../services/UtilsService', () => ({
  UtilsService: {
    getFileNameFromHeaders: vi.fn(() => 'dossierFacile.pdf')
  }
}))

// Mock toast
vi.mock('../components/toast/toastUtils', () => ({
  toast: {
    error: vi.fn()
  }
}))

// Mock URL.createObjectURL
const mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
globalThis.URL.createObjectURL = mockCreateObjectURL

// Shared test utilities
const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' })

function mockPdfDownload() {
  vi.mocked(ProfileService.getCurrentTenantPdf).mockResolvedValue({
    data: mockBlob,
    headers: {}
  } as never)
}

function mountComponent() {
  return mount(DownloadPdfSection, {
    global: {
      stubs: {
        ProgressIndicator: true,
        RiFileDownloadLine: true
      }
    }
  })
}

describe('DownloadPdfSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    mockPdfDownload()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when dossierPdfDocumentStatus is COMPLETED on mount', () => {
    it('should download PDF directly when clicking the button', async () => {
      // Setup: PDF is already generated
      vi.mocked(ProfileService.getCurrentTenantFullData).mockResolvedValue({
        data: { dossierPdfDocumentStatus: 'COMPLETED' }
      } as never)

      const wrapper = mountComponent()

      // Wait for onMounted to complete
      await flushPromises()

      // Verify getCurrentTenantFullData was called on mount
      expect(ProfileService.getCurrentTenantFullData).toHaveBeenCalledTimes(1)

      // Click download button
      const downloadButton = wrapper.find('button.fr-btn--secondary')
      await downloadButton.trigger('click')
      await flushPromises()

      // Should call getCurrentTenantPdf directly (no POST, no polling)
      expect(ProfileService.postCreateCurrentTenantPdf).not.toHaveBeenCalled()
      expect(ProfileService.getCurrentTenantPdf).toHaveBeenCalledTimes(1)
    })
  })

  describe('when dossierPdfDocumentStatus is NOT COMPLETED on mount', () => {
    it('should request generation, poll, then download when status becomes COMPLETED', async () => {
      // Setup: PDF is not yet generated
      let callCount = 0
      vi.mocked(ProfileService.getCurrentTenantFullData).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // First call (mount): dossierPdfDocumentStatus not present
          return Promise.resolve({
            data: {}
          } as never)
        }
        if (callCount === 2) {
          // Second call (poll): IN_PROGRESS
          return Promise.resolve({
            data: { dossierPdfDocumentStatus: 'IN_PROGRESS' }
          } as never)
        }
        // Third call (poll): COMPLETED
        return Promise.resolve({
          data: { dossierPdfDocumentStatus: 'COMPLETED' }
        } as never)
      })

      vi.mocked(ProfileService.postCreateCurrentTenantPdf).mockResolvedValue({} as never)

      const wrapper = mountComponent()

      // Wait for onMounted to complete
      await flushPromises()

      // First call (mount): no dossierPdfDocumentStatus
      expect(ProfileService.getCurrentTenantFullData).toHaveBeenCalledTimes(1)

      // Click download button
      const downloadButton = wrapper.find('button.fr-btn--secondary')
      await downloadButton.trigger('click')
      await flushPromises()

      // Should call POST to request generation (status undefined)
      expect(ProfileService.postCreateCurrentTenantPdf).toHaveBeenCalledTimes(1)

      // Progress bar should be visible
      expect(wrapper.text()).toContain('download-in-progress')

      // Advance timer by 15 seconds (poll)
      await vi.advanceTimersByTimeAsync(10000)
      await flushPromises()

      // Second call (poll): IN_PROGRESS, should not download yet
      expect(ProfileService.getCurrentTenantFullData).toHaveBeenCalledTimes(2)
      expect(ProfileService.getCurrentTenantPdf).not.toHaveBeenCalled()

      // Advance timer by another 15 seconds (poll)
      await vi.advanceTimersByTimeAsync(10000)
      await flushPromises()

      // Third call (poll): COMPLETED, should download
      expect(ProfileService.getCurrentTenantFullData).toHaveBeenCalledTimes(3)
      expect(ProfileService.getCurrentTenantPdf).toHaveBeenCalledTimes(1)
    })
  })
})
