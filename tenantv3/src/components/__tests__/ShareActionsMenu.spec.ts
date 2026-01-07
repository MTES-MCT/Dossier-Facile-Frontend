import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useI18n } from 'vue-i18n'
import ShareActionsMenu from '../sharing/ShareActionsMenu.vue'

vi.mock('vue-i18n')

vi.mocked(useI18n).mockReturnValue({
  t: (tKey: string) => tKey
} as ReturnType<typeof useI18n>)

describe('ShareActionsMenu', () => {
  const mountComponent = (linkType: 'LINK' | 'MAIL' = 'LINK', enabled = true) => {
    return mount(ShareActionsMenu, {
      props: { enabled, linkType },
      global: {
        stubs: {
          RiArrowDownSLine: true,
          RiArrowUpSLine: true,
          RiFileCopyLine: true,
          RiPauseCircleLine: true,
          RiPlayCircleLine: true,
          RiDeleteBinLine: true,
          RiSendPlaneLine: true,
          ModalComponent: true,
          DfButton: true
        }
      }
    })
  }

  const openMenu = async (wrapper: ReturnType<typeof mountComponent>) => {
    await wrapper.find('.actions-button').trigger('click')
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
