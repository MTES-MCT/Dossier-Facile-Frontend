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

  describe('when link type is LINK', () => {
    it('displays copy-the-link button in dropdown', async () => {
      const wrapper = mountComponent('LINK')

      await wrapper.find('.actions-button').trigger('click')

      const menuItems = wrapper.findAll('.menu-item')
      expect(menuItems[0].text()).toContain('copy-the-link')
    })

    it('displays pause-sharing button when link is enabled', async () => {
      const wrapper = mountComponent('LINK', true)

      await wrapper.find('.actions-button').trigger('click')

      const menuItems = wrapper.findAll('.menu-item')
      expect(menuItems[1].text()).toContain('pause-sharing')
      expect(menuItems[1].text()).not.toContain('reactivate-sharing')
    })

    it('displays reactivate-sharing button when link is disabled', async () => {
      const wrapper = mountComponent('LINK', false)

      await wrapper.find('.actions-button').trigger('click')

      const menuItems = wrapper.findAll('.menu-item')
      expect(menuItems[1].text()).toContain('reactivate-sharing')
      expect(menuItems[1].text()).not.toContain('pause-sharing')
    })

    it('displays delete-sharing button in dropdown', async () => {
      const wrapper = mountComponent('LINK')

      await wrapper.find('.actions-button').trigger('click')

      const menuItems = wrapper.findAll('.menu-item')
      expect(menuItems[2].text()).toContain('delete-sharing')
    })

    it('does not display resend-mail button', async () => {
      const wrapper = mountComponent('LINK')

      await wrapper.find('.actions-button').trigger('click')

      expect(wrapper.text()).not.toContain('resend-mail')
    })
  })

  describe('when link type is MAIL', () => {
    it('displays resend-mail and delete-sharing buttons only', async () => {
      const wrapper = mountComponent('MAIL')

      await wrapper.find('.actions-button').trigger('click')

      const menuItems = wrapper.findAll('.menu-item')
      expect(menuItems).toHaveLength(2)
      expect(menuItems[0].text()).toContain('resend-mail')
      expect(menuItems[1].text()).toContain('delete-sharing')
      expect(wrapper.text()).not.toContain('copy-the-link')
    })
  })
})
