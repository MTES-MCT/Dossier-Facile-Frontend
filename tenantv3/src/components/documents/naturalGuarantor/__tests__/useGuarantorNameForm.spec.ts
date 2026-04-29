import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, shallowRef } from 'vue'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { useGuarantorNameForm } from '../useGuarantorNameForm'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
  createI18n: () => ({ global: { t: (key: string) => key } })
}))

const mockSaveGuarantorName = vi.fn()
vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({ saveGuarantorName: mockSaveGuarantorName })
}))

vi.mock('vue-loading-overlay', () => ({
  useLoading: () => ({ show: () => ({ hide: vi.fn() }) })
}))

const mockToastError = vi.fn()
vi.mock('@/components/toast/toastUtils', () => ({
  toast: {
    keep: { success: vi.fn() },
    error: (...args: unknown[]) => mockToastError(...args)
  },
  getNextBtnInFooter: () => null
}))

type ComposableReturn = ReturnType<typeof useGuarantorNameForm>
type Options = Parameters<typeof useGuarantorNameForm>[0]

function setupComposable(opts: Options) {
  const captured = shallowRef<ComposableReturn | null>(null)
  const Comp = defineComponent({
    setup() {
      captured.value = useGuarantorNameForm(opts)
      return () => null
    }
  })
  mount(Comp)
  if (!captured.value) {
    throw new Error('composable did not run')
  }
  return captured.value
}

function makeGuarantor(overrides: Partial<Guarantor> = {}): Guarantor {
  return Object.assign(new Guarantor(), overrides)
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('save', () => {
  it('builds a FormData with capitalized names and calls store.saveGuarantorName', async () => {
    mockSaveGuarantorName.mockResolvedValueOnce(undefined)
    const onSuccess = vi.fn()
    const { save, firstName, lastName, preferredName } = setupComposable({
      guarantor: makeGuarantor({ id: 42, firstName: 'jean', lastName: 'dupont' }),
      onSuccess
    })

    firstName.value = 'pierre'
    lastName.value = 'martin'
    preferredName.value = 'durand'

    save()
    await flushPromises()

    expect(mockSaveGuarantorName).toHaveBeenCalledOnce()
    const fd = mockSaveGuarantorName.mock.calls[0][0] as FormData
    expect(fd.get('firstName')).toBe('Pierre')
    expect(fd.get('lastName')).toBe('Martin')
    expect(fd.get('preferredName')).toBe('Durand')
    expect(fd.get('guarantorId')).toBe('42')
    expect(fd.get('tenantId')).toBeNull()
    expect(onSuccess).toHaveBeenCalledOnce()
  })

  it('sends preferredName as empty string when cleared', async () => {
    mockSaveGuarantorName.mockResolvedValueOnce(undefined)
    const { save, preferredName } = setupComposable({
      guarantor: makeGuarantor({ firstName: 'a', lastName: 'b', preferredName: 'durand' }),
      onSuccess: vi.fn()
    })

    preferredName.value = ''
    save()
    await flushPromises()

    const fd = mockSaveGuarantorName.mock.calls[0][0] as FormData
    expect(fd.get('preferredName')).toBe('')
  })
})

describe('save - error handling', () => {
  it('shows error toast and sets STATUS_FAILED when the store rejects', async () => {
    mockSaveGuarantorName.mockRejectedValueOnce(new Error('boom'))
    const onSuccess = vi.fn()
    const errorAnchor = document.createElement('button')
    const { save, firstName, fileUploadStatus } = setupComposable({
      guarantor: makeGuarantor({ firstName: 'a', lastName: 'b' }),
      onSuccess
    })

    firstName.value = 'changed'
    save({ errorAnchor })
    await flushPromises()

    expect(mockToastError).toHaveBeenCalledWith('errors.submit-failed', errorAnchor)
    expect(fileUploadStatus.value).toBe(UploadStatus.STATUS_FAILED)
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
