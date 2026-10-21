import { useHead } from '@unhead/vue'
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

const siteTitle: string = import.meta.env.VITE_SITE_TITLE

export function useCanonicalUrl(
  getRoute?: () => RouteLocationRaw
): () => string | null {
  const router = useRouter()
  return () => {
    if (!getRoute)
      return `${window.location.origin}${router.currentRoute.value.path}`
    const route = getRoute()
    if (!route) return null
    return `${window.location.origin}${router.resolve(route).href}`
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
  const setAccessibilityProperties = inject(
    AccessibilityPropertiesKey
  ) as AccessibilityPropertiesType

  // Explicit title takes precedence; fall back to route.meta.title for pages
  // that define their title in the router (list pages, home, 404…)
  const resolvedTitle = computed(() => toValue(title) ?? (route.meta.title || undefined))

  const fullTitle = computed(() => {
    const t = resolvedTitle.value
    return t ? `${t} - ${siteTitle}` : siteTitle
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

  const args = {
    title: () => fullTitle.value,
    meta: () => {
      const metaDescription = toValue(description)
      const imagePath = toValue(image)
      return [
        {
          property: 'og:title',
          content: fullTitle.value
        }, {
          property: 'twitterTitle',
          content: fullTitle.value
        },
        ...(metaDescription
          ? [
            { name: 'description', content: metaDescription },
            { property: 'og:description', content: metaDescription },
            { property: 'twitterDescription', content: metaDescription }
          ]
          : []),
        ...(toValue(noIndex)
          ? [{ name: 'robots', content: 'noindex, nofollow' }]
          : []),
        ...(imagePath ? [
          { name: 'og:image', content: imagePath },
          { name: 'twitter:image', content: imagePath }
        ] : [])
      ]
    },
    link: () => {
      const url = toValue(canonicalUrl)
      return url ? [{ rel: 'canonical', href: url }] : []
    }
  }
  useHead(args)
}
