<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-md-8 fr-col-lg-6">
        <h1 class="fr-h1 fr-mt-3w">{{ $t("title") }}</h1>
        <p>{{ $t("subtitle") }}</p>
        <form>
          <validation-provider rules="is" v-slot="{ errors }" class="fr-col-10">
            <div
              class="fr-input-group"
              :class="errors[0] ? 'fr-input-group--error' : ''"
            >
              <input
                type="checkbox"
                id="acceptOwner"
                value="false"
                v-model="acceptOwner"
              />
              <label for="acceptOwner">{{
                $t("accept-owner", ["proprietaire", "adresse"])
              }}</label>
              <span class="fr-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </div>
          </validation-provider>
        </form>
        <div v-if="isLoggedIn">
          <DfButton
            class="fr-mt-3w"
            :primary="true"
            @on-click="redirectModalVisible = false"
            >{{ $t("connect-owner") }}</DfButton
          >
        </div>
        <div v-if="!isLoggedIn">
          <v-gouv-fr-modal :modal-id="'rf-modal-1'">
            <template v-slot:button>
              Se connecter
            </template>
            <template v-slot:title>
              Se connecter
            </template>
            <template v-slot:content>
              <Login @on-login="onLogin" />
            </template>
          </v-gouv-fr-modal>
          <v-gouv-fr-modal :modal-id="'rf-modal-2'">
            <template v-slot:button>
              Créer un compte
            </template>
            <template v-slot:title>
              Créer un compte
            </template>
            <template v-slot:content>
              <Register @on-register="onRegister" />
            </template>
          </v-gouv-fr-modal>
        </div>
      </div>
    </div>
    <Modal v-show="isValidModalVisible" @close="closeModal">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ $t("owner-connected") }}
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
import { is } from "vee-validate/dist/rules";
import { extend } from "vee-validate";
import { mapGetters } from "vuex";
import Login from "df-shared/src/Authentification/Login.vue";
import { User } from "df-shared/src/models/User";
import { ValidationProvider } from "vee-validate";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import Register from "df-shared/src/Authentification/Register.vue";
import Modal from "df-shared/src/components/Modal.vue";

extend("is", {
  ...is,
  message: "field-required",
  validate: value => !!value
});

@Component({
  components: {
    Login,
    ValidationProvider,
    VGouvFrModal,
    DfButton,
    Register,
    Modal
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn"
    })
  }
})
export default class OwnerShare extends Vue {
  isLoggedIn!: boolean;
  acceptOwner = false;
  token = "";
  isValidModalVisible = false;
  mounted() {
    this.token = this.$route.params.token;
  }

  onLogin(user: User) {
    if (user.email && user.password) {
      this.$store.dispatch("login", { user }).then(
        () => {
          this.$toasted.show(this.$i18n.t("login-success").toString(), {
            type: "success",
            duration: 7000
          });
        },
        error => {
          this.$toasted.show(this.$i18n.t("login-error").toString(), {
            type: "error",
            duration: 7000
          });
        }
      );
    }
  }

  onRegister(user: User) {
    if (user.email && user.password) {
      this.$store.dispatch("register", { user: user }).then(
        () => {
          this.isValidModalVisible = true;
        },
        error => {
          if (
            error.response.data.errors.indexOf(
              "email: the emails are already being used"
            ) >= 0
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
    this.$router.push("/account");
  }
}
</script>

<i18n>
{
  "en": {
    "title": "Candidatez pour le logement",
    "subtitle": "DossierFacile est une startup d'État qui vous permet de créer votre dossier de location intelligent et de le partager avec des propriétaires",
    "login-success": "Connecté",
    "login-error": "Problème de connexion",
    "accept-owner": "J'accepte que {0}, propriétaire situé au {1} ait accès aux informations de mon dossier. Conformément au RGPD, je peux révoquer cette autorisation à tout moment.",
    "field-required": "This field is required",
    "connect-owner": "Let's go"
  },
  "fr": {
    "title": "Candidatez pour le logement",
    "subtitle": "DossierFacile est une startup d'État qui vous permet de créer votre dossier de location intelligent et de le partager avec des propriétaires",
    "login-success": "Connecté",
    "login-error": "Problème de connexion",
    "accept-owner": "J'accepte que {0}, propriétaire situé au {1} ait accès aux informations de mon dossier. Conformément au RGPD, je peux révoquer cette autorisation à tout moment.",
    "field-required": "Ce champ est requis",
    "connect-owner": "C'est parti !"
  }
}
</i18n>
