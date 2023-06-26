<template>
  <div>
    <ValidationObserver v-slot="{ validate }">
      <form name="form" @submit.prevent="validate().then(sendFile)">
        <div v-if="!hasErrors()">
          <NakedCard class="fr-p-md-5w fr-mb-3w">
            <h1 class="fr-h6">{{ $t("validatefile.title") }}</h1>
            <p>{{ getCheckboxInstructions() }}</p>

            <validation-provider rules="isvalid" v-slot="{ errors }">
              <div
                class="fr-checkbox-group bg-purple fr-mb-3w"
                :class="errors[0] ? 'fr-checkbox-group--error' : ''"
              >
                <input
                  type="checkbox"
                  id="declaration"
                  value="false"
                  v-model="declaration"
                />
                <label for="declaration">
                  <span v-html="$t('validatefile.declaration')"></span>
                </label>
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
            <div v-if="hasGuarantors()">
              <validation-provider rules="isvalid" v-slot="{ errors }">
                <div
                  class="fr-checkbox-group bg-purple fr-mb-3w"
                  :class="errors[0] ? 'fr-checkbox-group--error' : ''"
                >
                  <input
                    type="checkbox"
                    id="declaration2"
                    value="false"
                    v-model="declaration2"
                  />
                  <label for="declaration2">{{
                    user.guarantors.length > 1
                      ? $t("validatefile.declaration2-plural")
                      : $t("validatefile.declaration2")
                  }}</label>
                  <span class="fr-error-text" v-if="errors[0]">{{
                    $t(errors[0])
                  }}</span>
                </div>
              </validation-provider>
            </div>
          </NakedCard>

          <div v-if="user.tenantType === 'CREATE'">
            <NakedCard class="fr-px-5w fr-py-3w fr-mb-2w">
              <validation-provider rules="isvalid" v-slot="{ errors }">
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <p>
                    <label for="precision" class="fr-label">
                      {{ $t("validatefile.precision") }}
                    </label>
                    <textarea
                      id="precision"
                      :placeholder="$t('validatefile.placeholder')"
                      type="text"
                      maxlength="2000"
                      rows="3"
                      v-model="precision"
                      name="precision"
                      class="validate-required form-control fr-input"
                    />
                    <span>{{ precision.length }} / 2000</span>
                    <span class="fr-error-text" v-if="errors[0]">{{
                      $t(errors[0])
                    }}</span>
                  </p>
                </div>
              </validation-provider>
            </NakedCard>
          </div>
        </div>
        <ProfileFooter
          @on-back="goBack()"
          :disabled="hasErrors()"
          :nextLabel="$t('validatefile.validate')"
        ></ProfileFooter>
      </form>
      <div v-if="hasErrors()">
        <NakedCard class="fr-px-5w fr-py-3w">
          <div>
            <h6 class="fr-h6 color--secondary">
              {{ $t("validatefile.validation-error-title") }}
            </h6>
            <p>
              {{ $t("validatefile.validation-error-description") }}
            </p>
          </div>
        </NakedCard>
        <FileErrors></FileErrors>
      </div>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { Guarantor } from "df-shared/src/models/Guarantor";
import ProfileFooter from "./footer/ProfileFooter.vue";
import { UtilsService } from "../services/UtilsService";
import { extend } from "vee-validate";
import { is } from "vee-validate/dist/rules";
import FileErrors from "./FileErrors.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { RegisterService } from "@/services/RegisterService";

extend("isvalid", {
  ...is,
  message: "validatefile.require-accept",
  validate: (value) => !!value,
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    ProfileFooter,
    FileErrors,
    NakedCard,
  },
  computed: {
    ...mapState({
      user: "user",
    }),
  },
})
export default class ValidateFile extends Vue {
  user!: User;
  precision = "";
  declaration = false;
  declaration2 = false;

  mounted() {
    if (this.user.honorDeclaration) {
      this.declaration = true;
      this.declaration2 = true;
    }
    this.precision = this.user?.clarification || "";
  }

  sendFile() {
    if (!this.canValidate()) {
      window.scrollTo(0, 800);
      return;
    }

    if (
      this.user.status === "VALIDATED" &&
      this.precision === this.user?.clarification
    ) {
      this.$router.push("/account");
      return;
    }
    const loader = Vue.$loading.show();
    const params: any = {
      honorDeclaration: true,
    };
    if (this.user.tenantType === "CREATE") {
      params.clarification = this.precision;
    }
    this.$store
      .dispatch("validateFile", params)
      .catch(() => {
        Vue.toasted.global.error();
      })
      .finally(() => {
        loader.hide();
      });
  }

  goBack() {
    this.$emit("on-back");
  }

  hasErrors() {
    return !UtilsService.allDocumentsFilled() || !UtilsService.allNamesFilled();
  }

  canValidate() {
    return this.declaration && (!this.hasGuarantors() || this.declaration2);
  }

  getCheckboxInstructions() {
    return this.hasGuarantors()
      ? this.$t("validatefile.read")
      : this.$t("validatefile.read-no-guarantor");
  }

  hasGuarantors() {
    return (
      this.user.guarantors.length > 0 &&
      this.user.guarantors.findIndex((g: Guarantor) => {
        return g.typeGuarantor !== "ORGANISM";
      }) >= 0
    );
  }
}
</script>
