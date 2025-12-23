import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useI18n } from 'vue-i18n'
import SharingLinkDetails from '../sharing/SharingLinkDetails.vue'
import type { ApartmentSharingLink } from 'df-shared-next/src/models/ApartmentSharingLink'

vi.mock('vue-i18n')

vi.mocked(useI18n).mockReturnValue({
  t: (tKey: string) => tKey
} as ReturnType<typeof useI18n>)

// Mock des services
vi.mock('@/services/ApartmentSharingLinkService', () => ({
  ApartmentSharingLinkService: {
    updateLinkStatus: vi.fn(),
    updateLinkExpiration: vi.fn(),
    updateLinkTitle: vi.fn(),
    resendLink: vi.fn()
  }
}))

// Mock des toasts
vi.mock('@/components/toast/toastUtils', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const createMockLink = (overrides: Partial<ApartmentSharingLink> = {}): ApartmentSharingLink => ({
  id: 1,
  title: 'Test Partage',
  type: 'LINK',
  url: '/public-file/abc123',
  enabled: true,
  fullData: false,
  creationDate: '2024-01-01T10:00:00',
  expirationDate: '2024-12-31T23:59:59',
  nbVisits: 5,
  firstVisit: '2024-01-15T14:30:00',
  lastVisit: '2024-06-20T09:00:00',
  createdBy: 'user@example.com',
  ownerEmail: '',
  deleted: false,
  ...overrides
})

describe('SharingLinkDetails', () => {
  const mountComponent = (link: ApartmentSharingLink) => {
    return mount(SharingLinkDetails, {
      props: { link },
      global: {
        stubs: {
          LinkWarning: true,
          VueDatePicker: true,
          RiPauseCircleLine: true,
          RiCalendarLine: true,
          RiPencilLine: true,
          RiFileCopyLine: true,
          RiSendPlaneLine: true,
          RiMailLine: true
        }
      }
    })
  }

  describe('fields displayed based on link type', () => {
    describe('when link type is LINK', () => {
      it('displays title-of-share field', () => {
        const link = createMockLink({ type: 'LINK' })
        const wrapper = mountComponent(link)
        expect(wrapper.text()).toContain('title-of-share')
      })

      it('displays created-on field', () => {
        const link = createMockLink({ type: 'LINK' })
        const wrapper = mountComponent(link)
        expect(wrapper.text()).toContain('created-on')
      })

      it('displays expires-on field', () => {
        const link = createMockLink({ type: 'LINK' })
        const wrapper = mountComponent(link)
        expect(wrapper.text()).toContain('expires-on')
      })

      it('displays file-type field', () => {
        const link = createMockLink({ type: 'LINK' })
        const wrapper = mountComponent(link)
        expect(wrapper.text()).toContain('file-type')
      })

      it('displays created-by field', () => {
        const link = createMockLink({ type: 'LINK' })
        const wrapper = mountComponent(link)
        expect(wrapper.text()).toContain('created-by')
      })

      it('displays usage stats section', () => {
        const link = createMockLink({ type: 'LINK' })
        const wrapper = mountComponent(link)
        expect(wrapper.text()).toContain('usage-stats')
        expect(wrapper.text()).toContain('first-consultation')
        expect(wrapper.text()).toContain('last-consultation')
        expect(wrapper.text()).toContain('nb-consultations')
      })

      it('displays LinkWarning component', () => {
        const link = createMockLink({ type: 'LINK' })
        const wrapper = mountComponent(link)
        expect(wrapper.findComponent({ name: 'LinkWarning' }).exists()).toBe(true)
      })
    })

    describe('when link type is MAIL', () => {
      it('displays title-of-share field', () => {
        const link = createMockLink({ type: 'MAIL', ownerEmail: 'test@test.com' })
        const wrapper = mountComponent(link)
        expect(wrapper.text()).toContain('title-of-share')
      })

      it('displays created-on field', () => {
        const link = createMockLink({ type: 'MAIL', ownerEmail: 'test@test.com' })
        const wrapper = mountComponent(link)
        expect(wrapper.text()).toContain('created-on')
      })

      it('displays expires-on field', () => {
        const link = createMockLink({ type: 'MAIL', ownerEmail: 'test@test.com' })
        const wrapper = mountComponent(link)
        expect(wrapper.text()).toContain('expires-on')
      })

      it('displays file-type field', () => {
        const link = createMockLink({ type: 'MAIL', ownerEmail: 'test@test.com' })
        const wrapper = mountComponent(link)
        expect(wrapper.text()).toContain('file-type')
      })

      it('displays created-by field', () => {
        const link = createMockLink({ type: 'MAIL', ownerEmail: 'test@test.com' })
        const wrapper = mountComponent(link)
        expect(wrapper.text()).toContain('created-by')
      })

      it('displays usage stats section', () => {
        const link = createMockLink({ type: 'MAIL', ownerEmail: 'test@test.com' })
        const wrapper = mountComponent(link)
        expect(wrapper.text()).toContain('usage-stats')
        expect(wrapper.text()).toContain('first-consultation')
        expect(wrapper.text()).toContain('last-consultation')
        expect(wrapper.text()).toContain('nb-consultations')
      })

      it('displays LinkWarning component', () => {
        const link = createMockLink({ type: 'MAIL', ownerEmail: 'test@test.com' })
        const wrapper = mountComponent(link)
        expect(wrapper.findComponent({ name: 'LinkWarning' }).exists()).toBe(true)
      })
    })

    describe('when link type is PARTNER', () => {
      const partnerLink = () => createMockLink({
        type: 'PARTNER',
        expirationDate: undefined as unknown as string,
        url: undefined as unknown as string
      })

      it('does NOT display title-of-share field', () => {
        const wrapper = mountComponent(partnerLink())
        expect(wrapper.text()).not.toContain('title-of-share')
      })

      it('displays created-on field', () => {
        const wrapper = mountComponent(partnerLink())
        expect(wrapper.text()).toContain('created-on')
      })

      it('does NOT display expires-on field', () => {
        const wrapper = mountComponent(partnerLink())
        expect(wrapper.text()).not.toContain('expires-on')
      })

      it('displays file-type field', () => {
        const wrapper = mountComponent(partnerLink())
        expect(wrapper.text()).toContain('file-type')
      })

      it('displays created-by field', () => {
        const wrapper = mountComponent(partnerLink())
        expect(wrapper.text()).toContain('created-by')
      })

      it('displays usage stats section', () => {
        const wrapper = mountComponent(partnerLink())
        expect(wrapper.text()).toContain('usage-stats')
        expect(wrapper.text()).toContain('first-consultation')
        expect(wrapper.text()).toContain('last-consultation')
        expect(wrapper.text()).toContain('nb-consultations')
      })

      it('does NOT display LinkWarning component', () => {
        const wrapper = mountComponent(partnerLink())
        expect(wrapper.findComponent({ name: 'LinkWarning' }).exists()).toBe(false)
      })

      it('does NOT display link actions (copy, pause buttons)', () => {
        const wrapper = mountComponent(partnerLink())
        expect(wrapper.find('.link-actions').exists()).toBe(false)
        expect(wrapper.text()).not.toContain('copy-link')
        expect(wrapper.text()).not.toContain('pause-share')
      })
    })

    describe('when link type is OWNER', () => {
      const ownerLink = () => createMockLink({
        type: 'OWNER',
        expirationDate: undefined as unknown as string,
        url: undefined as unknown as string
      })

      it('does NOT display title-of-share field', () => {
        const wrapper = mountComponent(ownerLink())
        expect(wrapper.text()).not.toContain('title-of-share')
      })

      it('displays created-on field', () => {
        const wrapper = mountComponent(ownerLink())
        expect(wrapper.text()).toContain('created-on')
      })

      it('does NOT display expires-on field', () => {
        const wrapper = mountComponent(ownerLink())
        expect(wrapper.text()).not.toContain('expires-on')
      })

      it('displays file-type field', () => {
        const wrapper = mountComponent(ownerLink())
        expect(wrapper.text()).toContain('file-type')
      })

      it('displays created-by field', () => {
        const wrapper = mountComponent(ownerLink())
        expect(wrapper.text()).toContain('created-by')
      })

      it('displays usage stats section', () => {
        const wrapper = mountComponent(ownerLink())
        expect(wrapper.text()).toContain('usage-stats')
        expect(wrapper.text()).toContain('first-consultation')
        expect(wrapper.text()).toContain('last-consultation')
        expect(wrapper.text()).toContain('nb-consultations')
      })

      it('does NOT display LinkWarning component', () => {
        const wrapper = mountComponent(ownerLink())
        expect(wrapper.findComponent({ name: 'LinkWarning' }).exists()).toBe(false)
      })

      it('does NOT display link actions (copy, pause buttons)', () => {
        const wrapper = mountComponent(ownerLink())
        expect(wrapper.find('.link-actions').exists()).toBe(false)
        expect(wrapper.text()).not.toContain('copy-link')
        expect(wrapper.text()).not.toContain('pause-share')
      })
    })
  })

  describe('action buttons', () => {
    describe('when link type is LINK', () => {
      it('displays 2 buttons: copy-link and pause-share', () => {
        const link = createMockLink({
          type: 'LINK',
          enabled: true,
          url: '/public-file/abc123'
        })

        const wrapper = mountComponent(link)

        const buttons = wrapper.findAll('.link-actions button')
        expect(buttons).toHaveLength(2)

        const copyButton = buttons[0]
        expect(copyButton.text()).toContain('copy-link')

        const pauseButton = buttons[1]
        expect(pauseButton.text()).toContain('pause-share')
      })

      it('displays resume-share button when link is disabled', () => {
        const link = createMockLink({
          type: 'LINK',
          enabled: false,
          url: '/public-file/abc123'
        })

        const wrapper = mountComponent(link)

        const buttons = wrapper.findAll('.link-actions button')
        expect(buttons).toHaveLength(2)

        const pauseButton = buttons[1]
        expect(pauseButton.text()).toContain('resume-share')
        // Expect the copy-link button to be disabled
        const copyButton = buttons[0]
        expect(copyButton.text()).toContain('copy-link')
        expect((copyButton.element as HTMLButtonElement).disabled).toBe(true)
      })
    })

    describe('when link type is MAIL', () => {
      it('displays resend-mail button', () => {
        const link = createMockLink({
          type: 'MAIL',
          ownerEmail: 'owner@example.com'
        })

        const wrapper = mountComponent(link)

        expect(wrapper.text()).not.toContain('copy-link')
        expect(wrapper.text()).not.toContain('pause-share')

        expect(wrapper.text()).toContain('resend-mail')
      })
    })
  })
})

