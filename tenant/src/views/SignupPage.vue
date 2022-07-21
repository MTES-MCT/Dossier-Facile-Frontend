<template>
  <div class="fr-container fr-container--fluid fluid-full-width">
    <div class="fr-grid-row">
      <div class="fr-col-lg-6 fr-col-12">
        <div class="bg-pic">
          <div class="max-550 left-row fr-pt-3w fr-mt-7w fr-mb-7w">
            <h2 class="fr-h4 my-file">
              {{ $t("my-file") }} <i>Dossier</i>Facile
            </h2>
            <p class="my-file-subtitle">
              {{ $t("my-file-subtitle") }} <b>{{ $t("my-file-subtitle2") }}</b>
            </p>
          </div>
          <div class="bg-white max-550 left-row fr-p-md-5w fr-mt-7w fr-mb-7w">
            <p><i>Dossier</i><b>Facile</b> {{ $t("help-you") }}</p>
            <p>
              🔐 à constituer un <b>dossier numérique conforme, sécurisé</b> et
              <b>facile à transmettre</b> au bailleur.
            </p>
            <p>
              🤔 à connaître <b><u>la liste des documents à fournir</u></b> dans
              un dossier de location pour éviter les pièges !
            </p>
            <p>
              🤩 à <b>rassurer votre futur propriétaire</b> pour
              <b>décrocher le logement de vos rêves !</b>
            </p>
          </div>
        </div>
      </div>
      <div class="fr-col-lg-6 fr-col-12 bg-white">
        <div class="fr-mt-2w align-end">
          <router-link to="/account" class="fr-tag">
            {{ $t("connect") }}
          </router-link>
        </div>
        <div class="margin-auto max-400">
          <Register @on-register="onRegister" />
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

  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }

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
    "connect": "Already signed up ? Connect",
    "mail-sent": "An email has been sent to the requested address.",
    "clic-to-confirm": "Please click on the given link to confirm your email and continue you inscription.",
    "duplicate-email": "This email is already used",
    "register-error": "An error occured"
},
"fr": {
    "connect": "Déjà inscrit ? Se connecter",
    "mail-sent": "Un mail vous a été envoyé à l'adresse indiquée.",
    "clic-to-confirm": "Veuillez cliquer sur le lien envoyé afin de confirmer votre adresse mail et poursuivre votre inscription.",
    "duplicate-email": "Cet email est déjà utilisé",
    "register-error": "Une erreur est survenue"
}
}
</i18n>

<style scoped lang="scss">
body {
  background-color: var(--g100);
}
.bg-white {
  background-color: white;
  padding: 16px;
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

.max-550 {
  max-width: 550px;
}

.max-400 {
  max-width: 400px;
}

.my-file {
  color: #fff;
}

.my-file-subtitle {
  color: #fff;
  font-size: 1.25rem;
}

.left-row {
  margin-left: auto;
  margin-right: 32px;
}

.bg-pic {
  &:before {
    content: " ";
    background-color: black;
    height: 100%;
    width: 100%;
  }
}
.bg-pic {
  background: linear-gradient(rgba(0, 0, 0, 0.527), rgba(0, 0, 0, 0.5)),
    url("../assets/immeuble.jpg") no-repeat;
  background-size: cover;
  height: 100%;
  overflow: hidden;
}

li {
  padding: 0 !important;
}

.align-end {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 20px;
}
</style>

<i18n>
{
  "en": {
    "my-file": "My rent file with ",
    "my-file-subtitle": "You are going to complete your file",
    "my-file-subtitle2": "checked by the state !",
    "help-you": "helps you :"
  },
  "fr": {
    "my-file": "Mon dossier de location avec ",
    "my-file-subtitle": "Vous êtes sur le point de compléter votre dossier de location",
    "my-file-subtitle2": "vérifié par l'État !",
    "help-you": "vous aide :"
  }
}</i18n>
