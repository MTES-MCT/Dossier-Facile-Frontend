<template>
  <div class="rf-container">
    <ChangePassword @on-change-password="onChangePassword" />
  </div>
</template>

<script lang="ts">
import { User } from "df-shared/src/models/User";
import { Component, Vue } from "vue-property-decorator";
import ChangePassword from "df-shared/src/Authentification/ChangePassword.vue";

@Component({
  components: {
    ChangePassword
  }
})
export default class ChangePasswordPage extends Vue {
  onChangePassword(user: User) {
    user.token = this.$route.params.token;
    this.$store.dispatch("newPassword", user).then(
      () => {
        this.$toasted.show(this.$i18n.t("password-update").toString(), {
          type: "success",
          duration: 7000,
        });
        this.$router.push("/profile");
      },
      () => {
        this.$toasted.show(this.$i18n.t("error").toString(), {
          type: "error",
          duration: 7000,
        });
      }
    );
  }
}
</script>

<i18n>
{
  "en": {
    "error": "Error",
    "password-update": "The password has been updated"
  },
  "fr": {
    "error": "Erreur",
    "password-update": "Le mot de passe a été mis-à-jour"
  }
}

</i18n>
