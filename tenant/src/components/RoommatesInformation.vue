<template>
  <div class="rf-grid-row rf-grid-row--center">
    <div class="col-md-8 col-lg-6">
      <div class="rf-grid-row rf-grid-row--center">
        <div class="rf-col-12">
          <label class="rf-label">{{ $t("roommateEmail") }}</label>
          <div
            class="rf-mb-1w"
            v-for="(roommate, key) in roommatesNotMe()"
            v-bind:key="key"
          >
            <div class="rf-grid-row">
              <validation-provider
                rules="email"
                v-slot="{ errors }"
                class="rf-col-10"
              >
                <div
                  class="rf-input-group"
                  :class="errors[0] ? 'rf-input-group--error' : ''"
                >
                  <input
                    v-model="roommate.email"
                    class="form-control rf-input"
                    name="email"
                    placeholder="Ex : exemple@exemple.fr"
                    type="email"
                    required
                  />
                  <span class="rf-error-text" v-if="errors[0]">{{
                    $t(errors[0])
                  }}</span>
                </div>
              </validation-provider>
              <div class="rf-col-2">
                <button
                  class="rf-btn rf-btn--icon rf-btn--secondary"
                  :title="$t('delete')"
                  :disabled="roommates.length <= 1"
                  @click="remove(key)"
                >
                  <span class="icon icon-Close text-danger"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="rf-col-12 rf-mb-3w">
          <a href="#" @click="addMail">{{ $t("addRommate") }}</a>
        </div>
        <div class="rf-col-12 rf-mb-3w">
          <validation-provider rules="is" v-slot="{ errors }" class="rf-col-10">
            <div
              class="rf-input-group"
              :class="errors[0] ? 'rf-input-group--error' : ''"
            >
              <input
                type="checkbox"
                id="authorize"
                value="false"
                v-model="author"
              />
              <label for="authorize">{{ $t("acceptAuthor") }}</label>
              <span class="rf-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </div>
          </validation-provider>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { email, is } from "vee-validate/dist/rules";
import { User } from "df-shared/src/models/User";
import { mapState } from "vuex";

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
    ValidationObserver
  },
  computed: {
    ...mapState({
      roommates: "roommates",
      user: "user"
    })
  }
})
export default class RoommatesInformation extends Vue {
  roommates!: User[];
  user!: User;
  @PropSync("authorize", { type: Boolean })
  readonly author!: boolean;

  mounted() {
    if (this.roommates.length === 0) {
      this.$store.commit("createRoommates");
    }
  }

  addMail() {
    this.$store.commit("createRoommates");
  }

  remove(key: number) {
    this.roommates.splice(key, 1);
  }

  roommatesNotMe() {
    return this.roommates.filter((r: User) => {
      return r.id != this.user.id;
    });
  }
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"roommateEmail": "Veuillez renseigner l’adresse email de votre colocataire",
"addRommate": "Ajouter un colocataire",
"acceptAuthor": "J’accepte que les autres membres de ma colocation aient accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que tous les dossiers de la colocation auront été validés",
"delete": "Supprimer",
"email-not-valid": "Email not valid",
"field-required": "This field is required"
},
"fr": {
"roommateEmail": "Veuillez renseigner l’adresse email de votre colocataire",
"addRommate": "Ajouter un colocataire",
"acceptAuthor": "J’accepte que les autres membres de ma colocation aient accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que tous les dossiers de la colocation auront été validés",
"delete": "Supprimer",
"email-not-valid": "Email non valide",
"field-required": "Ce champ est requis"
}
}
</i18n>
