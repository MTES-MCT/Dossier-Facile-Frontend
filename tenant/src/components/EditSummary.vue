<template>
  <div>
    <h4>{{ $t("title") }}</h4>
    <div class="rf-grid-row" style="justify-content: space-between">
      <div>
        Prénom et nom
      </div>
      <div>edit</div>
    </div>
    <div class="rf-grid-row" style="justify-content: space-between">
      <div>
        Type de location
      </div>
      <div>edit</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class EditSummary extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>

<i18n>
{
"en": {
"title": "Informations du locataire"
},
"fr": {
"title": "Informations du locataire"
}
}
</i18n>
