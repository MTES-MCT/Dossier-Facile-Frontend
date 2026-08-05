import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import MessagesPanel from '../MessagesPanel.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('@gouvminint/vue-dsfr', () => ({
  DsfrButton: { template: '<button><slot /></button>' },
  VIcon: { template: '<span />' }
}))

vi.mock('df-shared-next/src/components/ColoredTag.vue', () => ({
  default: { template: '<div />' }
}))

vi.mock('../DeclinedDocuments.vue', () => ({
  default: { template: '<div />' }
}))

const mockMessageList = ref<Record<number, Array<{ id: number; messageBody: string; typeMessage: string; creationDateTime?: Date }>>>({})

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({
    get messageList() {
      return mockMessageList.value
    },
    sendMessage: vi.fn().mockResolvedValue(undefined)
  })
}))

describe('MessagesPanel.vue - XSS Security', () => {
  beforeEach(() => {
    mockMessageList.value = {}
  })

  it('sanitizes <script> tags and <img onerror> from messageBody in rendered DOM', () => {
    const tenantId = 1
    mockMessageList.value = {
      [tenantId]: [
        {
          id: 101,
          messageBody: 'Hello <script>alert("XSS")</script><img src="x" onerror="alert(1)"> world',
          typeMessage: 'TO_TENANT'
        }
      ]
    }

    const wrapper = mount(MessagesPanel, {
      props: {
        tenant: { id: tenantId, status: 'INCOMPLETE' } as any
      },
      global: {
        stubs: {
          RouterLink: true,
          FieldLabel: true
        }
      }
    })

    const messageHtml = wrapper.find('.message').html()
    expect(messageHtml).not.toContain('<script>')
    expect(messageHtml).not.toContain('onerror')
    expect(messageHtml).not.toContain('alert')
    expect(messageHtml).toContain('Hello')
    expect(messageHtml).toContain('world')
  })
})
