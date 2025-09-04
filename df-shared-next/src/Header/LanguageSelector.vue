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
  <div id="select-language" class="fr-collapse fr-translate__menu fr-menu">
    <ul class="fr-menu__list">
      <li v-for="language in availableLanguages" :key="language.id">
        <a
          class="fr-translate__language fr-nav__link"
          :hreflang="language.id"
          :lang="language.id"
          href="#"
          :title="getTitle(language)"
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
  selectLabel: 'Sélectionner une langue',
  selected: 'Langue sélectionnée actuellement'
} as const

const ENGLISH = {
  id: 'en',
  code: 'EN',
  name: 'English',
  selectLabel: 'Select a language',
  selected: 'Currently selected language'
} as const

const props = withDefaults(defineProps<{ initialLanguage?: string }>(), {
  initialLanguage: 'fr'
})

const availableLanguages = [FRENCH, ENGLISH] satisfies Language[]
type AvailableLanguage = (typeof availableLanguages)[number]
type LanguageKey = AvailableLanguage['id']

const emit = defineEmits<{
  'on-change-lang': [lang: LanguageKey]
}>()

const currentLanguage = ref<Language>(FRENCH)

currentLanguage.value =
  availableLanguages.find((language) => language.id === props.initialLanguage) || FRENCH

function selectLanguage(l: AvailableLanguage) {
  emit('on-change-lang', l.id)
  currentLanguage.value = availableLanguages.find((language) => language.id === l.id) || FRENCH
}

function getTitle(l: AvailableLanguage) {
  const selected = currentLanguage.value.code === l.code ? l.selected : ''
  return `${currentLanguage.value.selectLabel} : ${selected} ${l.code} - ${l.name}`
}

interface Language {
  id: string
  code: string
  name: string
  selectLabel: string
  selected: string
}
</script>
