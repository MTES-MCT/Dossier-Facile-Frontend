<template>
  <div class="fr-container">
    <div class="signup">
      <div class="fr-grid-row">
        <div class="fr-col-lg-6 fr-col-12">
          <div class="bg-pic">
            <div class="bg-white max-450 left-row fr-pt-3w fr-mt-7w fr-mb-7w">
              <h2 class="fr-h5 blue-text text-center fr-mt-3w">
                En route pour rejoindre DossierFacile !
              </h2>
              <div class="fr-pl-2w fr-pr-2w">
                Afin de faciliter la constitution de votre dossier, préparez les
                pièces suivantes :
              </div>
              <div
                class="bg-purple blue-text fr-pr-2w fr-pl-2w fr-pt-3w fr-pb-3w"
              >
                <ul>
                  <li>
                    Votre pièce d’identité
                  </li>
                  <li>
                    Un justificatif de domicile
                  </li>
                  <li>
                    Un justificatif de situation professionnelle
                  </li>
                  <li>
                    Vos justificatifs de ressource
                  </li>
                  <li>
                    Votre dernier avis d’imposition
                  </li>
                </ul>
                Pour vos garants ces mêmes pièces vous seront demandées.
              </div>
              <div class="fr-pl-2w fr-pr-2w">
                <p class="fr-mt-3w">
                  Vous avez tout ?! Super !<br />
                  Commençons par sécuriser votre compte !
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="fr-col-lg-6 fr-col-12 bg-white">
          <div class="margin-auto max-400">
            <Register @on-register="onRegister" />
            <div class="text-center fr-mb-5w">
              {{ $t("existing-account") }}
              <router-link to="/account" class="blue-text">
                {{ $t("connect") }}
              </router-link>
            </div>
          </div>
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
  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  isValidModalVisible = false;
  onRegister(user: User) {
    if (user.email && user.password) {
      this.$store.dispatch("register", { user: user }).then(
        () => {
          this.isValidModalVisible = true;
        },
        error => {
          if (
            (error.response?.data?.errors?.indexOf(
              "email: the emails are already being used"
            ) || -1) >= 0
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
    window.location.replace(this.MAIN_URL);
  }
}
</script>

<i18n>
{
"en": {
    "existing-account": "Already registered ?",
    "connect": "Connect",
    "mail-sent": "An email has been sent to the requested address.",
    "clic-to-confirm": "Please click on the given link to confirm your email and continue you inscription.",
    "duplicate-email": "This email is already used",
    "register-error": "An error occured"
},
"fr": {
    "existing-account": "Déjà inscrit ?",
    "connect": "S'identifier",
    "mail-sent": "Un mail vous a été envoyé à l'adresse indiquée.",
    "clic-to-confirm": "Veuillez cliquer sur le lien envoyé afin de confirmer votre adresse mail et poursuivre votre inscription.",
    "duplicate-email": "Cet email est déjà utilisé",
    "register-error": "Une erreur est survenue"
}
}
</i18n>

<style>
body {
  background-color: var(--g100);
}
</style>

<style scoped lang="scss">
.bg-white {
  background-color: white;
  padding: 8px;
}

.bg-purple {
  margin: 8px;
  border-radius: 4px;
  background-color: #e5e5f4;
}

.inline-block {
  display: inline-block;
}

.text-center {
  text-align: center;
}

.margin-auto {
  margin: auto;
}

.max-450 {
  max-width: 450px;
}

.max-400 {
  max-width: 400px;
}

.left-row {
  margin-left: auto;
  margin-right: 32px;
}

.bg-pic {
  background: url("../assets/Immeuble.webp") no-repeat;
  background-size: cover;
  height: 100%;
  overflow: hidden;
}

li {
  padding: 0 !important;
}
</style>
