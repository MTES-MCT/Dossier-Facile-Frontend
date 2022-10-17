<template>
  <div>
    <div v-if="!isOwner()">
      <NakedCard class="fr-p-md-5w">
        <div
          class="fr-grid-row fr-grid-row--center"
          v-if="applicationType === 'COUPLE'"
        >
          <div class="fr-col-12">
            <validation-provider
              rules="is"
              v-slot="{ errors }"
              class="fr-col-10"
            >
              <div
                class="fr-checkbox-group bg-purple"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  type="checkbox"
                  id="authorize"
                  value="false"
                  v-model="localSpouseAuthorize"
                />
                <label for="authorize">{{ $t("acceptAuthorSpouse") }}</label>
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
        </div>
        <div
          class="fr-grid-row fr-grid-row--center"
          v-if="applicationType === 'GROUP'"
        >
          <div class="fr-col-12">
            <validation-provider
              rules="is"
              v-slot="{ errors }"
              class="fr-col-10"
            >
              <div
                class="fr-checkbox-group bg-purple"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  type="checkbox"
                  id="authorize"
                  value="false"
                  v-model="localCoTenantAuthorize"
                />
                <label for="authorize">{{ $t("acceptAuthorCoTenant") }}</label>
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
        </div>
      </NakedCard>
      <ProfileFooter @on-back="goBack" @on-next="authorize()"></ProfileFooter>
    </div>

    <div v-if="isOwner()">
      <ValidationObserver v-slot="{ validate }">
        <form
          name="form"
          @submit.prevent="validate().then(handleOthersInformation)"
        >
          <NakedCard class="fr-p-md-5w">
            <h1 class="fr-h6">{{ $t("title") }}</h1>
            <div class="fr-form-group fr-mt-3w fr-mb-0">
              <fieldset class="fr-fieldset">
                <div class="fr-fieldset__content">
                  <div class="fr-grid-row space-between">
                    <BigRadio
                      :big="true"
                      val="ALONE"
                      :value="applicationType"
                      @input="updateApplicationType"
                    >
                      <div class="fr-grid-col spa">
                        <div class="icon-container">
                          <span class="material-icons md-36" aria-hidden="true"
                            >person</span
                          >
                        </div>
                        {{ $t("alone") }}
                      </div>
                    </BigRadio>
                    <BigRadio
                      :big="true"
                      class="fr-mt-2w fr-mt-md-0"
                      val="COUPLE"
                      :value="applicationType"
                      @input="updateApplicationType"
                    >
                      <div class="fr-grid-col spa">
                        <div class="icon-container">
                          <span class="material-icons md-36" aria-hidden="true"
                            >group</span
                          >
                        </div>
                        {{ $t("couple") }}
                      </div>
                    </BigRadio>
                    <BigRadio
                      :big="true"
                      class="fr-mt-2w fr-mt-md-0"
                      val="GROUP"
                      :value="applicationType"
                      @input="updateApplicationType"
                    >
                      <div class="fr-grid-col spa">
                        <div class="icon-container">
                          <span class="material-icons md-36"
                                aria-hidden="true"
                            >groups</span
                          >
                        </div>
                        {{ $t("roommate") }}
                      </div>
                    </BigRadio>
                  </div>
                </div>
              </fieldset>
            </div>
          </NakedCard>
          <ProfileFooter @on-back="goBack"></ProfileFooter>
        </form>
      </ValidationObserver>
      <CoupleInformation
        v-model="coTenants"
        class="fr-mt-2w"
        v-if="applicationType === 'COUPLE'"
      >
      </CoupleInformation>
      <RoommatesInformation
        v-model="coTenants"
        class="fr-mt-2w"
        v-if="applicationType === 'GROUP'"
      >
      </RoommatesInformation>
    </div>
    <ConfirmModal
      v-if="isDeleteGroupVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-roommates") }}</span>
    </ConfirmModal>
    <ConfirmModal
      v-if="isDeleteCoupleVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("will-delete-couple") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import RoommatesInformation from "./RoommatesInformation.vue";
import CoupleInformation from "./CoupleInformation.vue";
import { mapGetters, mapState } from "vuex";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import SubmitButton from "df-shared/src/Button/SubmitButton.vue";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import ProfileFooter from "./footer/ProfileFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";

@Component({
  computed: {
    ...mapState({
      user: "user"
    }),
    ...mapGetters({
      roommates: "getRoommates",
      coTenantAuthorize: "coTenantAuthorize",
      spouseAuthorize: "spouseAuthorize"
    })
  },
  components: {
    CoupleInformation,
    RoommatesInformation,
    ValidationObserver,
    ValidationProvider,
    BigRadio,
    SubmitButton,
    WarningMessage,
    DfButton,
    ConfirmModal,
    ProfileFooter,
    NakedCard
  }
})
export default class TenantInformationForm extends Vue {
  user!: User;
  roommates!: User[];
  coTenants: User[] = [];
  coTenantAuthorize!: boolean;
  spouseAuthorize!: boolean;
  applicationType = "";
  isDeleteCoupleVisible = false;
  isDeleteGroupVisible = false;
  newApplicationType = "";

