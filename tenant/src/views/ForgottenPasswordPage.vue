<template>
  <div class="fr-container">
    <ForgottenPassword @on-forgotten-password="onForgottenPassword" />
    <Modal v-show="isValidModalVisible" @close="closeModal">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ $t("forgottenpasswordpage.mail-sent") }}
              </p>
              <p>
                {{ $t("forgottenpasswordpage.clic-to-confirm") }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import ForgottenPassword from "df-shared/src/Authentification/ForgottenPassword.vue";
import Modal from "df-shared/src/components/Modal.vue";

@Component({
  components: {
    ForgottenPassword,
    Modal
  }
})
export default class ForgottenPasswordPage extends Vue {
  isValidModalVisible = false;
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;

  onForgottenPassword(user: User) {
    if (user.email) {
      this.$store.dispatch("resetPassword", user).then(
        () => {
          this.isValidModalVisible = true;
        },
        () => {
          this.$toasted.show(this.$i18n.t("forgottenpasswordpage.email-not-found").toString(), {
            type: "error",
            duration: 7000
          });
        }
      );
    }
  }

  closeModal() {
    this.isValidModalVisible = false;
    window.location.replace(this.MAIN_URL);
  }
}
</script>

<i18n>
{
  "en": {
    "email-not-found": "Email not found",
    "mail-sent": "An email has been sent to the requested address.",
    "clic-to-confirm": "Please click on the given link to confirm your email and continue your password modification."
  },
  "fr": {
    "email-not-found": "Email non trouvé",
    "mail-sent": "Un mail vous a été envoyé à l'adresse indiquée.",
    "clic-to-confirm": "Veuillez cliquer sur le lien envoyé afin de confirmer votre adresse mail et poursuivre le changement de mot de passe."
  }
}

</i18n>
