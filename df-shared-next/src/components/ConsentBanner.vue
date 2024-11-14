<template>
  <div v-if="show" class="fr-consent-banner">
    <h2 class="fr-h6">{{ t('title') }}</h2>
    <div class="fr-consent-banner__content">
      <p class="fr-text--sm" v-html="t('desc', [`${MAIN_URL}/politique-de-confidentialite`])" />
    </div>
    <ul
      class="fr-consent-banner__buttons fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-sm"
    >
      <li>
        <button type="button" class="fr-btn" :title="t('accept-all-title')" @click="acceptAll">
          {{ t('accept-all') }}
        </button>
      </li>
      <li>
        <button type="button" class="fr-btn" :title="t('reject-all-title')" @click="rejectAll">
          {{ t('reject-all') }}
        </button>
      </li>
      <li>
        <button
          type="button"
          class="fr-btn fr-btn--secondary"
          data-fr-opened="false"
          aria-controls="fr-consent-modal"
          :title="t('customize-title')"
        >
          {{ t('customize') }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import * as Consent from '../services/ConsentService'
import { useI18n } from 'vue-i18n'

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`

defineProps<{ show: boolean }>()
const emit = defineEmits<{ choiceMade: [] }>()

const { t } = useI18n()

const acceptAll = () => {
  Consent.acceptAll()
  emit('choiceMade')
}

const rejectAll = () => {
  Consent.rejectAll()
  emit('choiceMade')
}
</script>

<i18n>
{
  "en": {
    "title": "About cookies on DossierFacile",
    "desc": "Welcome! We use cookies to improve your experience and the services available on this site. To find out more, visit our <a href={0}>privacy policy</a>. You can, at any time, control which cookies you wish to enable.",
    "accept-all": "Accept all",
    "accept-all-title": "Accept all cookies",
    "reject-all": "Reject all",
    "reject-all-title": "Reject all cookies",
    "customize": "Customize",
    "customize-title": "Customize cookies"
  },
  "fr": {
    "title": "À propos des cookies sur DossierFacile",
    "desc": "Bienvenue ! Nous utilisons des cookies pour améliorer votre expérience et les services disponibles sur ce site. Pour en savoir plus, visitez la <a href={0}>politique de confidentialité</a>. Vous pouvez, à tout moment, avoir le contrôle sur les cookies que vous souhaitez activer.",
    "accept-all": "Tout accepter",
    "accept-all-title": "Autoriser tous les cookies",
    "reject-all": "Tout refuser",
    "reject-all-title": "Refuser tous les cookies",
    "customize": "Personnaliser",
    "customize-title": "Personnaliser les cookies"
  }
}
</i18n>
