<template>
  <div class="fr-container fr-container--fluid fluid-full-width">
    <div class="fr-grid-row">
      <div class="fr-col-lg-6 fr-col-12">
        <div class="bg-pic">
          <div class="bg-white max-450 left-row fr-pt-3w fr-mt-7w fr-mb-7w">
            <p class="fr-h5 blue-text text-center fr-mt-3w">
              En route pour rejoindre DossierFacile !
            </p>
            <p class="fr-pl-2w fr-pr-2w">
              Afin de faciliter la constitution de votre dossier, préparez les
              pièces suivantes :
            </p>
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
        <h1 class="fr-text--sm">{{ $t("sourcelink.will-link-to-partner") }}</h1>
      </div>
    </div>
    <ConfirmModal
      v-if="showConfirmModal"
      @valid="validModal()"
      @cancel="closeConfirmModal()"
    >
      <span>{{ $t("sourcelink.will-link-to-partner") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Register from "df-shared/src/Authentification/Register.vue";
import Modal from "df-shared/src/components/Modal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import { mapGetters } from "vuex";
import { RegisterService } from "../services/RegisterService";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";

@Component({
  components: {
    Register,
    Modal,
    DfButton,
    ConfirmModal
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn"
    })
  }
})
export default class SourceLink extends Vue {
  isLoggedIn!: boolean;
  source = "";
  internalPartnerId = "";
  firstName = "";
  lastName = "";
  email = "";

  showConfirmModal = false;

  created() {
    this.source = this.$route.params.source || "";
    this.internalPartnerId =
      this.$route.query.internalPartnerId?.toString() || "";
    this.firstName = this.$route.query.firstName?.toString() || "";
    this.lastName = this.$route.query.lastName?.toString() || "";
    this.email = this.$route.query.email?.toString() || "";
  }

  mounted() {
    if (this.isLoggedIn) {
      this.showConfirmModal = true;
    } else {
      (Vue as any).$keycloak.login({
        redirectUri: this.$route.query.page
      });
    }
  }

  validModal() {
    RegisterService.connectSource(this.internalPartnerId, this.source)
      .then(() => {
        this.$toasted.show(this.$i18n.t("sourcelink.connected").toString(), {
          type: "success",
          duration: 3000
        });
        this.$router.push("/account");
      })
      .catch(() => {
        this.$toasted.show(this.$i18n.t("sourcelink.register-error").toString(), {
          type: "error",
          duration: 7000
        });
      });
  }

  closeConfirmModal() {
    this.$router.push("/account");
  }

  closeModal() {
    this.$router.push("/account");
  }
}
</script>


<style lang="scss">
body {
  background-color: var(--g100);
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
</style>

<style scoped lang="scss">
.bg-white {
  background-color: white;
  padding: 16px;
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

li {
  padding: 0 !important;
}

button.blue-text {
  background-color: transparent;
}
</style>
