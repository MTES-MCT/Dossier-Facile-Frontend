import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { vSafeHtml } from 'df-shared-next/src/services/SanitizeService'
import FileStatusAlert from '../FileStatusAlert.vue'

// The <i18n> block is not compiled by vitest: t() falls back to the key,
// so assertions are made on translation keys
const i18n = createI18n({ legacy: false, locale: 'fr', fallbackLocale: 'fr', messages: {} })

function mountAlert(dossierStatus: 'VALIDATED' | 'COMPLETED') {
  return mount(FileStatusAlert, {
    global: {
      plugins: [i18n],
      directives: { 'safe-html': vSafeHtml }
    },
    props: { dossierStatus }
  })
}

describe('FileStatusAlert', () => {
  it('renders an info alert with the COMPLETED wording for a COMPLETED dossier', () => {
    const wrapper = mountAlert('COMPLETED')

    expect(wrapper.find('.fr-alert--info').exists()).toBe(true)
    expect(wrapper.text()).toContain('title-COMPLETED')
    expect(wrapper.text()).toContain('documents-COMPLETED')
    expect(wrapper.text()).toContain('review-COMPLETED')
  })

  it('renders a success alert with the VALIDATED wording for a VALIDATED dossier', () => {
    const wrapper = mountAlert('VALIDATED')

    expect(wrapper.find('.fr-alert--success').exists()).toBe(true)
    expect(wrapper.text()).toContain('title-VALIDATED')
    expect(wrapper.text()).toContain('documents-VALIDATED')
    expect(wrapper.text()).toContain('review-VALIDATED')
  })
})
