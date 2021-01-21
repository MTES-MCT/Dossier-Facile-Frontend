<template>
  <div class="rf-grid-row rf-grid-row--center">
    <div class="col-md-8 col-lg-6">
      <div class="rf-grid-row rf-grid-row--center">
        <div class="rf-col-12">
          <label class="rf-label">{{ $t("spouseEmail") }}</label>
          <validation-provider rules="email" v-slot="{ errors }">
            <div
              class="rf-input-group"
              :class="errors[0] ? 'rf-input-group--error' : ''"
            >
              <input
                v-model="mail"
                class="form-control rf-input"
                name="email"
                placeholder="Ex : exemple@exemple.fr"
                type="email"
                required
              />
              <span class="rf-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </div>
          </validation-provider>
        </div>
        <div class="rf-col-12 rf-mb-3w">
          <validation-provider rules="is" v-slot="{ errors }" class="rf-col-10">
            <div
              class="rf-input-group"
              :class="errors[0] ? 'rf-input-group--error' : ''"
            >
              <input
                type="checkbox"
                id="authorize"
                value="false"
                v-model="author"
              />
              <label for="authorize">{{ $t("acceptAuthor") }}</label>
              <span class="rf-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </div>
          </validation-provider>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { email, is } from "vee-validate/dist/rules";

extend("email", {
  ...email,
  message: "email-not-valid",
});

extend("is", {
  ...is,
  message: "field-required",
  validate: (value) => !!value,
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class CoupleInformation extends Vue {
  @PropSync("coupleMail", { type: String })
  readonly mail!: string;
  @PropSync("authorize", { type: Boolean })
  readonly author!: boolean;
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"spouseEmail": "Veuillez renseigner l’adresse email de votre conjoint",
"acceptAuthor": "J’accepte que mon partenaire ait accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que nos deux dossiers auront été validés",
"email-not-valid": "Email not valid",
"field-required": "This field is required"
},
"fr": {
"spouseEmail": "Veuillez renseigner l’adresse email de votre conjoint",
"acceptAuthor": "J’accepte que mon partenaire ait accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que nos deux dossiers auront été validés",
"email-not-valid": "Email non valide",
"field-required": "Ce champ est requis"
}
}
</i18n>
