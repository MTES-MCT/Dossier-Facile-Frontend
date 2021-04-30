<template>
  <div class="fr-container">
    <div class="fr-grid-row fr-grid-row--center" v-if="owner.owner">
      <div class="fr-col-md-8 fr-col-lg-6">
        <h1 class="fr-h1 fr-mt-3w">{{ $t("title", [owner.name]) }}</h1>
        <p>{{ $t("subtitle") }}</p>
        <ValidationObserver v-slot="{ validate }">
          <form name="form" @submit.prevent="validate().then(connectOwner)">
            <validation-provider
              rules="is"
              v-slot="{ errors }"
              class="fr-col-10"
            >
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
                  $t("accept-owner", [
                    `${owner.owner.firstName} ${owner.owner.lastName}`,
                    owner.name
                  ])
                }}</label>
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
            <div v-if="isLoggedIn">
              <DfButton type="submit" class="fr-mt-3w" :primary="true">{{
                $t("connect-owner")
              }}</DfButton>
            </div>
          </form>
        </ValidationObserver>
        <div v-if="!isLoggedIn">
          <v-gouv-fr-modal class="fr-mt-2w" modal-id="fr-modal-2">
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
              <div class="fr-mt-3w">
                <div v-html="$t('no-account-1')"></div>
                <div v-html="$t('no-account-2')"></div>
                <div v-html="$t('no-account-3')"></div>
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
import { Owner } from "df-shared/src/models/Owner";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import Modal from "df-shared/src/components/Modal.vue";
import { OwnerService } from "../services/OwnerService";

extend("is", {
  ...is,
  message: "field-required",
  validate: value => !!value
});

@Component({
  components: {
    Login,
    ValidationProvider,
    ValidationObserver,
    VGouvFrModal,
    DfButton,
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
  owner: Owner = new Owner();

  mounted() {
    this.token = this.$route.params.token;
    OwnerService.getOwnerData(this.token)
      .then((response: any) => {
        this.owner = response.data;
      })
      .catch((error: any) => {
        console.dir(error);
      });
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

  closeModal() {
    this.isValidModalVisible = false;
    this.$router.push("/account");
  }

  connectOwner() {
    if (!this.acceptOwner) {
      return;
    }
    OwnerService.registerToOwner(this.token).then(
      () => {
        this.$toasted.show(this.$i18n.t("connection-success").toString(), {
          type: "success",
          duration: 7000
        });
        this.$router.push("/account");
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
</script>

<i18n>
{
  "en": {
    "title": "Candidatez pour le logement situé au {0}",
    "subtitle": "DossierFacile est une startup d'État qui vous permet de créer votre dossier de location intelligent et de le partager avec des propriétaires",
    "login-success": "Connecté",
    "login-error": "Problème de connexion",
    "accept-owner": "J'accepte que {0}, propriétaire situé au {1} ait accès aux informations de mon dossier. Conformément au RGPD, je peux révoquer cette autorisation à tout moment.",
    "field-required": "This field is required",
    "connect-owner": "Let's go",
    "no-account-1": "Si vous n'avez pas de compte, vous pouvez en <a href=\"/signup\">créer un</a> et revenir ultérieurement sur cette page",
    "no-account-2": "Notre dossier est facile à remplir (en moins de 3 minutes c'est promis) et en plus il est conforme à la loi",
    "no-account-3": "Et réutilisable pour toutes vos autres visites !",
    "connection-success": "Your file has been successfully shared"
  },
  "fr": {
    "title": "Candidatez pour le logement situé au {0}",
    "subtitle": "DossierFacile est une startup d'État qui vous permet de créer votre dossier de location intelligent et de le partager avec des propriétaires",
    "login-success": "Connecté",
    "login-error": "Problème de connexion",
    "accept-owner": "J'accepte que {0}, propriétaire situé au {1} ait accès aux informations de mon dossier. Conformément au RGPD, je peux révoquer cette autorisation à tout moment.",
    "field-required": "Ce champ est requis",
    "connect-owner": "C'est parti !",
    "no-account-1": "Si vous n'avez pas de compte, vous pouvez en <a href=\"/signup\">créer un</a> et revenir ultérieurement sur cette page.",
    "no-account-2": "Notre dossier est facile à remplir (en moins de 3 minutes c'est promis) et en plus il est conforme à la loi.",
    "no-account-3": "Et réutilisable pour toutes vos autres visites !",
    "connection-success": "Votre dossier a bien été partagé au propriétaire"
  }
}
</i18n>
