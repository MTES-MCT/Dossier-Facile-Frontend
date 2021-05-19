<template>
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-12">
      <h5>{{ $t("title") }}</h5>
    </div>
    <div class="fr-col-12 fr-mt-2w">
      <div v-if="showEmailExists" class="fr-callout">
        <p class="fr-mb-1w" v-html="$t('email-exists')"></p>
      </div>
      <div v-if="roommates.length > 0">
        <div v-for="(roommate, key) in roommates" v-bind:key="key">
          <NakedCard>
            <template v-slot:content>
              <div class="fr-grid-row bg--white">
                <div class="fr-col-10">
                  <div class="fr-grid-row">
                    <div class="fr-col-3 fr-col-md-2 center-icon">
                      <span class="color--white material-icons md-24 round-icon"
                        >person</span
                      >
                    </div>
                    <div class="fr-col-9 fr-col-md-10">
                      <div class="fr-grid-col overflow--hidden">
                        <div :title="roommate.email">
                          <b>
                            {{ roommate.email }}
                          </b>
                        </div>
                        <div class="small-text">
                          {{
                            $t(roommate.id ? "invite-sent" : "invite-waiting")
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="fr-col-2 center-icon">
                  <button
                    class="fr-btn fr-btn--secondary icon-btn"
                    :title="$t('delete')"
                    @click="remove(roommate.email)"
                    type="button"
                  >
                    <span class="color--primary material-icons md-24"
                      >delete_forever</span
                    >
                  </button>
                </div>
              </div>
            </template>
          </NakedCard>
        </div>
      </div>
    </div>
    <div class="fr-col-12 fr-mt-2w">
      <label class="fr-label fr-mb-1w">{{ $t("roommateEmail") }}</label>
      <validation-provider rules="email" v-slot="{ errors }">
        <div
          class="fr-input-group"
          :class="errors[0] ? 'fr-input-group--error' : ''"
        >
          <input
            v-model="newRoommate"
            class="form-control fr-input"
            name="email"
            placeholder="Ex : exemple@exemple.fr"
            type="email"
          />
          <span class="fr-error-text" v-if="errors[0]">{{
            $t(errors[0])
          }}</span>
        </div>
      </validation-provider>
    </div>
    <div class="fr-col-12">
      <div class="fr-grid-row fr-grid-row--right fr-mt-2w fr-mb-3w">
        <v-gouv-fr-button
          :secondary="true"
          :label="$t('add-a-roommate')"
          :btn-type="'button'"
          @click="addMail"
          :disabled="newRoommate === ''"
        ></v-gouv-fr-button>
      </div>
    </div>
    <div class="fr-col-12 fr-mb-3w fr-mt-3w">
      <validation-provider rules="is" v-slot="{ errors }" class="fr-col-10">
        <div
          class="fr-input-group"
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { email, is } from "vee-validate/dist/rules";
import { User } from "df-shared/src/models/User";
import { mapGetters, mapState } from "vuex";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";

extend("email", {
  ...email,
  message: "email-not-valid"
});

extend("is", {
  ...is,
  message: "field-required",
  validate: value => !!value
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    VGouvFrButton,
    NakedCard
  },
  computed: {
    ...mapState({
      user: "user"
    }),
    ...mapGetters({
      roommates: "getRoommates",
      coTenantAuthorize: "coTenantAuthorize"
    })
  }
})
export default class RoommatesInformation extends Vue {
  user!: User;
  authorize = false;
  coTenantAuthorize!: boolean;
  roommates!: User[];
  newRoommate = "";
  showEmailExists = false;

  mounted() {
    this.authorize = this.coTenantAuthorize;
  }

  addMail() {
    this.showEmailExists = false;
    if (this.newRoommate !== "") {
      if (this.user.email !== this.newRoommate) {
        this.$store.commit("createRoommates", this.newRoommate);
        this.newRoommate = "";
      } else {
        this.showEmailExists = true;
      }
    }
  }

  remove(email: string) {
    this.$store.commit("deleteRoommates", email);
    return false;
  }

  updateAuthorize() {
    this.$store.commit("updateCoTenantAuthorize", this.authorize);
  }
}
</script>

<style scoped lang="scss">
.small-text {
  font-size: 0.8rem;
}

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
  @media all and (min-width: 992px) {
    padding: 1.5rem;
  }
}
</style>

<i18n>
{
"en": {
"roommateEmail": "Add a roommate email",
"acceptAuthor": "I agree that the other members of my roommate have access to my documents as well as those of my guarantor, if applicable, once all the files of the roommate have been validated",
"delete": "Delete",
"email-not-valid": "Email not valid",
"field-required": "This field is required",
"title": "Who are your roommates ?",
"add-a-roommate": "Add this roommate",
"invite-waiting": "Waiting for confirmation",
"invite-sent": "Invitation sent",
"my-roommates": "My roommates",
"email-exists": "You can not associate two account with only one email address ! <br>Fullfill a different email address.",
"email-exists-2": "This email address already exists in DossierFacile. Please use an other email address."
},
"fr": {
"roommateEmail": "Ajouter l’adresse email d'un colocataire",
"acceptAuthor": "J’accepte que les autres membres de ma colocation aient accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que tous les dossiers de la colocation auront été validés",
"delete": "Supprimer",
"email-not-valid": "Email non valide",
"field-required": "Ce champ est requis",
"title": "Qui seront vos colocataires ?",
"add-a-roommate": "Inviter ce colocataire",
"invite-waiting": "Invitation en attente d'envoi",
"invite-sent": "Invitation envoyée",
"my-roommates": "Mes colocataires",
"email-exists": "Vous ne pouvez pas associer deux comptes à une même adresse email ! <br>Renseignez une adresse email différente de la votre.",
"email-exists-2": "Cette adresse email est déjà utilisée sur DossierFacile.<br>Renseignez une adresse email différente."
}
}
</i18n>
