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
              <p class="fr-header__service-tagline">
                Le dossier de location numérique de l'État
              </p>
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
                    ><i class="ri-account-circle-line" aria-hidden="true"></i>
                      {{ $t("logout") }}
                  </v-gouv-fr-button>
                </li>
                <li v-if="!loggedIn">
                  <DfButton
                    primary="true"
                    size="small"
                    @on-click="onLoginTenant"
                  >
                    <i class="ri-account-circle-line" aria-hidden="true"></i>
                    {{ $t("signin") }}
                  </DfButton>
                </li>
                <li v-if="!loggedIn">
                  <DfButton size="small" @on-click="onCreateOwner">
                      <i class="ri-community-line" aria-hidden="true"></i>
                    {{ $t("owner") }}
                  </DfButton>
                </li>
                <li v-if="!loggedIn">
                  <DfButton size="small"  @on-click="goToPartner">
                    <i class="ri-home-heart-line" aria-hidden="true"></i>
                    {{ $t("partner") }}
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
              <DfButton
                class="fr-ml-3"
                :primary="false"
                size="small"
                @on-click="onLogout"
                ><i class="ri-account-circle-line" aria-hidden="true"></i>
                >{{ $t("logout") }}
              </DfButton>
            </li>
            <li v-if="!loggedIn">
              <DfButton
                class="fr-ml-3"
                id="signin-button"
                :primary="false"
                size="small"
                @on-click="onLoginTenant"
              >
                  <i class="ri-account-circle-line" aria-hidden="true"></i>
                {{ $t("signin") }}
              </DfButton>
            </li>

            <li v-if="!loggedIn">
              <DfButton size="small" class="fr-ml-3" @on-click="onCreateOwner">
                <i class="ri-community-line" aria-hidden="true"></i>
                {{ $t("owner") }}
              </DfButton>
            </li>
            <li v-if="!loggedIn">
              <DfButton size="small" @onclick="goToPartner">
                <i class="ri-home-heart-line" aria-hidden="true"></i>
                {{ $t("partner") }}
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
  goToPartner(){
      window.location.href = 'https://partenaire.dossierfacile.fr';
  }
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
header i {
  padding-right: 0.25rem;
  font-size: 24px;
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
    "signin": "Sign in",
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
