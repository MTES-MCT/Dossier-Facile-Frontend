<template>
  <div>
    <p>
      {{
        $t("tenantPresentation", {
          firstname: user.firstname,
          lastname: user.lastname
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
              value="alone"
              v-model="tenantStatus"
            />
            <label class="rf-label" for="alone">{{ $t("alone") }}</label>
          </div>
          <div class="rf-radio-group">
            <input
              type="radio"
              id="couple"
              value="couple"
              v-model="tenantStatus"
            />
            <label class="rf-label" for="couple">{{ $t("couple") }}</label>
          </div>
          <CoupleInformation
            :couple-mail.sync="spouseEmail"
            :authorize.sync="spouseAuthorize"
            v-if="tenantStatus === 'couple'"
          >
          </CoupleInformation>
          <div class="rf-radio-group">
            <input
              type="radio"
              id="roommate"
              value="roommate"
              v-model="tenantStatus"
            />
            <label class="rf-label" for="roommate">{{ $t("roommate") }}</label>
          </div>
          <RoommatesInformation
            v-if="tenantStatus === 'roommate'"
            :roommates.sync="roommates"
            :authorize.sync="authorize"
          >
          </RoommatesInformation>
        </div>
      </fieldset>
    </div>

    <div class="rf-margin-bottom-5N">
      <button class="rf-btn" type="submit" @click="handleOthersInformation">
        {{ $t("confirm") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required, regex } from "vee-validate/dist/rules";
import RoommatesInformation from "@/components/RoommatesInformation.vue";
import CoupleInformation from "@/components/CoupleInformation.vue";

extend("regex", {
  ...regex,
  message: "Code postal non valide"
});

extend("required", {
  ...required,
  message: "Ce champ est requis"
});

@Component({
  components: {
    CoupleInformation,
    RoommatesInformation,
    ValidationProvider,
    ValidationObserver
  }
})
export default class TenantInformationForm extends Vue {
  @Prop() private user!: User;
  tenantStatus = "";
  roommates = [{ email: "" }];
  authorize = false;
  spouseEmail = "";
  spouseAuthorize = false;

  handleOthersInformation() {
    // this.$store.dispatch("setNames", this.user).then(null, error => {
    //   console.dir(error);
    // });
  }
  updateRoommates(roommates: { email: string }[]) {
    // todo update vuex
    this.roommates = roommates;
  }
  updateAuthorize(authorize: boolean) {
    // todo update vuex
    this.authorize = authorize;
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
