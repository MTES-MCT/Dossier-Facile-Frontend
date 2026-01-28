<template>
  <dialog
    id="fr-consent-modal"
    ref="dialogRef"
    class="fr-modal"
    role="dialog"
    aria-labelledby="fr-consent-modal-title"
    @keydown.esc="modalStore.closeModal()"
  >
    <div class="fr-container fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-10 fr-col-lg-8">
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              <button
                type="button"
                class="fr-btn--close fr-btn"
                aria-controls="fr-consent-modal"
                @click="modalStore.closeModal()"
              >
                {{ t('close') }}
              </button>
            </div>
            <div class="fr-modal__content">
              <h1 id="fr-consent-modal-title" class="fr-modal__title">
                {{ t('title') }}
              </h1>

              <!-- Finalités -->
              <header class="fr-consent-manager__header fr-pb-2w">
                <p
                  id="finality-legend"
                  class="fr-m-0"
                  v-html="t('legend', [`${MAIN_URL}/politique-de-confidentialite`])"
                />

                <div class="choice-btn-group">
                  <DsfrButton
                    :label="t('accept-all')"
                    primary
                    :aria-label="t('accept-all-title')"
                    @click="acceptAll"
                  />
                  <DsfrButton
                    :label="t('reject-all')"
                    secondary
                    :aria-label="t('reject-all-title')"
                    @click="rejectAll"
                  />
                </div>
              </header>
              <fieldset
                aria-describedby="finality-0-desc"
                disabled
                class="fr-consent-service fr-fieldset"
              >
                <legend class="fr-consent-service__title">
                  {{ t('mandatory-cookies') }}
                </legend>
                <p id="finality-0-desc" class="fr-consent-service__desc">
                  {{ t('mandatory-cookies-desc') }}
                </p>
                <DsfrRadioButton
                  v-model="requiredChoice"
                  name="consent-finality-0"
                  :label="t('accept')"
                  :value="true"
                  :inline="true"
                  checked
                />
                <DsfrRadioButton
                  v-model="requiredChoice"
                  name="consent-finality-0"
                  :label="t('reject')"
                  :value="false"
                  :inline="true"
                />
              </fieldset>
              <fieldset aria-describedby="finality-0-desc" class="fr-consent-service fr-fieldset">
                <legend class="fr-consent-service__title">
                  Crisp <span class="fr-text--regular fr-text--sm">(2 cookies)</span>
                </legend>
                <p id="finality-1-desc" class="fr-consent-service__desc">
                  {{ t('crisp-desc') }}
                </p>
                <DsfrRadioButton
                  v-model="crispChoice"
                  name="consent-finality-1"
                  :label="t('accept')"
                  :value="true"
                  :inline="true"
                />
                <DsfrRadioButton
                  v-model="crispChoice"
                  name="consent-finality-1"
                  :label="t('reject')"
                  :value="false"
                  :inline="true"
                />
              </fieldset>
              <fieldset aria-describedby="finality-2-desc" class="fr-consent-service fr-fieldset">
                <legend class="fr-consent-service__title">
                  Matomo <span class="fr-text--regular fr-text--sm">(8 cookies)</span>
                </legend>
                <p id="finality-2-desc" class="fr-consent-service__desc">
                  {{ t('matomo-desc') }}
                </p>
                <DsfrRadioButton
                  v-model="matomoChoice"
                  name="consent-finality-2"
                  :label="t('accept')"
                  :value="true"
                  :inline="true"
                />
                <DsfrRadioButton
                  v-model="matomoChoice"
                  name="consent-finality-2"
                  :label="t('reject')"
                  :value="false"
                  :inline="true"
                />
              </fieldset>
              <!-- Bouton de confirmation/fermeture -->
              <footer>
                <button
                  type="button"
                  class="fr-btn large-btn"
                  aria-controls="fr-consent-modal"
                  @click="confirm"
                >
                  {{ t('confirm-choices') }}
                </button>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useModalStore } from '../stores/useModalStore'