  localCoTenantAuthorize!: boolean;
  localSpouseAuthorize!: boolean;

  beforeMount() {
    if (this.user.applicationType) {
      this.applicationType = this.user.applicationType;
    }
    this.localCoTenantAuthorize = this.coTenantAuthorize;
    this.localSpouseAuthorize = this.spouseAuthorize;

    if (this.applicationType === "GROUP") {
      this.coTenants = this.roommates;
    }
  }

  handleOthersInformation() {
    if (
      (this.applicationType === "COUPLE" && !this.spouseAuthorize) ||
      (this.applicationType === "GROUP" && !this.coTenantAuthorize) ||
      !this.isOwner()
    ) {
      return;
    }
    // check Tenant validity
    let hasError = false;
    this.coTenants
      .filter((r: User) => {
        return (
          ((r.firstName?.length || 0) === 0 ||
            (r.lastName?.length || 0) == 0) &&
          r.email.length === 0
        );
      })
      .forEach((r: User) => {
        if (this.applicationType === "COUPLE") {
          this.$toasted.show(this.$i18n.t("couple-email-required").toString(), {
            type: "error",
            duration: 7000
          });
          hasError = hasError || true;
          return;
        }
        if (this.applicationType === "GROUP") {
          this.$toasted.show(
            this.$i18n.t("roommate-email-required").toString(),
            {
              type: "error",
              duration: 7000
            }
          );
          hasError = hasError || true;
          return;
        }
      });
    if (hasError) {
      return;
    }

    if (this.hasNothingToSave()) {
      this.$router.push({
        name: "TenantDocuments",
        params: { substep: "1" }
      });
      return;
    }

    const dispatchMethod =
      this.applicationType === "GROUP"
        ? () => {
            const data = {
              applicationType: this.applicationType,
              coTenantEmail: this.coTenants.flatMap(t => t.email),
              acceptAccess: true
            };
            return this.$store.dispatch("setRoommates", data);
          }
        : () => {
            const data = {
              applicationType: this.applicationType,
              coTenants: this.coTenants,
              acceptAccess: true
            };
            return this.$store.dispatch("setCoTenants", data);
          };
    const loader = this.$loading.show();

    dispatchMethod()
      .then(
        () => {
          AnalyticsService.confirmType();
          this.$router.push({
            name: "TenantDocuments",
            params: { substep: "1" }
          });
          if (this.applicationType === "COUPLE") {
            this.$toasted.show(this.$i18n.t("couple-saved").toString(), {
              type: "show",
              duration: 7000
            });
            return;
          }
          if (this.applicationType === "GROUP") {
            this.$toasted.show(this.$i18n.t("roommates-saved").toString(), {
              type: "show",
              duration: 7000
            });
            return;
          }
        },
        error => {
          if (
            error.response.data.message.includes(
              "emails are already being used"
            )
          ) {
            this.$toasted.show(this.$i18n.t("email-exists").toString(), {
              type: "error",
              duration: 7000
            });
            return;
          } else {
            this.$toasted.show(this.$i18n.t("error").toString(), {
              type: "error",
              duration: 7000
            });
            return;
          }
        }
      )
      .finally(() => {
        loader.hide();
      });
  }

  updateApplicationType(value: string) {
    this.newApplicationType = value;
    if (
      value !== this.applicationType &&
      (this.user.apartmentSharing?.tenants.length || 0) > 1
    ) {
      if (this.applicationType === "COUPLE") {
        this.isDeleteCoupleVisible = true;
        return false;
      }
      if (this.applicationType === "GROUP") {
        this.isDeleteGroupVisible = true;
        return false;
      }
    }
    this.applicationType = this.newApplicationType;
    return false;
  }

  hasNothingToSave() {
    if (
      this.applicationType === this.user.applicationType &&
      this.applicationType === "ALONE"
    ) {
      return true;
    }
    if (
      this.applicationType === this.user.applicationType &&
      (this.applicationType === "GROUP" || this.applicationType === "COUPLE")
    ) {
      const unregisteredRoommate = this.coTenants.find((r: any) => {
        return r.id === undefined;
      });
      if (unregisteredRoommate === undefined) {
        return true;
      }
    }
    return false;
  }

  undoSelect() {
    this.isDeleteCoupleVisible = false;
    this.isDeleteGroupVisible = false;
  }

