import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ResidencyAnalysisErrorBannerContent from '../residency/lib/ResidencyAnalysisErrorBannerContent.vue'
import BannerSource from '../residency/lib/ResidencyAnalysisErrorBannerContent.vue?raw'
import { useI18nForTest } from 'df-shared-next/src/helper/__tests__/useI18n'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'

const LOCALE = 'fr'
const { i18n, t } = useI18nForTest(BannerSource, LOCALE)

describe('ResidencyAnalysisErrorBannerContent', () => {
  const dummyRule: DocumentRule = {
    // Fill dummy rule data here if necessary
  }

  const defaultProps = {
    rule: dummyRule,
    notMatchingLabel: 'Documents do not match.',
    explainLinkLabel: 'Explain why.',
    title: 'Custom Error Title',
    firstSubTitle: 'Primary Document Expected'
  }

  const createWrapper = (props = {}) => {
    return mount(ResidencyAnalysisErrorBannerContent, {
      props: {
        ...defaultProps,
        ...props
      },
      global: {
        plugins: [i18n],
        mocks: {
          t: (key: string, params?: Record<string, unknown>) => t(key, params)
        },
        stubs: {
          VIcon: true
        }
      },
      slots: {
        'expected-doc': '<div class="expected-mock">Expected doc slot content</div>'
      }
    })
  }

  it('renders the title and firstSubTitle correctly', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.title-text').text()).toBe('Custom Error Title')
    expect(wrapper.find('.doc-label').text()).toBe('Primary Document Expected')
  })

  it('renders slots correctly', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.expected-mock').exists()).toBe(true)
    expect(wrapper.find('.expected-mock').text()).toBe('Expected doc slot content')
  })

  it('emits an "explain" event when the explain button is clicked', async () => {
    const wrapper = createWrapper()

    const explainButton = wrapper.find('.explain-link')
    expect(explainButton.exists()).toBe(true)
    expect(explainButton.text()).toBe('Explain why.')

    await explainButton.trigger('click')

    expect(wrapper.emitted('explain')).toBeTruthy()
    expect(wrapper.emitted('explain')?.length).toBe(1)
  })

  it('displays the contact link with translations', () => {
    const wrapper = createWrapper()
    const pageText = wrapper.text()
    expect(pageText).toContain(t('contact-us.title'))
    expect(pageText).toContain(t('contact-us.button'))
  })
})
