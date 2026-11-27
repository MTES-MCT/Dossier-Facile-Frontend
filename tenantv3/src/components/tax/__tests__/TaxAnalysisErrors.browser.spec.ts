import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-vue'
import axe from 'axe-core'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import AnalysisErrorBlock from '../../analysis/AnalysisErrorBlock.vue'
import {
  classification,
  declarative,
  names,
  pages,
  taxErrorBlockOptions,
  year
} from './taxAnalysisFixtures'

vi.mock('@/stores/tenant-store', () => ({
  useTenantStore: () => ({ deleteDocument: vi.fn() })
}))
vi.mock('@/services/AnalyticsService', () => ({
  AnalyticsService: { showWarningModale: vi.fn(), confirmModale: vi.fn() }
}))

const cases: {
  id: string
  rules: DocumentRule[]
  title: string
  help?: string
  bullets: string[]
}[] = [
  {
    id: 'declarative',
    rules: [declarative],
    title: "L'avis de situation déclarative n'est pas accepté",
    help: 'Comment les distinguer',
    bullets: ["Document déposé : avis de situation déclarative à l'impôt sur le revenu"]
  },
  {
    id: 'classification',
    rules: [classification],
    title: "Ce document n'est pas un avis d'impôt",
    help: 'Avant de redéposer',
    bullets: ["Document non reconnu comme un avis d'impôt"]
  },
  {
    id: 'pages',
    rules: [pages],
    title: "Il manque des pages à votre avis d'impôt",
    help: 'Pour un avis complet',
    bullets: ["Avis d'impôt déposé avec une seule page"]
  },
  {
    id: 'year',
    rules: [year],
    title: "Cet avis d'impôt est trop ancien",
    help: "L'année figure en haut de la première page de l'avis.",
    bullets: ["Avis d'impôt 2025 sur les revenus de 2024"]
  },
  {
    id: 'names',
    rules: [names],
    title: "Le nom RECOBER Laura sur l'avis d'impôt ne correspond pas au vôtre",
    help: 'Deux situations fréquentes',
    bullets: ["Avis d'impôt au nom de RECOBER Laura différent de celui du dossier"]
  },
  {
    id: 'multiple',
    rules: [year, names],
    title: 'Des erreurs sont détectées sur le document',
    bullets: [
      "Avis d'impôt 2025 sur les revenus de 2024",
      "Avis d'impôt au nom de RECOBER Laura différent de celui du dossier"
    ]
  }
]

async function expectNoA11yViolations(context: Element, options: axe.RunOptions = {}) {
  const { violations } = await axe.run(context, options)
  expect(
    violations.map((violation) => `${violation.id}: ${violation.nodes.map((n) => n.target)}`)
  ).toEqual([])
}