  validSelect() {
    this.applicationType = this.newApplicationType;
    this.user.apartmentSharing?.tenants.forEach(t => {
      if (t.tenantType !== "CREATE") {
        this.$store
          .dispatch("deleteCoTenant", t)
          .then()
          .catch(() => {
            this.$toasted.global.error();
            this.undoSelect();
            return;
          });
      }
    });
    this.isDeleteCoupleVisible = false;
    this.isDeleteGroupVisible = false;
  }

  isOwner() {
    return (
      this.user.tenantType === undefined || this.user.tenantType === "CREATE"
    );
  }

  authorize() {
    if (this.applicationType === "COUPLE" && !this.localSpouseAuthorize) {
      return;
    }
    if (this.applicationType === "GROUP" && !this.localCoTenantAuthorize) {
      return;
    }
    this.$router.push({ name: "TenantDocuments", params: { substep: "1" } });
  }

  goBack() {
    this.$router.push({ name: "TenantName" });
  }
}
</script>

<style scoped lang="scss">
.warning {
  padding: 0.5rem;
}

.spa {
  justify-content: space-around;
  align-content: space-around;
  height: 100%;
  align-items: center;
}

.selected {
  .icon-container {
    background-color: var(--primary);
    color: white;
  }
}

.icon-container {
  border-radius: 0.5rem;
  height: 5rem;
  width: 6rem;
  color: var(--primary);
  background-color: var(--white);
  border: 1px solid var(--primary);

  display: flex;
  justify-content: center;
  align-items: center;

  @media all and (max-width: 991px) {
    display: none;
  }
}
</style>

<i18n>
{
  "en": {
  "title": "You want to rent for accommodation :",
  "confirm": "Confirmer",
  "firstname": "Prénom du locataire",
  "lastname": "Nom du locataire",
  "zipcode": "Code postal",
  "tenantPresentation": "Le locataire sera {firstname} {lastname}. Vous désirez louer un logement :",
  "alone": "Alone",
  "couple": "Couple",
  "roommate": "Flatsharing",
  "remove-roommates": "Be careful! Your file will be disconnected from your roommates files",
  "remove-couple": "Be careful! Your file will be disconnected from your spouse file",
  "error": "An error occured",
  "acceptAuthorSpouse": "J’accepte que mon partenaire ait accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que nos deux dossiers auront été validés",
  "acceptAuthorCoTenant": "J’accepte que les autres membres de ma colocation aient accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que tous les dossiers de la colocation auront été validés",
  "validate": "Validate",
  "roommates-saved": "Invitation sent to you roommates. Your roommates have been successfully added<br> and an invitation has been sent to create their account.",
  "email-exists": "This email address already exists in DossierFacile. Please use an other email address.",
  "roommate-email-required": "You must fill at least one roommate adress.",
  "couple-email-required": "You must fill your spouse adress.",
  "will-delete-couple": "This action will delete the link with your spouse",
  "will-delete-roommates": "This action will delete the link with your roommates",
  "require-accept": "You must accept the declaration"
  },
  "fr": {
  "title": "Vous désirez louer pour un logement :",
  "confirm": "Confirmer",
  "firstname": "Prénom du locataire",
  "lastname": "Nom du locataire",
  "zipcode": "Code postal",
  "tenantPresentation": "Le locataire sera {firstname} {lastname}. Vous désirez louer un logement :",
  "alone": "Seul·e",
  "couple": "En couple",
  "roommate": "En colocation",
  "remove-roommates": "Attention, cela aura pour effet de dissocier votre dossier de vos colocataires",
  "remove-couple": "Attention, cela aura pour effet de dissocier votre dossier de celui de votre conjoint·e",
  "error": "Une erreur est survenue",
  "acceptAuthorSpouse": "J’accepte que mon partenaire ait accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que nos deux dossiers auront été validés",
  "acceptAuthorCoTenant": "J’accepte que les autres membres de ma colocation aient accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que tous les dossiers de la colocation auront été validés",
  "validate": "Valider",
  "roommates-saved": "Invitation envoyée à vos colocataires. Vos colocataires ont bien été<br>ajoutés et une invitation de création de compte leur a été envoyée.",
  "couple-saved": "Votre conjoint·e a bien été ajouté·e.<br/>Si un e-mail a été fourni, une invitation de création de compte lui a été envoyée.",
  "email-exists": "Cette adresse email est déjà utilisée sur DossierFacile.<br>Renseignez une adresse email différente.",
  "roommate-email-required": "Vous devez saisir l'adresse email d'au moins un colocataire.",
  "couple-email-required": "Vous devez saisir l'adresse email de votre conjoint·e",
  "will-delete-couple": "Cette action va supprimer la liaison avec le dossier de votre conjoint·e",
  "will-delete-roommates": "Cette action va supprimer la liaison avec le dossier de vos colocataires",
  "require-accept": "Vous devez accepter la déclaration"
  }
}
</i18n>
