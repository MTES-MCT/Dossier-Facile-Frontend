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
              v-model="user.tenantType"
            />
            <label class="rf-label" for="alone">{{ $t("alone") }}</label>
          </div>
          <div class="rf-radio-group">
            <input
              type="radio"
              id="couple"
              value="COUPLE"
              v-model="user.tenantType"
            />
            <label class="rf-label" for="couple">{{ $t("couple") }}</label>
          </div>
          <CoupleInformation
            :couple-mail.sync="spouseEmail"
            :authorize.sync="spouseAuthorize"
            v-if="user.tenantType === 'COUPLE'"
          >
          </CoupleInformation>
          <div class="rf-radio-group">
            <input
              type="radio"
              id="roommate"
              value="CREATE"
              v-model="user.tenantType"
            />
            <label class="rf-label" for="roommate">{{ $t("roommate") }}</label>
          </div>
          <RoommatesInformation
            v-if="user.tenantType === 'CREATE'"
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
import { required, regex } from "vee-validate/dist/rules";
import RoommatesInformation from "@/components/RoommatesInformation.vue";
import CoupleInformation from "@/components/CoupleInformation.vue";
import { mapState } from "vuex";

extend("regex", {
  ...regex,
  message: "Code postal non valide"
});

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
      (this.user.tenantType === "COUPLE" && !this.spouseAuthorize) ||
      (this.user.tenantType === "CREATE" && !this.coTenantAuthorize)
    ) {
      return;
    }
    let coTenantEmails: string[] = [];
    let acceptAccess = false;
    if (this.user.tenantType === "COUPLE") {
      coTenantEmails = [this.spouseEmail];
      acceptAccess = this.spouseAuthorize;
    } else if (this.user.tenantType === "CREATE") {
      coTenantEmails = this.roommates.map(function(r) {
        return r.email;
      });
      acceptAccess = this.coTenantAuthorize;
    }

    const data = {
      tenantType: this.user.tenantType,
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
