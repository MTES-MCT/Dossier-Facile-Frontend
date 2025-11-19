import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MyFile from '@/views/MyFile.vue'
import { ProfileService } from '@/services/ProfileService'
import type { FileUser } from 'df-shared-next/src/models/FileUser'
import FileHeader from 'tenantv3/src/components/FileHeader.vue'

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
              <button class="mocked-header-button" @click="$slots.default()[0].children[0].props.onClick">
                Mock Header Download Button
              </button>
            </div>
          `,
          props: ['user']
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

    // Check that the download button exists
    const header = wrapper.find('.file-header')
    const downloadButton = header.find('button')

    expect(downloadButton).toBeDefined()
    expect(downloadButton?.exists()).toBe(true)
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

    // Find and click the download button in the header
    const header = wrapper.find('.file-header')
    const downloadButton = header.find('button')

    await downloadButton.trigger('click')
    await flushPromises()

    // Find and click the download button
    // const buttons = wrapper.findAll('button')
    // const downloadButtons = buttons.filter((button: any) =>
    //     button.text().includes('file.download-all')
    // )
    // const downloadButton = downloadButtons[0]

    // await downloadButton?.trigger('click')
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

    // Find and click the download button in the header
    const header = wrapper.find('.file-header')
    const downloadButton = header.find('button')

    await downloadButton.trigger('click')
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

      const header = wrapper.find('.file-header')
      const downloadButton = header.find('button')
      await downloadButton.trigger('click')
      await flushPromises()

      expect(postCreatePdfSpy).toHaveBeenCalledTimes(1)
      expect(getCurrentTenantSpy).toHaveBeenCalledTimes(1)

      await vi.advanceTimersByTimeAsync(15000)
      await flushPromises()      // first retry resolves getCurrentTenant
      await vi.advanceTimersByTimeAsync(15000)
      await flushPromises()      // second retry checks status and calls downloadFile()

      expect(getCurrentTenantSpy).toHaveBeenCalledTimes(3) // mount + 2 retries
      expect(getFullPdfSpy).toHaveBeenCalledTimes(1)
    } finally {
      vi.useRealTimers()
    }
  })

//   it('should call postCreate then later getFullPdf when clicking header button and initial status is NONE (real component button)', async () => {
//     vi.useFakeTimers()

//     // Remove FileHeader stub to use real button rendered with data-testid
//     const mountOptionsRealHeader = {
//       global: {
//         stubs: {
//           // Keep other heavy components stubbed
//           FileReinsurance: true,
//           FileRowListItem: true,
//           RowListItem: true,
//           OwnerBanner: true,
//           FileNotFound: true,
//           ProgressIndicator: true
//         }
//       }
//     }

//     const incompletePdfUser = {
//       ...mockFileUser,
//       dossierPdfDocumentStatus: 'NONE'
//     }
//     const completedPdfUser = {
//       ...mockFileUser,
//       dossierPdfDocumentStatus: 'COMPLETED'
//     }
//     const mockPdfData = new Blob(['pdf content'], { type: 'application/pdf' })

//     const postCreatePdfSpy = vi
//       .spyOn(ProfileService, 'postCreateFullPdfForCurrentTenant')
//       .mockResolvedValue({} as any)
//     const getFullPdfSpy = vi
//       .spyOn(ProfileService, 'getFullPdfForCurrentTenant')
//       .mockResolvedValue({
//         data: mockPdfData,
//         headers: { 'content-disposition': 'attachment; filename="dossier.pdf"' }
//       } as any)
//     const getCurrentTenantSpy = vi
//       .spyOn(ProfileService, 'getCurrentTenant')
//       .mockResolvedValueOnce({ data: incompletePdfUser } as any)
//       .mockResolvedValue({ data: completedPdfUser } as any)

//     try {
//       const wrapper = mount(MyFile, mountOptionsRealHeader)
//       await flushPromises()

//       const headerButton = wrapper.find('[data-testid="header-download-button"]')
//       expect(headerButton.exists()).toBe(true)
//       await headerButton.trigger('click')
//       await flushPromises()

//       expect(postCreatePdfSpy).toHaveBeenCalledTimes(1)
//       expect(getFullPdfSpy).not.toHaveBeenCalled()
//       expect(getCurrentTenantSpy).toHaveBeenCalledTimes(1)

//       await vi.advanceTimersByTimeAsync(15000)
//       await flushPromises()
//       await flushPromises()

//       expect(getCurrentTenantSpy).toHaveBeenCalledTimes(2)
//       expect(getFullPdfSpy).toHaveBeenCalledTimes(1)
//       expect(postCreatePdfSpy).toHaveBeenCalledBefore(getFullPdfSpy)
//     } finally {
//       vi.useRealTimers()
//     }
//   })

//   it.only('should retry download and call setUser when PDF generation is in progress', async () => {
//     vi.useFakeTimers()

//     const incompletePdfUser = {
//         ...mockFileUser,
//         dossierPdfDocumentStatus: 'NONE'
//     }

//     const completedPdfUser = {
//         ...mockFileUser,
//         dossierPdfDocumentStatus: 'COMPLETED'
//     }

//     const mockPdfData = new Blob(['pdf content'], { type: 'application/pdf' })

//     const postCreatePdfSpy = vi
//         .spyOn(ProfileService, 'postCreateFullPdfForCurrentTenant')
//         .mockResolvedValue({} as any)

//     const getCurrentTenantSpy = vi
//         .spyOn(ProfileService, 'getCurrentTenant')
//         .mockResolvedValueOnce({ data: incompletePdfUser } as any)  // onMounted
//         .mockResolvedValue({ data: completedPdfUser } as any)       // first retry + any subsequent

//     const getFullPdfSpy = vi
//         .spyOn(ProfileService, 'getFullPdfForCurrentTenant')
//         .mockResolvedValue({
//         data: mockPdfData,
//         headers: { 'content-disposition': 'attachment; filename="dossier.pdf"' }
//         } as any)

//     const wrapper = mount(MyFile, mountOptions)

//     await flushPromises()

//     // At this point, getCurrentTenant has been called once (on mount)
//     expect(getCurrentTenantSpy).toHaveBeenCalledTimes(1)

//     // Find and click the download button in the header
//     const header = wrapper.find('.file-header')
//     const downloadButton = header.find('button')

//     await downloadButton.trigger('click')
//     await flushPromises()

//     expect(postCreatePdfSpy).toHaveBeenCalledTimes(1)
//     await flushPromises()
//     await flushPromises()

//     // First retry: calls setUser() but check happens before update completes
//     await vi.advanceTimersByTimeAsync(15000)
//     await flushPromises() // Let getCurrentTenant resolve and update user.value
    
//     // Second retry: now user.value has been updated to completedPdfUser from previous setUser()
//     // The check will see COMPLETED status and call downloadFile()
//     // But setUser() is still called first before the check
//     // await vi.advanceTimersByTimeAsync(1000)
//     await flushPromises() // Let downloadFile() complete

//     // Should have called getCurrentTenant: once on mount + once in first retry + once in second retry
//     expect(getCurrentTenantSpy).toHaveBeenCalledTimes(2)
//     expect(getFullPdfSpy).toHaveBeenCalledTimes(1)

//     vi.useRealTimers()
//     })

// it.only('should retry download and call setUser when PDF generation is in progress', async () => {
//     vi.useFakeTimers()

//     const incompletePdfUser = {
//         ...mockFileUser,
//         dossierPdfDocumentStatus: 'NONE'
//     }

//     const completedPdfUser = {
//         ...mockFileUser,
//         dossierPdfDocumentStatus: 'COMPLETED'
//     }

//     const mockPdfData = new Blob(['pdf content'], { type: 'application/pdf' })

//     const postCreatePdfSpy = vi
//         .spyOn(ProfileService, 'postCreateFullPdfForCurrentTenant')
//         .mockResolvedValue({} as any)

//     const getCurrentTenantSpy = vi
//         .spyOn(ProfileService, 'getCurrentTenant')
//         .mockResolvedValueOnce({ data: incompletePdfUser } as any)
//         .mockResolvedValue({ data: completedPdfUser } as any)

//     const getFullPdfSpy = vi
//         .spyOn(ProfileService, 'getFullPdfForCurrentTenant')
//         .mockResolvedValue({
//         data: mockPdfData,
//         headers: { 'content-disposition': 'attachment; filename="dossier.pdf"' }
//         } as any)

//     const wrapper = mount(MyFile, {
//         global: {
//         stubs: {
//             // FileHeader: {
//             // template: `
//             //     <div class="file-header"><button class= @click="$emit(\'click\')"><slot /></button></div>,
//             // `,
//             // props: ['user']
//             // },
//             FileHeader: true,
//             FileReinsurance: true,
//             FileRowListItem: true,
//             RowListItem: true,
//             OwnerBanner: true,
//             FileNotFound: true,
//             DfButton: {
//                 template: '<button @click="$emit(\'click\')" ><slot /></button>',
//                 props: ['disabled', 'primary', 'title']
//             },
//             ProgressIndicator: true
//         }
//         }
//     })

    

