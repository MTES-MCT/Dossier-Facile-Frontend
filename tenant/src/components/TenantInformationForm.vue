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
            <label class="rf-label" for="roommate">{{ $t("roommate") }}</label>
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
      <button class="rf-btn" type="submit" @click="handleOthersInformation">
        {{ $t("confirm") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import RoommatesInformation from "@/components/RoommatesInformation.vue";
import CoupleInformation from "@/components/CoupleInformation.vue";
import { mapState } from "vuex";

extend("required", {
  ...required,
  message: "Ce champ est requis"
});

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
    ValidationProvider,
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
      this.applicationType = this.user.applicationType
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
      coTenantEmails = this.roommates.filter((r: User) => { return r.id != this.user.id}).map(function(r) {
        return r.email;
      });
      acceptAccess = this.coTenantAuthorize;
    }

    const data = {
      applicationType: this.applicationType,
      coTenantEmail: coTenantEmails,
      acceptAccess: acceptAccess
    };
    this.$store.dispatch("setRoommates", data).then(null, error => {
      console.dir(error);
    });
  }
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"confirm": "Confirmer",
"firstname": "Prénom du locataire",
"lastname": "Nom du locataire",
"zipcode": "Code postal",
"tenantPresentation": "Le locataire sera {firstname} {lastname}. Vous désirez louer un logement :",
"alone": "Seul",
"couple": "En couple",
"roommate": "En colocation"
},
"fr": {
"confirm": "Confirmer",
"firstname": "Prénom du locataire",
"lastname": "Nom du locataire",
"zipcode": "Code postal",
"tenantPresentation": "Le locataire sera {firstname} {lastname}. Vous désirez louer un logement :",
"alone": "Seul",
"couple": "En couple",
"roommate": "En colocation"
}
}
</i18n>
