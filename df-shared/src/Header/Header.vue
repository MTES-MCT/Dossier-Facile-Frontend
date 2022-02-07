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
                    src="./logo_dossierfacile.webp"
                    alt="Dossier Facile"
                  />
                </p>
              </a>
              <p class="fr-header__service-tagline">
                DossierFacile, le dossier de location numérique de l’État
              </p>
            </div>
          </div>

          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-links-group">
                <li v-if="showAccessibility">
                  <a
                    class="fr-link fr-fi-eye-line"
                    :href="`${MAIN_URL}/accessibilite`"
                    target="_blank"
                    :title="$t('accessibility-link')"
                    >{{ $t("accessibility") }}</a
                  >
                </li>
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
                    {{ $t("signup") }}
                  </DfButton>
                </li>
                <li v-if="!loggedIn">
                  <DfButton size="small" @on-click="onCreateOwner">
                    {{ $t("owner") }}
                  </DfButton>
                </li>
                <li>
                  <button
                    class="fr-btn fr-ml-3 fr-btn--secondary fr-btn--sm lang"
                    @click="changeLang"
                  >
                    <span :class="{ underline: lang === 'fr' }">FR</span> |
                    <span :class="{ underline: lang === 'en' }">EN</span>
                  </button>
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
            <li v-if="showAccessibility">
              <a
                class="fr-link fr-fi-eye-line"
                :href="`${MAIN_URL}/accessibilite`"
                target="_blank"
                :title="$t('accessibility-link')"
                >{{ $t("accessibility") }}</a
              >
            </li>
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
                {{ $t("signup") }}
              </DfButton>
            </li>
            <li v-if="!loggedIn">
              <DfButton size="small" @on-click="onCreateOwner">
                {{ $t("owner") }}
              </DfButton>
            </li>
            <li>
              <button
                class="fr-btn fr-ml-3 fr-btn--secondary fr-btn--sm lang"
                @click="changeLang"
              >
                <span :class="{ underline: lang === 'fr' }">FR</span> |
                <span :class="{ underline: lang === 'en' }">EN</span>
              </button>
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
  @Prop({ default: false }) showAccessibility?: string;

  onCreateTenant() {
    this.$emit("on-create-tenant");
  }

  onLogout() {
    this.$emit("on-logout");
  }

  onCreateOwner() {
    this.$emit("on-create-owner");
  }

  changeLang() {
    this.$emit("on-change-lang");
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

.lang {
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
</style>

<i18n>
{
  "en": {
    "logout": "Logout",
    "signup": "Sign up",
    "owner": "Owner area",
    "accessibility": "Accessibility: not compliant",
    "accessibility-link": "Accessibility - new window"
  },
  "fr": {
    "logout": "Se déconnecter",
    "signup": "Mon dossier",
    "owner": "Espace propriétaire",
    "accessibility": "Accessibilité: non conforme",
    "accessibility-link": "Déclaration d'accessibilité - nouvelle fenêtre"
  }
}
</i18n>
