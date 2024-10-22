<template>
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
          :aria-current="currentLanguage.code === language.code ? 'page' : undefined"
          @click="selectLanguage(language)"
          >{{ language.code }} - {{ language.name }}</a
        >
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const FRENCH = {
  id: 'fr',
  code: 'FR',
  name: 'Français',
  selectLabel: 'Sélectionner une langue'
}

const ENGLISH = {
  id: 'en',
  code: 'EN',
  name: 'English',
  selectLabel: 'Select a language'
}

const emit = defineEmits(['on-change-lang'])

const props = withDefaults(defineProps<{ initialLanguage?: string }>(), {
  initialLanguage: 'fr'
})

const availableLanguages: Language[] = [FRENCH, ENGLISH]

const currentLanguage = ref(FRENCH)

currentLanguage.value =
  availableLanguages.find((language) => language.id === props.initialLanguage) || FRENCH

function selectLanguage(l: Language) {
  emit('on-change-lang', l.id)
  currentLanguage.value = availableLanguages.find((language) => language.id === l.id) || FRENCH
}

interface Language {
  id: string
  code: string
  name: string
  selectLabel: string
}
</script>
