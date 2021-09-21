<template>
  <div
    class="name-container fr-container fr-container-full-size bg--grey "
  > <!-- fr-grid-row -->
    <div class="fr-col-xs-12 fr-col-md-4 fr-col-xl-3 bg--dark-blue">
      <div class="title-container">
        <h1>{{ $t("title") }}</h1>
        <h5>{{ $t("subtitle") }}</h5>
      </div>
    </div>
    <div
      class="fr-col-xl-9 fr-col-md-8 fr-col-xs-12 fr-p-md-4w fr-p-2w fr-grid-row fr-grid-row--center"
    >
      <div class="fr-col-xs-12 fr-col-md-8 fr-col-xl-6 max-600">
        <NakedCard class="fr-pt-3w fr-pb-3w">
          <NameInformationForm :user="user"></NameInformationForm>
        </NakedCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NameInformationForm from "@/components/NameInformationForm.vue";
import ProfileContainer from "@/components/ProfileContainer.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";

@Component({
  components: {
    NameInformationForm,
    ProfileContainer,
    NakedCard
  }
})
export default class NameInformation extends Vue {
  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
    const localScript = document.createElement("script");
    localScript.setAttribute("src", "/js/dsfr.module.min.js");
    document.head.appendChild(localScript);
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
h1 {
  font-size: 2rem;
}
h5,
h1 {
  color: var(--w);
}

.title-container {
  @media all and (min-width: 768px) {
    margin-top: 200px;
    margin-left: 1.5rem;
    margin-right: 1rem;
  }
}

.name-container {
  @media all and (min-width: 768px) {
    min-height: 100%;
  }
}
</style>

<i18n>
{
"en": {
  "title": "You are only a few steps away from your rental file!",
  "subtitle": "Let's start with your personal identity information."
},
"fr": {
  "title": "Vous n'êtes qu'à quelques étapes de votre dossier de location !",
  "subtitle": "Commençons par vos informations personnelles d'identité."
}
}
</i18n>
