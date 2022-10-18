<template>
  <aside
    class="name-container fr-container fr-container-full-size bg--grey fr-grid-row"
  >
    <div class="fr-col-xs-12 fr-col-md-4 bg--dark-blue">
      <div class="title-container">
        <h2 class="fr-h1">{{ $t("title") }}</h2>
        <h3 class="fr-h5 fr-mb-1w text-bold">
          {{ $t("prepare-documents") }}
        </h3>
        <ul>
          <li>Pièce d'identité</li>
          <li>Justificatif de domicile</li>
          <li>Justificatif de situation professionnelle</li>
          <li>Justificatif de ressources</li>
          <li>Avis d'imposition</li>
        </ul>
        <p>
          <span class="text-bold">Et la même liste pour vos garants !</span>
          <br />
          😱
          <a
            href="https://docs.dossierfacile.fr/"
            target="_blank"
            rel="noopener"
            >Consultez notre documentation.</a
          >
        </p>
      </div>
    </div>
    <div
      class="fr-col-md-8 fr-col-xs-12 fr-grid-row fr-grid-row--center d-p-200"
    >
      <div class="fr-col-xs-12 fr-col-md-10 max-600">
        <NameInformationForm :user="user"></NameInformationForm>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NameInformationForm from "../components/NameInformationForm.vue";
import ProfileContainer from "../components/ProfileContainer.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { mapState } from "vuex";
import { User } from "df-shared/src/models/User";

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
  color: var(--text-inverted-grey);
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

li {
  list-style-type: "👉 ";
}
</style>

<i18n>
{
"en": {
  "title": "Your rental file in 5 supporting document",
  "join-title": "You are only a few steps away from joining {0} rental file!",
  "roommate": "votre colocataire",
  "spouse": "your spouse",
  "prepare-documents": "Prepare your supporting documents:"
},
"fr": {
  "title": "Votre dossier de location en 5 justificatifs !",
  "join-title": "Vous n'êtes qu'à quelques étapes de rejoindre le dossier de location de {0} !",
  "roommate": "votre colocataire",
  "spouse": "votre conjoint",
  "prepare-documents": "Préparez vos pièces justificatives :"
}
}
</i18n>
