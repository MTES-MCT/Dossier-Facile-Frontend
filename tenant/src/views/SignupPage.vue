<template>
  <div class="fr-container fr-container--fluid fluid-full-width">
    <div class="fr-grid-row">
      <div class="fr-col-lg-6 fr-col-12">
        <div class="bg-pic">
          <div class="max-550 left-row fr-pt-3w fr-mt-7w fr-mb-7w">
            <h2 class="fr-h4 my-file">
              {{ $t("signuppage.my-file") }} <em>Dossier</em>Facile
            </h2>
            <p class="my-file-subtitle">
              {{ $t("signuppage.my-file-subtitle") }}
              <strong>{{ $t("signuppage.my-file-subtitle2") }}</strong>
            </p>
          </div>
          <div class="bg-white max-550 left-row fr-p-md-5w fr-mt-7w fr-mb-7w">
            <p>
              <em>Dossier</em><strong>Facile</strong>
              {{ $t("signuppage.help-you") }}
            </p>
            <p>
              🔐 à constituer un
              <strong>dossier numérique conforme, sécurisé</strong> et
              <strong>facile à transmettre</strong> au bailleur.
            </p>
            <p>
              🤔 à connaître
              <strong><u>la liste des documents à fournir</u></strong> dans un
              dossier de location pour éviter les pièges !
            </p>
            <p>
              🤩 à <strong>rassurer votre futur propriétaire</strong> pour
              <strong>décrocher le logement de vos rêves !</strong>
            </p>
          </div>
        </div>
      </div>
      <div class="fr-col-lg-6 fr-col-12 bg-white">
        <div class="fr-mt-2w align-end">
          <router-link to="/account" class="fr-tag">
            {{ $t("signuppage.connect") }}
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
                {{ $t("signuppage.mail-sent") }}
              </p>
              <p>
                {{ $t("signuppage.clic-to-confirm") }}
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
    Modal,
  },
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
        (error) => {
          if (
            (error.response?.data?.errors?.indexOf(
              "email: the emails are already being used"
            ) || -1) >= 0
          ) {
            Vue.toasted.global.error_toast({
              message: "signuppage.duplicate-email",
            });
          } else {
            Vue.toasted.global.error_toast({
              message: "signuppage.register-error",
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
