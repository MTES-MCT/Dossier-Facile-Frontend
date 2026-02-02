<template>
  <div v-if="show" class="fr-consent-banner">
    <h2 class="fr-h6">{{ t('title') }}</h2>
    <div class="fr-consent-banner__content">
      <p class="fr-text--sm" v-html="t('desc', [`${MAIN_URL}/politique-de-confidentialite`])" />
    </div>
    <DsfrButtonGroup
      :buttons="consentButtons"
      inline-layout-when="md"
      align="right"
      class="fr-consent-banner__buttons"
    />
  </div>
</template>

<script setup lang="ts">
import * as Consent from '../services/ConsentService'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '../stores/useModalStore'
import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'
// can't use DsfrConsent because of reverse order on buttons, which invalidates RGAA 12.8.1 (plus it's completely broken)
import { DsfrButtonGroup } from '@gouvminint/vue-dsfr'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`

defineProps<{ show: boolean }>()

const emit = defineEmits<{ choiceMade: [] }>()

const { t } = useI18n()

const modalStore = useModalStore()

const acceptAll = () => {
  Consent.acceptAll()
  emit('choiceMade')
}

const rejectAll = () => {
  Consent.rejectAll()
  emit('choiceMade')
}

const consentButtons: ComputedRef<DsfrButtonProps[]> = computed(() => [
  {
    title: t('customize-title'),
    label: t('customize'),
    secondary: true,
    'aria-controls': 'fr-consent-modal',
    onclick: () => {
      modalStore.openModal()
    }
  },
  {
    title: t('reject-all-title'),
    label: t('reject-all'),
    onclick: () => {
      rejectAll
    }
  },
  {
    title: t('accept-all-title'),
    label: t('accept-all'),
    onclick: () => {
      acceptAll
    }
  }
])
</script>

<i18n>
{
  "en": {
    "title": "About cookies on DossierFacile",
    "desc": "DossierFacile use cookies to improve its website and enable you to use certain services.<br>You can change your choice at any time by clicking on the <b>“Cookie management”</b> button at the bottom of any page on the site.",
    "accept-all": "Accept all",
    "accept-all-title": "Accept all cookies",
    "reject-all": "Reject all",
    "reject-all-title": "Reject all cookies",
    "customize": "Customize",
    "customize-title": "Customize cookies"
  },
  "fr": {
    "title": "À propos des cookies sur DossierFacile",
    "desc": "DossierFacile utilise des cookies pour améliorer son site internet et vous permettre d'utiliser certains services.<br>Vous pouvez changer votre choix à tout moment en cliquant sur le bouton <b>« Gestion des cookies »</b> qui se trouve en bas de chaque page du site.",
    "accept-all": "Tout accepter",
    "accept-all-title": "Autoriser tous les cookies",
    "reject-all": "Tout refuser",
    "reject-all-title": "Refuser tous les cookies",
    "customize": "Personnaliser",
    "customize-title": "Personnaliser les cookies"
  }
}
</i18n>
