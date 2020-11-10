<template>
  <div>
    <h1>{{ $t("title") }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NameInformationForm extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>

<i18n>
{
"en": {
"title": "1. Je renseigne mes informations"
},
"fr": {
"title": "1. Je renseigne mes informations"
}
}
</i18n>
