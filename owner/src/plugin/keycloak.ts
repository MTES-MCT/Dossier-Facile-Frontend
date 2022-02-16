import Keycloak, { KeycloakConfig } from 'keycloak-js';
import axios from 'axios';
import store from '../store';

const options: KeycloakConfig = {
  url: import.meta.env.VITE_SSO_ENDPOINT?.toString() || '',
  realm: 'dossier-facile',
  clientId: import.meta.env.VITE_SSO_CLIENT_ID?.toString() || '',
};

const keycloak = Keycloak(options);
export default keycloak;
