import { createHead, renderSSRHead } from '@unhead/vue/server'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import { AccessibilityPropertiesKey } from '../../models/injectionKeys'
import { toAbsoluteUrl, useCanonicalUrl, useMeta } from '../useSeo'

// The site title is read when the module loads: unset it before the imports
// run, to exercise the build environments where VITE_SITE_TITLE is missing.
vi.hoisted(() => {
  vi.stubEnv('VITE_SITE_TITLE', undefined)
})

const MAIN_URL = 'https://www.example.test'

type MetaOptions = Partial<Parameters<typeof useMeta>[0]>

const setAccessibilityProperties = vi.fn()

/**
 * Mounts a page calling useMeta, then returns the <head> it produces.
 * The canonical URL is the current page unless the options say otherwise.
 */
async function renderHead(
  path: string,
  options: MetaOptions,
  provideAccessibility = true
): Promise<Document> {
  const Page = defineComponent({
    setup() {
      useMeta({ canonicalUrl: useCanonicalUrl(), ...options })
      return () => null
    }
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: Page }]
  })
  await router.push(path)
  await router.isReady()
  const head = createHead()

  mount(Page, {
    global: {
      plugins: [router, head],
      provide: provideAccessibility
        ? { [AccessibilityPropertiesKey as symbol]: setAccessibilityProperties }
        : {}
    }
  })

  const { headTags } = await renderSSRHead(head)
  return new DOMParser().parseFromString(`<head>${headTags}</head>`, 'text/html')
}

const content = (head: Document, selector: string) =>
  head.querySelector(selector)?.getAttribute('content') ?? null

beforeEach(() => {
  vi.stubEnv('VITE_MAIN_URL', MAIN_URL)
})

afterEach(() => {
  vi.unstubAllEnvs()
  setAccessibilityProperties.mockClear()
})

describe('useMeta', () => {
  it('falls back to "DossierFacile" when VITE_SITE_TITLE is not set', async () => {
    const head = await renderHead('/contact', { title: () => 'Contact' })

    expect(head.querySelector('title')?.textContent).toBe('Contact - DossierFacile')
    expect(head.head.innerHTML).not.toContain('undefined')
  })

  it.each([undefined, ''])('uses the site title alone when the page title is %j', async (title) => {
    const head = await renderHead('/contact', { title: () => title })

    expect(head.querySelector('title')?.textContent).toBe('DossierFacile')
    expect(content(head, 'meta[property="og:title"]')).toBe('DossierFacile')
  })

  it('writes the title and description under the names read by social networks', async () => {
    const head = await renderHead('/contact', {
      title: () => 'Contact',
      description: () => 'Une question ?'
    })

    expect(content(head, 'meta[property="og:title"]')).toBe('Contact - DossierFacile')
    expect(content(head, 'meta[name="twitter:title"]')).toBe('Contact - DossierFacile')
    expect(content(head, 'meta[name="description"]')).toBe('Une question ?')
    expect(content(head, 'meta[property="og:description"]')).toBe('Une question ?')
    expect(content(head, 'meta[name="twitter:description"]')).toBe('Une question ?')
  })

  it('turns the image path into a full URL', async () => {
    const head = await renderHead('/blog/article', {
      title: () => 'Article',
      image: () => '/assets/article.png'
    })

    expect(content(head, 'meta[property="og:image"]')).toBe(`${MAIN_URL}/assets/article.png`)
    expect(content(head, 'meta[name="twitter:image"]')).toBe(`${MAIN_URL}/assets/article.png`)
  })

  it('declares the card type expected by X, with and without an image', async () => {
    const withImage = await renderHead('/blog/article', { image: () => '/assets/article.png' })
    const withoutImage = await renderHead('/contact', { title: () => 'Contact' })

    expect(content(withImage, 'meta[name="twitter:card"]')).toBe('summary_large_image')
    expect(content(withoutImage, 'meta[name="twitter:card"]')).toBe('summary')
  })

  it.each([undefined, ''])(
    'leaves out the description, image and robots tags when the description is %j',
    async (description) => {
      const head = await renderHead('/contact', { title: () => 'Contact', description: () => description })

      expect(head.querySelector('meta[name="description"]')).toBeNull()
      expect(head.querySelector('meta[property="og:description"]')).toBeNull()
      expect(head.querySelector('meta[name="twitter:description"]')).toBeNull()
      expect(head.querySelector('meta[property="og:image"]')).toBeNull()
      expect(head.querySelector('meta[name="twitter:image"]')).toBeNull()
      expect(head.querySelector('meta[name="robots"]')).toBeNull()
    }
  )

  it('asks robots not to index the page when noIndex is set', async () => {
    const head = await renderHead('/contact', { title: () => 'Contact', noIndex: () => true })

    expect(content(head, 'meta[name="robots"]')).toBe('noindex, nofollow')
  })

  it('writes the canonical link and og:url as a full URL built on VITE_MAIN_URL', async () => {
    const head = await renderHead('/contact', { title: () => 'Contact' })

    expect(head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${MAIN_URL}/contact`
    )
    expect(content(head, 'meta[property="og:url"]')).toBe(`${MAIN_URL}/contact`)
    expect(content(head, 'meta[property="og:type"]')).toBe('website')
  })

  it('writes neither canonical link nor og:url when the page has no canonical URL', async () => {
    const head = await renderHead('/404', { title: () => 'Introuvable', canonicalUrl: () => null })

    expect(head.querySelector('link[rel="canonical"]')).toBeNull()
    expect(head.querySelector('meta[property="og:url"]')).toBeNull()
  })

  it('announces the page title for screen readers', async () => {
    await renderHead('/contact', { title: () => 'Contact' })

    expect(setAccessibilityProperties).toHaveBeenCalledWith('Contact')
  })

  it('works in an app that does not provide the screen reader announcement', async () => {
    const head = await renderHead('/contact', { title: () => 'Contact' }, false)

    expect(head.querySelector('title')?.textContent).toBe('Contact - DossierFacile')
  })
})

describe('toAbsoluteUrl', () => {
  it('ignores a trailing slash in VITE_MAIN_URL', () => {
    vi.stubEnv('VITE_MAIN_URL', `${MAIN_URL}/`)

    expect(toAbsoluteUrl('/contact')).toBe(`${MAIN_URL}/contact`)
  })

  it('falls back to the browser address when VITE_MAIN_URL is not set', () => {
    vi.stubEnv('VITE_MAIN_URL', undefined)

    expect(toAbsoluteUrl('/contact')).toBe(`${window.location.origin}/contact`)
  })

  it.each(['https://cdn.example.test/image.png', '//cdn.example.test/image.png', 'data:image/png;base64,AAAA'])(
    'keeps %s unchanged',
    (url) => {
      expect(toAbsoluteUrl(url)).toBe(url)
    }
  )
})
