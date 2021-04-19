<template>
  <div class="fr-container">
    <ForgottenPassword @on-forgotten-password="onForgottenPassword" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import ForgottenPassword from "df-shared/src/Authentification/ForgottenPassword.vue";

@Component({
  components: {
    ForgottenPassword
  }
})
export default class ForgottenPasswordPage extends Vue {
  onForgottenPassword(user: User) {
    if (user.email) {
      this.$store.dispatch("resetPassword", user).then(
        () => {
          this.$toasted.show(this.$i18n.t("password-reset").toString(), {
            type: "success",
            duration: 7000
          });
          this.$router.push("/");
        },
        () => {
          this.$toasted.show(this.$i18n.t("email-not-found").toString(), {
            type: "error",
            duration: 7000
          });
        }
      );
    }
  }
}
</script>

<i18n>
{
  "en": {
    "email-not-found": "Email not found",
    "password-reset": "An email has been sent"
  },
  "fr": {
    "email-not-found": "Email non trouvé",
    "password-reset": "Un email a été envoyé"
  }
}

</i18n>
