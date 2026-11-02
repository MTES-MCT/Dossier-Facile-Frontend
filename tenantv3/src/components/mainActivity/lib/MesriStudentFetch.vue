<template>
  <div v-if="enabled" class="fr-callout fr-mb-3w" data-testid="mesri-student-fetch">
    <h3 class="fr-callout__title fr-h6">{{ t('title') }}</h3>
    <p class="fr-callout__text">{{ t('text') }}</p>
    <DsfrAlert
      v-if="state === 'success'"
      type="success"
      small
      class="fr-mb-2w"
      :description="t('success')"
      data-testid="mesri-success"
    />
    <DsfrAlert
      v-else-if="state === 'error'"
      type="error"
      small
      class="fr-mb-2w"
      :description="t('errors.' + errorKey)"
      data-testid="mesri-error"
    />
    <button
      type="button"
      class="fr-btn fr-btn--icon-left fr-icon-refresh-line"
      :disabled="state === 'loading'"
      data-testid="mesri-button"
      @click="startFranceConnect"
    >
      {{ buttonLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { DsfrAlert } from '@gouvminint/vue-dsfr'
import axios from 'axios'
import { keycloak } from '@/plugin/keycloak'
import { RegisterService } from '@/services/RegisterService'
import { useTenantStore } from '@/stores/tenant-store'

// POC "statut étudiant à la source": re-login through FranceConnect to get a fresh token (it lives ~60 s),
// then ask the backend to fetch the MESR student status and add it as the STUDENT document.
const QUERY_FLAG = 'mesri'
type State = 'idle' | 'loading' | 'success' | 'error'
type ErrorKey = 'not-eligible' | 'not-found' | 'token-expired' | 'no-admission' | 'generic'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useTenantStore()

const state = ref<State>('idle')
const errorKey = ref<ErrorKey>('generic')

// Eligibility (feature flag, FranceConnect, ALONE application) is computed by the API, so the
// button only shows when the call would be accepted
const enabled = computed(() => store.user.mesriStudentEligible === true)

const buttonLabel = computed(() => {
  if (state.value === 'loading') return t('loading')
  if (state.value === 'error' && errorKey.value === 'token-expired') return t('retry')
  return t('button')
})

function startFranceConnect() {
  // prompt=login forces Keycloak to go through FranceConnect again even if the SSO session is
  // still valid: without it Keycloak answers from its session and the stored FC token stays stale.
  keycloak.login({
    idpHint: 'oidc',
    prompt: 'login',
    redirectUri: `${import.meta.env.VITE_FULL_TENANT_URL}${route.path}?${QUERY_FLAG}=1`
  })
}

function toErrorKey(error: unknown): ErrorKey {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined
  switch (status) {
    case 403:
      return 'not-eligible'
    case 404:
      return 'not-found'
    case 409:
      return 'token-expired'
    case 422:
      return 'no-admission'
    default:
      return 'generic'
  }
}

async function fetchStudentStatus() {
  state.value = 'loading'
  try {
    const response = await RegisterService.fetchMesriStudentStatus()
    store.loadUserCommit(response.data)
    state.value = 'success'
  } catch (error) {
    errorKey.value = toErrorKey(error)
    state.value = 'error'
  }
}

onMounted(() => {
  if (route.query[QUERY_FLAG] !== '1') return
  const query = { ...route.query }
  delete query[QUERY_FLAG]
  router.replace({ path: route.path, query })
  if (enabled.value) fetchStudentStatus()
})
</script>

<i18n>
{
  "en": {
    "title": "Retrieve your student status automatically",
    "text": "With your FranceConnect account, DossierFacile can retrieve your enrolment directly from the Ministry of Higher Education and add it to your file. You can still upload a document yourself.",
    "button": "Retrieve my student status via FranceConnect",
    "retry": "Try again via FranceConnect",
    "loading": "Retrieving your student status…",
    "success": "Your student status has been added below. Check it before continuing.",
    "errors": {
      "not-eligible": "This feature is not available for your file.",
      "not-found": "No enrolment was found for you. Please upload a document.",
      "token-expired": "Your FranceConnect session has expired. Please try again.",
      "no-admission": "The Ministry returned no admission for you. Please upload a document.",
      "generic": "The retrieval failed. Please try again later or upload a document."
    }
  },
  "fr": {
    "title": "Récupérer votre statut étudiant automatiquement",
    "text": "Grâce à votre compte FranceConnect, DossierFacile peut récupérer votre inscription directement auprès du ministère de l’Enseignement supérieur et l’ajouter à votre dossier. Vous pouvez toujours déposer un document vous-même.",
    "button": "Récupérer mon statut étudiant via FranceConnect",
    "retry": "Réessayer via FranceConnect",
    "loading": "Récupération de votre statut étudiant…",
    "success": "Votre statut étudiant a été ajouté ci-dessous. Vérifiez-le avant de continuer.",
    "errors": {
      "not-eligible": "Cette fonctionnalité n’est pas disponible pour votre dossier.",
      "not-found": "Aucune inscription n’a été trouvée à votre nom. Déposez un justificatif.",
      "token-expired": "Votre session FranceConnect a expiré. Réessayez.",
      "no-admission": "Le ministère n’a renvoyé aucune admission à votre nom. Déposez un justificatif.",
      "generic": "La récupération a échoué. Réessayez plus tard ou déposez un justificatif."
    }
  }
}
</i18n>
