<template>
  <div>
    <p>
      {{
        $t("tenantPresentation", {
          firstname: user.firstName,
          lastname: user.lastName
        })
      }}
    </p>
    <template v-if="removeRoommates()">
      <WarningMessage>
        <span>{{ $t("remove-roommates") }}</span>
      </WarningMessage>
    </template>
    <template v-if="removeCouple()">
      <WarningMessage>
        <span>{{ $t("remove-couple") }}</span>
      </WarningMessage>
    </template>

    <div v-if="!isOwner()">
      <div
        class="rf-grid-row rf-grid-row--center"
        v-if="applicationType === 'COUPLE'"
      >
        <div class="rf-col-12">
          <validation-provider rules="is" v-slot="{ errors }" class="rf-col-10">
            <div
              class="rf-input-group"
              :class="errors[0] ? 'rf-input-group--error' : ''"
            >
              <input
                type="checkbox"
                id="authorize"
                value="false"
                v-model="spouseAuthorize"
              />
              <label for="authorize">{{ $t("acceptAuthorSpouse") }}</label>
              <span class="rf-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </div>
          </validation-provider>
        </div>
      </div>
      <div
        class="rf-grid-row rf-grid-row--center"
        v-if="applicationType === 'GROUP'"
      >
        <div class="rf-col-12">
          <validation-provider rules="is" v-slot="{ errors }" class="rf-col-10">
            <div
              class="rf-input-group"
              :class="errors[0] ? 'rf-input-group--error' : ''"
            >
              <input
                type="checkbox"
                id="authorize"
                value="false"
                v-model="coTenantAuthorize"
              />
              <label for="authorize">{{ $t("acceptAuthorCoTenant") }}</label>
              <span class="rf-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </div>
          </validation-provider>
        </div>
      </div>
      <DfButton primary="true" @on-click="authorize()">{{
        $t("validate")
      }}</DfButton>
    </div>

    <div v-if="isOwner()">
      <ValidationObserver v-slot="{ validate }">
        <form
          name="form"
          @submit.prevent="validate().then(handleOthersInformation)"
        >
          <div class="rf-form-group rf-mt-3w">
            <fieldset class="rf-fieldset">
              <div class="rf-fieldset__content">
                <div class="rf-grid-row space-around">
                  <BigRadio :big="true" val="ALONE" v-model="applicationType">
                    <div class="rf-grid-col spa">
                      <div class="icon-container">
                        <span class="material-icons md-36">person</span>
                      </div>
                      <span>{{ $t("alone") }}</span>
                    </div>
                  </BigRadio>
                  <BigRadio :big="true" val="COUPLE" v-model="applicationType">
                    <div class="rf-grid-col spa">
                      <div class="icon-container">
                        <span class="material-icons md-36">group</span>
                      </div>
                      <span>{{ $t("couple") }}</span>
                    </div>
                  </BigRadio>
                  <BigRadio :big="true" val="GROUP" v-model="applicationType">
                    <div class="rf-grid-col spa">
                      <div class="icon-container">
                        <span class="material-icons md-36">groups</span>
                      </div>
                      <span>{{ $t("roommate") }}</span>
                    </div>
                  </BigRadio>
                </div>
                <CoupleInformation
                  class="rf-mt-4w"
                  @update-couple="updateCouple"
                  v-if="applicationType === 'COUPLE'"
                >
                </CoupleInformation>
                <RoommatesInformation
                  class="rf-mt-4w"
                  v-if="applicationType === 'GROUP'"
                >
                </RoommatesInformation>
              </div>
            </fieldset>
          </div>

          <SubmitButton></SubmitButton>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import RoommatesInformation from "@/components/RoommatesInformation.vue";
import CoupleInformation from "@/components/CoupleInformation.vue";
import { mapGetters, mapState } from "vuex";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import SubmitButton from "df-shared/src/Button/SubmitButton.vue";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import DfButton from "df-shared/src/Button/Button.vue";

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
    DfButton
  }
})
export default class TenantInformationForm extends Vue {
  user!: User;
  roommates!: User[];
  coTenantAuthorize!: boolean;
  spouseEmail = "";
  spouseAuthorize!: boolean;
  applicationType = "";

  mounted() {
    if (this.user.applicationType) {
      this.applicationType = this.user.applicationType;
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
    let coTenantEmails: string[] = [];
    let acceptAccess = false;
    if (this.applicationType === "COUPLE") {
      coTenantEmails = [this.spouseEmail];
      acceptAccess = this.spouseAuthorize;
      if (
        this.roommates.length === 1 &&
        this.roommates[0].id &&
        this.roommates[0].email === this.spouseEmail
      ) {
        this.$store.commit("setRoommatesSuccess");
        return;
      }
    } else if (this.applicationType === "GROUP") {
      coTenantEmails = this.roommates
        .filter((r: User) => {
          return r.id != this.user.id;
        })
        .map(function(r) {
          return r.email;
        });
      acceptAccess = this.coTenantAuthorize;
    }

    const data = {
      applicationType: this.applicationType,
      coTenantEmail: coTenantEmails,
      acceptAccess: acceptAccess
    };

    const loader = this.$loading.show();
    this.$store
      .dispatch("setRoommates", data)
      .then(null, error => {
        this.$toasted.show(this.$i18n.t("error").toString(), {
          type: "error",
          duration: 7000
        });
        console.dir(error);
      })
      .finally(() => {
        loader.hide();
      });
  }

  removeRoommates() {
    return (
      this.user.applicationType === "GROUP" && this.applicationType !== "GROUP"
    );
  }

  removeCouple() {
    return (
      this.user.applicationType === "COUPLE" &&
      this.applicationType !== "COUPLE"
    );
  }

  updateCouple(email: string) {
    this.spouseEmail = email;
  }

  isOwner() {
    return (
      this.user.tenantType === undefined || this.user.tenantType === "CREATE"
    );
  }

  authorize() {
    if (this.applicationType === "COUPLE" && !this.spouseAuthorize) {
      return;
    }
    if (this.applicationType === "GROUP" && !this.coTenantAuthorize) {
      return;
    }
    this.$store.commit("setStep", 2);
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
}
</style>

<i18n>
{
"en": {
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
"validate": "Validate"
},
"fr": {
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
"validate": "Valider"
}
}
</i18n>
