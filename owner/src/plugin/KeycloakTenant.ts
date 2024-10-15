import Keycloak, { type KeycloakConfig } from 'keycloak-js'

const options: KeycloakConfig = {
  url: import.meta.env.VITE_TENANT_SSO_ENDPOINT?.toString() || '',
  realm: import.meta.env.VITE_TENANT_SSO_REALM?.toString() || 'dossier-facile',
  clientId: import.meta.env.VITE_TENANT_SSO_CLIENT_ID_PUBLIC?.toString() || ''
}

const keycloakTenant = Keycloak(options)
export default keycloakTenant
