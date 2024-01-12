import { describe, it, expect, vi } from "vitest";
import { mount } from '@vue/test-utils'
import { useI18n } from "vue-i18n";
import LandingPage from '@/views/LandingPage.vue';

vi.mock("vue-i18n");

useI18n.mockReturnValue({
  t: (tKey: string) => tKey,
});

describe('Header', () => {
  it('renders properly', () => {
    // TODO : don't mock i18n to check real value
    const wrapper = mount(LandingPage)
    expect(wrapper.text()).toContain('s0.titles0.text')
  })
})
