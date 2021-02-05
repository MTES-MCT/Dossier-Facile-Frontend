<template>
  <Card>
    <template v-slot:header>
      {{ $t("title") }}
    </template>
    <template v-slot:body>
      <p v-html="$t('paragraph1')"></p>
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Card from "df-shared/src/components/Card.vue";

@Component({
  components: { Card }
})
export default class DocumentHelp extends Vue {
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
    "paragraph1": "Si votre pièce est trop lourde, nous vous conseillons de scanner votre pièce (avec une application gratuite pour smartphone par exemple).<br> Si cela ne suffit pas, contactez-nous par mail à l’adresse <a href='mailto:contact@dossierfacile.fr'>contact@dossierfacile.fr</a>, nous nous efforcerons de répondre au plus vite !"
  },
  "fr": {
    "title": "Aide",
    "paragraph1": "Si votre pièce est trop lourde, nous vous conseillons de scanner votre pièce (avec une application gratuite pour smartphone par exemple).<br> Si cela ne suffit pas, contactez-nous par mail à l’adresse <a href='mailto:contact@dossierfacile.fr'>contact@dossierfacile.fr</a>, nous nous efforcerons de répondre au plus vite !"
  }
}
</i18n>
