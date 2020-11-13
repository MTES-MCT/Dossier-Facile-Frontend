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
export default class TenantInformationForm extends Vue {
  @Prop() private user!: User;

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
"tenantPresentation": "Le locataire sera {firstname} {lastname}"
},
"fr": {
"confirm": "Confirmer",
"firstname": "Prénom du locataire",
"lastname": "Nom du locataire",
"zipcode": "Code postal",
"tenantPresentation": "Le locataire sera {firstname} {lastname}"
}
}
</i18n>
