<template>
  <div>
    <ValidationObserver v-slot="{ validate }">
      <form name="form" @submit.prevent="validate().then(sendFile)">
        <div v-if="!hasErrors()">
          <h1 class="fr-h1">{{ $t("title") }}</h1>
          <div v-if="!hasGuarantors()">
            <p>{{ $t("read-no-guarantor") }}</p>
            <div class="fr-mb-3w">
              <validation-provider rules="is" v-slot="{ errors }">
                <div
                  class="fr-checkbox-group bg-purple"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <input
                    type="checkbox"
                    id="declaration"
                    value="false"
                    v-model="declaration"
                  />
                  <label for="declaration" v-html="$t('declaration')"></label>
                  <span class="fr-error-text" v-if="errors[0]">{{
                    $t(errors[0])
                  }}</span>
                </div>
              </validation-provider>
            </div>

            <div v-if="user.tenantType === 'CREATE'">
              <validation-provider rules="is" v-slot="{ errors }">
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <p>
                    <label for="precision" class="fr-label">
                      {{ $t("precision") }}
                    </label>
                    <textarea
                      id="precision"
                      :placeholder="$t('placeholder')"
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
            </div>
          </div>
          <div v-if="hasGuarantors()">
            <p>{{ $t("read") }}</p>
            <div class="bg-purple fr-mb-3w">
              <validation-provider rules="is" v-slot="{ errors }">
                <div
                  class="fr-checkbox-group bg-purple"
                  :class="errors[0] ? 'fr-checkbox-group--error' : ''"
                >
                  <input
                    type="checkbox"
                    id="declaration"
                    value="false"
                    v-model="declaration"
                  />
                  <label for="declaration">{{ $t("declaration") }}</label>
                  <span class="fr-error-text" v-if="errors[0]">{{
                    $t(errors[0])
                  }}</span>
                </div>
              </validation-provider>
              <div>
                <validation-provider rules="is" v-slot="{ errors }">
                  <div
                    class="fr-checkbox-group bg-purple"
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
                        ? $t("declaration2-plural")
                        : $t("declaration2")
                    }}</label>
                    <span class="fr-error-text" v-if="errors[0]">{{
                      $t(errors[0])
                    }}</span>
                  </div>
                </validation-provider>
              </div>
            </div>
            <div v-if="user.tenantType === 'CREATE'">
              <validation-provider rules="is" v-slot="{ errors }">
                <div
                  class="fr-input-group"
                  :class="errors[0] ? 'fr-input-group--error' : ''"
                >
                  <p>
                    <label for="precision" class="fr-label">
                      {{ $t("precision") }}</label
                    >
                    <textarea
                      id="precision"
                      :placeholder="$t('placeholder')"
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
            </div>
          </div>
        </div>
        <div v-if="hasErrors()">
          <NakedCard class="fr-px-5w fr-py-3w ">
            <div>
              <h6 class="fr-h6 color--secondary">
                {{ $t("validation-error-title") }}
              </h6>
              <p>
                {{ $t("validation-error-description") }}
              </p>
            </div>
          </NakedCard>
          <FileErrors></FileErrors>
        </div>
        <ProfileFooter
          @on-back="goBack()"
          :disabled="hasErrors()"
          :nextLabel="$t('validate')"
        ></ProfileFooter>
      </form>
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

extend("is", {
  ...is,
  message: "require-accept",
  validate: value => !!value
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    ProfileFooter,
    FileErrors,
    NakedCard
  },
  computed: {
    ...mapState({
      user: "user"
    })
  }
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
      window.scrollTo(0, 0);
      return;
    }

    if (this.user.status === "VALIDATED") {
      this.$router.push("/account");
      return;
    }
    const loader = Vue.$loading.show();
    const params: any = {
      honorDeclaration: true
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
    return !UtilsService.allDocumentsFilled();
  }

  canValidate() {
    return this.declaration && (!this.hasGuarantors() || this.declaration2);
  }

  hasGuarantors() {
    const res =
      this.user.guarantors &&
      this.user.guarantors.length > 0 &&
      this.user.guarantors.findIndex((g: Guarantor) => {
        return g.typeGuarantor !== "ORGANISM";
      }) >= 0;

    return res;
  }
}
</script>

<i18n>
{
    "en": {
        "title": "Je valide mon dossier",
        "read-no-guarantor": "Je lis et je coche la case suivante afin de valider mon dossier",
        "declaration": "Je déclare avoir pris connaissance de l'article 441-1 du code pénal qui punit le faux et l'usage de faux de trois ans d'emprisonnement et de 45000 euros d'amende.",
        "precision": "Si je le souhaite, je peux préciser certains éléments importants de ma situation à mes futurs propriétaires. Mon texte sera ajouté au début de mon dossier:",
        "placeholder": "Renseignez votre commentaire ici",
        "validate": "Valider mon dossier",
        "read": "Je lis et je coche les cases suivantes afin de valider mon dossier",
        "declaration2": "Je déclare sur l'honneur avoir reçu le consentement de mon garant pour que ses données soient traitées dans le cadre du processus de location",
        "declaration2-plural": "Je déclare sur l'honneur avoir reçu le consentement de mes garants pour que leurs données soient traitées dans le cadre du processus de location",
        "require-accept": "You must accept the declaration",
        "validation-error-title": "You're so close !",
        "validation-error-description": "Limit update, check your files today"
    },
    "fr": {
        "title": "Je valide mon dossier",
        "read-no-guarantor": "Je lis et je coche la case suivante afin de valider mon dossier",
        "declaration": "Je déclare avoir pris connaissance de l'article 441-1 du code pénal qui punit le faux et l'usage de faux de trois ans d'emprisonnement et de 45000 euros d'amende.",
        "precision": "Si je le souhaite, je peux préciser certains éléments importants de ma situation à mes futurs propriétaires. Mon texte sera ajouté au début de mon dossier :",
        "placeholder": "Renseignez votre commentaire ici",
        "validate": "Valider mon dossier",
        "read": "Je lis et je coche les cases suivantes afin de valider mon dossier",
        "declaration2": "Je déclare sur l'honneur avoir reçu le consentement de mon garant pour que ses données soient traitées dans le cadre du processus de location",
        "declaration2-plural": "Je déclare sur l'honneur avoir reçu le consentement de mes garants pour que leurs données soient traitées dans le cadre du processus de location",
        "require-accept": "Vous devez accepter la déclaration",
        "validation-error-title": "Vous y êtes presque !",
        "validation-error-description": "Limiter les modifications, pensez à vérifier votre dossier dès aujourd'hui"
    }
}
</i18n>
