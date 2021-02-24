<template>
  <div class="rf-container">
    <Login @on-login="onLogin" />
    <div class="rf-grid-row">
      <div class="rf-col-12 text-center rf-mb-3w">
        <router-link to="/forgotten-password">{{
          $t("forgotten-password")
        }}</router-link>
      </div>
      <div class="rf-col-12 text-center rf-mb-12w">
        <router-link to="/signup">{{ $t("no-account") }}</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Login from "df-shared/src/Authentification/Login.vue";
import { User } from "df-shared/src/models/User";

@Component({
  components: {
    Login,
  },
})
export default class LoginPage extends Vue {
  onLogin(user: User) {
    if (user.email && user.password) {
      this.$store.dispatch("login", { user }).then(
        () => {
          this.$router.push("/profile");
        },
        (error) => {
          if (error.response.status === 401) {
            this.$toasted.show(this.$i18n.t("password-error").toString(), {
              type: "error",
              duration: 7000,
            });
          } else {
            this.$toasted.show(error.message, {
              type: "error",
              duration: 5000,
            });
          }
        }
      );
    }
  }
}
</script>

<i18n>
{
  "en": {
    "password-error": "Incorrect username or password",
    "forgotten-password": "Forgotten password",
    "no-account": "I don't have an account yet"
  },
  "fr": {
    "password-error": "Utilisateur ou mot de passe incorrect",
    "forgotten-password": "mot de passe oublié",
    "no-account": "je n'ai pas encore de compte"
  }
}
</i18n>
