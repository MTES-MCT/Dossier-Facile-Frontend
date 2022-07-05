<template>
  <div>...</div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import keycloakTenant from '../../plugin/KeycloakTenant';
import PropertyService from './PropertyService';

const route = useRoute();
const router = useRouter();

const token = ref(0);

if (route.params.token) {
  token.value = route.params.token;
} else {
  router.push({ name: 'Dashboard' });
}

const OWNER_URL = `${import.meta.env.VITE_OWNER_URL}`;
const CLIENT_ID = `${import.meta.env.VITE_TENANT_SSO_CLIENT_ID}`;

function subscribe() {
  if (keycloakTenant.authenticated) {
    const kcToken = keycloakTenant.token;
    const reqInstance = axios.create({
      headers: {
        Authorization: `Bearer ${kcToken}`,
      },
    });
    reqInstance
      .get(`https://api-dev.dossierfacile.fr/api-partner-linking/${CLIENT_ID}`)
      .then((profile) => {
        PropertyService.subscribe(profile.data.connectedTenantId, token.value);
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
