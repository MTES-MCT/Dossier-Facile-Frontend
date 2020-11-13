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
          <RoommatesInformation couple="true" v-if="tenantStatus === 'couple'">
          </RoommatesInformation>
          <div class="rf-radio-group">
            <input
              type="radio"
              id="roommate"
              value="roommate"
              v-model="tenantStatus"
            />
            <label class="rf-label" for="roommate">{{ $t("roommate") }}</label>
          </div>
          <RoommatesInformation v-if="tenantStatus === 'roommate'">
          </RoommatesInformation>
        </div>
      </fieldset>
    </div>

    <div class="rf-margin-bottom-5N">
      <button class="rf-btn" type="submit">
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
    RoommatesInformation,
    ValidationProvider,
    ValidationObserver
  }
})
export default class TenantInformationForm extends Vue {
  @Prop() private user!: User;
  tenantStatus = "";

  handleNameInformation() {
    this.$store.dispatch("setNames", this.user).then(null, error => {
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
