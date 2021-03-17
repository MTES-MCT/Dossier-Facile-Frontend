<template>
  <div class="rf-container">
    <h2 class="rf-h2 text-center rf-mt-7w rf-mb-5w">
      {{ $t("title") }}
    </h2>
    <InitPassword @on-init-password="onInitPassword" />
    <ConfirmModal v-if="isLoggedIn" @valid="logout()" @cancel="redirect()">
      <span>{{ $t("already-logged") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { User } from "df-shared/src/models/User";
import { Component, Vue } from "vue-property-decorator";
import InitPassword from "df-shared/src/Authentification/InitPassword.vue";
import { mapGetters } from "vuex";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";

@Component({
  components: {
    InitPassword,
    ConfirmModal
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn"
    })
  }
})
export default class JoinCouple extends Vue {
  isLoggedIn!: boolean;

  onInitPassword(user: User) {
    user.token = this.$route.params.token;
    this.$store.dispatch("createPasswordCouple", user).then(
      () => {
        this.$toasted.show(this.$i18n.t("password-update").toString(), {
          type: "success",
          duration: 7000
        });
        this.$router.push("/profile");
      },
      () => {
        this.$toasted.show(this.$i18n.t("error").toString(), {
          type: "error",
          duration: 7000
        });
      }
    );
  }

  logout() {
    this.$store.dispatch("logout", false);
  }

  redirect() {
    this.$router.push("/profile");
  }
}
</script>

<i18n>
{
  "en": {
    "error": "Error",
    "password-update": "The password has been updated",
    "title": "Create password",
    "already-logged": "You are already logged-in, do you want to logout to create this account ?"
  },
  "fr": {
    "error": "Erreur",
    "password-update": "Le mot de passe a été mis-à-jour",
    "title": "Création du mot de passe",
    "already-logged": "Vous êtes déjà connecté, voulez-vous vous déconnecter pour créer ce compte ?"
  }
}
</i18n>
