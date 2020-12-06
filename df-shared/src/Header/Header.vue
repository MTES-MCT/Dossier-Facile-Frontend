<template>
  <div class="rf-header__body">
    <div class="rf-header__brand">
      <a
        class="rf-logo"
        href="/"
        title="Ministère de la transition écologique et solidaire"
      >
        <span class="rf-logo__title">
          Ministère <br />de la transition <br />écologique <br />et solidaire
        </span>
      </a>
    </div>
    <div class="rf-header__navbar">
      <div class="rf-service">
        <a class="rf-service__title" href="/" title="Dossier Facile">
          <img
            class="logo"
            src="./logo_dossierfacile.png"
            alt="Dossier Facile"
          />
        </a>
      </div>
    </div>
    <div class="rf-header__tools">
      <div class="rf-shortcuts">
        <ul class="rf-shortcuts__list">
          <li class="rf-shortcuts__item" v-if="loggedIn">
            <DfButton
              size="small"
              @on-click="onLogout"
              :label="$t('logout')"
            />
          </li>
          <li class="rf-shortcuts__item" v-if="!loggedIn">
            <DfButton
              class="rf-ml-3"
              primary="true"
              size="small"
              @on-click="onCreateTenant"
              :label="$t('signup')"
            />
          </li>
          <li class="rf-shortcuts__item" v-if="!loggedIn">
            <DfButton
              size="small"
              @on-click="onCreateOwner"
              :label="$t('owner')"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DfButton from "../Button/Button.vue";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    DfButton
  }
})
export default class MyHeader extends Vue {
  @Prop({ default: false }) private loggedIn?: boolean;

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
  max-height: 50px;
  max-width: calc(100% - 40px);
}
</style>

<i18n>
{
"en": {
"logout": "Logout",
"signup": "S'inscrire",
"owner": "Espace propriétaire"
},
"fr": {
"logout": "Logout",
"signup": "S'inscrire",
"owner": "Espace propriétaire"
}
}
</i18n>
