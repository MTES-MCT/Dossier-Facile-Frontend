import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import ValidationRequestCallout from '../account/ValidationRequestCallout.vue'

dayjs.locale('fr')

const { mockStore, mockToast, mockAnalytics } = vi.hoisted(() => ({
  mockStore: {
    user: {
      status: 'COMPLETED' as string,
      optInEligible: true as boolean,
      validationRequested: undefined as boolean | undefined,
      lotteryStatus: undefined as string | undefined,
      nextEligibleDate: undefined as string | undefined,
      lastUpdateDate: undefined as string | undefined
    },
    updateValidationRequest: vi.fn(() => Promise.resolve()),
    loadUser: vi.fn(() => Promise.resolve())
  },
  mockToast: { error: vi.fn(), info: vi.fn() },
  mockAnalytics: {
    optInSectionDisplayed: vi.fn(),
    optInRequestValidation: vi.fn(),
    optInCancelValidation: vi.fn(),
    optInLotteryPendingDisplayed: vi.fn(),
    optInLotteryCooldownDisplayed: vi.fn()
  }
}))

vi.mock('@/stores/tenant-store', () => ({ useTenantStore: () => mockStore }))
// Renders the key followed by its parameters, so that interpolated values can be asserted
const t = (key: string, args?: unknown[]) => (args ? `${key} ${args.join(' ')}` : key)

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t,
    d: (date: Date) => date.toISOString().slice(0, 10)
  })
}))
vi.mock('@/components/toast/toastUtils', () => ({ toast: mockToast }))
vi.mock('@/services/AnalyticsService', () => ({ AnalyticsService: mockAnalytics }))

const globalStubs = { VIcon: true }

function mountComponent(attachToBody = false) {
  return mount(ValidationRequestCallout, {
    // The global `t` mock from tests/unit.setup.ts drops the parameters: override it
    global: { stubs: globalStubs, mocks: { t } },
    ...(attachToBody ? { attachTo: document.body } : {})
  })
}

describe('ValidationRequestCallout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.user = {
      status: 'COMPLETED',
      optInEligible: true,
      validationRequested: undefined,
      lotteryStatus: undefined,
      nextEligibleDate: undefined,
      lastUpdateDate: undefined
    }
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
      mockStore.user = {
        status: 'TO_PROCESS',
        optInEligible: true,
        validationRequested: true,
        lotteryStatus: undefined,
        nextEligibleDate: undefined,
        lastUpdateDate: '2026-08-06T11:32:00'
      }
    })

    it('shows the pending state with the purple accent', () => {
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('requested.badge')
      expect(wrapper.text()).toContain('requested.title')
      expect(wrapper.text()).toContain('requested.still-shareable')
      expect(wrapper.find('.accent-purple').exists()).toBe(true)
    })

    it('mentions the average processing time and the request date', () => {
      const wrapper = mountComponent()

      expect(wrapper.find('strong').text()).toBe('requested.text-bold')
      expect(wrapper.text()).toContain('requested.sent-on 6 août 2026 à 11h32')
    })

    it('skips the request date when the dossier has no update date', () => {
      mockStore.user.lastUpdateDate = undefined
      const wrapper = mountComponent()

      expect(wrapper.text()).not.toContain('requested.sent-on')
      expect(wrapper.text()).toContain('requested.still-shareable')
    })

    it('shows the same text once the lottery drew the dossier', () => {
      mockStore.user.lotteryStatus = 'DRAWN'
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('requested.text-bold')
      expect(wrapper.text()).toContain('requested.sent-on 6 août 2026 à 11h32')
    })

    it('cancels the request on click', async () => {
      const wrapper = mountComponent()

      await wrapper.find('button').trigger('click')
      await flushPromises()

      expect(mockAnalytics.optInCancelValidation).toHaveBeenCalled()
      expect(mockStore.updateValidationRequest).toHaveBeenCalledWith(false)
    })
  })

  describe('when a lottery application is waiting for the draw', () => {
    beforeEach(() => {
      mockStore.user.lotteryStatus = 'PENDING'
    })

    it('shows the registered application state with the purple accent', () => {
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('pending.badge')
      expect(wrapper.text()).toContain('pending.title')
      expect(wrapper.text()).toContain('pending.still-shareable')
      expect(wrapper.text()).not.toContain('available.title')
      expect(wrapper.find('.accent-purple').exists()).toBe(true)
      expect(mockAnalytics.optInLotteryPendingDisplayed).toHaveBeenCalledTimes(1)
    })

    it('withdraws the application on click', async () => {
      const wrapper = mountComponent()

      await wrapper.find('button').trigger('click')
      await flushPromises()

      expect(mockAnalytics.optInCancelValidation).toHaveBeenCalled()
      expect(mockStore.updateValidationRequest).toHaveBeenCalledWith(false)
    })
  })

  describe('during the cooldown after a lost draw', () => {
    beforeEach(() => {
      mockStore.user.lotteryStatus = 'COOLDOWN'
      mockStore.user.nextEligibleDate = '2026-09-18'
    })

    it('explains the situation with the next eligible date and no action button', () => {
      const wrapper = mountComponent()

      expect(wrapper.text()).toContain('cooldown.title')
      expect(wrapper.text()).toContain('cooldown.text-date')
      expect(wrapper.text()).not.toContain('available.request')
      expect(wrapper.find('button').exists()).toBe(false)
      expect(mockAnalytics.optInLotteryCooldownDisplayed).toHaveBeenCalledTimes(1)
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
