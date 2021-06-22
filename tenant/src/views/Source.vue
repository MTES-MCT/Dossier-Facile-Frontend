<template>
  <div class="fr-container fr-mt-3w">
    <div class="signup">
      <DfButton @on-click="existingAccount = false" v-if="existingAccount">
        {{ $t("register") }}
      </DfButton>
      <DfButton @on-click="existingAccount = true" v-if="!existingAccount">
        {{ $t("existing-account") }}
      </DfButton>
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-md-8 fr-col-lg-6">
          <Register
            :email="email"
            @on-register="onRegister"
            v-if="!existingAccount"
          />
          <Login @on-login="onLogin" v-if="existingAccount" />
        </div>
      </div>

      <Modal v-show="isValidModalVisible" @close="closeModal">
        <template v-slot:body>
          <div class="fr-container">
            <div class="fr-grid-row justify-content-center">
              <div class="fr-col-12">
                <p>
                  {{ $t("mail-sent") }}
                </p>
                <p>
                  {{ $t("clic-to-confirm") }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import Register from "df-shared/src/Authentification/Register.vue";
import Login from "df-shared/src/Authentification/Login.vue";
import Modal from "df-shared/src/components/Modal.vue";
import DfButton from "df-shared/src/Button/Button.vue";

@Component({
  components: {
    Register,
    Modal,
    DfButton,
    Login
  }
})
export default class Source extends Vue {
  source = "";
  internalPartnerId = "";
  firstName = "";
  lastName = "";
  email = "";
  existingAccount = false;

  mounted() {
    this.source = this.$route.params.source;

    this.internalPartnerId = this.$route.query.internalPartnerId.toString();
    this.firstName = this.$route.query.firstName.toString();
    this.lastName = this.$route.query.lastName.toString();
    this.email = this.$route.query.email.toString();
  }

  isValidModalVisible = false;

  onRegister(user: User) {
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    if (user.email && user.password) {
      this.$store
        .dispatch("register", {
          user,
          source: this.source,
          internalPartnerId: this.internalPartnerId
        })
        .then(
          () => {
            this.isValidModalVisible = true;
          },
          error => {
            if (
              error.response.data.errors.indexOf(
                "email: the emails are already being used"
              ) >= 0
            ) {
              this.$toasted.show(this.$i18n.t("duplicate-email").toString(), {
                type: "error",
                duration: 7000
              });
            } else {
              this.$toasted.show(this.$i18n.t("register-error").toString(), {
                type: "error",
                duration: 7000
              });
            }
          }
        );
    }
  }

  onLogin(user: User) {
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    if (user.email && user.password) {
      const url =
        "https://sso-preprod.dossierfacile.fr/auth/realms/dossier-facile/protocol/openid-connect/auth?" +
        "response_type=code&state=&client_id=login-app&scope=openid&redirect_uri=https%3A%2F%2Flocataire-dev.dossierfacile.fr/auth/callback";
      window.location.href = url;

      // TODO : clean code
      // login pre-prod: "https://sso-preprod.dossierfacile.fr/auth/realms/dossier-facile/protocol/openid-connect/auth?response_type=code&state=&client_id=login-app&scope=openid&redirect_uri=https%3A%2F%2Flocataire-dev.dossierfacile.fr/auth/callback";
      // login localhost: "https://sso-preprod.dossierfacile.fr/auth/realms/dossier-facile/protocol/openid-connect/auth?response_type=code&state=&client_id=login-app&scope=openid&redirect_uri=http%3A%2F%2Flocalhost%3A9002/auth/callback"
      // "https://locataire-dev.dossierfacile.fr/auth/callback?state=&session_state=6cb83e9e-8feb-4e58-a0a4-5a0ced703b1e&code=9d3493e1-f813-495f-9e1c-871876ac6c6f.6cb83e9e-8feb-4e58-a0a4-5a0ced703b1e.e5fba3a0-95aa-4345-a719-7d578b4ef4d9"
      /*       this.$store
        .dispatch("login", {
          user,
          source: this.source,
          internalPartnerId: this.internalPartnerId
        })
        .then(
          () => {
            this.$router.push("/profile");
          },
          error => {
            if (error.response.status === 401) {
              this.$toasted.show(this.$i18n.t("password-error").toString(), {
                type: "error",
                duration: 7000
              });
            } else {
              this.$toasted.show(error.message, {
                type: "error",
                duration: 5000
              });
            }
          }
        ); */
    }
  }

  closeModal() {
    this.isValidModalVisible = false;
    this.$router.push("/login");
  }
}
</script>

<i18n>
{
"en": {
    "mail-sent": "An email has been sent to the requested address.",
    "clic-to-confirm": "Please click on the given link to confirm your email and continue you inscription.",
    "existing-account": "I have an account already",
    "register": "Register a new account",
    "register-error": "An error occured"
},
"fr": {
    "mail-sent": "Un mail vous a été envoyé à l'adresse indiquée.",
    "clic-to-confirm": "Veuillez cliquer sur le lien envoyé afin de confirmer votre adresse mail et poursuivre votre inscription.",
    "existing-account": "Lier un compte existant",
    "register": "Créer un nouveau compte",
    "register-error": "Une erreur est survenue"
}
}
</i18n>
