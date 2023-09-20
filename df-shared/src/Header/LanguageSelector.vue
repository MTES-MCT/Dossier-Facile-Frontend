<template>
  <li class="fr-translate fr-nav__item">
    <button
      class="fr-translate__btn fr-nav__link fr-mb-0"
      aria-controls="select-language"
      aria-expanded="false"
      :title="currentLanguage.selectLabel"
    >
      {{ currentLanguage.code }}
      <span class="fr-hidden-lg"> - {{ currentLanguage.name }}</span>
    </button>
    <div class="fr-collapse fr-translate__menu fr-menu" id="select-language">
      <ul class="fr-menu__list">
        <li v-for="language in availableLanguages" v-bind:key="language.id">
          <a
            class="fr-translate__language fr-nav__link"
            :hreflang="language.id"
            :lang="language.id"
            href="#"
            :aria-current="currentLanguage === language"
            @click="selectLanguage(language)"
            >{{ language.code }} - {{ language.name }}</a
          >
        </li>
      </ul>
    </div>
  </li>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class LanguageSelector extends Vue {
  @Prop() initialLanguage!: string;

  availableLanguages: Language[] = [FRENCH, ENGLISH];

  currentLanguage: Language =
    this.availableLanguages.find(
      (language) => language.id === this.initialLanguage
    ) || FRENCH;

  selectLanguage(language: Language) {
    this.$store.dispatch("setLang", language.id);
    this.currentLanguage = language;
  }
}

interface Language {
  id: string;
  code: string;
  name: string;
  selectLabel: string;
}

const FRENCH = {
  id: "fr",
  code: "FR",
  name: "Français",
  selectLabel: "Sélectionner une langue",
};

const ENGLISH = {
  id: "en",
  code: "EN",
  name: "English",
  selectLabel: "Select a language",
};
</script>
<style scoped lang="scss"></style>
