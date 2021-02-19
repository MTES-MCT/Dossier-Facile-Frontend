<template>
  <div class="rf-container">
    <div class="signup">
      <Register :email="email" @on-register="onRegister" />
      <Modal v-show="isValidModalVisible" @close="closeModal">
        <template v-slot:body>
          <div class="rf-container">
            <div class="row justify-content-center">
              <div class="col-12 col-md-8">
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
import Modal from "df-shared/src/components/Modal.vue";

@Component({
  components: {
    Register,
    Modal,
  },
})
export default class Source extends Vue {
  source = "";
  internalPartnerId = "";
  firstName = "";
  lastName = "";
  email = "";

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
          internalPartnerId: this.internalPartnerId,
        })
        .then(
          () => {
            this.isValidModalVisible = true;
          },
          (error) => {
            if (
              error.response.data.errors.indexOf(
                "email: the emails are already being used"
              ) >= 0
            ) {
              this.$toasted.show(this.$i18n.t("duplicate-email").toString(), {
                type: "error",
                duration: 7000,
              });
            } else {
              this.$toasted.show(this.$i18n.t("register-error").toString(), {
                type: "error",
                duration: 7000,
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
    "mail-sent": "An email has been sent to the requested address.",
    "clic-to-confirm": "Please click on the given link to confirm your email and continue you inscription."
},
"fr": {
    "mail-sent": "Un mail vous a été envoyé à l'adresse indiquée.",
    "clic-to-confirm": "Veuillez cliquer sur le lien envoyé afin de confirmer votre adresse mail et poursuivre votre inscription."
}
}
</i18n>
