import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { config, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import AnalysisErrorBlock from '../../analysis/AnalysisErrorBlock.vue'
import { getTaxYearPeriod } from '../lib/taxYear'
import ConfirmDeleteModal from 'df-shared-next/src/components/ConfirmDeleteModal.vue'
import TaxBackLinkRow from '../lib/TaxBackLinkRow.vue'
import {
  classification,
  declarative,
  names,
  pages,
  rule,
  taxErrorBlockOptions,
  year
} from './taxAnalysisFixtures'

const mockDeleteDocument = vi.fn<(documentId: number) => Promise<void>>()
vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({ deleteDocument: mockDeleteDocument })
}))
vi.mock('@/services/AnalyticsService', () => ({
  AnalyticsService: { showWarningModale: vi.fn(), confirmModale: vi.fn() }
}))

enableAutoUnmount(afterEach)
const originalMocks = { ...config.global.mocks }
beforeEach(() => {
  config.global.mocks = {}
  mockDeleteDocument.mockReset().mockResolvedValue(undefined)
})
afterEach(() => {
  config.global.mocks = originalMocks
})

function mountBlock(...args: Parameters<typeof taxErrorBlockOptions>) {
  const options = taxErrorBlockOptions(...args)
  return mount(AnalysisErrorBlock, {
    ...options,
    global: { ...options.global, stubs: { VIcon: true, ConfirmDeleteModal: true } }
  })
}

