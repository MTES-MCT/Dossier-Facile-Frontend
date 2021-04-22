<template>
  <div>
    <p v-html="$t('paragraph1')"></p>
    <p v-html="$t('paragraph2')"></p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class TaxHelp extends Vue {
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
    "title": "Help",
    "paragraph1": "You can now <b> download your tax notice on <a target='_blank' href='https://www.impots.gouv.fr'>www.impots.gouv.fr</a></b>",
    "paragraph2": "If your file is too heavy, we recommend that you scan your file (with a free smartphone app for example). <br> If that is not enough, contact us by email at <a href='mailto: contact@dossierfacile.fr'>contact@dossierfacile.fr</a>, we will do our best to respond as quickly as possible!"
  },
  "fr": {
    "title": "Aide",
    "paragraph1": "Vous pouvez désormais <b>télécharger un avis d’imposition sur <a target='_blank' href='https://www.impots.gouv.fr'>www.impots.gouv.fr</a></b>",
    "paragraph2": "Si votre pièce est trop lourde, nous vous conseillons de scanner votre pièce (avec une application gratuite pour smartphone par exemple).<br> Si cela ne suffit pas, contactez-nous par mail à l’adresse <a href='mailto:contact@dossierfacile.fr'>contact@dossierfacile.fr</a>, nous nous efforcerons de répondre au plus vite !"
  }
}
</i18n>
