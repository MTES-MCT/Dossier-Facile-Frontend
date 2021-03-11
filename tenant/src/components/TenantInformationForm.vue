<template>
  <div>
    <p>
      {{
        $t("tenantPresentation", {
          firstname: user.firstName,
          lastname: user.lastName,
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

    <ValidationObserver v-slot="{ validate }">
      <form
        name="form"
        @submit.prevent="validate().then(handleOthersInformation)"
      >
        <div class="rf-form-group rf-mt-3w">
          <fieldset class="rf-fieldset">
            <div class="rf-fieldset__content">
              <div class="rf-grid-row space-around">
                <BigRadio val="ALONE" v-model="applicationType">
                  <div class="rf-grid-col spa">
                    <div class="icon-container">
                      <span class="material-icons md-36">person</span>
                    </div>
                    <span>{{ $t("alone") }}</span>
                  </div>
                </BigRadio>
                <BigRadio val="COUPLE" v-model="applicationType">
                  <div class="rf-grid-col spa">
                    <div class="icon-container">
                      <span class="material-icons md-36">group</span>
                    </div>
                    <span>{{ $t("couple") }}</span>
                  </div>
                </BigRadio>
                <BigRadio val="GROUP" v-model="applicationType">
                  <div class="rf-grid-col spa">
                    <div class="icon-container">
                      <span class="material-icons md-36">groups</span>
                    </div>
                    <span>{{ $t("roommate") }}</span>
                  </div>
                </BigRadio>
              </div>
              <CoupleInformation
                @update-couple="updateCouple"
                v-if="applicationType === 'COUPLE'"
              >
              </CoupleInformation>
              <RoommatesInformation
                v-if="applicationType === 'GROUP'"
                :authorize.sync="coTenantAuthorize"
              >
              </RoommatesInformation>
            </div>
          </fieldset>
        </div>

        <SubmitButton></SubmitButton>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import RoommatesInformation from "@/components/RoommatesInformation.vue";
import CoupleInformation from "@/components/CoupleInformation.vue";
import { mapState } from "vuex";
import { ValidationObserver } from "vee-validate";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import SubmitButton from "df-shared/src/Button/SubmitButton.vue";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";

@Component({
  computed: {
    ...mapState({
      user: "user",
      roommates: "roommates",
    }),
  },
  components: {
    CoupleInformation,
    RoommatesInformation,
    ValidationObserver,
    BigRadio,
    SubmitButton,
    WarningMessage,
  },
})
export default class TenantInformationForm extends Vue {
  user!: User;
  roommates!: User[];
  coTenantAuthorize = false;
  spouseEmail = "";
  spouseAuthorize = false;
  applicationType = "";

  mounted() {
    if (this.user.applicationType) {
      this.applicationType = this.user.applicationType;
    }
  }

  handleOthersInformation() {
    if (
      (this.applicationType === "COUPLE" && !this.spouseAuthorize) ||
      (this.applicationType === "GROUP" && !this.coTenantAuthorize)
    ) {
      return;
    }
    let coTenantEmails: string[] = [];
    let acceptAccess = false;
    if (this.applicationType === "COUPLE") {
      coTenantEmails = [this.spouseEmail];
      acceptAccess = this.spouseAuthorize;
    } else if (this.applicationType === "GROUP") {
      coTenantEmails = this.roommates
        .filter((r: User) => {
          return r.id != this.user.id;
        })
        .map(function (r) {
          return r.email;
        });
      acceptAccess = this.coTenantAuthorize;
    }

    const data = {
      applicationType: this.applicationType,
      coTenantEmail: coTenantEmails,
      acceptAccess: acceptAccess,
    };

    const loader = this.$loading.show();
    this.$store
      .dispatch("setRoommates", data)
      .then(null, (error) => {
        this.$toasted.show(this.$i18n.t("error").toString(), {
          type: "error",
          duration: 7000,
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

  updateCouple(email: string, authorize: boolean) {
    this.spouseEmail = email;
    this.spouseAuthorize = authorize;
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

.space-around {
  justify-content: space-between;
  align-content: space-around;
}

.selected {
  .icon-container {
    color: var(--tertiary);
    border: 1px solid var(--tertiary);
    background-color: var(--bd300);
  }
}

.icon-container {
  border-radius: 15%;
  background-color: var(--tertiary);
  color: white;
  height: 50px;
  width: 70px;

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
"error": "An error occured"
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
"remove-couple": "Attention, cela aura pour effet de dissocier votre dossier de ceux de votre conjoint·e",
"error": "Une erreur est survenue"
}
}
</i18n>
