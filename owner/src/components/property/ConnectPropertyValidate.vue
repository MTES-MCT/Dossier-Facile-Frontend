<template>
  <PropertyContainer v-if="!propertyNotFound">
    <div class="fr-container">
      <div v-if="!showError && !showSuccess">
        {{ t('connectpropertyvalidate.loading') }}
      </div>
      <div v-if="showError" class="box-container">
        <div class="fr-col-12 fr-col-md-7">
          <NakedCard class="fr-mt-3w bg-purple-var fr-p-5w h-100">
            <p style="font-size: 40px">🙊</p>
            <h2 class="fr-h5">{{ t('connectpropertyvalidate.oops-title') }}</h2>
            <div v-if="!isCreate">
              {{ t('connectpropertyvalidate.oops-create-subtitle', [mainTenantFirstname]) }}
            </div>
            <div v-if="isCreate">
              {{ t('connectpropertyvalidate.oops-subtitle') }}
            </div>
            <div class="right-btn-container">
              <a class="fr-mt-7w fr-btn" :href="TENANT_URL">Retourner à mon DossierFacile</a>
            </div>
          </NakedCard>
        </div>
      </div>
      <div v-if="showSuccess" class="box-container">
        <div class="fr-col-12 fr-col-md-7">
          <div
            class="fr-callout fr-mt-3w"
            :class="{
              'success fr-icon-success-line': apartmentSharing?.status === 'VALIDATED',
              'error fr-icon-error-line':
                apartmentSharing?.status === 'DECLINED' ||
                apartmentSharing?.status === 'INCOMPLETE',
              'neutral fr-icon-time-line': apartmentSharing?.status === 'TO_PROCESS'
            }"
          >
            <h3 class="fr-callout__title">
              {{ t('connectpropertyvalidate.title.' + apartmentSharing?.status) }}
            </h3>
            <p
              class="fr-callout__text"
              v-html="t('connectpropertyvalidate.subtitle.' + apartmentSharing?.status)"
            />
            <a
              class="fr-btn"
              :href="TENANT_URL + (apartmentSharing?.status === 'DECLINED' ? '/messaging' : '')"
            >
              {{
                t('connectpropertyvalidate.back-to-tenant-button-text.' + apartmentSharing?.status)
              }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </PropertyContainer>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import keycloakTenant from '../../plugin/KeycloakTenant'
import PropertyService from './PropertyService'
import PropertyContainer from './PropertyContainer.vue'
import useOwnerStore from '../../store/owner-store'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const token = ref('')
const showError = ref(false)
const showSuccess = ref(false)
const store = useOwnerStore()
const propertyNotFound = ref(true)

if (route.params.token) {
  token.value = route.params.token.toString()
  store.setPropertyToConsult(token.value)
  propertyNotFound.value = false
  if (Object.keys(store.getPropertyToConsult).length <= 0) {
    router.push({ name: 'Dashboard' })
  }
} else {
  router.push({ name: 'Dashboard' })
}

const TENANT_URL = `${import.meta.env.VITE_FULL_TENANT_URL}`
const OWNER_URL = `${import.meta.env.VITE_OWNER_URL}`
const TENANT_API_URL = `${import.meta.env.VITE_API_URL}`

const isCreate = ref(true)
const mainTenantFirstname = ref('')
const apartmentSharing = ref(null)

function subscribe() {
  if (keycloakTenant.authenticated) {
    const kcToken = keycloakTenant.token
    const reqInstance = axios.create({
      headers: {
        Authorization: `Bearer ${kcToken}`
      }
    })
    reqInstance
      .get(`${TENANT_API_URL}/dfc/tenant/profile`)
      .then((profile) => {
        apartmentSharing.value = profile.data.apartmentSharing
        PropertyService.subscribe(kcToken!, token.value)
          .then(() => {
            showSuccess.value = true
          })
          .catch(() => {
            const createTenant = profile.data.apartmentSharing.tenants.find(
              (tenant: any) => tenant.tenantType === 'CREATE'
            )
            mainTenantFirstname.value = createTenant.firstName
            isCreate.value = createTenant.id === profile.data.connectedTenantId
            showError.value = true
          })
      })
      .catch(() => {
        showError.value = true
      })
  }
}

onMounted(() => {
  keycloakTenant
    .init({ onLoad: 'check-sso', checkLoginIframe: false })
    .then((auth) => {
      if (auth) {
        subscribe()
      } else {
        keycloakTenant.login({ redirectUri: OWNER_URL + route.fullPath })
      }
    })
    .catch(() => {
      window.location.reload()
    })
})
</script>

<style scoped lang="scss">
@import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';

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
.fr-callout {
  background-color: white;
}
.fr-callout__title {
  font-size: 1.25rem;
}
.fr-callout__text {
  font-size: 1rem;
}
.fr-callout.success {
  background-image: linear-gradient(0deg, var(--success), var(--success));
}
.fr-callout.success:before {
  color: var(--success);
}
.fr-callout.error {
  background-image: linear-gradient(0deg, var(--red-marianne-425-625), var(--red-marianne-425-625));
}
.fr-callout.error:before {
  color: var(--red-marianne-425-625);
}
.fr-callout.neutral {
  background-image: linear-gradient(0deg, var(--blue-france-main-525), var(--blue-france-main-525));
}
.fr-callout.neutral:before {
  color: var(--blue-france-main-525);
}
</style>
