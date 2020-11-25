<template>
  <div>
    <h1>
      {{ title }}
    </h1>
    <div>
      <div
        class="document-title"
        :class="{ selected: substep === 1 }"
        @click="updateSubstep(1)"
      >
        <unicon :name="substep === 1 ? 'angle-down' : 'angle-up'"></unicon>
        <unicon name="user"></unicon>
        <h2>{{ $t("identification") }}</h2>
      </div>
      <Identification v-if="substep === 1"></Identification>
    </div>
    <div>
      <div
        class="document-title"
        :class="{ selected: substep === 2 }"
        @click="updateSubstep(2)"
      >
        <unicon :name="substep === 2 ? 'angle-down' : 'angle-up'"></unicon>
        <unicon name="home"></unicon>
        <h2>{{ $t("residency") }}</h2>
      </div>
      <Residency v-if="substep === 2"></Residency>
    </div>
    <div>
      <div
        class="document-title"
        :class="{ selected: substep === 3 }"
        @click="updateSubstep(3)"
      >
        <unicon :name="substep === 3 ? 'angle-down' : 'angle-up'"></unicon>
        <unicon name="suitcase-alt"></unicon>
        <h2>{{ $t("professional") }}</h2>
      </div>
      <Professional v-if="substep === 3"></Professional>
    </div>
    <div>
      <div
        class="document-title"
        :class="{ selected: substep === 4 }"
        @click="updateSubstep(4)"
      >
        <unicon :name="substep === 4 ? 'angle-down' : 'angle-up'"></unicon>
        <unicon name="euro-circle"></unicon>
        <h2>{{ $t("financial") }}</h2>
      </div>
      <Financial v-if="substep === 4"></Financial>
    </div>
    <div>
      <div
        class="document-title"
        :class="{ selected: substep === 5 }"
        @click="updateSubstep(5)"
      >
        <unicon :name="substep === 5 ? 'angle-down' : 'angle-up'"></unicon>
        <unicon name="file-alt"></unicon>
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
@import "df-shared/src/scss/_variables.scss";

h2 {
  font-size: 1rem;
  margin: 0.5rem;
  display: inline-block;
  align-self: center;
}

.document-title {
  border: 1px solid #ececec;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
}

.unicon {
  align-self: center;
  margin: 0.2rem 0.5rem;
}

.selected {
  background-color: $secondary;
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
