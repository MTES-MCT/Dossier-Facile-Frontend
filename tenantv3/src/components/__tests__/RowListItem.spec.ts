import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useI18n } from 'vue-i18n'
import RowListItem from '../documents/RowListItem.vue'

vi.mock('vue-i18n')

useI18n.mockReturnValue({
  t: (tKey: string) => tKey
})

describe('LeftEditMenu', () => {
  it('renders properly', () => {
    expect(RowListItem).toBeTruthy()
    const wrapper = mount(RowListItem, { props: { label: 'test label' } })
    expect(wrapper.text()).toContain('test label')
  })
})
