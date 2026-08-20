import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FileHeader from '../FileHeader.vue'
import type { FileUser } from 'df-shared-next/src/models/FileUser'

vi.mock(import('vue-i18n'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useI18n: (() => ({
      t: (key: string, params?: unknown[]) => (params ? `${key}:${params.join(' ')}` : key)
    })) as unknown as typeof actual.useI18n
  }
})

function makeUser(status: string): FileUser {
  return {
    id: 1,
    status,
    applicationType: 'ALONE',
    lastUpdateDate: new Date('2026-08-12'),
    tenants: [
      {
        firstName: 'Louise',
        lastName: 'Martin',
        documents: [{ documentCategory: 'FINANCIAL', monthlySum: 2000 }]
      }
    ]
  } as FileUser
}

describe('FileHeader', () => {
  it('displays the income of a VALIDATED dossier', () => {
    const wrapper = mount(FileHeader, { props: { user: makeUser('VALIDATED') } })

    expect(wrapper.text()).toContain('file.income:2000')
  })

  it('hides the income of a COMPLETED dossier, not yet verified by an agent', () => {
    const wrapper = mount(FileHeader, { props: { user: makeUser('COMPLETED') } })

    expect(wrapper.text()).toContain('ALONE')
    expect(wrapper.text()).not.toContain('file.income')
    expect(wrapper.text()).not.toContain('file.no-income')
  })
})
