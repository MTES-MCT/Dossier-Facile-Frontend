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
              v-model="user.applicationType"
            />
            <label class="rf-label" for="alone">{{ $t("alone") }}</label>
          </div>
          <div class="rf-radio-group">
            <input
              type="radio"
              id="couple"
              value="COUPLE"
              v-model="user.applicationType"
            />
            <label class="rf-label" for="couple">{{ $t("couple") }}</label>
          </div>
          <CoupleInformation
            :couple-mail.sync="spouseEmail"
            :authorize.sync="spouseAuthorize"
            v-if="user.applicationType === 'COUPLE'"
          >
          </CoupleInformation>
          <div class="rf-radio-group">
            <input
              type="radio"
              id="roommate"
              value="CREATE"
              v-model="user.applicationType"
            />
            <label class="rf-label" for="roommate">{{ $t("roommate") }}</label>
          </div>
          <RoommatesInformation
            v-if="user.applicationType === 'CREATE'"
            :roommates.sync="roommates"
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
      user: "user"
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
  roommates = [{ email: "" }];
  coTenantAuthorize = false;
  spouseEmail = "";
  spouseAuthorize = false;

  handleOthersInformation() {
    if (
      (this.user.applicationType === "COUPLE" && !this.spouseAuthorize) ||
      (this.user.applicationType === "CREATE" && !this.coTenantAuthorize)
    ) {
      return;
    }
    let coTenantEmails: string[] = [];
    let acceptAccess = false;
    if (this.user.applicationType === "COUPLE") {
      coTenantEmails = [this.spouseEmail];
      acceptAccess = this.spouseAuthorize;
    } else if (this.user.applicationType === "CREATE") {
      coTenantEmails = this.roommates.map(function(r) {
        return r.email;
      });
      acceptAccess = this.coTenantAuthorize;
    }

    const data = {
      applicationType: this.user.applicationType,
      coTenantEmail: coTenantEmails,
      acceptAccess: acceptAccess
    };
    this.$store.dispatch("setRoommates", data).then(null, error => {
      console.dir(error);
    });
  }
  updateRoommates(roommates: { email: string }[]) {
    // todo update vuex
    this.roommates = roommates;
  }
  updateAuthorize(authorize: boolean) {
    // todo update vuex
    this.coTenantAuthorize = authorize;
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
