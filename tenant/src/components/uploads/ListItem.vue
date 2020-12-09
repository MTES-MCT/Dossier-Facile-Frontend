<template>
  <div class="rf-grid-row row">
    <div class="text">
      {{ filename }}
    </div>
    <div class="text">
      {{ $t(documentSubCategory) }}
    </div>
    <div class="progress">
      <Progress :percentage="percentage" :state="uploadState" />
    </div>
    <div>delete</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Progress from "./Progress.vue";
@Component({
  components: {
    Progress
  }
})
export default class ListItem extends Vue {
  @Prop({ default: "" }) filename!: string;
  @Prop({ default: "" }) documentSubCategory!: string;
  @Prop({ default: "idle" }) uploadState!: string;
  @Prop({ default: 0 }) percentage!: number;
}
</script>

<style scoped lang="scss">
.progress {
  float: left;
}
.text {
  float: right;
  flex: 1;
}
.row {
  height: 42px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>

<i18n>
{
  "en": {
    "FRENCH_IDENTITY_CARD": "Carte d'identité",
    "FRENCH_PASSPORT": "Passport",
    "FRENCH_RESIDENCE_PERMIT": "Permis de conduire",
    "OTHER_IDENTIFICATION": "Autre",
    "CERTIFICATE_VISA": "Visa"
  },
  "fr": {
    "FRENCH_IDENTITY_CARD": "Carte d'identité",
    "FRENCH_PASSPORT": "Passport",
    "FRENCH_RESIDENCE_PERMIT": "Permis de conduire",
    "OTHER_IDENTIFICATION": "Autre",
    "CERTIFICATE_VISA": "Visa"
  }
}
</i18n>

