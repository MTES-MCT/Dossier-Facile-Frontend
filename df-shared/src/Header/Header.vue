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
                    :label="$t('logout')"
                    :small="true"
                    :secondary="true"
                    @click="onLogout"
                  ></v-gouv-fr-button>
                </li>
                <li v-if="!loggedIn">
                  <DfButton
                    class="fr-ml-3"
                    primary="true"
                    size="small"
                    @on-click="onCreateTenant"
                  >
                    <span class="material-icons-outlined" aria-hidden="true">
                      account_circle
                    </span>
                    {{ $t("signup") }}
                  </DfButton>
                </li>
                <li v-if="!loggedIn">
                  <DfButton
                    class="fr-ml-3"
                    size="small"
                    @on-click="onCreateOwner"
                  >
                    <span class="material-icons" aria-hidden="true"
                      >apartment</span
                    >
                    {{ $t("owner") }}
                  </DfButton>
                </li>
                <li v-if="!loggedIn">
                  <DfButton class="fr-ml-3" size="small">
                    <a
                      class="fr-ml-3 fr-external-link"
                      href="https://partenaire.dossierfacile.fr"
                      target="_blank"
                      rel="noreferrer"
                      :title="$t('partner-link-title')"
                    >
                      {{ $t("partner") }}
                    </a>
                  </DfButton>
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
              <v-gouv-fr-button
                :label="$t('logout')"
                :small="true"
                :secondary="true"
                @click="onLogout"
              ></v-gouv-fr-button>
            </li>
            <li v-if="!loggedIn">
              <DfButton
                class="fr-ml-3"
                primary="true"
                size="small"
                @on-click="onCreateTenant"
              >
                <span class="material-icons-outlined" aria-hidden="true">
                  account_circle
                </span>
                {{ $t("signup") }}
              </DfButton>
            </li>

            <li v-if="!loggedIn">
              <DfButton size="small" class="fr-ml-3" @on-click="onCreateOwner">
                <span class="material-icons" aria-hidden="true">apartment</span>
                {{ $t("owner") }}
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

  onCreateTenant() {
    this.$emit("on-create-tenant");
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
  height: 50px;
  width: 312px;
  max-height: 50px;
  max-width: calc(100% - 20px);
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
}
.fr-links-group > li:nth-last-child(2) {
  border-left: 1px;
  border-left-style: solid;
}
.fr-links-group > li:last-child {
  border-left: 1px;
  border-left-style: solid;
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
