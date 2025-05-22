import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useI18n } from 'vue-i18n'
import LandingPage from '@/views/LandingPage.vue'
import axios from 'axios'

vi.mock('vue-i18n')
vi.mock('axios')
vi.mock('@unhead/vue')

useI18n.mockReturnValue({
  t: (tKey: string) => tKey
})

describe('Header', () => {
  it('renders properly', () => {
    axios.get.mockResolvedValue({})
    // TODO : don't mock i18n to check real value
    const wrapper = mount(LandingPage)
    expect(wrapper.text()).toContain('s0.titles')
  })
})
