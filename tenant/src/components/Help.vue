<template>
  <div>
    <div class="rf-card rf-card--no-arrow">
      <div class="rf-card__body">
        <button
          href="#"
          class="rf-btn rf-card__link"
          :aria-expanded="expanded"
          aria-controls="card-content"
          @click="expanded = !expanded"
        >
          {{ $t("title") }}
        </button>
        <div
          id="card-content"
          :class="{ hidden: !expanded }"
          class="rf-card__desc"
        >
          <p>
            {{ $t("paragraph1.0") }}<b>{{ $t("paragraph1.1") }}</b>
          </p>
          <p>
            {{ $t("paragraph2") }}
          </p>
          <p>
            {{ $t("paragraph3.0") }}<b>{{ $t("paragraph3.1") }}</b
            >{{ $t("paragraph3.2") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Help extends Vue {
  expanded = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hidden {
  display: none;
}
</style>

<i18n>
{
"en": {
"title": "Aide",
"paragraph1": {
"0": "Attention, veuillez renseigner les informations et les documents ",
"1": "de la personne dont le nom sera sur le bail de location."
},
"paragraph2": "Toute demande dont l'identité du locataire n'est pas correcte ne sera pas instruite.",
"paragraph3": {
"0": "Exemple: si le futur habitant du bien à louer est un étudiant et ",
"1": "que ce sont les parents qui signent le bail et paieront le loyer, ",
"2": "l'identité et les pièces demandées sont ceux des parents"
}
},
"fr": {
"title": "Aide",
"paragraph1": {
"0": "Attention, veuillez renseigner les informations et les documents ",
"1": "de la personne dont le nom sera sur le bail de location."
},
"paragraph2": "Toute demande dont l'identité du locataire n'est pas correcte ne sera pas instruite.",
"paragraph3": {
"0": "Exemple: si le futur habitant du bien à louer est un étudiant et ",
"1": "que ce sont les parents qui signent le bail et paieront le loyer, ",
"2": "l'identité et les pièces demandées sont ceux des parents"
}
}
}
</i18n>
