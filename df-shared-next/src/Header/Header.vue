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
                  <img
                    class="logo"
                    src="./logo_dossierfacile.svg"
                    alt="Dossier Facile"
                  />
                </p>
              </a>
            </div>
          </div>

          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-btns-group">
                <li v-if="loggedIn">
                  <v-gouv-fr-button
                    :small="true"
                    :primary="false"
                    @click="onLogout"
                    ><span class="material-icons-outlined" aria-hidden="true">
                      account_circle </span
                    >{{ t("logout") }}
                  </v-gouv-fr-button>
                </li>
                <li v-if="!loggedIn">
                  <DfButton
                    :primary="true"
                    :title="t('signup')"
                    size="small"
                    @on-click="onLoginTenant"
                  >
                    <span class="material-icons-outlined" aria-hidden="true">
                      account_circle
                    </span>
                    {{ t("signup") }}
                  </DfButton>
                </li>
                <li v-if="!loggedIn">
                  <DfButton
                    size="small"
                    :title="t('owner')"
                    @on-click="onCreateOwner"
                  >
                    <span class="material-icons" aria-hidden="true"
                      >apartment</span
                    >
                    {{ t("owner") }}
                  </DfButton>
                </li>
                <li v-if="!loggedIn">
                  <a
                    class="fr-external-link fr-btn fr-btn--sm"
                    href="https://partenaire.dossierfacile.fr"
                    target="_blank"
                    rel="noreferrer"
                    :title="t('partner-link-title')"
                  >
                    {{ t("partner") }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Navigation principale -->
    <div class="fr-header__menu fr-modal" id="modal-dc">
      <div class="fr-container">
        <button
          class="fr-btn--close fr-btn"
          aria-controls="modal-dc"
          title="fermer"
        >
          Fermer
        </button>
        <div class="fr-header__menu-links" style="display: none"></div>
        <div class="fr-header__menu-links-hack">
          <ul class="fr-btns-group">
            <li v-if="loggedIn">
              <DfButton
                :title="t('logout')"
                class="fr-ml-3"
                :primary="false"
                size="small"
                @on-click="onLogout"
                ><span class="material-icons-outlined" aria-hidden="true">
                  account_circle </span
                >{{ t("logout") }}
              </DfButton>
            </li>
            <li v-if="!loggedIn">
              <DfButton
                class="fr-ml-3"
                :title="t('signup')"
                :primary="false"
                size="small"
                @on-click="onLoginTenant"
              >
                <span class="material-icons-outlined" aria-hidden="true">
                  account_circle
                </span>
                {{ t("signup") }}
              </DfButton>
            </li>

            <li v-if="!loggedIn">
              <DfButton
                size="small"
                class="fr-ml-3"
                :title="t('owner')"
                @on-click="onCreateOwner"
              >
                <span class="material-icons" aria-hidden="true">apartment</span>
                {{ t("owner") }}
              </DfButton>
            </li>
            <li v-if="!loggedIn">
              <DfButton
                size="small"
                class="fr-external-link"
                :title="t('partner-link-title')"
                @on-click="gotToPartner"
              >
                <span class="material-icons" aria-hidden="true"> </span>
                {{ t("partner") }}
              </DfButton>
            </li>
          </ul>
        </div>
        <nav
          class="fr-nav"
          id="navigation-832"
          role="navigation"
          aria-label="Menu principal"
        >
          <slot></slot>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import DfButton from "../Button/Button.vue";
import VGouvFrButton from "../Button/v-gouv-fr-button/VGouvFrButton.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`;

withDefaults(
  defineProps<{
    loggedIn?: boolean;
    lang?: string;
    showAccessibility?: boolean;
  }>(),
  {
    loggedIn: false,
    lang: "fr",
    showAccessibility: false
  }
);

const emit = defineEmits(["on-login-tenant", "on-logout", "on-create-owner"]);

function onLoginTenant() {
  emit("on-login-tenant");
}

function onLogout() {
  emit("on-logout");
}

function onCreateOwner() {
  emit("on-create-owner");
}

function gotToPartner() {
  window.open("https://partenaire.dossierfacile.fr", "_blank");
}
</script>

<style lang="scss" scoped>
.logo {
  width: 290px;
  max-width: 290px;
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
span.material-icons,
span.material-icons-outlined {
  padding-right: 0.25rem;
  min-width: 24px;
}

.fr-header {
  .fr-links-group {
    li {
      margin-right: 0;
      margin-left: 0;
      .fr-btn {
        margin-right: 0;
      }
      @media all and (max-width: 768px) {
        border-bottom: 1px;
        border-bottom-style: solid;
        border-bottom-color: var(--border-default-grey);
      }
    }
    & > li:last-child,
    li:nth-last-child(2) {
      @media all and (min-width: 768px) {
        border-left: 1px;
        border-left-style: solid;
      }
    }
    & > li:first-child {
      border-left-style: none !important;
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
    "partner": "Become partner",
    "partner-link-title": "Become partner (New Window)"
  },
  "fr": {
    "logout": "Se déconnecter",
    "signup": "Se connecter",
    "owner": "Espace propriétaire",
    "partner": "Devenir partenaire",
    "partner-link-title": "Devenir partenaire (Nouvelle fenêtre)"
  }
}
</i18n>
