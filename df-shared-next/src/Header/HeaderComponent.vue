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
              <ul class="fr-btns-group">
                <li v-if="loggedIn">
                  <DfButton :small="true" :primary="false" @click="onLogout">
                    <RiAccountCircleLine aria-hidden="true" />
                    {{ t('logout') }}
                  </DfButton>
                </li>
                <li v-if="!loggedIn">
                  <DfButton :primary="true" :title="t('signup')" size="small" @click="onLogin">
                    <RiAccountCircleLine aria-hidden="true" />
                    {{ t('signup') }}
                  </DfButton>
                </li>
                <li v-if="!loggedIn">
                  <DfButton
                    v-if="type == 'tenant'"
                    size="small"
                    :title="t('owner')"
                    @click="onAccessOwner"
                  >
                    <RiCommunityLine aria-hidden="true" />
                    {{ t('owner') }}
                  </DfButton>
                  <DfButton v-else size="small" :title="t('tenant')" @click="onAccessTenant">
                    <RiUserStarLine aria-hidden="true" />
                    {{ t('tenant') }}
                  </DfButton>
                </li>
                <li v-if="!loggedIn">
                  <a
                    class="fr-external-link fr-btn fr-btn--sm"
                    href="https://partenaire.dossierfacile.logement.gouv.fr/devenir-partenaire-1/pourquoi-devenir-partenaire-dossierfacile"
                    target="_blank"
                    rel="noopener"
                    :title="t('partner-link-title')"
                  >
                    <RiHomeHeartLine aria-hidden="true" />
                    {{ t('partner') }}
                  </a>
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
        <button class="fr-btn--close fr-btn" aria-controls="modal-dc" title="fermer">Fermer</button>
        <div class="fr-header__menu-links" style="display: none"></div>
        <div class="fr-header__menu-links-hack">
          <ul class="fr-btns-group">
            <li v-if="loggedIn">
              <DfButton
                :title="t('logout')"
                class="fr-ml-3"
                :primary="false"
                size="small"
                @click="onLogout"
              >
                <RiAccountCircleLine aria-hidden="true" />
                {{ t('logout') }}
              </DfButton>
            </li>
            <li v-if="!loggedIn">
              <DfButton
                class="fr-ml-3"
                :title="t('signup')"
                :primary="false"
                size="small"
                @click="onLogin"
              >
                <RiAccountCircleLine aria-hidden="true" />
                {{ t('signup') }}
              </DfButton>
            </li>

            <li v-if="!loggedIn">
              <DfButton
                v-if="type == 'tenant'"
                size="small"
                class="fr-ml-3"
                :title="t('owner')"
                @click="onAccessOwner"
              >
                <RiCommunityLine aria-hidden="true" />
                {{ t('owner') }}
              </DfButton>
              <DfButton
                v-else
                size="small"
                class="fr-ml-3"
                :title="t('tenant')"
                @click="onAccessTenant"
              >
                <RiUserStarLine aria-hidden="true" />
                {{ t('tenant') }}
              </DfButton>
            </li>
            <li v-if="!loggedIn">
              <a
                class="fr-external-link fr-btn fr-btn--sm"
                href="https://partenaire.dossierfacile.logement.gouv.fr/devenir-partenaire-1/pourquoi-devenir-partenaire-dossierfacile"
                target="_blank"
                rel="noopener"
                :title="t('partner-link-title')"
              >
                <RiHomeHeartLine aria-hidden="true" />
                {{ t('partner') }}
              </a>
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
import {
  RiAccountCircleLine,
  RiCommunityLine,
  RiHomeHeartLine,
  RiUserStarLine
} from '@remixicon/vue'
import DfButton from '../Button/DfButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`

withDefaults(
  defineProps<{
    loggedIn?: boolean
    lang?: string
    showAccessibility?: boolean
    type?: string
  }>(),
  {
    loggedIn: false,
    lang: 'fr',
    showAccessibility: false,
    type: 'tenant'
  }
)

const emit = defineEmits<{
  'on-login': []
  'on-access-tenant': []
  'on-access-owner': []
  'on-logout': []
}>()

function onLogin() {
  emit('on-login')
}

function onLogout() {
  emit('on-logout')
}

function onAccessTenant() {
  emit('on-access-tenant')
}

function onAccessOwner() {
  emit('on-access-owner')
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

<i18n>
{
  "en": {
    "logout": "Logout",
    "signup": "Sign-in",
    "owner": "Owner area",
    "tenant": "Tenant area",
    "partner": "Become partner",
    "partner-link-title": "Become partner (New Window)"
  },
  "fr": {
    "logout": "Se déconnecter",
    "signup": "Se connecter",
    "owner": "Espace propriétaire",
    "tenant": "Espace locataire",
    "partner": "Devenir partenaire",
    "partner-link-title": "Devenir partenaire (Nouvelle fenêtre)"
  }
}
</i18n>
