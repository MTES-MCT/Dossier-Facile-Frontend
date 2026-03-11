import Keycloak, { type KeycloakConfig } from 'keycloak-js'

const options: KeycloakConfig = {
  url: import.meta.env.VITE_SSO_ENDPOINT?.toString() || 'http://localhost:8080/auth',
  realm: import.meta.env.VITE_SSO_REALM?.toString() || 'dossier-facile',
  clientId: import.meta.env.VITE_SSO_CLIENT_ID?.toString() || 'dossier-facile-vue-tenant'
}

export const keycloak = new Keycloak(options)
