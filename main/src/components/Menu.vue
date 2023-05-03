<template>
  <ul class="fr-nav__list">
    <li class="fr-nav__item">
      <a
        :href="`${MAIN_URL}/information`"
        class="fr-nav__link"
        :aria-current="currentPage() === 'Information' ? 'page' : false"
      >
        {{ $t("information") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${MAIN_URL}/blog`"
        class="fr-nav__link"
        :aria-current="currentPage() === 'Blog' ? 'page' : false"
      >
        {{ $t("blog") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${DOCS_URL}`"
        class="fr-nav__link fr-external-link"
        target="_blank"
        rel="noreferrer"
      >
        {{ $t("help") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <a
        :href="`${MAIN_URL}/contact`"
        :aria-current="currentPage() === 'Contact'"
        class="fr-nav__link"
        id="contact-us"
      >
        <span class="fr-icon-mail-line fr-icon--sm" aria-hidden="true"></span>
        {{ $t("contact-us") }}
      </a>
    </li>
    <li class="fr-nav__item">
      <button
        class="fr-nav__link fr-btn fr-ml-3 fr-btn--secondary fr-btn--sm lang"
        @click="changeLang"
      >
        {{ getLanguageSwitchLabel() }}
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import i18n from "../i18n";

@Component({
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn"
    })
  }
})
export default class Menu extends Vue {
  isLoggedIn?: boolean;

  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  DOCS_URL = `//${process.env.VUE_APP_DOCS_URL}`;

  currentPage() {
    return this.$route.name;
  }
  changeLang() {
    const lang = i18n.locale === "fr" ? "en" : "fr";
    this.$store.dispatch("setLang", lang);
  }
  getLanguageSwitchLabel() {
    return i18n.locale === "fr" ? "English version" : "Version française";
  }
}
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
