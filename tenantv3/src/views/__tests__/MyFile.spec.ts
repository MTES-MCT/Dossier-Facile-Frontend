import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MyFile from '@/views/MyFile.vue'
import { ProfileService } from '@/services/ProfileService'
import type { FileUser } from 'df-shared-next/src/models/FileUser'

vi.mock('@/services/ProfileService')
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  }),
  createI18n: vi.fn(() => ({}))
}))
vi.mock('@/components/toast/toastUtils', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

describe('MyFile.vue', () => {
  const mockFileUser: FileUser = {
    id: 1,
    applicationType: 'ALONE',
    status: 'VALIDATED',
    dossierPdfDocumentStatus: 'COMPLETED',
    tenants: [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        ownerType: 'SELF',
        franceConnect: false,
        documents: [],
        guarantors: [],
        apartmentSharing: {
          id: 1,
          status: 'VALIDATED'
        }
      } as any
    ]
  }

  const mountOptions = {
    global: {
      stubs: {
        FileHeader: {
          template: `
            <div class="file-header">
              <div @click="handleSlotClick">
                <slot />
              </div>
            </div>
          `,
          props: ['user'],
          methods: {
            handleSlotClick(event: Event) {
              // Find the first button in the slot and trigger its click handler
              const button = (event.currentTarget as HTMLElement).querySelector('button')
              if (button) {
                button.click()
              }
            }
          }
        },
        FileReinsurance: true,
        FileRowListItem: true,
        RowListItem: true,
        OwnerBanner: true,
        FileNotFound: true,
        ProgressIndicator: true
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.URL.createObjectURL for downloadFile()
    window.URL.createObjectURL = vi.fn(() => 'mock-url')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render the download PDF button', async () => {
    vi.spyOn(ProfileService, 'getCurrentTenant').mockResolvedValue({
      data: mockFileUser
    } as any)

    const wrapper = mount(MyFile, mountOptions)

    await flushPromises()

    const header = wrapper.find('.file-header')
    const downloadButton = header.find('button')

    expect(downloadButton).toBeDefined()
    expect(downloadButton?.exists()).toBe(true)
  })

  it('should disable the download button when dossier is not VALIDATED', async () => {
    const invalidatedUser = {
      ...mockFileUser,
      status: 'INCOMPLETE'
    }

    vi.spyOn(ProfileService, 'getCurrentTenant').mockResolvedValue({
      data: invalidatedUser
    } as any)

    const wrapper = mount(MyFile, mountOptions)

    await flushPromises()

    const header = wrapper.find('.file-header')
    const downloadButton = header.find('button')

    expect(downloadButton.attributes('disabled')).toBeDefined()
  })

  it('should call getFullPdfForCurrentTenant when PDF is already completed', async () => {
    const mockPdfData = new Blob(['pdf content'], { type: 'application/pdf' })
    const getFullPdfSpy = vi
      .spyOn(ProfileService, 'getFullPdfForCurrentTenant')
      .mockResolvedValue({
        data: mockPdfData,
        headers: { 'content-disposition': 'attachment; filename="dossier.pdf"' }
      } as any)

    vi.spyOn(ProfileService, 'getCurrentTenant').mockResolvedValue({
      data: mockFileUser
    } as any)

    const wrapper = mount(MyFile, mountOptions)

    await flushPromises()

    const header = wrapper.find('.file-header > div')
    await header.trigger('click')
    await flushPromises()

    expect(getFullPdfSpy).toHaveBeenCalledTimes(1)
  })

  it('should call postCreateFullPdfForCurrentTenant when PDF is not ready', async () => {
    const incompletePdfUser = {
      ...mockFileUser,
      dossierPdfDocumentStatus: 'NONE'
    }

    const postCreatePdfSpy = vi
      .spyOn(ProfileService, 'postCreateFullPdfForCurrentTenant')
      .mockResolvedValue({} as any)

    vi.spyOn(ProfileService, 'getCurrentTenant').mockResolvedValue({
      data: incompletePdfUser
    } as any)

    const wrapper = mount(MyFile, mountOptions)

    await flushPromises()

    const header = wrapper.find('.file-header > div')
    await header.trigger('click')
    await flushPromises()

    expect(postCreatePdfSpy).toHaveBeenCalled()
  })

  it('should call postCreateFullPdfForCurrentTenant then eventually getFullPdfForCurrentTenant after retry when initial status is NONE', async () => {
    vi.useFakeTimers()

    const incompletePdfUser = {
      ...mockFileUser,
      dossierPdfDocumentStatus: 'NONE'
    }

    const completedPdfUser = {
      ...mockFileUser,
      dossierPdfDocumentStatus: 'COMPLETED'
    }

    const mockPdfData = new Blob(['pdf content'], { type: 'application/pdf' })

    const postCreatePdfSpy = vi
      .spyOn(ProfileService, 'postCreateFullPdfForCurrentTenant')
      .mockResolvedValue({} as any)

    const getFullPdfSpy = vi
      .spyOn(ProfileService, 'getFullPdfForCurrentTenant')
      .mockResolvedValue({
        data: mockPdfData,
        headers: { 'content-disposition': 'attachment; filename="dossier.pdf"' }
      } as any)

    const getCurrentTenantSpy = vi
      .spyOn(ProfileService, 'getCurrentTenant')
      .mockResolvedValueOnce({ data: incompletePdfUser } as any) // initial mount
      .mockResolvedValue({ data: completedPdfUser } as any) // first retry

    try {
      const wrapper = mount(MyFile, mountOptions)
      await flushPromises()

      const header = wrapper.find('.file-header > div')
      await header.trigger('click')
      await flushPromises()

      expect(postCreatePdfSpy).toHaveBeenCalledTimes(1)
      expect(getCurrentTenantSpy).toHaveBeenCalledTimes(1)

      await vi.advanceTimersByTimeAsync(15000)
      await flushPromises()      // first retry resolves and checks status, then downloads

      expect(getCurrentTenantSpy).toHaveBeenCalledTimes(2) // mount + 1 retry
      expect(getFullPdfSpy).toHaveBeenCalledTimes(1)
    } finally {
      vi.useRealTimers()
    }
  })

})
