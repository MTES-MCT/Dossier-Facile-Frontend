import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useI18n } from 'vue-i18n'
import ShareActionsMenu from '../sharing/ShareActionsMenu.vue'
import { FocusLegendKey } from '@/models/InjectionKeys'

vi.mock('vue-i18n')

vi.mocked(useI18n).mockReturnValue({
  t: (tKey: string) => tKey
} as ReturnType<typeof useI18n>)

vi.mock('@/components/toast/toastUtils', () => ({
  toast: {
    error: vi.fn()
  }
}))

describe('ShareActionsMenu', () => {
  const mountComponent = (linkType: 'LINK' | 'MAIL' | 'OWNER' | 'PARTNER' = 'LINK', enabled = true) => {
    return mount(ShareActionsMenu, {
      props: { enabled, linkType, linkId: 'share-1' },
      global: {
        provide: { [FocusLegendKey as symbol]: vi.fn() },
        stubs: {
          RiArrowDownSLine: true,
          RiArrowUpSLine: true,
          RiFileCopyLine: true,
          RiPauseCircleLine: true,
          RiPlayCircleLine: true,
          RiDeleteBinLine: true,
          RiSendPlaneLine: true,
          ModalComponent: true,
          DsfrButton: {
            props: ['label'],
            template: '<button>{{ label }}</button>'
          }
        }
      }
    })
  }

  const openMenu = async (wrapper: ReturnType<typeof mountComponent>) => {
    await wrapper.find('#actionBtn').trigger('click')
    return wrapper.findAll('.menu-item')
  }

  describe.each([
    {
      linkType: 'LINK' as const,
      enabled: true,
      expectedItems: ['copy-the-link', 'pause-sharing', 'delete-sharing'],
      notExpected: ['resend-mail']
    },
    {
      linkType: 'LINK' as const,
      enabled: false,
      expectedItems: ['reactivate-sharing', 'delete-sharing'],
      notExpected: ['copy-the-link', 'resend-mail']
    },
    {
      linkType: 'MAIL' as const,
      enabled: true,
      expectedItems: ['resend-mail', 'pause-sharing', 'delete-sharing'],
      notExpected: ['copy-the-link']
    },
    {
      linkType: 'MAIL' as const,
      enabled: false,
      expectedItems: ['reactivate-sharing', 'delete-sharing'],
      notExpected: ['resend-mail', 'copy-the-link']
    },
    {
      linkType: 'OWNER' as const,
      enabled: true,
      expectedItems: ['pause-sharing', 'delete-sharing'],
      notExpected: ['copy-the-link', 'resend-mail']
    },
    {
      linkType: 'OWNER' as const,
      enabled: false,
      expectedItems: ['reactivate-sharing', 'delete-sharing'],
      notExpected: ['copy-the-link', 'resend-mail', 'pause-sharing']
    },
    {
      linkType: 'PARTNER' as const,
      enabled: true,
      expectedItems: ['pause-sharing', 'delete-sharing'],
      notExpected: ['copy-the-link', 'resend-mail']
    },
    {
      linkType: 'PARTNER' as const,
      enabled: false,
      expectedItems: ['reactivate-sharing', 'delete-sharing'],
      notExpected: ['copy-the-link', 'resend-mail', 'pause-sharing']
    }
  ])('when linkType=$linkType and enabled=$enabled', ({ linkType, enabled, expectedItems, notExpected }) => {
    it(`displays ${expectedItems.length} menu items: ${expectedItems.join(', ')}`, async () => {
      const wrapper = mountComponent(linkType, enabled)
      const menuItems = await openMenu(wrapper)

      expect(menuItems).toHaveLength(expectedItems.length)
      expectedItems.forEach((item, index) => {
        expect(menuItems[index].text()).toContain(item)
      })
    })

    it(`does not display: ${notExpected.join(', ')}`, async () => {
      const wrapper = mountComponent(linkType, enabled)
      await openMenu(wrapper)

      notExpected.forEach((item) => {
        expect(wrapper.text()).not.toContain(item)
      })
    })
  })
})
