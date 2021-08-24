<template>
  <div>
    <h1 class="fr-h1">{{ $t("title") }}</h1>
    <div v-if="!hasGuarantors()">
      <p>{{ $t("read-no-guarantor") }}</p>
      <div>
        <input
          type="checkbox"
          id="declaration"
          value="false"
          v-model="declaration"
        />
        <label for="declaration">{{ $t("declaration") }}</label>
      </div>

      <div v-if="false">
        <validation-provider v-slot="{ errors }">
          <div
            class="fr-input-group"
            :class="errors[0] ? 'fr-input-group--error' : ''"
          >
            <p>
              <label for="precision" class="fr-label">
                {{ $t("precision") }}
              </label>
              <input
                id="precision"
                :placeholder="$t('placeholder')"
                type="text"
                maxlength="500"
                v-model="precision"
                name="precision"
                class="validate-required form-control fr-input"
              />
              <span class="fr-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </p>
          </div>
        </validation-provider>
      </div>

      <div class="fr-mt-3w">
        <button
          class="fr-btn"
          type="submit"
          @click="validate()"
          :disabled="canValidate()"
        >
          {{ $t("validate") }}
        </button>
      </div>
    </div>
    <div v-if="hasGuarantors()">
      <p>{{ $t("read") }}</p>
      <div>
        <input
          type="checkbox"
          id="declaration"
          value="false"
          v-model="declaration"
        />
        <label for="declaration">{{ $t("declaration") }}</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="declaration2"
          value="false"
          v-model="declaration2"
        />
        <label for="declaration2">{{ $t("declaration2") }}</label>
      </div>
      <div v-if="false">
        <validation-provider v-slot="{ errors }">
          <div
            class="fr-input-group"
            :class="errors[0] ? 'fr-input-group--error' : ''"
          >
            <p>
              <label for="precision" class="fr-label">
                {{ $t("precision") }}</label
              >
              <input
                id="precision"
                :placeholder="$t('placeholder')"
                type="text"
                v-model="precision"
                name="precision"
                class="validate-required form-control fr-input"
              />
              <span class="fr-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </p>
          </div>
        </validation-provider>
      </div>
      <ProfileFooter
        @on-back="goBack"
        @on-next="validate()"
        :nextLabel="$t('validate')"
      ></ProfileFooter>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ValidationProvider } from "vee-validate";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { Guarantor } from "df-shared/src/models/Guarantor";
import ProfileFooter from "@/components/footer/ProfileFooter.vue";

@Component({
  components: { ValidationProvider, ProfileFooter },
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
  }

  validate() {
    if (this.declaration && (!this.hasGuarantors() || this.declaration2)) {
      const loader = Vue.$loading.show();
      this.$store
        .dispatch("validateFile", {
          honorDeclaration: true,
          clarification: this.precision
        })
        .catch(() => {
          Vue.toasted.global.error();
        })
        .finally(() => {
          loader.hide();
        });
    }
  }

  goBack() {
    this.$store.commit("setStep", 3);
  }

  canValidate() {
    return !(this.declaration && (!this.hasGuarantors() || this.declaration2));
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
        "declaration2": "Je déclare sur l'honneur avoir avoir reçu le consentement de mon garant pour que ses données soient traitées dans le cadre du processus de location"
    },
    "fr": {
        "title": "Je valide mon dossier",
        "read-no-guarantor": "Je lis et je coche la case suivante afin de valider mon dossier",
        "declaration": "Je déclare avoir pris connaissance de l'article 441-1 du code pénal qui punit le faux et l'usage de faux de trois ans d'emprisonnement et de 45000 euros d'amende.",
        "precision": "Si je le souhaite, je peux préciser certains éléments importants de ma situation à mes futurs propriétaires. Mon texte sera ajouté au début de mon dossier :",
        "placeholder": "Renseignez votre commentaire ici",
        "validate": "Valider mon dossier",
        "read": "Je lis et je coche les cases suivantes afin de valider mon dossier",
        "declaration2": "Je déclare sur l'honneur avoir avoir reçu le consentement de mon garant pour que ses données soient traitées dans le cadre du processus de location"
    }
}
</i18n>