// Icons are downloaded from the Iconify API: give them time, without failing offline.
async function waitForIcons(root: Element) {
  const deadline = performance.now() + 2000
  const pending = () =>
    [...root.querySelectorAll('svg.vicon')].some((icon) => !icon.childElementCount)
  while (pending() && performance.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}

// A component test must not call the application API.
const xhrOpen = vi.spyOn(XMLHttpRequest.prototype, 'open')
const fetchSpy = vi.spyOn(window, 'fetch')
afterEach(() => {
  const urls = [
    ...xhrOpen.mock.calls.map(([, url]) => String(url)),
    ...fetchSpy.mock.calls.map(([input]) => (input instanceof Request ? input.url : String(input)))
  ]
  xhrOpen.mockClear()
  fetchSpy.mockClear()
  expect(urls.filter((url) => url.includes('/api/'))).toEqual([])
})

let main: HTMLElement
beforeEach(() => {
  main = document.createElement('main')
  main.className = 'fr-container fr-py-3w'
  main.style.maxWidth = '50rem'
  main.innerHTML = '<h1 class="fr-h4">Avis d\'imposition</h1>'
  document.body.append(main)
})
afterEach(() => main.remove())

for (const viewport of [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 375, height: 812 }
]) {
  describe(`tax errors — ${viewport.name}`, () => {
    it.each(cases)('renders $id', async ({ id, rules, title, help, bullets }) => {
      await page.viewport(viewport.width, viewport.height)
      expect(window.innerWidth).toBe(viewport.width)
      await render(AnalysisErrorBlock, { ...taxErrorBlockOptions(rules), container: main })
      await document.fonts.ready

      const block = main.querySelector<HTMLElement>('.analysis-error-block')!
      await expect.element(block).toBeVisible()
      expect(block.getAttribute('role')).toBe('alert')
      const heading = main.querySelector<HTMLElement>('.analysis-error-header-title')!
      expect(heading.tagName).toBe('H2')
      expect(heading.textContent?.trim()).toBe(title)
      const sectionTitle = main.querySelector<HTMLElement>('.analysis-error-section-title')!
      expect(sectionTitle.tagName).toBe('H3')
      await expect.element(sectionTitle).toBeVisible()
      expect(sectionTitle.textContent?.trim()).toBe('Document attendu')
      expect(
        [...main.querySelectorAll('.analysis-error-bullets li')].map((li) => li.textContent?.trim())
      ).toEqual(bullets)
      const expected = main.querySelector<HTMLElement>('.analysis-error-expected-text')!
      await expect.element(expected).toBeVisible()
      expect(expected.textContent).toContain("avis d'impôt 2026 sur les revenus de 2025")
      expect(expected.querySelector('a')?.getAttribute('href')).toBe('https://www.impots.gouv.fr')
      const guidance = main.querySelector<HTMLElement>('.tax-analysis-guidance')
      if (help) {
        await expect.element(guidance).toBeVisible()
        expect(guidance?.textContent).toContain(help)
      } else {
        expect(guidance).toBeNull()
      }
      if (id === 'pages' || id === 'names') {
        const items = main.querySelectorAll<HTMLElement>('.tax-analysis-guidance > ul > li')
        expect(items).toHaveLength(2)
        for (const item of items) {
          expect(getComputedStyle(item, '::marker').content).toBe('normal')
          expect(getComputedStyle(item).listStyleType).toBe('disc')
        }
      }
      const textarea = main.querySelector<HTMLTextAreaElement>('#explainText')!
      expect(textarea.value).toBe('')
      expect(textarea.getAttribute('aria-invalid')).toBe('false')
      expect(main.querySelector<HTMLElement>('.confirm-tax-btn, .continue-without-btn')).toBeNull()
      await expect
        .element(main.querySelector<HTMLElement>('label[for="explainText"]'))
        .toBeVisible()
      await expect.element(main.querySelector<HTMLElement>('#explain-info-text')).toBeVisible()
      expect(main.querySelector<HTMLElement>('#explain-info-text')?.textContent).toContain(
        'à notre équipe uniquement'
      )
      expect(main.textContent).not.toContain('Technical backend message')

      for (const element of main.querySelectorAll<HTMLElement>(
        '.analysis-error-header-title, .analysis-error-body, .tax-analysis-guidance, #explainText'
      )) {
        expect(element.scrollWidth, `${element.className}: no clipped content`).toBeLessThanOrEqual(
          element.clientWidth + 1
        )
        const box = element.getBoundingClientRect()
        expect(box.left).toBeGreaterThanOrEqual(0)
        expect(box.right).toBeLessThanOrEqual(viewport.width)
      }
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(viewport.width)

      await page.viewport(
        viewport.width,
        Math.max(viewport.height, document.documentElement.scrollHeight)
      )
      await waitForIcons(main)
      await page.screenshot({
        element: main,
        path: `__screenshots__/tax-errors/${viewport.name}-${id}.png`
      })
      await page.viewport(viewport.width, viewport.height)

      await expectNoA11yViolations(main, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] }
      })

      await userEvent.click(textarea)
      await expect.element(textarea).toHaveFocus()
      await userEvent.keyboard('Mon explication fiscale personnelle')
      textarea.blur()
      await expect.element(textarea).toHaveValue('Mon explication fiscale personnelle')

      if (id === 'names') {
        const nameLink = main.querySelector<HTMLElement>(
          '.tax-analysis-guidance a[href="/nom-locataire"]'
        )
        await expect.element(nameLink).toBeVisible()
        await userEvent.click(
          main.querySelector<HTMLElement>('.tax-analysis-guidance button.fr-link')!
        )
        const dialog = page.getByRole('dialog')
        await expect.element(dialog).toBeVisible()
        expect(dialog.element().matches('dialog:modal')).toBe(true)
        await expectNoA11yViolations(dialog.element())
        await userEvent.click(dialog.getByRole('button', { name: 'Fermer' }))
        await expect.element(dialog).not.toBeInTheDocument()
        expect(main.querySelector<HTMLTextAreaElement>('#explainText')?.value).toBe(
          'Mon explication fiscale personnelle'
        )
      }
    })
  })
}
