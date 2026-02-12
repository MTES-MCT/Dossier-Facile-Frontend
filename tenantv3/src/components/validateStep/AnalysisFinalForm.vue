<template>
  <form @submit.prevent="submit">
    <NakedCard class="fr-mt-3w">
      <h1 class="fr-h6">{{ t('title') }}</h1>
      <p>{{ t('description') }}</p>

      <div class="fr-input-group">
        <textarea
          id="message"
          v-model="message"
          class="fr-input"
          name="message"
          rows="1"
          maxlength="2000"
        ></textarea>
      </div>
    </NakedCard>
    <div class="fr-mt-3w">
      <div class="fr-checkbox-group">
        <input id="honor" v-model="honorDeclaration" type="checkbox" name="honor" />
        <label class="fr-label" for="honor">
          {{ t('honor-declaration') }}
        </label>
      </div>

      <div v-if="hasToDisplayConsentDeclaration" class="fr-checkbox-group fr-mt-2w">
        <input id="consent" v-model="consentDeclaration" type="checkbox" name="consent" />
        <label class="fr-label" for="consent">
          {{ t('consent-declaration') }}
        </label>
      </div>

      <div class="fr-grid-row fr-grid-row--right fr-mt-2w">
        <button ref="submitButton" class="fr-btn" type="submit" :disabled="!isValid">
          {{ t('send-files') }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant-store'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading } from 'vue-loading-overlay'
import { useRouter } from 'vue-router'
import { toast } from '@/components/toast/toastUtils'

const { t } = useI18n()

const store = useTenantStore()
const router = useRouter()

const message = ref('')
const honorDeclaration = ref(false)
const consentDeclaration = ref(false)
const submitButton = useTemplateRef('submitButton')

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

const submit = () => {
  if (!isValid.value) {
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

<style scoped lang="scss"></style>

<i18n>
{
  "en": {
    "title": "Message for the owner",
    "description": "You can add a message for your future landlords. It will be displayed at the beginning of your file.",
    "honor-declaration": "I declare on my honor the accuracy of this information (Article 441-1 of the Penal Code: 3 years imprisonment and €45,000 fine).",
    "consent-declaration": "I declare that I have obtained the consent of the persons mentioned in my file (spouse, roommates, guarantors).",
    "send-files": "Submit my application"
  },
  "fr": {
    "title": "Message pour le propriétaire",
    "description": "Vous pouvez ajouter un message à destination de vos futurs propriétaires. Il sera affiché au début de votre dossier.",
    "honor-declaration": "Je déclare sur l'honneur l'exactitude de ces informations (article 441-1 du code pénal : 3 ans d'emprisonnement et 45 000 € d'amende).",
    "consent-declaration": "Je déclare avoir obtenu le consentement des personnes mentionnées dans mon dossier (conjoint, colocataires, garants).",
    "send-files": "Soumettre mon dossier"
  }
}
</i18n>
