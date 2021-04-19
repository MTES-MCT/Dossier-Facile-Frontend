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
                  aria-controls="modal-833"
                  aria-haspopup="menu"
                  title="Menu"
                >
                  Menu
                </button>
              </div>
            </div>
            <div class="fr-header__service">
              <a :href="`/?lang=${$i18n.locale}`" title="Retour à l’accueil">
                <p class="fr-header__service-title">
                  <img
                    class="logo"
                    src="./logo_dossierfacile.webp"
                    alt="logo Dossier Facile"
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
    <div
      class="fr-header__menu fr-modal"
      id="modal-833"
      aria-labelledby="button-834"
    >
      <div class="fr-container">
        <button class="fr-link--close fr-link" aria-controls="modal-833">
          Fermer
        </button>
        <div class="fr-header__menu-links"></div>
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

  changeLang() {
    this.$emit("on-change-lang");
  }
}
</script>

<style lang="scss" scoped>
.logo {
  max-height: 50px;
  max-width: calc(100% - 40px);
}

.lang {
  box-shadow: none;
}

li {
  margin: 0.5rem;
}
</style>

<i18n>
{
"en": {
"logout": "Logout",
"signup": "Sign up",
"owner": "Owner area"
},
"fr": {
"logout": "Se déconnecter",
"signup": "Mon dossier",
"owner": "Espace propriétaire"
}
}
</i18n>
