<template>
  <footer class="rf-footer" role="contentinfo" id="footer">
    <div class="rf-container">
      <div class="rf-footer__body">
        <div class="rf-footer__brand">
          <a class="rf-logo" href="#" title="république française">
            <span class="rf-logo__title">république <br />française</span>
          </a>
          <a href="#">
            <img class="footer-logo" src="./logo-betagouvfr.svg" />
          </a>
        </div>
        <div class="rf-footer__content">
          <ul class="rf-footer__content-list links-center rf-grid-row">
            <li class="rf-col-lg-3 rf-col-6 align-right">
              <a
                class="rf-footer__content-link"
                href="https://legifrance.gouv.fr"
                >legifrance.gouv.fr</a
              >
            </li>
            <li class="rf-col-lg-3 rf-col-6 align-right">
              <a class="rf-footer__content-link" href="https://gouvernement.fr"
                >gouvernement.fr</a
              >
            </li>
            <li class="rf-col-lg-3 rf-col-6 align-right">
              <a
                class="rf-footer__content-link"
                href="https://service-public.fr"
                >service-public.fr</a
              >
            </li>
            <li class="rf-col-lg-3 rf-col-6 align-right">
              <a class="rf-footer__content-link" href="https://data.gouv.fr"
                >data.gouv.fr</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="rf-footer__bottom">
        <ul class="rf-footer__bottom-list">
          <li class="rf-footer__bottom-item">
            <a class="rf-footer__bottom-link" href="https://beta.gouv.fr/"
              >Les startups d'Etat</a
            >
          </li>
          <li class="rf-footer__bottom-item">
            <a class="rf-footer__bottom-link" :href="`${VUE_APP_MAIN_URL}/faq`">
              {{ $t("faq") }}
            </a>
          </li>
          <li class="rf-footer__bottom-item">
            <a
              class="rf-footer__bottom-link"
              :href="`${VUE_APP_MAIN_URL}/blog`"
            >
              {{ $t("blog") }}
            </a>
          </li>
          <li class="rf-footer__bottom-item">
            <a
              class="rf-footer__bottom-link"
              href="https://github.com/MTES-MCT/Dossier-Facile-Frontend"
            >
              {{ $t("sources") }}
            </a>
          </li>
          <li class="rf-footer__bottom-item">
            <a
              class="rf-footer__bottom-link blue--link"
              href="mailto:contact@dossierfacile.fr"
              >{{ $t("contact") }}</a
            >
          </li>
          <li class="rf-footer__bottom-item">
            <a class="rf-footer__bottom-link" href="#">{{
              $t("accessibility")
            }}</a>
          </li>
          <li class="rf-footer__bottom-item">
            <a
              class="rf-footer__bottom-link"
              :href="`${VUE_APP_MAIN_URL}/securite-des-donnees`"
            >
              {{ $t("legals") }}
            </a>
          </li>
          <li class="rf-footer__bottom-item">
            <a
              class="rf-footer__bottom-link"
              :href="`${VUE_APP_MAIN_URL}/information`"
            >
              {{ $t("information") }}
            </a>
          </li>
        </ul>
        <div class="rf-footer__bottom-copy">© République Française 2020</div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MyFooter extends Vue {
  VUE_APP_MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
}
</script>

<style lang="scss" scoped>
@import "../scss/_variables.scss";
.blue--link {
  color: $primary !important;
}
.footer-logo {
  min-width: 100px;
  max-width: 100%;
  width: 200px;
  height: auto;
  display: block;
}

.links-center {
  align-self: center;
}

.rf-grid-row {
  width: 100%;
}

.rf-footer__content-list {
  margin-bottom: 0;
}

.align-right {
  margin-top: 0;
  @media (min-width: 768px) {
    text-align: right;
    margin-right: 0;
  }
}

/*

.rf-footer__logo {
  min-width: 100px;
}

.rf-footer__content-links {
  margin-bottom: 0;
}
 */
</style>

<i18n>
{
  "en": {
    "contact": "Nous écrire",
    "legals": "Legal notice",
    "faq": "FAQ",
    "blog": "Blog",
    "information": "Information",
    "sources": "Code source",
    "accessibility": "Accessibilité: partiellement"
  },
  "fr": {
    "contact": "Nous écrire",
    "legals": "Mentions légales",
    "faq": "FAQ",
    "blog": "Blog",
    "information": "En savoir plus",
    "sources": "Code source",
    "accessibility": "Accessibilité: partiellement"
  }
}
</i18n>