import { ref, useTemplateRef } from 'vue'
import * as Consent from '../services/ConsentService'
import { useI18n } from 'vue-i18n'
import { DsfrButton, DsfrRadioButton } from '@gouvminint/vue-dsfr'

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`

const initialValues = Consent.getAll()

const emit = defineEmits<{ choiceMade: [] }>()

const { t } = useI18n()
const requiredChoice = true
const crispChoice = ref(initialValues?.crisp ?? true)
const matomoChoice = ref(initialValues?.matomo ?? true)

const modalStore = useModalStore()
const dialogRef = useTemplateRef('dialogRef')

modalStore.$subscribe(
  (_mutation, state) => {
    const dialog = dialogRef.value
    if (state.isOpen && !dialog?.open) {
      dialog?.showModal()
    }
    if (!state.isOpen && dialog?.open) {
      dialog?.close()
    }
  },
  { flush: 'sync' }
)

const acceptAll = () => {
  crispChoice.value = true
  matomoChoice.value = true
  // Consent.acceptAll()
  // emit('choiceMade')
}

const rejectAll = () => {
  crispChoice.value = false
  matomoChoice.value = false
  // Consent.rejectAll()
  // emit('choiceMade')
}

const confirm = () => {
  Consent.accept({ crisp: crispChoice.value, matomo: matomoChoice.value })
  emit('choiceMade')
  modalStore.closeModal()
}
</script>

<style scoped>
.fr-modal {
  --ground: 2000;
  padding: 0;
  font-size: 0.875rem;
  color: var(--text-default-grey);
  background-color: transparent;
  border: none;
  opacity: 0;
  transition:
    opacity 0.3s,
    visibility 0.3s;
  visibility: hidden;
  z-index: 1750;
}
.fr-modal[open] {
  opacity: 1;
  transition:
    opacity 0.3s,
    visibility 0.3s;
  visibility: visible;
}
.fr-modal::backdrop {
  background-color: hsla(0, 0%, 9%, 0.64);
}
.fr-consent-manager__header {
  display: flex;
  flex-flow: row wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}
header,
.choice-btn-group {
  display: flex;
  flex-flow: row wrap;
  gap: 1rem;
}
.fieldset-all {
  align-items: center;
  gap: 1rem;
  padding: 0 0 1.5rem 0;
  margin: 0;
}
footer {
  display: flex;
  justify-content: end;
}
.large-btn {
  justify-content: center;
  width: fit-content;
  flex-grow: 1;
  @media (min-width: 768px) {
    flex-grow: 0;
  }
}
</style>

<i18n>
{
  "en": {
    "close":"Close",
    "title": "Cookie management panel",
    "accept": "Accept",
    "reject": "Reject",
    "accept-all": "Accept all",
    "accept-all-title": "Accept all cookies",
    "reject-all": "Reject all",
    "reject-all-title": "Reject all cookies",
    "mandatory-cookies": "Mandatory cookies",
    "mandatory-cookies-desc": "This site uses cookies which are necessary for its proper operation and which cannot be deactivated.",
    "confirm-choices": "Confirm choices",
    "legend": "View DossierFacile's <a href={0}>privacy policy</a> <br> <strong>Settings for all services:</strong>",
    "crisp-desc": "DossierFacile uses Crisp to chat with its users. If you refuse these cookies, you will not be able to chat with DossierFacile.",
    "matomo-desc": "DossierFacile uses Matomo to analyze its audience and improve its website. Matomo is an open-source tool recommended by the CNIL."
  },
  "fr": {
    "close": "Fermer",
    "title": "Panneau de gestion des cookies",
    "accept": "Accepter",
    "reject": "Refuser",
    "accept-all": "Accepter tout",
    "accept-all-title": "Accepter tous les cookies",
    "reject-all": "Refuser tout",
    "reject-all-title": "Refuser tous les cookies",
    "mandatory-cookies": "Cookies obligatoires",
    "mandatory-cookies-desc": "Ce site utilise des cookies nécessaires à son bon fonctionnement qui ne peuvent pas être désactivés.",
    "confirm-choices": "Confirmer vos choix",
    "legend": "Voir la <a href={0}>politique de confidentialité</a> de DossierFacile <br> <strong>Préférences pour tous les services :</strong>",
    "crisp-desc": "DossierFacile utilise Crisp pour tchatter avec ses utilisateurs. Si vous refusez ces cookies, vous ne pourrez pas tchatter avec DossierFacile.",
    "matomo-desc": "DossierFacile utilise Matomo pour analyser son audience et améliorer son site internet. Matomo est un outil open-source recommandé par la CNIL."
  }
}
</i18n>
