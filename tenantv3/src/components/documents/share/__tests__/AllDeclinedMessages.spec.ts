import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AllDeclinedMessages from '../AllDeclinedMessages.vue'
import { vSafeHtml } from 'df-shared-next/src/services/SanitizeService'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('../PreValidationMessages.vue', () => ({
  default: { template: '<div />' }
}))

describe('AllDeclinedMessages.vue - XSS Security', () => {
  it('sanitizes malicious script and onerror handlers in single decline comment', () => {
    const wrapper = mount(AllDeclinedMessages, {
      props: {
        documentDeniedReasons: {
          comment: 'Motif de refus <script>alert("XSS")</script><img src="x" onerror="alert(1)">',
          selectedOptions: []
        },
        documentStatus: 'DECLINED'
      },
      global: {
        directives: {
          'safe-html': vSafeHtml
        }
      }
    })

    const textContent = wrapper.find('.declined').html()
    expect(textContent).not.toContain('<script>')
    expect(textContent).not.toContain('onerror')
    expect(textContent).not.toContain('alert')
    expect(textContent).toContain('Motif de refus')
  })

  it('sanitizes malicious script tags in list of decline reason options', () => {
    const wrapper = mount(AllDeclinedMessages, {
      props: {
        documentDeniedReasons: {
          comment: 'Autre motif',
          selectedOptions: [
            { label: 'Option 1 <iframe src="javascript:alert(1)"></iframe>' },
            { label: 'Option 2 <b>Valide</b>' }
          ]
        },
        documentStatus: 'DECLINED'
      },
      global: {
        directives: {
          'safe-html': vSafeHtml
        }
      }
    })

    const textContent = wrapper.find('.declined').html()
    expect(textContent).not.toContain('<iframe')
    expect(textContent).not.toContain('javascript:')
    expect(textContent).toContain('Option 1')
    expect(textContent).toContain('<b>Valide</b>')
  })
})
