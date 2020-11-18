<template>
  <div>
    <h1>
      {{ title }}
    </h1>
    <div>
      <div @click="updateSubstep(1)">
        <h2>{{ $t("identification") }}</h2>
      </div>
      <Identification v-if="substep === 1"></Identification>
    </div>
    <div>
      <div @click="updateSubstep(2)">
        <h2>{{ $t("residency") }}</h2>
      </div>
      <Residency v-if="substep === 2"></Residency>
    </div>
    <div>
      <div @click="updateSubstep(3)">
        <h2>{{ $t("professional") }}</h2>
      </div>
      <Professional v-if="substep === 3"></Professional>
    </div>
    <div>
      <div @click="updateSubstep(4)">
        <h2>{{ $t("financial") }}</h2>
      </div>
      <Financial v-if="substep === 4"></Financial>
    </div>
    <div>
      <div @click="updateSubstep(5)">
        <h2>{{ $t("tax") }}</h2>
      </div>
      <Tax v-if="substep === 5"></Tax>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import Identification from "@/components/Identification.vue";
import Residency from "@/components/Residency.vue";
import Professional from "@/components/Professional.vue";
import Financial from "@/components/Financial.vue";
import Tax from "@/components/Tax.vue";
@Component({
  components: { Tax, Financial, Professional, Residency, Identification }
})
export default class UploadDocuments extends Vue {
  @Prop() private user!: User;
  @Prop() private title!: string;

  substep = 0;

  updateSubstep(s: number) {
    this.substep = s === this.substep ? 0 : s;
  }
}
</script>

<style scoped lang="scss">
h2 {
  font-size: 1rem;
}
</style>

<i18n>
{
"en": {
"identification": "Pièce d'identité",
"residency": "Justificatif de domicile",
"professional": "Justificatif de situation professionelle et financière",
"financial": "Justificatif de revenu",
"tax": "Avis d'imposition"
},
"fr": {
"identification": "Pièce d'identité",
"residency": "Justificatif de domicile",
"professional": "Justificatif de situation professionelle et financière",
"financial": "Justificatif de revenu",
"tax": "Avis d'imposition"
}
}
</i18n>
