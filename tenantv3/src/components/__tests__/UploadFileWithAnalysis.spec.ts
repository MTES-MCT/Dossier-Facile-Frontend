import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'
import UploadFileWithAnalysis from '../analysis/UploadFileWithAnalysis.vue'
import { RegisterService } from '@/services/RegisterService'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  })
}))

vi.mock('@/services/RegisterService', () => ({
  RegisterService: {
    deleteFile: vi.fn().mockResolvedValue(undefined)
  }
}))

vi.mock('@/services/AnalyticsService', () => ({
  AnalyticsService: {
    uploadFile: vi.fn(),
    deleteDocument: vi.fn(),
    cancelDelete: vi.fn(),
    deleteFile: vi.fn(),
    removeDeniedDocument: vi.fn()
  }
}))

vi.mock('@/services/UtilsService', () => ({
  UtilsService: {
    handleCommonSaveError: vi.fn()
  }
}))

vi.mock('vue-loading-overlay', () => ({
  useLoading: () => ({
    show: () => ({ hide: vi.fn() })
  })
}))

vi.mock('@/components/toast/toastUtils', () => ({
  toast: {
    success: vi.fn(),
    maxFileError: vi.fn()
  }
}))

const mockSaveTenantTax = vi.fn().mockResolvedValue({})

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    saveTenantTax: mockSaveTenantTax
  })
}))

const mockDocument = ref<DfDocument | undefined>({
  id: 42,
  files: [{ id: 1, name: 'tax.pdf', size: 1000 }],
  documentStatus: 'TO_PROCESS',
  documentAnalysisReport: undefined
} as unknown as DfDocument)

vi.mock('../documents/documentFormState', () => ({
  useDocumentFormKey: () => ({
    document: mockDocument,
    formFieldValue: 'typeDocumentTax',
    storeAction: 'saveTenantTax',
    addData: undefined
  })
}))

const globalStubs = {
  FileUpload: true,
  ListItem: true,
  VIcon: true
}

function mountComponent(props?: {
  maxFileCount?: number
  analysisInProgress?: boolean
  beforeSave?: (files: File[]) => Promise<boolean> | boolean
  isOvertime?: boolean
}) {
  return mount(UploadFileWithAnalysis, {
    props: {
      docCategory: 'tax',
      subCategory: 'MY_NAME',
      ...props
    } as never,
    global: {
      stubs: globalStubs
    }
  })
}

