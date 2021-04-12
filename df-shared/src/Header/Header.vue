<template>
  <header role="banner" class="fr-header">
    <div class="fr-container">
      <div class="fr-header__body">
        <div class="fr-header__brand fr-enlarge-link">
          <div class="fr-header__logo">
            <p class="fr-logo">
              République<br />
              française
            </p>
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
        <div class="fr-header__navbar">
          <button
            class="fr-btn--menu fr-btn"
            data-fr-opened="false"
            aria-controls="header-navigation"
            aria-haspopup="menu"
            title="Ouvrir le menu"
          >
            Ouvrir le menu
          </button>
        </div>
        <div class="fr-header__tools">
          <div class="fr-shortcuts">
            <ul class="fr-shortcuts__list">
              <li class="fr-shortcuts__item" v-if="loggedIn">
                <v-gouv-fr-button
                  :label="$t('logout')"
                  :small="true"
                  :secondary="true"
                  @click="onLogout"
                ></v-gouv-fr-button>
              </li>
              <li class="fr-shortcuts__item" v-if="!loggedIn">
                <DfButton
                  class="fr-ml-3"
                  primary="true"
                  size="small"
                  @on-click="onCreateTenant"
                >
                  {{ $t("signup") }}
                </DfButton>
              </li>
              <li class="fr-shortcuts__item" v-if="!loggedIn">
                <DfButton size="small" @on-click="onCreateOwner">
                  {{ $t("owner") }}
                </DfButton>
              </li>
              <li class="fr-shortcuts__item">
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
      <nav
        class="fr-nav fr-modal"
        id="header-navigation"
        role="navigation"
        aria-label="Menu principal"
      >
        <button
          class="fr-link--close fr-link"
          aria-controls="header-navigation"
        >
          Fermer
        </button>
        <slot></slot>
      </nav>
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
