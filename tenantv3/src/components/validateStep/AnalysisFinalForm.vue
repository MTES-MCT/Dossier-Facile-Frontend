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

      <div class="fr-checkbox-group fr-mt-2w">
        <input id="consent" v-model="consentDeclaration" type="checkbox" name="consent" />
        <label class="fr-label" for="consent">
          {{ t('consent-declaration') }}
        </label>
      </div>

      <div class="fr-grid-row fr-grid-row--right fr-mt-2w">
        <button class="fr-btn" type="submit" :disabled="!isValid">
          {{ t('send-files') }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { computed, ref } from 'vue'

const { t } = useI18n()

const message = ref('')
const honorDeclaration = ref(false)
const consentDeclaration = ref(false)

const isValid = computed(() => honorDeclaration.value && consentDeclaration.value)

const submit = () => {
  // TODO: Implement submit logic
  console.log('Submitting', {
    message: message.value,
    honor: honorDeclaration.value,
    consent: consentDeclaration.value
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
