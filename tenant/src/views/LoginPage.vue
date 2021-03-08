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
    <Modal v-show="redirectModalVisible" @close="redirectModalVisible = false">
      <template v-slot:body>
        <div class="rf-container">
          <div class="row justify-content-center">
            <div class="col-12 col-md-8">
              <p v-html="$t('error-occured')"></p>
            </div>
          </div>

          <DfButton class="rf-mt-3w" @on-click="redirectModalVisible = false">{{
            $t("try-again")
          }}</DfButton>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Login from "df-shared/src/Authentification/Login.vue";
import { User } from "df-shared/src/models/User";
import Modal from "df-shared/src/components/Modal.vue";
import DfButton from "df-shared/src/Button/Button.vue";

@Component({
  components: {
    Login,
    Modal,
    DfButton,
  },
})
export default class LoginPage extends Vue {
  redirectModalVisible = false;
  onLogin(user: User) {
    if (user.email && user.password) {
      this.$store.dispatch("login", { user }).then(
        () => {
          this.$router.push("/account");
        },
        (error) => {
          this.redirectModalVisible = true;
          /*           if (error.response.status === 401) {
            this.$toasted.show(this.$i18n.t("password-error").toString(), {
              type: "error",
              duration: 7000,
            });
          } else {
            this.$toasted.show(error.message, {
              type: "error",
              duration: 5000,
            });
          } */
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
    "no-account": "I don't have an account yet",
    "error-occured": "An error occured, if you already have an account on the old version, please go there: <a href='https://dossierfacile.fr/v1'>DossierFacile v1</a>",
    "try-again": "Try again",
    "old-version": "DossierFacile v1"
  },
  "fr": {
    "password-error": "Utilisateur ou mot de passe incorrect",
    "forgotten-password": "mot de passe oublié",
    "no-account": "je n'ai pas encore de compte",
    "error-occured": "Une erreur est survenue, si vous avez un compte sur l'ancienne version de DossierFacile, vous pouvez vous connecter ici : <a href='https://dossierfacile.fr/v1'>DossierFacile v1</a>",
    "try-again": "Réessayer",
    "old-version": "DossierFacile v1"
  }
}
</i18n>
