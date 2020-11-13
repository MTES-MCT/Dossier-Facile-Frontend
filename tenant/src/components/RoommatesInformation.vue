<template>
  <div class="rf-grid-row rf-grid-row--center">
    <div class="col-md-8 col-lg-6">
      <form name="form" @submit.prevent="handleUpdateMailsInformation">
        <div class="rf-grid-row rf-grid-row--center">
          <div class="rf-col-12 rf-margin-bottom-3N">
            <validation-provider rules="required" v-slot="{ errors }">
              <div
                class="rf-input-group"
                :class="errors[0] ? 'rf-input-group--error' : ''"
              >
                <label class="rf-label" for="email">Email :</label>
                <input
                  v-model="email"
                  class="form-control validate-required rf-input"
                  id="email"
                  name="email"
                  placeholder="Ex : exemple@exemple.fr"
                  type="email"
                />
                <span class="rf-error-text" v-if="errors[0]">{{
                  errors[0]
                }}</span>
              </div>
            </validation-provider>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";

extend("email", {
  ...email,
  message: "email non valide"
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
export default class RoommatesInformation extends Vue {
  @Prop({ default: false }) private couple?: boolean;
  email = "";

  handleUpdateMailsInformation() {
    // TODO
  }
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
},
"fr": {
}
}
</i18n>
