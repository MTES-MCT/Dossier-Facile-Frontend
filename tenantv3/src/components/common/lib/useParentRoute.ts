import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Using ".." adds a trailing slash to the URL which breaks relative links, so
// we have to compute the path manually
export function useParentRoute(levels = 1) {
  const route = useRoute()
  const parentRoute = computed(() => {
    const p = route.path.split('/')
    p.splice(-levels)
    return p.join('/')
  })
  return parentRoute
}
