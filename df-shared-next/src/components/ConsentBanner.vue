<template>
  <div v-if="show" class="fr-consent-banner">
    <h2 class="fr-h6">À propos des cookies sur DossierFacile</h2>
    <div class="fr-consent-banner__content">
      <p class="fr-text--sm">
        Bienvenue ! Nous utilisons des cookies pour améliorer votre expérience et les services
        disponibles sur ce site. Pour en savoir plus, visitez la
        <a :href="`${MAIN_URL}/politique-de-confidentialite`">politique de confidentialité</a>. Vous
        pouvez, à tout moment, avoir le contrôle sur les cookies que vous souhaitez activer.
      </p>
    </div>
    <ul
      class="fr-consent-banner__buttons fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-sm"
    >
      <li>
        <button type="button" class="fr-btn" title="Autoriser tous les cookies" @click="acceptAll">
          Tout accepter
        </button>
      </li>
      <li>
        <button type="button" class="fr-btn" title="Refuser tous les cookies" @click="refuseAll">
          Tout refuser
        </button>
      </li>
      <li>
        <button
          type="button"
          class="fr-btn fr-btn--secondary"
          data-fr-opened="false"
          aria-controls="fr-consent-modal"
          title="Personnaliser les cookies"
        >
          Personnaliser
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import * as Consent from '../services/ConsentService'

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`

defineProps<{ show: boolean }>()
const emit = defineEmits<{ choiceMade: [] }>()

const acceptAll = () => {
  Consent.acceptAll()
  emit('choiceMade')
}

const refuseAll = () => {
  Consent.rejectAll()
  emit('choiceMade')
}
</script>
