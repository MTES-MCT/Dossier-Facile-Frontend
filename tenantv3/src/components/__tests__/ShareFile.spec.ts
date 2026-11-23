import { mount } from '@vue/test-utils'
import { defineRule } from 'vee-validate'
import { describe, expect, it, vi } from 'vitest'
import ShareFile from '../sharing/ShareFile.vue'
import ShareFileSource from '../sharing/ShareFile.vue?raw'
import { useI18nForTest } from 'df-shared-next/src/helper/__tests__/useI18n'

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({ user: { status: 'VALIDATED' } })
}))

// Same rule as main.ts, used by the link title field
defineRule('required', (value: unknown) => (value ? true : 'field-required'))

const { i18n, messages, t } = useI18nForTest(ShareFileSource, 'fr')

function createWrapper() {
  return mount(ShareFile, {
    global: {
      plugins: [i18n],
      // tests/unit.setup.ts mocks t to return the key: use the real messages instead
      mocks: { t: (key: string, params?: Record<string, unknown>) => t(key, params) },
      stubs: { LinkWarning: true, DownloadPdfSection: true }
    }
  })
}

describe('ShareFile', () => {
  it('shows the shared content placeholder only once', () => {
    const options = createWrapper().findAll('select[name="shareType"] option')

    expect(options.map((option) => option.text())).toEqual([
      t('select-option'),
      t('file-without-docs'),
      t('file-with-docs')
    ])
  })

  it('has an English text for every French one', () => {
    expect(Object.keys(messages.en ?? {}).sort()).toEqual(Object.keys(messages.fr ?? {}).sort())
  })
})
