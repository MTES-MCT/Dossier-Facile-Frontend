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
            <MyButton
              size="small"
              v-on:on-click="onLogout"
              :label="$t('logout')"
            />
          </li>
          <li class="rf-shortcuts__item" v-if="!loggedIn">
            <MyButton
              size="small"
              v-on:on-click="onLogin"
              :label="$t('login')"
            />
          </li>
          <li class="rf-shortcuts__item" v-if="!loggedIn">
            <MyButton
              class="rf-ml-3"
              primary="true"
              size="small"
              v-on:on-click="onCreateAccount"
              :label="$t('signup')"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import MyButton from "../Button/Button.vue";
import { Vue, Component, Prop } from "vue-property-decorator";
import { User } from "../models/User";

@Component({
  components: {
    MyButton
  }
})
export default class MyHeader extends Vue {
  @Prop() private user?: User;
  @Prop({ default: false }) private loggedIn?: boolean;

  onLogin() {
    this.$emit("on-login");
  }

  onLogout() {
    this.$emit("on-logout");
  }

  onCreateAccount() {
    this.$emit("on-create-account");
  }
}
</script>

<style lang="scss" scoped>
.logo {
  max-height: 50px;
}
</style>

<i18n>
{
"en": {
"login": "Login",
"logout": "Logout",
"signup": "Signup"
},
"fr": {
"login": "Me connecter",
"logout": "Se déconnecter",
"signup": "S'enregistrer"
}
}
</i18n>