//     await flushPromises()

//     // Find and click the download button

//     // const header = wrapper.find('.file-header')
//     // const downloadButton = header.find('button')

//     // const buttons = wrapper.findAll('button')
//     // const downloadButtons = buttons.filter((button: any) =>
//     //     button.text().includes('file.download-all')
//     // )
//     // const downloadButton = downloadButtons[0]

//     // await downloadButton?.trigger('click')

//     const header = wrapper.find('[data-testid="footer-download-button-div"]')
//     const downloadButton = header.find('button')
//     await downloadButton.trigger('click')

//     // const buttons = wrapper.findAll('button')
//     // const downloadButton = buttons.find((button: any) =>
//     //     button.text().includes('file.download-all')
//     // )

//     // const downloadButton = wrapper.find('.mocked-header-button2')

//     // await downloadButton?.trigger('click')
//     await flushPromises()

//     expect(postCreatePdfSpy).toHaveBeenCalledTimes(1)

//     // Fast-forward timer to trigger retry
//     await vi.advanceTimersByTimeAsync(15000)
//     await flushPromises()

//     // Should have called getCurrentTenant again to check status
//     expect(getCurrentTenantSpy).toHaveBeenCalled()
//     expect(getFullPdfSpy).toHaveBeenCalledTimes(1)

