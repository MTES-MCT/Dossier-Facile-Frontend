import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { useI18n } from "vue-i18n";
import Header from '../Header.vue'

vi.mock("vue-i18n");

useI18n.mockReturnValue({
  t: (tKey: string) => tKey,
});

describe('Header', () => {
  it('renders properly', () => {
    expect(Header).toBeTruthy()
    const wrapper = mount(Header, { props: { loggedIn: true } })
    expect(wrapper.text()).toContain('République')
  })
})
