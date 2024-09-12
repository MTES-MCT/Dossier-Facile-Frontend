<template>
  <ul class="fr-nav__list">
    <li class="fr-nav__item">
      <a
        :href="`${MAIN_URL}/information`"
        class="fr-nav__link"
        :aria-current="currentPage === '/information' ? 'page' : undefined"
      >
        {{ t("information") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${MAIN_URL}/blog`"
        class="fr-nav__link"
        :aria-current="currentPage === '/blog' ? 'page' : undefined"
      >
        {{ t("blog") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${MAIN_URL}/partenaires`"
        class="fr-nav__link"
        :aria-current="currentPage === '/partenaires' ? 'page' : undefined"
      >
        {{ t("partners.menu") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${DOCS_URL}`"
        class="fr-nav__link fr-external-link"
        target="_blank"
        rel="noreferrer"
      >
        {{ t("help") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${MAIN_URL}/contact`"
        :aria-current="currentPage === '/contact' ? 'page' : undefined"
        class="fr-nav__link"
        id="contact-us"
      >
        <span class="fr-icon-mail-line fr-icon--sm" aria-hidden="true"></span>
        {{ t("contact-us") }}
      </a>
    </li>
    <li class="fr-nav__item fr-translate">
      <LanguageSelector @on-change-lang="changeLang" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import LanguageSelector from "df-shared-next/src/Header/LanguageSelector.vue";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import useWwwStore from "../stores/www-store";

  const MAIN_URL = `//${import.meta.env.VITE_MAIN_URL}`;
  const DOCS_URL = `//${import.meta.env.VITE_DOCS_URL}`;

const { t } = useI18n();
const store = useWwwStore();

function changeLang(lang: string) {
  store.setLang(lang);
}

const currentPage = ref("/")

onMounted(() => {
  currentPage.value = window.location.pathname;
});
</script>

<style scoped lang="scss">
@import "@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.css";

.fr-nav__item {
  position: relative;

  a.fr-external-link::after {
    content: "";
  }
}

.fr-nav__list > li:nth-last-child(2) {
  @media all and (min-width: 992px) {
    margin-left: auto;
  }
}

.warn {
  background-color: #fdf2f3;
  a {
    color: var(--error);
  }
}
</style>
