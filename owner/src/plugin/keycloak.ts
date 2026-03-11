import Keycloak, { type KeycloakConfig } from 'keycloak-js'

const options: KeycloakConfig = {
  url: import.meta.env.VITE_SSO_ENDPOINT?.toString() || 'http://localhost:8080/auth',
  realm: import.meta.env.VITE_SSO_REALM?.toString() || 'dossier-facile-owner',
  clientId: import.meta.env.VITE_SSO_CLIENT_ID?.toString() || 'dossier-facile-vue-owner'
}

const keycloak = new Keycloak(options)
export default keycloak
