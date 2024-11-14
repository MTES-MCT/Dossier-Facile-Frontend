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
                Fermer
              </button>
            </div>
            <div class="fr-modal__content">
              <h1 id="fr-consent-modal-title" class="fr-modal__title">
                Panneau de gestion des cookies
              </h1>
              <div class="fr-consent-manager">
                <!-- Finalités -->
                <div class="fr-consent-service fr-consent-manager__header">
                  <fieldset class="fr-fieldset fr-fieldset--inline">
                    <legend id="finality-legend" class="fr-consent-service__title">
                      Préférences pour tous les services. <br />
                      <a :href="`${MAIN_URL}/politique-de-confidentialite`"
                        >Données personnelles et cookies</a
                      >
                    </legend>
                    <div class="fr-consent-service__radios">
                      <div class="fr-btns-group fr-btns-group--inline fr-btns-group--right">
                        <button
                          type="button"
                          id="consent-service__tout-accepter"
                          title="Tout accepter"
                          class="fr-btn"
                          aria-controls="fr-consent-modal"
                          @click="acceptAll"
                        >
                          Tout accepter
                        </button>
                        <button
                          type="button"
                          id="consent-service__tout-refuser"
                          title="Tout refuser"
                          class="fr-btn fr-btn--secondary"
                          aria-controls="fr-consent-modal"
                          @click="rejectAll"
                        >
                          Tout refuser
                        </button>
                      </div>
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
                      Cookies obligatoires
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
                      Ce site utilise des cookies nécessaires à son bon fonctionnement qui ne
                      peuvent pas être désactivés.
                    </p>
                  </fieldset>
                </div>
                <div class="fr-consent-service">
                  <fieldset
                    aria-labelledby="finality-1-legend finality-1-desc"
                    role="group"
                    class="fr-fieldset fr-fieldset--inline"
                  >
                    <legend id="finality-1-legend" class="fr-consent-service__title">Crisp</legend>
                    <div class="fr-consent-service__radios">
                      <div class="fr-radio-group">
                        <input
                          v-model="crispChoice"
                          type="radio"
                          id="consent-finality-1-accept"
                          name="consent-finality-1"
                          :value="true"
                        />
                        <label class="fr-label" for="consent-finality-1-accept"> Accepter </label>
                      </div>
                      <div class="fr-radio-group">
                        <input
                          v-model="crispChoice"
                          type="radio"
                          id="consent-finality-1-refuse"
                          name="consent-finality-1"
                          :value="false"
                        />
                        <label class="fr-label" for="consent-finality-1-refuse"> Refuser </label>
                      </div>
                    </div>
                    <p id="finality-1-desc" class="fr-consent-service__desc">
                      Ce service peut déposer 2 cookies.
                    </p>
                  </fieldset>
                </div>
                <div class="fr-consent-service">
                  <fieldset
                    aria-labelledby="finality-2-legend finality-2-desc"
                    role="group"
                    class="fr-fieldset fr-fieldset--inline"
                  >
                    <legend id="finality-2-legend" class="fr-consent-service__title">Matomo</legend>
                    <div class="fr-consent-service__radios">
                      <div class="fr-radio-group">
                        <input
                          v-model="matomoChoice"
                          type="radio"
                          id="consent-finality-2-accept"
                          name="consent-finality-2"
                          :value="true"
                        />
                        <label class="fr-label" for="consent-finality-2-accept"> Accepter </label>
                      </div>
                      <div class="fr-radio-group">
                        <input
                          v-model="matomoChoice"
                          type="radio"
                          id="consent-finality-2-refuse"
                          name="consent-finality-2"
                          :value="false"
                        />
                        <label class="fr-label" for="consent-finality-2-refuse"> Refuser </label>
                      </div>
                    </div>
                    <p id="finality-2-desc" class="fr-consent-service__desc">
                      Ce service peut déposer 8 cookies.
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
                      Confirmer mes choix
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

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`

const initialValues = Consent.getAll()

const emit = defineEmits<{ choiceMade: [] }>()

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
