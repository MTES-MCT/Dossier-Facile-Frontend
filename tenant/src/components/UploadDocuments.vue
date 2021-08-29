<template>
  <div class="fr-mb-7w">
    <div>
      <div
        class="document-title title-bar"
        :class="{ selected: substep === 1 }"
        @click="updateSubstep(1)"
      >
        <span v-if="substep === 1" class="color--primary material-icons"
          >keyboard_arrow_up</span
        >
        <span v-if="substep !== 1" class="color--primary material-icons"
          >keyboard_arrow_down</span
        >
        <span class="color--primary material-icons">person</span>
        <h2>{{ $t("identification") }}</h2>
        <span class="spacer"></span>
        <span
          v-if="hasDoc('IDENTIFICATION')"
          class="color--primary material-icons"
          >check_circle_outline</span
        >
      </div>
      <div v-if="substep === 1">
        <Identification></Identification>
        <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
      </div>
    </div>
    <div>
      <div
        class="document-title title-bar"
        :class="{ selected: substep === 2 }"
        @click="updateSubstep(2)"
      >
        <span v-if="substep === 2" class="color--primary material-icons"
          >keyboard_arrow_up</span
        >
        <span v-if="substep !== 2" class="color--primary material-icons"
          >keyboard_arrow_down</span
        >
        <span class="color--primary material-icons">home</span>
        <h2>{{ $t("residency") }}</h2>
        <span class="spacer"></span>
        <span v-if="hasDoc('RESIDENCY')" class="color--primary material-icons"
          >check_circle_outline</span
        >
      </div>
      <div v-if="substep === 2">
        <Residency></Residency>
        <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
      </div>
    </div>
    <div>
      <div
        class="document-title title-bar"
        :class="{ selected: substep === 3 }"
        @click="updateSubstep(3)"
      >
        <span v-if="substep === 3" class="color--primary material-icons"
          >keyboard_arrow_up</span
        >
        <span v-if="substep !== 3" class="color--primary material-icons"
          >keyboard_arrow_down</span
        >
        <span class="color--primary material-icons">work</span>
        <h2>{{ $t("professional") }}</h2>
        <span class="spacer"></span>
        <span
          v-if="hasDoc('PROFESSIONAL')"
          class="color--primary material-icons"
          >check_circle_outline</span
        >
      </div>
      <div v-if="substep === 3">
        <Professional></Professional>
        <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
      </div>
    </div>
    <div>
      <div
        class="document-title title-bar"
        :class="{ selected: substep === 4 }"
        @click="updateSubstep(4)"
      >
        <span v-if="substep === 4" class="color--primary material-icons"
          >keyboard_arrow_up</span
        >
        <span v-if="substep !== 4" class="color--primary material-icons"
          >keyboard_arrow_down</span
        >
        <span class="color--primary material-icons">euro</span>
        <h2>{{ $t("financial") }}</h2>
        <span class="spacer"></span>
        <span v-if="isFinancialValid()" class="color--primary material-icons"
          >check_circle_outline</span
        >
      </div>
      <div v-if="substep === 4">
        <Financial @on-back="goBack" @on-next="goNext"></Financial>
      </div>
    </div>
    <div>
      <div
        class="document-title title-bar"
        :class="{ selected: substep === 5 }"
        @click="updateSubstep(5)"
      >
        <span v-if="substep === 5" class="color--primary material-icons"
          >keyboard_arrow_up</span
        >
        <span v-if="substep !== 5" class="color--primary material-icons"
          >keyboard_arrow_down</span
        >
        <span class="color--primary material-icons">content_copy</span>
        <h2>{{ $t("tax") }}</h2>
        <span class="spacer"></span>
        <span v-if="isTaxValid()" class="color--primary material-icons"
          >check_circle_outline</span
        >
      </div>
      <div v-if="substep === 5">
        <Tax @on-back="goBack" @on-next="goNext"></Tax>
      </div>
    </div>
    <div v-if="substep === 0">
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Identification from "@/components/documents/Identification.vue";
import Residency from "@/components/documents/Residency.vue";
import Professional from "@/components/documents/Professional.vue";
import Financial from "@/components/documents/Financial.vue";
import Tax from "@/components/documents/Tax.vue";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { AnalyticsService } from "../services/AnalyticsService";
import ProfileFooter from "@/components/footer/ProfileFooter.vue";
import { UtilsService } from "../services/UtilsService";

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
    this.$router.push({
      name: "GuarantorChoice"
    });
  }

  hasDoc(docType: string) {
    return UtilsService.hasDoc(docType);
  }

  isFinancialValid() {
    return UtilsService.isFinancialValid();
  }

  isTaxValid() {
    return UtilsService.isTaxValid();
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
"financial": "Justificatif de ressources",
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
