<template>
  <div class="rf-container">
    <h2 class="rf-h2 text-center rf-mt-7w rf-mb-5w">
      {{ $t("title") }}
    </h2>
    <InitPassword @on-init-password="onInitPassword" />
  </div>
</template>

<script lang="ts">
import { User } from "df-shared/src/models/User";
import { Component, Vue } from "vue-property-decorator";
import InitPassword from "df-shared/src/Authentification/InitPassword.vue";

@Component({
  components: {
    InitPassword,
  },
})
export default class JoinCouple extends Vue {
  onInitPassword(user: User) {
    user.token = this.$route.params.token;
    this.$store.dispatch("createPasswordGroup", user).then(
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
    "password-update": "The password has been updated",
    "title": "Create password"
  },
  "fr": {
    "error": "Erreur",
    "password-update": "Le mot de passe a été mis-à-jour",
    "title": "Création du mot de passe"
  }
}
</i18n>
