import LandingPage from '@/views/LandingPage.vue';
import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

describe('LandingPage', () => {
  it('renders properly', () => {
    const wrapper = mount(LandingPage, {})
    expect(wrapper.text()).toContain('Montez un dossier de location')
  })
})
