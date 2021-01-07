<template>
  <div class="rf-container">
    <div class="signup">
      <Register @on-register="onRegister" />
      <div class="text-center">
        <router-link to="/login">
          {{ $t("existing-account") }}
        </router-link>
      </div>
      <Modal v-show="isValidModalVisible" @close="closeModal">
        <template v-slot:body>
          <div class="rf-container">
            <div class="row justify-content-center">
              <div class="col-12 col-md-8">
                <p>
                  Un mail vous a été envoyé à l'adresse indiquée.
                </p>
                <p>
                  Veuillez cliquer sur le lien envoyé afin de confirmer votre
                  adresse mail et poursuivre votre inscription.
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
      this.$store.dispatch("register", user).then(
        () => {
          this.isValidModalVisible = true;
        },
        error => {
          console.dir(error);
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
    "existing-account": "J'ai déjà un compte"
},
"fr": {
    "existing-account": "J'ai déjà un compte"
}
}
</i18n>
