<template>
  <div>
    <div class="rf-margin-bottom-3N">
      <label class="rf-label" for="select">
        J'ajoute une pièce d'identité en cours de validité. Attention, veillez à
        ajouter votre pièce recto-verso !
      </label>
      <select
        v-model="user.identification"
        class="rf-select"
        id="select"
        name="select"
      >
        <option value="" selected disabled hidden>- Select -</option>
        <option value="FRENCH_IDENTITY_CARD">{{ $t("cni") }}</option>
        <option value="FRENCH_PASSPORT">{{ $t("passport") }}</option>
        <option value="FRENCH_RESIDENCE_PERMIT">{{ $t("permit") }}</option>
        <option value="OTHER_IDENTIFICATION">{{ $t("other") }}</option>
      </select>
    </div>
    <div v-if="user.identification === 'FRENCH_IDENTITY_CARD'">
      <div class="rf-margin-bottom-3N">
        Attention veillez à ajouter votre pièce recto-verso !
      </div>
      <div class="rf-margin-bottom-3N">
        <table>
          <tr>
            <th>Les pièces acceptées</th>
            <th>Les pièces refusées</th>
          </tr>
          <tr>
            <td>
              <ul>
                <li>
                  Carte d'identité française recto-verso
                </li>
              </ul>
            </td>
            <td>
              <ul>
                <li>Carte d'identité sans le verso ou périmée</li>
                <li>Tout autre document</li>
              </ul>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  computed: {
    ...mapState({
      user: "user",
      currentStep: "currentStep"
    })
  }
})
export default class Identification extends Vue {}
</script>

<style scoped lang="scss">
table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid #ececec;
}
</style>

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
