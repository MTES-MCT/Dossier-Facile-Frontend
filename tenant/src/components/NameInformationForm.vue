<template>
  <div>
    <h1>
      {{ title }}
    </h1>
    <ValidationObserver v-slot="{ invalid, validate }">
      <form
        name="form"
        @submit.prevent="validate().then(handleNameInformation)"
      >
        <div class="rf-grid-row rf-grid-row--center">
          <div class="rf-col-12 rf-margin-bottom-3N">
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="rf-input-group"
                :class="errors[0] ? 'rf-input-group--error' : ''"
              >
                <label class="rf-label" for="lastname"
                  >{{ $t("lastname") }} :</label
                >
                <input
                  v-model="user.lastname"
                  class="form-control rf-input validate-required"
                  id="lastname"
                  name="lastname"
                  :placeholder="$t('lastname')"
                  type="text"
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  errors[0]
                }}</span>
              </div>
            </validation-provider>
          </div>
          <div class="rf-col-12 rf-margin-bottom-3N">
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="rf-input-group"
                :class="errors[0] ? 'rf-input-group--error' : ''"
              >
                <label for="firstname" class="rf-label"
                  >{{ $t("firstname") }} :</label
                >
                <input
                  id="firstname"
                  :placeholder="$t('firstname')"
                  type="text"
                  v-model="user.firstname"
                  name="firstname"
                  class="validate-required form-control rf-input"
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  errors[0]
                }}</span>
              </div>
            </validation-provider>
          </div>
          <div class="rf-col-12 rf-margin-bottom-3N">
            <validation-provider
              :rules="{ regex: /^[0-9]{4,5}$/ }"
              v-slot="{ errors }"
            >
              <div
                class="rf-input-group"
                :class="errors[0] ? 'rf-input-group--error' : ''"
              >
                <label for="zipcode" class="rf-label"
                  >{{ $t("zipcode") }} :</label
                >
                <input
                  id="zipcode"
                  :placeholder="$t('zipcode')"
                  type="text"
                  v-model="user.zipCode"
                  name="zipcode"
                  class="validate-required form-control rf-input"
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  errors[0]
                }}</span>
              </div>
            </validation-provider>
          </div>

          <div class="rf-col-12 rf-margin-bottom-5N">
            <button class="rf-btn" type="submit">
              {{ $t("confirm") }}
            </button>
          </div>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required, regex } from "vee-validate/dist/rules";

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
    ValidationProvider,
    ValidationObserver
  }
})
export default class NameInformationForm extends Vue {
  @Prop() private user!: User;
  @Prop() private title!: string;

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
"zipcode": "Code postal"
},
"fr": {
"confirm": "Confirmer",
"firstname": "Prénom du locataire",
"lastname": "Nom du locataire",
"zipcode": "Code postal"
}
}
</i18n>
