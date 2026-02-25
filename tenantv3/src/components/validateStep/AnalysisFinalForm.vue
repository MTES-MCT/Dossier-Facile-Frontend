<template>
  <NakedCard class="fr-mt-3w">
    <h1 class="fr-h6">{{ t('title') }}</h1>
    <p>{{ t('description') }}</p>
    <form novalidate @submit.prevent="submit">
      <div class="fr-input-group" :class="{ 'fr-input-group--error': !isMessageValid }">
        <label for="message" class="fr-label">{{ t('label') }}</label>
        <textarea
          id="message"
          v-model="message"
          class="fr-input"
          name="message"
          rows="1"
          maxlength="2000"
          aria-describedby="message-desc message-error"
        />
        <p id="message-desc" class="fr-my-1w">{{ message.length }}/2000</p>
        <p
          v-if="!isMessageValid && showError"
          id="message-error"
          aria-live="assertive"
          class="fr-error-text"
        >
          {{ t('error-message') }}
        </p>
      </div>
      <DsfrCheckboxSet>
        <template #legend>
          <span class="fr-sr-only">Exactitude et consentement.</span>
        </template>
        <DsfrCheckbox
          id="input-honor"
          v-model="honorDeclaration"
          :label="t('honor-declaration')"
          name="honor"
          value=""
          required
          :error-message="!honorDeclaration && showError ? t('error-honor') : undefined"
        >
          <template #required-tip>&nbsp;</template>
        </DsfrCheckbox>

        <DsfrCheckbox
          v-if="hasToDisplayConsentDeclaration"
          id="input-consent"
          v-model="consentDeclaration"
          class="fr-mt-2w"
          :label="t('consent-declaration')"
          name="consent"
          value=""
          required
          :error-message="!consentDeclaration && showError ? t('error-consent') : undefined"
        >
          <template #required-tip>&nbsp;</template>
        </DsfrCheckbox>
      </DsfrCheckboxSet>
      <div class="fr-grid-row fr-grid-row--right fr-mt-2w">
        <button ref="submitButton" class="fr-btn" type="submit">
          {{ t('send-files') }}
        </button>
      </div>
    </form>
  </NakedCard>
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading } from 'vue-loading-overlay'
import { useRouter } from 'vue-router'
import { toast } from '@/components/toast/toastUtils'
import { DsfrCheckbox, DsfrCheckboxSet } from '@gouvminint/vue-dsfr'

const { t } = useI18n()

const store = useTenantStore()
const router = useRouter()

const message = ref('')
const honorDeclaration = ref(false)
const consentDeclaration = ref(false)
const submitButton = useTemplateRef('submitButton')
const showError = ref(false)

onMounted(() => {
  if (store.user.honorDeclaration) {
    honorDeclaration.value = true
    consentDeclaration.value = true
  }
  message.value = store.user.clarification || ''
})

const isValid = computed(() => {
  if (hasToDisplayConsentDeclaration.value) {
    return honorDeclaration.value && consentDeclaration.value
  } else {
    return honorDeclaration.value
  }
})

const hasToDisplayConsentDeclaration = computed(() => {
  return store.user.applicationType !== 'ALONE' || store.user.guarantors.length > 0
})

const isMessageValid = computed(() => {
  if (message.value.length > 2000) {
    return false
  }
  return true
})

const submit = () => {
  if (!isValid.value || !isMessageValid.value) {
    showError.value = true
    return
  }

  if (
    honorDeclaration.value === store.user.honorDeclaration &&
    message.value === store.user.clarification
  ) {
    router.push('/account')
    return
  }

  const $loading = useLoading({})
  const loader = $loading.show()
  const params = {
    honorDeclaration: true,
    clarification: store.user.tenantType === 'CREATE' ? message.value : undefined
  }
  store
    .validateFile(params)
    .then(() => {
      return store.loadUser()
    })
    .then(() => {
      router.push('/account')
    })
    .catch(() => {
      toast.error(t('errors.submit-failed'), submitButton.value)
    })
    .finally(() => {
      loader.hide()
    })
}
</script>

<i18n lang="json">
{
  "en": {
    "title": "Message for the owner",
    "label": "Your message (optional)",
    "description": "You can add a message for your future landlords. It will be displayed at the beginning of your file.",
    "honor-declaration": "I declare on my honor the accuracy of these informations (Article 441-1 of the Penal Code: 3 years imprisonment and €45,000 fine).",
    "consent-declaration": "I declare that I have obtained the consent of the persons mentioned in my file (spouse, roommates, guarantors).",
    "send-files": "Submit my application",
    "error-message": "Your message is over the caracter limit of 2000.",
    "error-honor": "Please certify the accuracy of these informations.",
    "error-consent": "Please confirm that you have obtained consent."
  },
  "fr": {
    "title": "Message pour le propriétaire",
    "label": "Votre message (facultatif)",
    "description": "Vous pouvez ajouter un message à destination de vos futurs propriétaires. Il sera affiché au début de votre dossier.",
    "honor-declaration": "Je déclare sur l'honneur l'exactitude de ces informations (article 441-1 du code pénal : 3 ans d'emprisonnement et 45 000 € d'amende).",
    "consent-declaration": "Je déclare avoir obtenu le consentement des personnes mentionnées dans mon dossier (conjoint, colocataires, garants).",
    "send-files": "Soumettre mon dossier",
    "error-message": "Votre message dépasse la limite de 2000 caractères.",
    "error-honor": "Veuillez certifier l'exactitude de ces informations.",
    "error-consent": "Veuillez confirmer avoir obtenu le consentement."
  }
}
</i18n>
