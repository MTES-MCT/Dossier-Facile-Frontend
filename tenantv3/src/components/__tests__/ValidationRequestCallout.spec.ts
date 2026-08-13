import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ValidationRequestCallout from '../account/ValidationRequestCallout.vue'

const { mockStore, mockToast, mockAnalytics } = vi.hoisted(() => ({
  mockStore: {
    user: {
      status: 'COMPLETED' as string,
      optInEligible: true as boolean,
      validationRequested: undefined as boolean | undefined
    },
    updateValidationRequest: vi.fn(() => Promise.resolve()),
    loadUser: vi.fn(() => Promise.resolve())
  },
  mockToast: { error: vi.fn(), info: vi.fn() },
  mockAnalytics: {
    optInSectionDisplayed: vi.fn(),
    optInRequestValidation: vi.fn(),
    optInCancelValidation: vi.fn()
  }
}))

vi.mock('@/stores/tenant-store', () => ({ useTenantStore: () => mockStore }))
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }))
vi.mock('@/components/toast/toastUtils', () => ({ toast: mockToast }))
vi.mock('@/services/AnalyticsService', () => ({ AnalyticsService: mockAnalytics }))

const globalStubs = { VIcon: true }

function mountComponent(attachToBody = false) {
  return mount(ValidationRequestCallout, {
    global: { stubs: globalStubs },
    ...(attachToBody ? { attachTo: document.body } : {})
  })
}

describe('ValidationRequestCallout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.user = { status: 'COMPLETED', optInEligible: true, validationRequested: undefined }
    mockStore.updateValidationRequest.mockResolvedValue(undefined)
  })

  describe('when the tenant has not asked for a verification', () => {
    it('offers to request one', () => {
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('available.title')
      expect(wrapper.text()).toContain('available.request')
      expect(wrapper.text()).not.toContain('requested.title')
      expect(wrapper.find('.accent-primary').exists()).toBe(true)
    })

    it('sends the request on click', async () => {
      const wrapper = mountComponent()

      await wrapper.find('button').trigger('click')
      await flushPromises()

      expect(mockAnalytics.optInRequestValidation).toHaveBeenCalled()
      expect(mockStore.updateValidationRequest).toHaveBeenCalledWith(true)
      expect(mockToast.error).not.toHaveBeenCalled()
    })
  })

  describe('when a verification has been requested', () => {
    beforeEach(() => {
      mockStore.user = { status: 'TO_PROCESS', optInEligible: true, validationRequested: true }
    })

    it('shows the pending state with the purple accent', () => {
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('requested.badge')
      expect(wrapper.text()).toContain('requested.title')
      expect(wrapper.text()).toContain('requested.still-shareable')
      expect(wrapper.find('.accent-purple').exists()).toBe(true)
    })

    it('cancels the request on click', async () => {
      const wrapper = mountComponent()

      await wrapper.find('button').trigger('click')
      await flushPromises()

      expect(mockAnalytics.optInCancelValidation).toHaveBeenCalled()
      expect(mockStore.updateValidationRequest).toHaveBeenCalledWith(false)
    })
  })

  it('tracks the display of the section', () => {
    mountComponent()

    expect(mockAnalytics.optInSectionDisplayed).toHaveBeenCalledTimes(1)
  })

  it('gives the focus back to the heading after a successful choice', async () => {
    const wrapper = mountComponent(true)

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(document.activeElement).toBe(wrapper.find('h2').element)
  })

  it('warns the tenant when the choice is no longer available', async () => {
    mockStore.updateValidationRequest.mockRejectedValueOnce(
      Object.assign(new Error('conflict'), { isAxiosError: true, response: { status: 409 } })
    )
    const wrapper = mountComponent()

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(mockStore.loadUser).toHaveBeenCalled()
    expect(mockToast.info).toHaveBeenCalledWith('conflict', null)
  })

  it('shows an error toast when the request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    mockStore.updateValidationRequest.mockRejectedValueOnce(new Error('boom'))
    const wrapper = mountComponent()

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(mockToast.error).toHaveBeenCalledWith('error', wrapper.find('button').element)
  })
})
