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
              <ul class="fr-links-group">
                <li v-if="loggedIn">
                  <v-gouv-fr-button
                    :small="true"
                    :primary="false"
                    @click="onLogout"
                    ><span class="material-icons-outlined" aria-hidden="true">
                      account_circle </span
                    >{{ $t("logout") }}
                  </v-gouv-fr-button>
                </li>
                <li v-if="!loggedIn">
                  <DfButton
                    primary="true"
                    size="small"
                    @on-click="onLoginTenant"
                  >
                    <span class="material-icons-outlined" aria-hidden="true">
                      account_circle
                    </span>
                    {{ $t("signin") }}
                  </DfButton>
                </li>
                <li v-if="!loggedIn">
                  <DfButton size="small" @on-click="onCreateOwner">
                    <span class="material-icons" aria-hidden="true"
                      >apartment</span
                    >
                    {{ $t("owner") }}
                  </DfButton>
                </li>
                <li v-if="!loggedIn">
                  <a
                    class="fr-external-link fr-btn fr-btn--sm"
                    href="https://partenaire.dossierfacile.fr"
                    target="_blank"
                    rel="noreferrer"
                    :title="$t('partner-link-title')"
                  >
                    {{ $t("partner") }}
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
        <button class="fr-link--close fr-link" aria-controls="modal-dc">
          Fermer
        </button>
        <div class="fr-header__menu-links" style="display: none"></div>
        <div class="fr-header__menu-links-hack">
          <ul class="fr-links-group">
            <li v-if="loggedIn">
              <DfButton
                class="fr-ml-3"
                :primary="false"
                size="small"
                @on-click="onLogout"
                ><span class="material-icons-outlined" aria-hidden="true">
                  account_circle </span
                >{{ $t("logout") }}
              </DfButton>
            </li>
            <li v-if="!loggedIn">
              <DfButton
                class="fr-ml-3"
                :primary="false"
                size="small"
                @on-click="onLoginTenant"
              >
                <span class="material-icons-outlined" aria-hidden="true">
                  account_circle
                </span>
                {{ $t("signin") }}
              </DfButton>
            </li>

            <li v-if="!loggedIn">
              <DfButton size="small" class="fr-ml-3" @on-click="onCreateOwner">
                <span class="material-icons" aria-hidden="true">apartment</span>
                {{ $t("owner") }}
              </DfButton>
            </li>
            <li v-if="!loggedIn">
              <DfButton size="small">
                <a
                  class="fr-external-link"
                  href="https://partenaire.dossierfacile.fr"
                  target="_blank"
                  rel="noreferrer"
                  :title="$t('partner-link-title')"
                >
                  <span class="material-icons" aria-hidden="true"> </span>
                  {{ $t("partner") }}
                </a>
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

<script lang="ts">
import DfButton from "../Button/Button.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import VGouvFrButton from "../Button/v-gouv-fr-button/VGouvFrButton.vue";

@Component({
  components: {
    DfButton,
    VGouvFrButton
  }
})
export default class MyHeader extends Vue {
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  @Prop({ default: false }) loggedIn?: boolean;
  @Prop({ default: "fr" }) lang?: string;

  onLoginTenant() {
    this.$emit("on-login-tenant");
  }

  onLogout() {
    this.$emit("on-logout");
  }

  onCreateOwner() {
    this.$emit("on-create-owner");
  }
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
    "signin": "Sign-in",
    "owner": "Owner area",
    "partner": "Become partner",
    "partner-link-title": "Become partner (New Window)"
  },
  "fr": {
    "logout": "Se déconnecter",
    "signin": "Se connecter",
    "owner": "Espace propriétaire",
    "partner": "Devenir partenaire",
    "partner-link-title": "Devenir partenaire (Nouvelle fenêtre)"
  }
}
</i18n>
