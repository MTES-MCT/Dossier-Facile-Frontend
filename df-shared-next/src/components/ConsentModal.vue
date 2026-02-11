<template>
  <dialog
    id="fr-consent-modal"
    ref="dialogRef"
    class="fr-modal"
    role="dialog"
    aria-labelledby="fr-consent-modal-title"
    @cancel="modalStore.closeModal"
  >
    <div class="fr-container fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-sm-10">
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              <button
                type="button"
                class="fr-btn--close fr-btn"
                aria-controls="fr-consent-modal"
                @click="modalStore.closeModal"
              >
                {{ t('close') }}
              </button>
            </div>
            <div class="fr-modal__content">
              <h1 id="fr-consent-modal-title" class="fr-modal__title">
                {{ t('title') }}
              </h1>

              <!-- Finalités -->
              <header class="fr-consent-service fr-consent-manager__header">
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
              <div class="fr-consent-service">
                <fieldset aria-labelledby="finality-0-legend finality-0-desc" class="fr-fieldset">
                  <legend id="finality-0-legend" class="fr-consent-service__title">
                    {{ t('mandatory-cookies') }}
                  </legend>
                  <div class="fr-consent-service__radios">
                    <div class="fr-radio-group">
                      <input
                        checked
                        type="radio"
                        id="consent-finality-0-accept"
                        name="consent-finality-0"
                      />
                      <label class="fr-label" for="consent-finality-0-accept"> Accepter </label>
                    </div>
                    <div class="fr-radio-group">
                      <input
                        disabled
                        type="radio"
                        id="consent-finality-0-refuse"
                        name="consent-finality-0"
                      />
                      <label class="fr-label" for="consent-finality-0-refuse"> Refuser </label>
                    </div>
                  </div>
                  <p id="finality-0-desc" class="fr-consent-service__desc">
                    {{ t('mandatory-cookies-desc') }}
                  </p>
                </fieldset>
              </div>
              <div class="fr-consent-service">
                <fieldset aria-labelledby="finality-1-legend finality-1-desc" class="fr-fieldset">
                  <legend id="finality-1-legend" class="fr-consent-service__title">
                    Crisp <span class="fr-text--regular fr-text--sm">(2 cookies)</span>
                  </legend>
                  <div class="fr-consent-service__radios">
                    <div class="fr-radio-group">
                      <input
                        v-model="crispChoice"
                        type="radio"
                        id="consent-finality-1-accept"
                        name="consent-finality-1"
                        :value="true"
                      />
                      <label class="fr-label" for="consent-finality-1-accept">
                        {{ t('accept') }}
                      </label>
                    </div>
                    <div class="fr-radio-group">
                      <input
                        v-model="crispChoice"
                        type="radio"
                        id="consent-finality-1-refuse"
                        name="consent-finality-1"
                        :value="false"
                      />
                      <label class="fr-label" for="consent-finality-1-refuse">
                        {{ t('reject') }}
                      </label>
                    </div>
                  </div>
                  <p id="finality-1-desc" class="fr-consent-service__desc">
                    {{ t('crisp-desc') }}
                  </p>
                </fieldset>
              </div>
              <div class="fr-consent-service">
                <fieldset aria-labelledby="finality-2-legend finality-2-desc" class="fr-fieldset">
                  <legend id="finality-2-legend" class="fr-consent-service__title">
                    Matomo <span class="fr-text--regular fr-text--sm">(8 cookies)</span>
                  </legend>
                  <div class="fr-consent-service__radios">
                    <div class="fr-radio-group">
                      <input
                        v-model="matomoChoice"
                        type="radio"
                        id="consent-finality-2-accept"
                        name="consent-finality-2"
                        :value="true"
                      />
                      <label class="fr-label" for="consent-finality-2-accept">
                        {{ t('accept') }}
                      </label>
                    </div>
                    <div class="fr-radio-group">
                      <input
                        v-model="matomoChoice"
                        type="radio"
                        id="consent-finality-2-refuse"
                        name="consent-finality-2"
                        :value="false"
                      />
                      <label class="fr-label" for="consent-finality-2-refuse">
                        {{ t('reject') }}
                      </label>
                    </div>
                  </div>
                  <p id="finality-2-desc" class="fr-consent-service__desc">
                    {{ t('matomo-desc') }}
                  </p>
                </fieldset>
              </div>
              <footer>
                <DsfrButton
                  :label="t('confirm-choices')"
                  class="fr-col-12 fr-col-sm-5 fr-grid-row--center"
                  size="large"
                  aria-controls="fr-consent-modal"
                  @click="confirm"
                />
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
import { DsfrButton } from '@gouvminint/vue-dsfr'

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`

const initialValues = Consent.getAll()

const emit = defineEmits<{ choiceMade: [] }>()

const { t } = useI18n()
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
}

const rejectAll = () => {
  crispChoice.value = false
  matomoChoice.value = false
}

const confirm = () => {
  Consent.accept({ crisp: crispChoice.value, matomo: matomoChoice.value })
  emit('choiceMade')
  modalStore.closeModal()
}
</script>

<style scoped>
.fr-modal {
  margin: revert;
  font-size: 0.875rem;
  width: revert;
  height: revert;
  max-inline-size: 100%;
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
footer {
  display: flex;
  justify-content: end;
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
