<template>
  <button
    class="fr-translate__btn fr-nav__link fr-mb-0"
    aria-controls="select-language"
    aria-expanded="false"
    :title="getCurrentLanguage().selectLabel"
  >
    {{ getCurrentLanguage().code }}
    <span class="fr-hidden-lg"> - {{ getCurrentLanguage().name }}</span>
  </button>
  <div class="fr-collapse fr-translate__menu fr-menu" id="select-language">
    <ul class="fr-menu__list">
      <li v-for="language in availableLanguages" v-bind:key="language.id">
        <a
          class="fr-translate__language fr-nav__link"
          :hreflang="language.id"
          :lang="language.id"
          href="#"
          :aria-current="getCurrentLanguage() === language ? true : undefined"
          @click="selectLanguage(language)"
        >
          {{ language.code }} - {{ language.name }}
        </a>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import i18n from "owner/src/i18n";
import { Composer } from "vue-i18n";

const emit = defineEmits(["on-change-lang"]);

const availableLanguages: Language[] = [
  {
    id: "fr",
    code: "FR",
    name: "Français",
    selectLabel: "Sélectionner une langue",
  },
  {
    id: "en",
    code: "EN",
    name: "English",
    selectLabel: "Select a language",
  },
];

function getCurrentLanguage() {
  return availableLanguages.find(
    (language) => language.id === (i18n.global as Composer).locale.value
  );
}

function selectLanguage(language: Language) {
  emit("on-change", language.id);
}

interface Language {
  id: string;
  code: string;
  name: string;
  selectLabel: string;
}
</script>
<style scoped lang="scss"></style>
