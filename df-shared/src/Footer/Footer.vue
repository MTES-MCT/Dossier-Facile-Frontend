<template>
  <footer class="rf-footer" role="contentinfo" id="">
    <div class="rf-container">
      <div class="rf-footer__body">
        <div class="rf-footer__brand">
          <a class="rf-logo" href="#" title="république<br>française">
            <span class="rf-logo__title">république <br />française</span>
          </a>
          <a href="#">
            <img class="rf-footer__logo" src="./logo-betagouvfr.svg" />
          </a>
        </div>
        <div class="rf-footer__content">
          <ul class="rf-footer__content-links links-center rf-grid-row">
            <li class="rf-col-lg-3 rf-col-6 align-right">
              <a href="http://legifrance.gouv.fr">legifrance.gouv.fr</a>
            </li>
            <li class="rf-col-lg-3 rf-col-6 align-right">
              <a href="http://gouvernement.fr">gouvernement.fr</a>
            </li>
            <li class="rf-col-lg-3 rf-col-6 align-right">
              <a href="http://service-public.fr">service-public.fr</a>
            </li>
            <li class="rf-col-lg-3 rf-col-6 align-right">
              <a href="http://data.gouv.fr">data.gouv.fr</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="rf-footer__bottom">
        <ul class="rf-footer__bottom-list">
          <li class="rf-col-lg-3 rf-col-6">
            <a href="https://beta.gouv.fr/">Les startups d'Etat</a>
          </li>
          <li class="rf-col-lg-3 rf-col-6">
            <a :href="`${VUE_APP_MAIN_URL}/faq`">
              {{ $t("faq") }}
            </a>
          </li>
          <li class="rf-col-lg-3 rf-col-6">
            <a :href="`${VUE_APP_MAIN_URL}/blog`">
              {{ $t("blog") }}
            </a>
          </li>
          <li class="rf-col-lg-3 rf-col-6">
            <a href="https://github.com/MTES-MCT/Dossier-Facile-Frontend">
              {{ $t("sources") }}
            </a>
          </li>
          <li>
            <a class="blue--link" href="mailto:contact@dossierfacile.fr">{{
              $t("contact")
            }}</a>
          </li>
          <li class="rf-footer__bottom-item">
            <a class="rf-footer__bottom-link" href="#">{{
              $t("accessibility")
            }}</a>
          </li>
          <li>
            <a :href="`${VUE_APP_MAIN_URL}/securite-des-donnees`">
              {{ $t("legals") }}
            </a>
          </li>
          <li class="rf-col-lg-3 rf-col-6">
            <a :href="`${VUE_APP_MAIN_URL}/information`">
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
.links-center {
  align-self: center;
}

.rf-grid-row {
  width: 100%;
}

li {
  &.rf-col-lg-3 {
    margin-right: 0;
  }
}

.blue--link {
  color: $primary;
}

@media (min-width: 768px) {
  .align-right {
    text-align: right;
  }
}

.rf-footer__logo {
  min-width: 100px;
}

.rf-footer__content-links {
  margin-bottom: 0;
}

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