describe('tax analysis errors', () => {
  it('combines the expected year and identity and displays the extracted values', () => {
    const wrapper = mountBlock([year, names])
    expect(wrapper.get('.analysis-error-bullets').text()).toContain(
      "Avis d'impôt 2025 sur les revenus de 2024"
    )
    expect(wrapper.get('.analysis-error-bullets').text()).toContain('RECOBER Laura')
    expect(wrapper.get('.analysis-error-expected-text').text()).toContain(
      'au nom de Christophe Leconte'
    )
  })

  it('offers the parents situation change and links to the name form', () => {
    const wrapper = mountBlock([names])
    expect(wrapper.getComponent(TaxBackLinkRow).get('button').text()).toContain('mes parents')
    expect(wrapper.get('a[href="/nom-locataire"]').text()).toBe('ajoutez-le à votre dossier')
  })

  it.each([
    ['fr', 'expliquez pourquoi dans le champ ci-dessous'],
    ['en', 'explain the difference in the field below']
  ])('explains how to report a FranceConnect name mismatch in %s', (locale, instruction) => {
    const wrapper = mountBlock([names], {}, locale, null)
    expect(wrapper.get('.tax-analysis-guidance').text()).toContain(instruction)
    expect(wrapper.find('a[href="/nom-locataire"]').exists()).toBe(false)
    expect(wrapper.getComponent(TaxBackLinkRow).find('button').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('keeps the tax document and route when the parents change is cancelled', async () => {
    const wrapper = mountBlock([names])
    await wrapper.getComponent(TaxBackLinkRow).get('button').trigger('click')
    const modal = wrapper.getComponent(ConfirmDeleteModal)
    expect(modal.props('isOpened')).toBe(true)
    modal.vm.$emit('update:isOpened', false)
    await flushPromises()
    expect(modal.props('isOpened')).toBe(false)
    expect(mockDeleteDocument).not.toHaveBeenCalled()
    expect(wrapper.vm.$router.currentRoute.value.path).toBe('/')
  })

  it('waits for deletion before opening the parents declaration', async () => {
    let finishDelete!: () => void
    mockDeleteDocument.mockReturnValue(
      new Promise<void>((resolve) => {
        finishDelete = resolve
      })
    )
    const wrapper = mountBlock([names])
    await wrapper.getComponent(TaxBackLinkRow).get('button').trigger('click')
    wrapper.getComponent(ConfirmDeleteModal).vm.$emit('confirm')
    await flushPromises()
    expect(mockDeleteDocument).toHaveBeenCalledWith(42)
    expect(wrapper.vm.$router.currentRoute.value.path).toBe('/')
    finishDelete()
    await flushPromises()
    expect(wrapper.vm.$router.currentRoute.value.path).toBe(
      '/documents-locataire/5/sans-avis/parents'
    )
  })

  it('uses third-person wording for the other applicants', () => {
    const wrapper = mountBlock([names], { isSelf: false })
    expect(wrapper.get('.analysis-error-header-title').text()).toContain('la personne concernée')
    expect(wrapper.get('.tax-analysis-guidance').text()).toContain('son nom de naissance')
    expect(wrapper.get('.tax-analysis-guidance').text()).not.toContain('votre')
  })

  it('only claims one page when the file page count is known', () => {
    expect(mountBlock([pages]).get('.analysis-error-bullets').text()).toContain('une seule page')
    expect(
      mountBlock([pages], { pageCount: undefined }).get('.analysis-error-bullets').text()
    ).toContain('pages manquantes')
    expect(mountBlock([pages]).get('.analysis-error-expected-text').text()).toContain(
      'avec toutes ses pages'
    )
  })

  it.each([
    [new Date(Date.UTC(2026, 5, 30, 12)), '2025 sur les revenus de 2024', false],
    [new Date(Date.UTC(2026, 6, 1, 12)), '2025 sur les revenus de 2024', true],
    [new Date(Date.UTC(2026, 8, 14, 12)), '2025 sur les revenus de 2024', true],
    [new Date(Date.UTC(2026, 8, 15, 12)), '2026 sur les revenus de 2025', false]
  ] as const)('uses the existing calendar at %s', (date, expected, transition) => {
    const wrapper = mountBlock([classification], { period: getTaxYearPeriod(date) })
    const text = wrapper.get('.analysis-error-expected-text').text()
    expect(text).toContain(expected)
    expect(text.includes(' ou ')).toBe(transition)
  })

  it('prioritizes the year expected by the backend over the browser date', () => {
    const wrapper = mountBlock([
      rule('R_TAX_WRONG_YEAR', {
        type: 'R_TAX_YEARS',
        expectedYear: 2027,
        extractedYears: [2024, 2025]
      })
    ])
    expect(wrapper.get('.analysis-error-expected-text').text()).toContain(
      '2028 sur les revenus de 2027'
    )
    expect(wrapper.findAll('.analysis-error-bullets li')).toHaveLength(2)
  })

  it('ignores the outdated expected year of a report saved before the cutoff', () => {
    const wrapper = mountBlock([
      rule('R_TAX_WRONG_YEAR', { type: 'R_TAX_YEARS', expectedYear: 2024, extractedYears: [2023] })
    ])
    const expected = wrapper.get('.analysis-error-expected-text').text()
    expect(expected).toContain('2026 sur les revenus de 2025')
    expect(expected).not.toContain('sur les revenus de 2024')
  })

  it.each([
    ['2026-09-14T21:59:59Z', true],
    ['2026-09-14T22:00:00Z', false]
  ] as const)(
    'uses the French calendar at %s when the report has no year',
    (instant, acceptsOlderNotice) => {
      vi.useFakeTimers()
      try {
        vi.setSystemTime(new Date(instant))
        const wrapper = mountBlock([classification], { period: undefined })
        const expected = wrapper.get('.analysis-error-expected-text').text()
        expect(expected).toContain('2026 sur les revenus de 2025')
        expect(expected.includes('2025 sur les revenus de 2024')).toBe(acceptsOlderNotice)
      } finally {
        vi.useRealTimers()
      }
    }
  )

  it.each([
    ['fr', 'nouvelle fenêtre'],
    ['en', 'new window']
  ])('announces the new window on the rendered %s tax download link', (locale, notice) => {
    const link = mountBlock([classification], {}, locale).get('.analysis-error-expected-text a')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.text()).toContain(notice)
  })

  it.each([
    ['fr', 'R_TAX_FAKE', 'illisible', 'floues ou corrompues'],
    ['fr', 'R_TAX_N1', "l'année attendue", "l'année de revenus attendue"],
    ['fr', 'R_TAX_N3', 'trop ancien', 'antérieur à la période acceptée'],
    ['en', 'R_TAX_FAKE', 'unreadable', 'blurry or corrupted'],
    ['en', 'R_TAX_N1', 'expected year', 'required income year'],
    ['en', 'R_TAX_N3', 'too old', 'older than the accepted period']
  ])('explains the saved %s failure %s', (locale, code, title, reason) => {
    const wrapper = mountBlock([rule(code)], {}, locale)
    expect(wrapper.get('.analysis-error-header-title').text()).toContain(title)
    expect(wrapper.get('.analysis-error-bullets').text()).toContain(reason)
    expect(wrapper.text()).not.toContain('Technical backend message')
  })

  it('handles absent extraction data and unknown rules without exposing backend messages', () => {
    for (const failedRule of [
      rule('R_TAX_NAMES'),
      rule('R_TAX_WRONG_YEAR'),
      rule('R_TAX_2D_DOC'),
      rule('R_FUTURE_TAX_RULE')
    ]) {
      const wrapper = mountBlock([failedRule])
      expect(wrapper.get('.analysis-error-header-title').text()).not.toContain('trop ancien')
      expect(wrapper.get('.analysis-error-bullets').text()).not.toBe('')
      expect(wrapper.text()).not.toMatch(/undefined|NaN|Technical backend message/)
    }
  })

  it('treats names as text in the title, bullets and expected document', () => {
    const wrapper = mountBlock([
      rule('R_TAX_NAMES', {
        type: 'R_TAX_NAMES',
        expectedName: { firstNames: '<em>Jean</em>', lastName: 'A&B', preferredName: null },
        extractedIdentities: ['<a href="https://example.com">A&B</a>']
      })
    ])
    expect(wrapper.get('.analysis-error-header-title').text()).toContain(
      '<a href="https://example.com">A&B</a>'
    )
    expect(wrapper.get('.analysis-error-bullets').text()).toContain(
      '<a href="https://example.com">A&B</a>'
    )
    expect(wrapper.get('.analysis-error-expected-text').text()).toContain('<em>Jean</em> A&B')
    expect(wrapper.find('a[href="https://example.com"]').exists()).toBe(false)
    expect(wrapper.find('em').exists()).toBe(false)
  })

  it('supports English guidance and preserves the freely entered explanation', async () => {
    const wrapper = mountBlock([declarative], {}, 'en')
    expect(wrapper.get('.analysis-error-header-title').text()).toBe(
      'A declarative situation notice is not accepted'
    )
    expect(wrapper.get('.tax-analysis-guidance').text()).toContain('How to tell them apart')
    await wrapper.get('textarea').setValue('My own explanation')
    expect(wrapper.emitted('update:modelValue')).toEqual([['My own explanation']])
    expect(wrapper.emitted('customEvent')).toBeUndefined()
  })
})
