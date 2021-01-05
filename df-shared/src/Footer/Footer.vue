<template>
  <footer class="rf-footer" role="contentinfo" id="">
    <div class="rf-container">
      <div class="rf-footer__body">
        <div class="rf-footer__brand">
          <a class="rf-logo" href="#" title="république<br>française">
            <span class="rf-logo__title">république <br />française</span>
          </a>
        </div>
        <div class="rf-footer__content">
          <ul class="rf-footer__content-links links-center rf-grid-row">
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
              <a :href="`${VUE_APP_MAIN_URL}/information`">
                {{ $t("information") }}
              </a>
            </li>
            <li class="rf-col-lg-3 rf-col-6">
              <a href="http://legifrance.gouv.fr">legifrance.gouv.fr</a>
            </li>
            <li class="rf-col-lg-3 rf-col-6">
              <a href="http://gouvernement.fr">gouvernement.fr</a>
            </li>
            <li class="rf-col-lg-3 rf-col-6">
              <a href="http://service-public.fr">service-public.fr</a>
            </li>
            <li class="rf-col-lg-3 rf-col-6">
              <a href="http://data.gouv.fr">data.gouv.fr</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="rf-footer__bottom">
        <ul class="rf-footer__bottom-list">
          <li>
            <a href="mailto:contact@dossierfacile.fr">{{ $t("contact") }}</a>
          </li>
          <li>
            <a :href="`${VUE_APP_MAIN_URL}/securite-des-donnees`">
              {{ $t("legals") }}
            </a>
          </li>
          <li class="rf-footer__bottom-item">
            <a class="rf-footer__bottom-link" href="#"
              >Accessibilité: partiellement conforme</a
            >
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
</style>

<i18n>
{
  "en": {
    "contact": "You can contact us at contact@dossierfacile.fr",
    "legals": "Legal notice",
    "faq": "FAQ",
    "blog": "Blog",
    "information": "Information"
  },
  "fr": {
    "contact": "Vous pouvez nous contacter à contact@dossierfacile.fr",
    "legals": "Mentions légales",
    "faq": "FAQ",
    "blog": "Blog",
    "information": "En savoir plus"
  }
}
</i18n>
