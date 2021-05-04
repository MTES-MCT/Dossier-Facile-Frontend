<template>
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-12">
      <h4>{{ $t("title") }}</h4>
    </div>
    <div class="fr-col-12">
      <label class="fr-label">{{ $t("roommateEmail") }}</label>
      <div
        class="fr-mb-1w"
        v-for="(roommate, key) in roommates"
        v-bind:key="key"
      >
        <div class="fr-grid-row">
          <validation-provider
            rules="email"
            v-slot="{ errors }"
            class="fr-col-10"
          >
            <div
              class="fr-input-group"
              :class="errors[0] ? 'fr-input-group--error' : ''"
            >
              <input
                v-model="roommate.email"
                class="form-control fr-input"
                name="email"
                placeholder="Ex : exemple@exemple.fr"
                type="email"
                @change="updateRoommates()"
                required
              />
              <span class="fr-error-text" v-if="errors[0]">{{
                $t(errors[0])
              }}</span>
            </div>
          </validation-provider>
          <div class="fr-col-2">
            <button
              type="button"
              class="fr-btn fr-btn--icon fr-btn--secondary"
              :title="$t('delete')"
              :disabled="user.apartmentSharing.tenants.length <= 1"
              @click="remove(key)"
            >
              <span class="text-danger material-icons">delete_forever</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="fr-col-12 fr-mb-3w">
      <a href="#" @click="addMail">{{ $t("addRommate") }}</a>
    </div>
    <div class="fr-col-12 fr-mb-3w">
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
import { Component, PropSync, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { email, is } from "vee-validate/dist/rules";
import { User } from "df-shared/src/models/User";
import { mapGetters, mapState } from "vuex";

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

  mounted() {
    if ((this.user.apartmentSharing?.tenants.length || 0) < 2) {
      this.$store.commit("createRoommates");
    }
    this.authorize = this.coTenantAuthorize;
  }

  addMail() {
    this.$store.commit("createRoommates");
  }

  remove(key: number) {
    this.$store.commit("deleteRoommates", key);
    return false;
  }

  updateAuthorize() {
    this.$store.commit("updateCoTenantAuthorize", this.authorize);
  }

  updateRoommates() {
    this.$store.commit("updateRoommates", this.roommates);
  }
}
</script>

<style scoped lang="scss"></style>

<i18n>
{
"en": {
"roommateEmail": "Your roommates email",
"addRommate": "Add a roommate",
"acceptAuthor": "I agree that the other members of my roommate have access to my documents as well as those of my guarantor, if applicable, once all the files of the roommate have been validated",
"delete": "Delete",
"email-not-valid": "Email not valid",
"field-required": "This field is required",
"title": "Who are your roommates ?"
},
"fr": {
"roommateEmail": "L’adresse email de votre colocataire",
"addRommate": "Ajouter un colocataire",
"acceptAuthor": "J’accepte que les autres membres de ma colocation aient accès à mes documents ainsi qu’à ceux de mon garant le cas échéant une fois que tous les dossiers de la colocation auront été validés",
"delete": "Supprimer",
"email-not-valid": "Email non valide",
"field-required": "Ce champ est requis",
"title": "Qui seront vos colocataires ?"
}
}
</i18n>
