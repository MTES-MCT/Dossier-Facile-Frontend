<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12">
          <h6>{{ $t("title") }}</h6>
          <v-gouv-fr-modal>
            <template v-slot:button>
              <span class="small-font">{{ $t("more-information") }}</span>
            </template>
            <template v-slot:title>
              {{ $t("more-information") }}
            </template>
            <template v-slot:content>
              <p>
                <CoupleInformationHelp></CoupleInformationHelp>
              </p>
            </template>
          </v-gouv-fr-modal>
        </div>
      </div>
      <div class="fr-grid-row fr-grid-row--center">
        <div v-if="!showEdition" class="fr-col-12 fr-mt-2w">
          <NakedCard>
            <div class="fr-grid-row bg--white">
              <div class="fr-col-10">
                <div class="fr-grid-row nowrap">
                  <div class="center-icon fr-mr-1w">
                    <span class="color--white material-icons md-24 round-icon"
                      >person</span
                    >
                  </div>
                  <div class="fr-grid-col overflow--hidden max-content">
                    <div
                      :title="'' + coTenant.firstName + coTenant.lastName"
                      class="overflow--hidden"
                    >
                      <b>
                        {{ coTenant.firstName + " " + coTenant.lastName }}
                      </b>
                    </div>
                    <div class="small-text">
                      {{ coTenant.email }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="fr-col-2 center-icon">
                <button
                  class="fr-btn fr-btn--secondary icon-btn"
                  :title="$t('delete')"
                  @click="edit()"
                  type="button"
                >
                  <span class="color--primary material-icons md-24" aria-hidden="true"
                    >delete_forever</span
                  >
                </button>
              </div>
            </div>
          </NakedCard>
        </div>

        <div class="fr-col-12 fr-mt-2w" v-else>
          <div class="fr-col-12 fr-mb-3w">
            <label class="fr-label fr-mb-1w">{{ $t("spouseLastName") }}</label>
            <validation-provider v-slot="{ errors }">
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  v-model="coTenant.lastName"
                  class="validate-required form-control fr-input"
                  :class="errors[0] ? 'fr-input--error' : ''"
                  name="coTenantLastName"
                  type="text"
                  @input="handleInput"
                />
                <span
                  class="fr-error-text"
                  v-if="errors[0] && errors[0] !== 'none'"
                  >{{ $t(errors[0]) }}</span
                >
              </div>
            </validation-provider>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <label class="fr-label fr-mb-1w">{{ $t("spouseFirstName") }}</label>
            <validation-provider v-slot="{ errors }">
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  v-model="coTenant.firstName"
                  class="validate-required form-control fr-input"
                  :class="errors[0] ? 'fr-input--error' : ''"
                  name="firstName"
                  type="text"
                  @input="handleInput"
                />
                <span
                  class="fr-error-text"
                  v-if="errors[0] && errors[0] !== 'none'"
                  >{{ $t(errors[0]) }}</span
                >
              </div>
            </validation-provider>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <label class="fr-label fr-mb-1w">{{ $t("spouseEmail") }}</label>
            <validation-provider
              v-slot="{ errors }"
              :rules="{ email: true, custom: user.email }"
            >
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  v-model="coTenant.email"
                  class="validate-required form-control fr-input"
                  :class="errors[0] ? 'fr-input--error' : ''"
                  name="email"
                  placeholder="Ex : exemple@exemple.fr"
                  type="email"
                  @input="handleInput"
                />
                <span
                  class="fr-error-text"
                  v-if="errors[0] && errors[0] !== 'none'"
                  >{{ $t(errors[0]) }}</span
                >
              </div>
            </validation-provider>
          </div>
        </div>
      </div>
    </NakedCard>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-mb-3w fr-mt-3w">
        <validation-provider rules="is" v-slot="{ errors }" class="fr-col-10">
          <div
            class="fr-checkbox-group bg-purple"
            :class="errors[0] ? 'fr-input-group--error' : ''"
          >
            <input
              type="checkbox"
              id="authorize"
              value="false"
              v-model="authorize"
              @change="updateAuthorize()"
            />
            <label for="authorize">{{ $t("acceptAuthor") }}</label>
            <span class="fr-error-text" v-if="errors[0]">{{
              $t(errors[0])
            }}</span>
          </div>
        </validation-provider>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { email, is } from "vee-validate/dist/rules";
import { mapGetters, mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import CoupleInformationHelp from "./helps/CoupleInformationHelp.vue";

extend("email", {
  ...email,
  message: "email-not-valid"
});

extend("is", {
  ...is,
  message: "field-required",
  validate: value => !!value
});

extend("custom", {
  ...is,
  message: "none",
  validate: (v1, v2: any) => {
    return v1 !== v2.other;
  }
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    VGouvFrButton,
    VGouvFrModal,
    CoupleInformationHelp,
    NakedCard
  },
  computed: {
    ...mapState({
      user: "user"
    }),
    ...mapGetters({
      spouseAuthorize: "spouseAuthorize"
    })
  }
})
export default class CoupleInformation extends Vue {
  coTenant = new User();
  authorize = false;
  spouseAuthorize!: boolean;
  showEdition = true;

  user!: User;

  mounted() {
    if ((this.user.apartmentSharing?.tenants.length || 0) > 1) {
      const partner = this.user.apartmentSharing?.tenants.find(t => {
        return t.email != this.user.email;
      });
      this.coTenant = partner || this.coTenant;
      this.showEdition = false;
    }
    this.authorize = this.spouseAuthorize;
  }

  handleInput() {
    this.$emit("input", [this.coTenant]);
  }

  updateAuthorize() {
    this.$store.commit("updateCoupleAuthorize", this.authorize);
  }

  coTenantIsValid() {
    return (
      ((this.coTenant.firstName?.length || 0) > 0 &&
        (this.coTenant.lastName?.length || 0) > 0) ||
      this.coTenant.email.length > 3
    );
  }

  edit() {
    this.showEdition = true;
    this.coTenant = new User();
  }
}
</script>

<style scoped lang="scss">
.overflow--hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.fr-btn {
  box-shadow: none;
  background-color: none;
  --color-hover: none;
  --color-active: none;
  padding: 0;
}

.icon-btn {
  display: block;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
}

.material-icons,
.material-icons-outlined {
  border-radius: 50%;
  --color-hover: var(--block-color-hover);
  --color-active: var(--block-color-active);
  padding: 0.25rem;
}

.center-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.round-icon {
  border-radius: 50%;
  background-color: var(--primary);
  padding: 0.25rem;
}

.card {
  box-shadow: 0 1px 8px 0 #cecece;
  @media all and (min-width: 992px) {
    padding: 1.5rem;
  }
}

.nowrap {
  flex-wrap: nowrap;
  overflow: auto;
}

.max-content {
  max-width: max-content;
  @media all and (max-width: 420px) {
    max-width: 200px;
  }
}
</style>

<i18n>
{
"en": {
"spouseFirstName": "Your spouse firstname",
"spouseLastName": "Your spouse lastname",
"spouseEmail": "Your spouse email",
"acceptAuthor": "J’accepte que mon partenaire ait accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que nos deux dossiers auront été validés",
"email-not-valid": "Email not valid",
"field-required": "This field is required",
"title": "Who will be you spouse ?",
"invite-waiting": "Waiting for confirmation",
"invite-sent": "Invitation sent",
"add-a-spouse": "Add your spouse",
"email-exists": "You can not associate two account with only one email address ! <br>Fullfill a different email address.",
"more-information": "How is this information useful to us?",
"require-accept": "You must accept the statement",
"delete": "Delete the invitation"
},
"fr": {
"spouseFirstName": "Prénom de votre conjoint",
"spouseLastName": "Nom de votre conjoint",
"spouseEmail": "L’adresse email de votre conjoint",
"acceptAuthor": "J’accepte que mon partenaire ait accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que nos deux dossiers auront été validés",
"email-not-valid": "Email non valide",
"field-required": "Ce champ est requis",
"title": "Qui sera votre conjoint·e ?",
"add-a-spouse": "Ajouter votre conjoint·e",
"invite-waiting": "Invitation en attente d'envoi",
"invite-sent": "Invitation envoyée",
"email-exists": "Vous ne pouvez pas associer deux comptes à une même adresse email ! <br>Renseignez une adresse email différente.",
"more-information": "En quoi cette information nous est utile ?",
"require-accept": "Vous devez accepter la déclaration",
"delete": "Supprimer l'invitation"
}
}
</i18n>
