<template>
  <div>
    <h1>{{ $t("title") }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ValidateFile extends Vue {}
</script>

<i18n>
{
    "en": {
        "title": "Je valide mon dossier"
    },
    "fr": {
        "title": "Je valide mon dossier"
    }
}
</i18n>
