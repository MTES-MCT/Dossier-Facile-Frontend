<template>
  <div class="rf-grid-row row">
    <div class="text sm">
      {{ file.id }}
    </div>
    <div class="text">
      {{ file.path }}
    </div>
    <div class="text text-center">
      {{ $t(file.documentSubCategory) }}
    </div>
    <div class="progress">
      <Progress :percentage="percentage" :state="uploadState" />
    </div>
    <div class="cursor--pointer" @click="remove()">
      <span class="icon icon-Close text-danger"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { DfFile } from "df-shared/src/models/DfFile";
import { Component, Prop, Vue } from "vue-property-decorator";
import Progress from "./Progress.vue";
@Component({
  components: {
    Progress
  }
})
export default class ListItem extends Vue {
  @Prop({ default: "" }) file!: DfFile;
  @Prop({ default: "idle" }) uploadState!: string;
  @Prop({ default: 0 }) percentage!: number;

  remove() {
    this.$emit("remove");
  }
}
</script>

<style scoped lang="scss">
.progress {
  float: left;
}
.text {
  float: right;
  flex: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  &.sm {
    flex: 1;
  }
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
