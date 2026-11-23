import { keycloak } from '@/plugin/keycloak'
import { useTenantStore } from '@/stores/tenant-store'

/**
 * Loads the tenant on a public page when the visitor is logged in.
 * A public page opened in a new tab (such as /contact from the "Contacter le support" links)
 * starts a fresh app in which no protected route has loaded the tenant yet.
 * A failure is only logged: the page stays usable without the tenant.
 */
export async function loadUserIfLoggedIn() {
  const store = useTenantStore()
  if (!keycloak.authenticated || store.user.id) {
    return
  }
  try {
    await store.loadUser()
  } catch (error) {
    console.error(new Error('Cannot load the tenant on a public page', { cause: error }))
  }
}
