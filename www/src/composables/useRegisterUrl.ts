import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { withKeycloakLocale } from 'df-shared-next/src/services/KeycloakLocaleService'

/** Keycloak's sign-up address, asking for English when the site is in English. */
export function useRegisterUrl() {
  const { locale } = useI18n()
  return computed(() => withKeycloakLocale(import.meta.env.VITE_REGISTER_URL, locale.value))
}
