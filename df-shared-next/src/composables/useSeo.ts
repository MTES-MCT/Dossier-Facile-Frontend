import { useHead, useSeoMeta } from '@unhead/vue'
import type { Ref } from 'vue'
import { computed, inject, toValue, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'

import {
  AccessibilityPropertiesKey,
  type AccessibilityPropertiesType
} from '../models/injectionKeys'
import { DebugLogger } from './debug'

const debug = new DebugLogger('useMeta')

type ReactiveInput<T> = Ref<T> | (() => T)

// The fallback matters: VITE_SITE_TITLE is not set in every build environment,
// and a missing value would render as "undefined" in page titles.
export const SITE_TITLE: string = import.meta.env.VITE_SITE_TITLE || 'DossierFacile'

/**
 * Turns a root-relative path ("/contact", "/assets/image.png") into a full URL.
 * Canonical links and Open Graph images must be full URLs, including in the
 * pre-rendered HTML, where `window` does not exist: the site URL comes from
 * VITE_MAIN_URL first, and from the browser only as a fallback.
 */
export function toAbsoluteUrl(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  const mainUrl: string = import.meta.env.VITE_MAIN_URL || ''
  const siteUrl = mainUrl.endsWith('/') ? mainUrl.slice(0, -1) : mainUrl
  const origin = siteUrl || (typeof window === 'undefined' ? '' : window.location.origin)
  return `${origin}${path}`
}

export function useCanonicalUrl(
  getRoute?: () => RouteLocationRaw
): () => string | null {
  const router = useRouter()

  return () => {
    if (!getRoute) return toAbsoluteUrl(router.currentRoute.value.path)
    const route = getRoute()
    if (!route) return null
    return toAbsoluteUrl(router.resolve(route).href)
  }
}

export function useMeta({
  title,
  description,
  canonicalUrl,
  image,
  noIndex
}: {
  title?: ReactiveInput<string | undefined>
  description?: ReactiveInput<string | undefined>
  keywords?: ReactiveInput<string[] | undefined>
  canonicalUrl: ReactiveInput<string | undefined | null>
  image?: ReactiveInput<string | undefined>
  noIndex?: ReactiveInput<boolean | undefined>
}) {
  const route = useRoute()
  // Only www provides this callback: default to a no-op elsewhere.
  const setAccessibilityProperties: AccessibilityPropertiesType = inject(
    AccessibilityPropertiesKey,
    () => {}
  )

  // Explicit title takes precedence; fall back to route.meta.title for pages
  // that define their title in the router.
  const resolvedTitle = computed(() => toValue(title) ?? (route.meta.title || undefined))

  const fullTitle = computed(() => {
    const title = resolvedTitle.value
    return title ? `${title} - ${SITE_TITLE}` : SITE_TITLE
  })

  if (!resolvedTitle.value) {
    debug.warn(`route "${String(route.name)}" has no title`)
  }

  watch(
    [resolvedTitle, () => route.path],
    ([title]) => {
      if (title) setAccessibilityProperties(title)
    },
    { immediate: true }
  )

  // An empty value must leave the tag out, not write it empty.
  const descriptionText = () => toValue(description) || undefined
  const imageUrl = () => {
    const imagePath = toValue(image)
    return imagePath ? toAbsoluteUrl(imagePath) : undefined
  }

  // useSeoMeta writes each tag with the attribute and name its consumers expect
  // (property="og:title", name="twitter:title"...) and skips undefined values.
  useSeoMeta({
    title: () => fullTitle.value,
    description: descriptionText,
    ogType: 'website',
    ogUrl: () => toValue(canonicalUrl) || undefined,
    ogTitle: () => fullTitle.value,
    ogDescription: descriptionText,
    ogImage: imageUrl,
    // X only shows a preview when the card type is declared.
    twitterCard: () => (imageUrl() ? 'summary_large_image' : 'summary'),
    twitterTitle: () => fullTitle.value,
    twitterDescription: descriptionText,
    twitterImage: imageUrl,
    robots: () => (toValue(noIndex) ? 'noindex, nofollow' : undefined)
  })

  useHead({
    link: () => {
      const url = toValue(canonicalUrl)
      return url ? [{ rel: 'canonical' as const, href: url }] : []
    }
  })
}
