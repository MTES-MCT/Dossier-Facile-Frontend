<template>
  <header role="banner" class="fr-header">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo">
                  République<br />
                  française
                </p>
              </div>
              <div class="fr-header__navbar">
                <button
                  class="fr-btn--menu fr-btn"
                  data-fr-opened="false"
                  aria-controls="modal-dc"
                  aria-haspopup="menu"
                  title="Menu"
                >
                  Menu
                </button>
              </div>
            </div>
            <div class="fr-header__service">
              <a :href="`${MAIN_URL}/`" title="Dossier Facile - Accueil">
                <p class="fr-header__service-title">
                  <span style="font-weight: normal">Dossier</span>Facile
                </p>
              </a>
              <p class="fr-header__service-tagline">Le dossier de location numérique de l'État</p>
            </div>
          </div>

          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-links-group">
                <li v-if="props?.loggedIn">
                  <v-gouv-fr-button :small="true" :primary="false" @click="onLogout">
                    <RiAccountCircleLine aria-hidden="true" />
                    {{ t('logout') }}
                  </v-gouv-fr-button>
                </li>
                <li v-if="!props?.loggedIn">
                  <DfButton :primary="true" size="small" @click="onLoginTenant">
                    <RiAccountCircleLine aria-hidden="true" />
                    {{ t('signin') }}
                  </DfButton>
                </li>
                <li v-if="!props?.loggedIn">
                  <DfButton size="small" @click="onCreateOwner">
                    <RiCommunityLine aria-hidden="true" />
                    {{ t('owner-header') }}
                  </DfButton>
                </li>
                <li v-if="!props?.loggedIn">
                  <DfButton size="small" @click="goToPartner">
                    <RiHomeHeartLine aria-hidden="true" />
                    {{ t('partner') }}
                  </DfButton>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Navigation principale -->
    <div id="modal-dc" class="fr-header__menu fr-modal">
      <div class="fr-container">
        <button class="fr-link--close fr-link" aria-controls="modal-dc">Fermer</button>
        <div class="fr-header__menu-links" style="display: none"></div>
        <div class="fr-header__menu-links-hack">
          <ul class="fr-links-group">
            <li v-if="props?.loggedIn">
              <DfButton class="fr-ml-3" :primary="false" size="small" @click="onLogout">
                <RiAccountCircleLine aria-hidden="true" />
                >{{ t('logout') }}
              </DfButton>
            </li>
            <li v-if="!props?.loggedIn">
              <DfButton
                id="signin-button"
                class="fr-ml-3"
                :primary="false"
                size="small"
                @click="onLoginTenant"
              >
                <RiAccountCircleLine aria-hidden="true" />
                {{ t('signin') }}
              </DfButton>
            </li>

            <li v-if="!props?.loggedIn">
              <DfButton size="small" class="fr-ml-3" @click="onCreateOwner">
                <RiCommunityLine aria-hidden="true" />
                {{ t('owner') }}
              </DfButton>
            </li>
            <li v-if="!props?.loggedIn">
              <DfButton size="small" @onclick="goToPartner">
                <RiHomeHeartLine aria-hidden="true" />
                {{ t('partner') }}
              </DfButton>
            </li>
          </ul>
        </div>
        <nav id="navigation-832" class="fr-nav" role="navigation" aria-label="Menu principal">
          <slot></slot>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RiAccountCircleLine, RiCommunityLine, RiHomeHeartLine } from '@remixicon/vue'
import DfButton from 'df-shared-next/src/Button/DfButton.vue'
import VGouvFrButton from 'df-shared-next/src/Button/VGouvFrButton.vue'
import { useI18n } from 'vue-i18n'

const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`
const { t } = useI18n()

const emit = defineEmits<{ 'on-login-tenant': []; 'on-logout': []; 'on-create-owner': [] }>()

const props = withDefaults(
  defineProps<{
    loggedIn?: boolean
    lang?: string
  }>(),
  {
    loggedIn: false,
    lang: 'fr'
  }
)

function onLoginTenant() {
  emit('on-login-tenant')
}

function onLogout() {
  emit('on-logout')
}

function onCreateOwner() {
  emit('on-create-owner')
}
function goToPartner() {
  window.location.href =
    'https://partenaire.dossierfacile.logement.gouv.fr/devenir-partenaire-1/pourquoi-devenir-partenaire-dossierfacile'
}
</script>

<style lang="scss" scoped>
.logo {
  width: 290px;
  max-width: 290px;
  height: 89px;
}

.fr-btn--secondary {
  box-shadow: none;
}

li {
  margin: 0.5rem;
}

.fr-header__service-tagline {
  @media all and (max-width: 768px) {
    display: none;
  }
}

.fr-header__menu-links-hack {
  @media all and (min-width: 992px) {
    display: none;
  }
}
.fr-header .remixicon {
  margin-right: 0.25rem;
}

.fr-header {
  .fr-links-group {
    li {
      margin-right: 0;
      margin-left: 0;
      .fr-btn {
        margin-right: 0;
      }
    }
  }
}
</style>