//     vi.useRealTimers()
//     })



//     it('should retry download and call setUser when PDF generation is in progress', async () => {
//     vi.useFakeTimers()

//     const incompletePdfUser = {
//         ...mockFileUser,
//         dossierPdfDocumentStatus: 'NONE'
//     }

//     const completedPdfUser = {
//         ...mockFileUser,
//         dossierPdfDocumentStatus: 'COMPLETED'
//     }

//     const mockPdfData = new Blob(['pdf content'], { type: 'application/pdf' })

//     const postCreatePdfSpy = vi
//         .spyOn(ProfileService, 'postCreateFullPdfForCurrentTenant')
//         .mockResolvedValue({} as any)

//     const getCurrentTenantSpy = vi
//         .spyOn(ProfileService, 'getCurrentTenant')
//         .mockResolvedValueOnce({ data: incompletePdfUser } as any)
//         .mockResolvedValue({ data: completedPdfUser } as any)

//     const getFullPdfSpy = vi
//         .spyOn(ProfileService, 'getFullPdfForCurrentTenant')
//         .mockResolvedValue({
//         data: mockPdfData,
//         headers: { 'content-disposition': 'attachment; filename="dossier.pdf"' }
//         } as any)

//     const wrapper = mount(MyFile, mountOptions)

//     await flushPromises()

//     // Find and click the download button
//     const header = wrapper.find('.file-header')
//     const downloadButton = header.find('button')

//     await downloadButton.trigger('click')
//     await flushPromises()

//     expect(postCreatePdfSpy).toHaveBeenCalled()

//     // Fast-forward timer to trigger retry
//     await vi.advanceTimersByTimeAsync(15000)
//     await flushPromises()

//     // Should have called getCurrentTenant again to check status
//     expect(getCurrentTenantSpy).toHaveBeenCalled()
//     expect(getFullPdfSpy).toHaveBeenCalled()

//     vi.useRealTimers()
//     })

})
