<template>
  <div>
    <h1>
      {{ title }}
    </h1>
    <div>
      CNI
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";

@Component
export default class UploadDocuments extends Vue {
  @Prop() private user!: User;
  @Prop() private title!: string;
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
