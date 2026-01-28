<template>
  <div v-if="show" class="fr-consent-banner">
    <h2 class="fr-h6">{{ t('title') }}</h2>
    <div class="fr-consent-banner__content">
      <p class="fr-text--sm" v-html="t('desc', [`${MAIN_URL}/politique-de-confidentialite`])" />
    </div>
    <ul
      class="fr-consent-banner__buttons fr-btns-group fr-btns-group--right fr-btns-group--inline-sm"
    >
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
      <li>
        <button type="button" class="fr-btn" :title="t('reject-all-title')" @click="rejectAll">
          {{ t('reject-all') }}
        </button>
      </li>
      <li>
        <button type="button" class="fr-btn" :title="t('accept-all-title')" @click="acceptAll">
          {{ t('accept-all') }}
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
    "desc": "DossierFacile use cookies to improve its website and enable you to use certain services.<br> You can change your choice at any time by clicking on the <button type=\"button\" data-fr-opened=\"false\" aria-controls=\"fr-consent-modal\" class=\"btn-link\">Cookie management</button> link at the bottom of any page on the site.",
    "accept-all": "Accept all",
    "accept-all-title": "Accept all cookies",
    "reject-all": "Reject all",
    "reject-all-title": "Reject all cookies",
    "customize": "Customize",
    "customize-title": "Customize cookies"
  },
  "fr": {
    "title": "À propos des cookies sur DossierFacile",
    "desc": "DossierFacile utilise des cookies pour améliorer son site internet et vous permettre d'utiliser certains services.<br> Vous pouvez changer votre choix à tout moment en cliquant sur le lien <button type=\"button\" data-fr-opened=\"false\" aria-controls=\"fr-consent-modal\" class=\"btn-link\">Gestion des cookies</button> qui se trouve en bas de chaque page du site.",
    "accept-all": "Tout accepter",
    "accept-all-title": "Autoriser tous les cookies",
    "reject-all": "Tout refuser",
    "reject-all-title": "Refuser tous les cookies",
    "customize": "Personnaliser",
    "customize-title": "Personnaliser les cookies"
  }
}
</i18n>
