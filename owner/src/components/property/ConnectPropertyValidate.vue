<template>
  <div class="fr-container">
    <div v-if="!showError">{{ t('loading') }}</div>
    <div v-if="showError">{{ t('error-occured') }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import keycloakTenant from '../../plugin/KeycloakTenant';
import PropertyService from './PropertyService';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const token = ref(0);
const showError = ref(false);

if (route.params.token) {
  token.value = route.params.token;
} else {
  router.push({ name: 'Dashboard' });
}

const OWNER_URL = `${import.meta.env.VITE_OWNER_URL}`;
const TENANT_API_URL = `${import.meta.env.VITE_API_URL}`;
const CLIENT_ID_PRIVATE = `${import.meta.env.VITE_TENANT_SSO_CLIENT_ID_PRIVATE}`;

function subscribe() {
  if (keycloakTenant.authenticated) {
    const kcToken = keycloakTenant.token;
    const reqInstance = axios.create({
      headers: {
        Authorization: `Bearer ${kcToken}`,
      },
    });
    reqInstance
      .get(`${TENANT_API_URL}/api-partner-linking/${CLIENT_ID_PRIVATE}`)
      .then((profile) => {
        PropertyService.subscribe(profile.data.id, token.value)
          .then(() => {
            window.close();
          })
          .catch(() => {
            showError.value = true;
          });
      })
      .catch(() => {
        showError.value = true;
      });
  }
}

onMounted(() => {
  keycloakTenant
    .init({ onLoad: 'check-sso', checkLoginIframe: false })
    .then((auth) => {
      if (auth) {
        subscribe();
      } else {
        keycloakTenant.login({ redirectUri: OWNER_URL + route.fullPath });
      }
    })
    .catch(() => {
      window.location.reload();
    });
});
</script>

<i18n>
{
  "en": {
    "loading": "Loading",
    "error-occured": "An error occured"
  },
  "fr": {
    "loading": "Veuillez patienter",
    "error-occured": "Une erreur est survenue"
  }
}

</i18n>
