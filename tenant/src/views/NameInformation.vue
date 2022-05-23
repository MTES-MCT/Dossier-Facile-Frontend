<template>
  <div
    class="name-container fr-container fr-container-full-size bg--grey fr-grid-row"
  >
    <div class="fr-col-xs-12 fr-col-md-4 bg--dark-blue">
      <div class="title-container">
        <div class="fr-h1">{{ getTitle() }}</div>
        <div class="fr-h5">{{ $t("subtitle") }}</div>
      </div>
    </div>
    <div
      class="fr-col-md-8 fr-col-xs-12 fr-grid-row fr-grid-row--center d-p-200"
    >
      <div class="fr-col-xs-12 fr-col-md-10 max-600">
        <NameInformationForm :user="user"></NameInformationForm>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NameInformationForm from "../components/NameInformationForm.vue";
import ProfileContainer from "../components/ProfileContainer.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";
import { UtilsService } from "../services/UtilsService";

@Component({
  components: {
    NameInformationForm,
    ProfileContainer,
    NakedCard
  },
  computed: {
    ...mapState({
      user: "user"
    })
  }
})
export default class NameInformation extends Vue {
  user!: User;

  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }

  getTitle() {
    if (this.isOwner()) {
      return this.$i18n.t("title");
    }
    const firstName = UtilsService.getMainUser().firstName;
    if (firstName) {
      return this.$i18n.t("join-title", [firstName]);
    }
    return this.user.applicationType === "COUPLE"
      ? this.$i18n.t("join-title", [this.$i18n.t("spouse")])
      : this.$i18n.t("join-title", [this.$i18n.t("roommate")]);
  }

  isOwner() {
    return (
      this.user.tenantType === undefined || this.user.tenantType === "CREATE"
    );
  }
}
</script>

<style lang="scss" scoped>
.fr-h5,
.fr-h1 {
  color: var(--text-inverted-grey);
}
.fr-h1 {
  font-size: 2rem !important;
}
.fr-h5 {
  font-size: 1.25rem !important;
}

.title-container {
  padding: 1.5rem;
  @media all and (min-width: 768px) {
    padding-top: 200px;
    padding-left: 1.5rem;
    padding-right: 1rem;
  }
}

.name-container {
  @media all and (min-width: 768px) {
    min-height: 100%;
  }
}

.d-p-200 {
  @media all and (min-width: 768px) {
    display: flex;
    flex-direction: column;
    align-content: center;
    padding-left: 4rem;
    padding-right: 4rem;
  }
}
</style>

<i18n>
{
"en": {
  "title": "You are only a few steps away from your rental file!",
  "subtitle": "Let's start with your personal identity information.",
  "join-title": "You are only a few steps away from joining {0} rental file!",
  "roommate": "votre colocataire",
  "spouse": "your spouse"
},
"fr": {
  "title": "Vous n'êtes qu'à quelques étapes de votre dossier de location !",
  "subtitle": "Commençons par vos informations personnelles d'identité.",
  "join-title": "Vous n'êtes qu'à quelques étapes de rejoindre le dossier de location de {0} !",
  "roommate": "votre colocataire",
  "spouse": "votre conjoint"
}
}
</i18n>
