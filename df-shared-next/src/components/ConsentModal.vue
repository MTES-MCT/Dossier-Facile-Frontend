<template>
  <dialog
    id="fr-consent-modal"
    class="fr-modal"
    role="dialog"
    aria-labelledby="fr-consent-modal-title"
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
                title="Fermer"
              >
                {{ t('close') }}
              </button>
            </div>
            <div class="fr-modal__content">
              <h1 id="fr-consent-modal-title" class="fr-modal__title">
                {{ t('title') }}
              </h1>
              <div class="fr-consent-manager">
                <!-- Finalités -->
                <div class="fr-consent-manager__header">
                  <fieldset class="fr-fieldset fieldset-all" aria-labelledby="finality-legend">
                    <div
                      id="finality-legend"
                      v-html="t('legend', [`${MAIN_URL}/politique-de-confidentialite`])"
                    />
                    <div class="fr-btns-group--inline fr-ml-auto">
                      <button
                        type="button"
                        id="consent-service__tout-accepter"
                        class="fr-btn"
                        aria-controls="fr-consent-modal"
                        @click="acceptAll"
                      >
                        {{ t('accept-all') }}
                      </button>
                      <button
                        type="button"
                        id="consent-service__tout-refuser"
                        class="fr-btn fr-btn--secondary"
                        aria-controls="fr-consent-modal"
                        @click="rejectAll"
                      >
                        {{ t('reject-all') }}
                      </button>
                    </div>
                  </fieldset>
                </div>
                <div class="fr-consent-service">
                  <fieldset
                    aria-labelledby="finality-0-legend finality-0-desc"
                    role="group"
                    class="fr-fieldset fr-fieldset--inline"
                  >
                    <legend id="finality-0-legend" class="fr-consent-service__title">
                      {{ t('mandatory-cookies') }}
                    </legend>
                    <div class="fr-consent-service__radios">
                      <div class="fr-radio-group">
                        <input
                          checked
                          disabled
                          type="radio"
                          id="consent-finality-0-accept"
                          name="consent-finality-0"
                        />
                        <label class="fr-label" for="consent-finality-0-accept">
                          {{ t('accept') }}
                        </label>
                      </div>
                      <div class="fr-radio-group">
                        <input
                          disabled
                          type="radio"
                          id="consent-finality-0-refuse"
                          name="consent-finality-0"
                        />
                        <label class="fr-label" for="consent-finality-0-refuse">
                          {{ t('reject') }}
                        </label>
                      </div>
                    </div>
                    <p id="finality-0-desc" class="fr-consent-service__desc">
                      {{ t('mandatory-cookies-desc') }}
                    </p>
                  </fieldset>
                </div>
                <div class="fr-consent-service">
                  <fieldset
                    aria-labelledby="finality-1-legend finality-1-desc"
                    role="group"
                    class="fr-fieldset fr-fieldset--inline"
                  >
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
                  <fieldset
                    aria-labelledby="finality-2-legend finality-2-desc"
                    role="group"
                    class="fr-fieldset fr-fieldset--inline"
                  >
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
                <!-- Bouton de confirmation/fermeture -->
                <ul
                  class="fr-consent-manager__buttons fr-btns-group fr-btns-group--right fr-btns-group--inline-sm"
                >
                  <li>
                    <button
                      type="button"
                      class="fr-btn"
                      aria-controls="fr-consent-modal"
                      @click="confirm"
                    >
                      {{ t('confirm-choices') }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as Consent from '../services/ConsentService'
import { useI18n } from 'vue-i18n'

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`

const initialValues = Consent.getAll()

const emit = defineEmits<{ choiceMade: [] }>()

const { t } = useI18n()
const crispChoice = ref(initialValues?.crisp ?? true)
const matomoChoice = ref(initialValues?.matomo ?? true)

const acceptAll = () => {
  crispChoice.value = true
  matomoChoice.value = true
  Consent.acceptAll()
  emit('choiceMade')
}

const rejectAll = () => {
  crispChoice.value = false
  matomoChoice.value = false
  Consent.rejectAll()
  emit('choiceMade')
}

const confirm = () => {
  Consent.accept({ crisp: crispChoice.value, matomo: matomoChoice.value })
  emit('choiceMade')
}
</script>

<style scoped>
#finality-legend {
  font-size: 0.875rem;
}
.fieldset-all {
  align-items: center;
  gap: 1rem;
  padding: 0 0 1.5rem 0;
  margin: 0;
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
    "reject-all": "Reject all",
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
    "accept-all": "Tout accepter",
    "reject-all": "Tout refuser",
    "mandatory-cookies": "Cookies obligatoires",
    "mandatory-cookies-desc": "Ce site utilise des cookies nécessaires à son bon fonctionnement qui ne peuvent pas être désactivés.",
    "confirm-choices": "Confirmer vos choix",
    "legend": "Voir la <a href={0}>politique de confidentialité</a> de DossierFacile <br> <strong>Préférences pour tous les services :</strong>",
    "crisp-desc": "DossierFacile utilise Crisp pour tchatter avec ses utilisateurs. Si vous refusez ces cookies, vous ne pourrez pas tchatter avec DossierFacile.",
    "matomo-desc": "DossierFacile utilise Matomo pour analyser son audience et améliorer son site internet. Matomo est un outil open-source recommandé par la CNIL."
  }
}
</i18n>
