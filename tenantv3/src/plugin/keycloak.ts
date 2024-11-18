import Keycloak, { type KeycloakConfig } from 'keycloak-js'

const options: KeycloakConfig = {
  url: import.meta.env.VITE_SSO_ENDPOINT?.toString() || '',
  realm: import.meta.env.VITE_SSO_REALM?.toString() || 'dossier-facile',
  clientId: import.meta.env.VITE_SSO_CLIENT_ID?.toString() || ''
}

export const keycloak = new Keycloak(options)
