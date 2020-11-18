<template>
  <div>
    <div>
      <label class="rf-label" for="select">
        J'ajoute une pièce d'identité en cours de validité. Attention, veillez à
        ajouter votre pièce recto-verso !
      </label>
      <select class="rf-select" id="select" name="select">
        <option value="" selected disabled hidden>- Select -</option>
        <option value="FRENCH_IDENTITY_CARD">{{ $t("cni") }}</option>
        <option value="FRENCH_PASSPORT">{{ $t("passport") }}</option>
        <option value="FRENCH_RESIDENCE_PERMIT">{{ $t("permit") }}</option>
        <option value="OTHER_IDENTIFICATION">{{ $t("other") }}</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Identification extends Vue {}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"cni": "Carte nationale d'identité",
"passport": "Passeport",
"permit": "Permis de conduire",
"other": "Autre"
},
"fr": {
"cni": "Carte nationale d'identité",
"passport": "Passeport",
"permit": "Permis de conduire",
"other": "Autre"
}
}
</i18n>
