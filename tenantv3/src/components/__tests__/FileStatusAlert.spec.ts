import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { vSafeHtml } from 'df-shared-next/src/services/SanitizeService'
import FileStatusAlert from '../FileStatusAlert.vue'

// The <i18n> block is not compiled by vitest: t() falls back to the key,
// so assertions are made on translation keys
const i18n = createI18n({ legacy: false, locale: 'fr', fallbackLocale: 'fr', messages: {} })

function mountAlert(dossierStatus: 'VALIDATED' | 'COMPLETED' | 'TO_PROCESS') {
  return mount(FileStatusAlert, {
    global: {
      plugins: [i18n],
      directives: { 'safe-html': vSafeHtml }
    },
    props: { dossierStatus }
  })
}

describe('FileStatusAlert', () => {
  it('renders an info alert with the unverified wording for a COMPLETED dossier', () => {
    const wrapper = mountAlert('COMPLETED')

    expect(wrapper.find('.fr-alert--info').exists()).toBe(true)
    expect(wrapper.text()).toContain('title-unverified')
    expect(wrapper.text()).toContain('documents-unverified')
    expect(wrapper.text()).toContain('review-unverified')
  })

  // A TO_PROCESS dossier is not verified either: same rendering as COMPLETED
  it('renders an info alert with the unverified wording for a TO_PROCESS dossier', () => {
    const wrapper = mountAlert('TO_PROCESS')

    expect(wrapper.find('.fr-alert--info').exists()).toBe(true)
    expect(wrapper.text()).toContain('title-unverified')
    expect(wrapper.text()).toContain('review-unverified')
  })

  it('renders a success alert with the verified wording for a VALIDATED dossier', () => {
    const wrapper = mountAlert('VALIDATED')

    expect(wrapper.find('.fr-alert--success').exists()).toBe(true)
    expect(wrapper.text()).toContain('title-verified')
    expect(wrapper.text()).toContain('documents-verified')
    expect(wrapper.text()).toContain('review-verified')
  })
})
