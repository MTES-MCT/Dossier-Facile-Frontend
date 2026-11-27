/**
 * Language to ask Keycloak's pages for. Our apps start in French whatever the browser's
 * language, so only English is passed on: without it, Keycloak follows the browser.
 */
export function keycloakLocale(lang: string): 'en' | undefined {
  return lang === 'en' ? 'en' : undefined
}

/** Same rule for the Keycloak addresses taken from settings, which do not go through keycloak-js. */
export function withKeycloakLocale(url: string, lang: string): string {
  const locale = keycloakLocale(lang)
  if (!url || !locale) {
    return url
  }
  return `${url}${url.includes('?') ? '&' : '?'}ui_locales=${locale}`
}
