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
    <p v-if="removeRoommates()">
      <span class="color--primary material-icons warning">warning</span>
      <span>{{ $t('remove-roommates')}}</span>
    </p>
    <p v-if="removeCouple()">
      <span class="color--primary material-icons warning">warning</span>
      <span>{{ $t('remove-couple')}}</span>
    </p>

    <ValidationObserver v-slot="{ invalid, validate }">
      <form
        name="form"
        @submit.prevent="validate().then(handleOthersInformation)"
      >
        <div class="rf-form-group">
          <fieldset class="rf-fieldset">
            <div class="rf-fieldset__content">
              <div class="rf-radio-group">
                <input
                  type="radio"
                  id="alone"
                  value="ALONE"
                  name="applicationType"
                  v-model="applicationType"
                />
                <label class="rf-label" for="alone">{{ $t("alone") }}</label>
              </div>
              <div class="rf-radio-group">
                <input
                  type="radio"
                  id="couple"
                  value="COUPLE"
                  name="applicationType"
                  v-model="applicationType"
                />
                <label class="rf-label" for="couple">{{ $t("couple") }}</label>
              </div>
              <CoupleInformation
                :couple-mail.sync="spouseEmail"
                :authorize.sync="spouseAuthorize"
                v-if="applicationType === 'COUPLE'"
              >
              </CoupleInformation>
              <div class="rf-radio-group">
                <input
                  type="radio"
                  id="roommate"
                  value="GROUP"
                  name="applicationType"
                  v-model="applicationType"
                />
                <label class="rf-label" for="roommate">{{
                  $t("roommate")
                }}</label>
              </div>
              <RoommatesInformation
                v-if="applicationType === 'GROUP'"
                :authorize.sync="coTenantAuthorize"
              >
              </RoommatesInformation>
            </div>
          </fieldset>
        </div>

        <div class="rf-mb-5w">
          <button class="rf-btn" type="submit">
            {{ $t("confirm") }}
          </button>
        </div>
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

@Component({
  computed: {
    ...mapState({
      user: "user",
      roommates: "roommates"
    })
  },
  components: {
    CoupleInformation,
    RoommatesInformation,
    ValidationObserver
  }
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
    return this.user.applicationType === "GROUP" && this.applicationType !== "GROUP"
  }

  removeCouple() {
    return this.user.applicationType === "COUPLE" && this.applicationType !== "COUPLE"
  }
}
</script>

<style scoped lang="scss">
.warning {
  padding: 0.5rem;
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
"alone": "Seul",
"couple": "En couple",
"roommate": "En colocation",
"remove-roommates": "Attention, cela aura pour effet de dissocier votre dossier de vos colocataires",
"remove-couple": "Attention, cela aura pour effet de dissocier votre dossier de ceux de votre conjoint·e",
"error": "Une erreur est survenue"
}
}
</i18n>
