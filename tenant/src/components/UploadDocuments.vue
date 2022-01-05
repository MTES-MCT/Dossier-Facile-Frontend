<template>
  <div class="fr-mb-15w">
    <div v-if="substep <= 1">
      <Identification></Identification>
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
    <div v-if="substep === 2">
      <Residency></Residency>
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
    <div v-if="substep === 3">
      <Professional></Professional>
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
    <div v-if="substep === 4">
      <Financial @on-back="goBack" @on-next="goNext"></Financial>
    </div>
    <div v-if="substep === 5">
      <Tax @on-back="goBack" @on-next="goNext"></Tax>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Identification from "./documents/Identification.vue";
import Residency from "./documents/Residency.vue";
import Professional from "./documents/Professional.vue";
import Financial from "./documents/Financial.vue";
import Tax from "./documents/Tax.vue";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { AnalyticsService } from "../services/AnalyticsService";
import ProfileFooter from "./footer/ProfileFooter.vue";

@Component({
  components: {
    Tax,
    Financial,
    Professional,
    Residency,
    Identification,
    ProfileFooter
  },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class UploadDocuments extends Vue {
  @Prop({ default: 0 }) substep!: number;
  user!: User;

  updateSubstep(s: number) {
    this.$router.push({
      name: "TenantDocuments",
      params: { substep: this.substep === s ? "0" : s.toString() }
    });
  }

  goToGuarantor() {
    AnalyticsService.validateFunnel();
    if (this.user.guarantors && this.user.guarantors.length > 0) {
      this.$router.push({
        name: "GuarantorList"
      });
      return;
    }
    this.$router.push({
      name: "GuarantorChoice"
    });
  }

  goBack() {
    if (this.substep > 1) {
      this.$router.push({
        name: "TenantDocuments",
        params: { substep: (this.substep - 1).toString() }
      });
    } else {
      this.$router.push({
        name: "TenantType"
      });
    }
  }

  goNext() {
    if (this.substep < 5) {
      this.updateSubstep(this.substep + 1);
    } else {
      this.goToGuarantor();
    }
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

.icon {
  align-self: center;
}

.document-title {
  border: 1px solid #ececec;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
}

.selected {
  background-color: $secondary;
}

.check {
  padding: 0.5rem;
  margin-left: auto;
  color: green;
}

.title-bar {
  display: flex;
  align-items: center;
  span {
    padding: 0.5rem;
    line-height: 1rem;
  }
}

h2 {
  line-height: 1.5rem;
}
</style>

<i18n>
{
"en": {
"identification": "Pièce d’identité",
"residency": "Justificatif de domicile",
"professional": "Justificatif de situation professionnelle",
"financial": "Proof of resources",
"tax": "Avis d’imposition"
},
"fr": {
"identification": "Pièce d’identité",
"residency": "Justificatif de domicile",
"professional": "Justificatif de situation professionnelle",
"financial": "Justificatif de ressources",
"tax": "Avis d’imposition"
}
}
</i18n>
