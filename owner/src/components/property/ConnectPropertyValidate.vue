<template>
  <PropertyContainer>
    <div class="fr-container">
      <div v-if="!showError && !showSuccess">{{ t('loading') }}</div>
      <div v-if="showError" class="box-container">
        <div class="fr-col-12 fr-col-md-7">
          <NakedCard class="fr-mt-3w bg-purple-var fr-p-5w h-100">
            <p style="font-size:40px">🙊</p>
            <h2 class="fr-h5">{{ t('oops-title') }}</h2>
            <div v-if="!isCreate">{{ t('oops-create-subtitle', [mainTenantFirstname]) }}</div>
            <div v-if="isCreate">{{ t('oops-subtitle') }}</div>
            <div class="right-btn-container">
              <a class="fr-mt-7w fr-btn" :href="TENANT_URL">Retourner à mon DossierFacile</a>
            </div>
          </NakedCard>
        </div>
      </div>
      <div v-if="showSuccess" class="box-container">
        <div class="fr-col-12 fr-col-md-7">
          <NakedCard class="fr-mt-3w bg-purple-var fr-p-5w h-100">
            <p style="font-size:40px">🎉</p>
            <h2 class="fr-h5">{{ t('title') }}</h2>
            <div>{{ t('subtitle') }}</div>
            <div class="right-btn-container">
              <a class="fr-mt-7w fr-btn" :href="TENANT_URL">Retourner à mon DossierFacile</a>
            </div>
          </NakedCard>
        </div>
      </div>
    </div>
  </PropertyContainer>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import NakedCard from 'df-shared-next/src/components/NakedCard.vue';
import keycloakTenant from '../../plugin/KeycloakTenant';
import PropertyService from './PropertyService';
import PropertyContainer from './PropertyContainer.vue';
import useOwnerStore from '../../store/owner-store';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const token = ref('');
const showError = ref(false);
const showSuccess = ref(false);
const store = useOwnerStore();

if (route.params.token) {
  token.value = route.params.token.toString();
  store.setPropertyToConsult(token.value).then(() => {
    if (Object.keys(store.getPropertyToConsult).length <= 0) {
      router.push({ name: 'Dashboard' });
    }
  });
} else {
  router.push({ name: 'Dashboard' });
}

const TENANT_URL = `${import.meta.env.VITE_FULL_TENANT_URL}`;
const OWNER_URL = `${import.meta.env.VITE_OWNER_URL}`;
const TENANT_API_URL = `${import.meta.env.VITE_API_URL}`;
const CLIENT_ID_PRIVATE = `${import.meta.env.VITE_TENANT_SSO_CLIENT_ID_PRIVATE}`;

const isCreate = ref(true);
const mainTenantFirstname = ref('');

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
            showSuccess.value = true;
          })
          .catch(() => {
            if (profile.data.tenantType !== 'CREATE') {
              isCreate.value = false;
              mainTenantFirstname.value = profile.data.apartmentSharing.tenants.find(
                (tenant: any) => tenant.tenantType === 'CREATE',
              ).firstName;
            }
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

<style scoped lang="scss">
.box-container {
  display: flex;
  justify-content: center;
  align-content: center;
}
.right-btn-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 0;
}
</style>

<i18n>
{
  "en": {
    "loading": "Loading",
    "error-occured": "An error occured",
    "title": "Your DossierFacile has been shared with the owner !",
    "subtitle": "The owner will contact you directly your application is accepted.",
    "oops-title": "Oops, you can't subscribe",
    "oops-subtitle": "An error occured, please contact the support",
    "oops-create-subtitle": "You are not the main tenant, please contact {0}"
  },
  "fr": {
    "loading": "Veuillez patienter",
    "error-occured": "Une erreur est survenue",
    "title": "Votre DossierFacile a bien été partagé avec le propriétaire !",
    "subtitle": "Ce dernier prendra directement contact avec vous si votre dossier est retenu.",
    "oops-title": "Oups, vous ne pouvez pas candidater…",
    "oops-subtitle": "Une erreur est survenue, veuillez prendre contact avec le support.",
    "oops-create-subtitle": "car vous n’êtes pas l’initiateur du dossier de colocation DossierFacile. Prenez contact avec {0} afin qu’il.elle candidate en vos noms."
  }
}

</i18n>
