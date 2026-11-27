import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useI18n } from 'vue-i18n'
import LandingPage from '@/views/LandingPage.vue'
import axios from 'axios'
import { AccessibilityPropertiesKey } from 'df-shared-next/src/models/injectionKeys'

vi.mock('vue-i18n')
vi.mock('axios')
vi.mock('@unhead/vue')

import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'Home', component: LandingPage, meta: { title: 'Home' } }]
})

router.push('/')
await router.isReady()

useI18n.mockReturnValue({
  t: (tKey: string) => tKey,
  locale: ref('fr')
})

describe('Header', () => {
  it('renders properly', () => {
    axios.get.mockResolvedValue({})
    // TODO : don't mock i18n to check real value
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [router],
        provide: {
          [AccessibilityPropertiesKey as symbol]: vi.fn()
        }
      }
    })
    expect(wrapper.text()).toContain('s0.titles')
  })
})