<template>
  <div class="rf-header__body">
    <div class="rf-header__brand">
      <a
        class="rf-logo"
        :href="`/?lang=${$i18n.locale}`"
        title="Ministère de la transition écologique et solidaire"
      >
        <span class="rf-logo__title"> République <br />française </span>
      </a>
    </div>
    <div class="rf-header__navbar">
      <div class="rf-service">
        <a
          class="rf-service__title"
          title="Dossier Facile"
          :href="`/?lang=${$i18n.locale}`"
        >
          <img
            class="logo"
            src="./logo_dossierfacile.webp"
            alt="logo Dossier Facile"
          />
        </a>
      </div>
    </div>
    <div class="rf-header__tools">
      <div class="rf-shortcuts">
        <ul class="rf-shortcuts__list">
          <li class="rf-shortcuts__item" v-if="loggedIn">
            <v-gouv-fr-button
              :label="$t('logout')"
              @click="onLogout"
            ></v-gouv-fr-button>
          </li>
          <li class="rf-shortcuts__item" v-if="!loggedIn">
            <DfButton
              class="rf-ml-3"
              primary="true"
              size="small"
              @on-click="onCreateTenant"
            >
              {{ $t("signup") }}
            </DfButton>
          </li>
          <li class="rf-shortcuts__item" v-if="!loggedIn">
            <DfButton size="small" @on-click="onCreateOwner">
              {{ $t("owner") }}
            </DfButton>
          </li>
          <li class="rf-shortcuts__item">
            <button
              class="rf-btn rf-ml-3 rf-btn--secondary rf-btn--sm lang"
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