describe('UploadFileWithAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDocument.value = {
      id: 42,
      files: [{ id: 1, name: 'tax.pdf', size: 1000 }],
      documentStatus: 'TO_PROCESS',
      documentAnalysisReport: undefined
    } as unknown as DfDocument
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('saves files on addFiles and resets upload status', async () => {
    const wrapper = mountComponent()
    const file = new File(['content'], 'new-tax.pdf', { type: 'application/pdf' })

    await wrapper.vm.$.setupState.addFiles([file])
    await flushPromises()

    expect(mockSaveTenantTax).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.isUploading).toBe(false)
  })

  it('reverts pending files when beforeSave returns false', async () => {
    const beforeSave = vi.fn().mockResolvedValue(false)
    const wrapper = mountComponent({ beforeSave })
    const file = new File(['content'], 'new-tax.pdf', { type: 'application/pdf' })

    await wrapper.vm.$.setupState.addFiles([file])
    await flushPromises()

    expect(beforeSave).toHaveBeenCalledOnce()
    expect(mockSaveTenantTax).not.toHaveBeenCalled()
    expect(wrapper.vm.$.setupState.files).toEqual([])
  })

  it('fails upload when maxFileCount is exceeded', async () => {
    const wrapper = mountComponent({ maxFileCount: 5 })
    const files = Array.from(
      { length: 6 },
      (_, index) => new File(['content'], `extra-${index}.pdf`, { type: 'application/pdf' })
    )

    await wrapper.vm.$.setupState.addFiles(files)
    await flushPromises()

    expect(wrapper.vm.$.setupState.fileUploadStatus).toBe(UploadStatus.STATUS_INITIAL)
    expect(mockSaveTenantTax).not.toHaveBeenCalled()
  })

  it('counts existing server files when enforcing maxFileCount', async () => {
    const wrapper = mountComponent({ maxFileCount: 5 })
    const files = Array.from(
      { length: 5 },
      (_, index) => new File(['content'], `extra-${index}.pdf`, { type: 'application/pdf' })
    )

    await wrapper.vm.$.setupState.addFiles(files)
    await flushPromises()

    // 1 existing server file + 5 new local files => 6 total > maxFileCount (5)
    expect(wrapper.vm.$.setupState.fileUploadStatus).toBe(UploadStatus.STATUS_INITIAL)
    expect(mockSaveTenantTax).not.toHaveBeenCalled()
  })

  it('removes existing file via RegisterService', async () => {
    const wrapper = mountComponent()

    await wrapper.vm.$.setupState.remove({ id: 1, name: 'tax.pdf', size: 1000 })
    await flushPromises()

    expect(RegisterService.deleteFile).toHaveBeenCalledWith(1, false)
  })

  it('removes local file without RegisterService call', async () => {
    const wrapper = mountComponent()
    const localFile = new File(['content'], 'local.pdf', { type: 'application/pdf' })

    await wrapper.vm.$.setupState.addFiles([localFile])
    await flushPromises()

    mockSaveTenantTax.mockClear()
    await wrapper.vm.$.setupState.remove({ name: 'local.pdf', size: localFile.size })
    await flushPromises()

    expect(RegisterService.deleteFile).not.toHaveBeenCalled()
  })

  it('shows analysis loading bar and spinner when analysisInProgress is true and not overtime', async () => {
    const wrapper = mountComponent({ analysisInProgress: true, isOvertime: false })
    await flushPromises()

    expect(wrapper.find('.analysis-loading').exists()).toBe(true)
    expect(wrapper.find('.analysis-loading-progress').exists()).toBe(true)
    expect(wrapper.find('.analysis-loading-text').text()).toContain('analysis-in-progress')

    const icon = wrapper.findComponent({ name: 'VIcon' })
    expect(icon.props('name')).toBe('ri:loader-4-line')
    expect(icon.classes()).toContain('analysis-loading-spinner')
  })

  it('cuts loader and shows overtime information when isOvertime prop is true', async () => {
    const wrapper = mountComponent({ analysisInProgress: true, isOvertime: true })
    await flushPromises()

    expect(wrapper.find('.analysis-loading').exists()).toBe(true)
    expect(wrapper.find('.analysis-loading-progress').exists()).toBe(false)
    expect(wrapper.find('.analysis-loading-text').text()).toContain('analysis-overtime')

    const icon = wrapper.findComponent({ name: 'VIcon' })
    expect(icon.props('name')).toBe('ri:information-line')
    expect(icon.classes()).not.toContain('analysis-loading-spinner')
  })

  it('cuts loader and shows overtime information when isOvertime changes to true', async () => {
    const wrapper = mountComponent({ analysisInProgress: true, isOvertime: false })
    await flushPromises()

    expect(wrapper.find('.analysis-loading-progress').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'VIcon' }).props('name')).toBe('ri:loader-4-line')

    await wrapper.setProps({ isOvertime: true })
    await flushPromises()

    expect(wrapper.find('.analysis-loading-progress').exists()).toBe(false)
    expect(wrapper.find('.analysis-loading-text').text()).toContain('analysis-overtime')
    expect(wrapper.findComponent({ name: 'VIcon' }).props('name')).toBe('ri:information-line')
    expect(wrapper.findComponent({ name: 'VIcon' }).classes()).not.toContain('analysis-loading-spinner')
  })

  it('restarts and advances progress when adding a new file while analysisInProgress is already true', async () => {
    vi.useFakeTimers()
    const wrapper = mountComponent({ analysisInProgress: true, isOvertime: false })
    await flushPromises()

    await vi.advanceTimersByTimeAsync(500)
    const progressBar = wrapper.find('[role="progressbar"]')
    expect(Number(progressBar.attributes('aria-valuenow'))).toBeGreaterThan(0)

    const file = new File(['hello'], 'new.pdf', { type: 'application/pdf' })
    await wrapper.vm.$.setupState.addFiles([file])
    await flushPromises()

    await vi.advanceTimersByTimeAsync(500)
    expect(Number(wrapper.find('[role="progressbar"]').attributes('aria-valuenow'))).toBeGreaterThan(0)
    vi.useRealTimers()
  })
})
