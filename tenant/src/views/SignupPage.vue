<template>
  <div class="fr-container">
    <div class="signup">
      <Register @on-register="onRegister" />
      <div class="text-center fr-mb-5w">
        <router-link to="/login">
          {{ $t("existing-account") }}
        </router-link>
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
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import Register from "df-shared/src/Authentification/Register.vue";
import Modal from "df-shared/src/components/Modal.vue";

@Component({
  components: {
    Register,
    Modal
  }
})
export default class SignupPage extends Vue {
  isValidModalVisible = false;
  onRegister(user: User) {
    if (user.email && user.password) {
      this.$store.dispatch("register", { user: user }).then(
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
  closeModal() {
    this.isValidModalVisible = false;
    this.$router.push("/");
  }
}
</script>

<i18n>
{
"en": {
    "existing-account": "I have an account already",
    "mail-sent": "An email has been sent to the requested address.",
    "clic-to-confirm": "Please click on the given link to confirm your email and continue you inscription.",
    "duplicate-email": "This email is already used",
    "register-error": "An error occured"
},
"fr": {
    "existing-account": "J'ai déjà un compte",
    "mail-sent": "Un mail vous a été envoyé à l'adresse indiquée.",
    "clic-to-confirm": "Veuillez cliquer sur le lien envoyé afin de confirmer votre adresse mail et poursuivre votre inscription.",
    "duplicate-email": "Cet email est déjà utilisé",
    "register-error": "Une erreur est survenue"
}
}
</i18n>
