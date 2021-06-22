<template>
  <footer class="fr-footer" role="contentinfo" id="footer">
    <div class="fr-container">
      <div class="fr-footer__body">
        <div class="fr-footer__brand">
          <a class="fr-logo" href="#" title="république française">
            <span class="fr-logo__title">république <br />française</span>
          </a>
          <a class="beta-logo" href="https://beta.gouv.fr/">
            <img
              alt="footer logo dossierfacile"
              class="footer-logo"
              src="./logo-betagouvfr.svg"
            />
          </a>
        </div>
        <div class="fr-footer__content">
          <ul class="fr-footer__content-list links-center fr-grid-row">
            <li class="fr-col-lg-3 fr-col-6 align-right">
              <a
                aria-label="Legifrance"
                class="fr-footer__content-link"
                href="https://legifrance.gouv.fr"
                >legifrance.gouv.fr</a
              >
            </li>
            <li class="fr-col-lg-3 fr-col-6 align-right">
              <a
                class="fr-footer__content-link"
                href="https://gouvernement.fr"
                aria-label="gouvernement"
                >gouvernement.fr</a
              >
            </li>
            <li class="fr-col-lg-3 fr-col-6 align-right">
              <a
                aria-label="service-public"
                class="fr-footer__content-link"
                href="https://service-public.fr"
                >service-public.fr</a
              >
            </li>
            <li class="fr-col-lg-3 fr-col-6 align-right">
              <a
                class="fr-footer__content-link"
                href="https://data.gouv.fr"
                aria-label="data gouv"
                >data.gouv.fr</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="fr-footer__bottom">
        <ul class="fr-footer__bottom-list">
          <li class="fr-footer__bottom-item">
            <a class="fr-footer__bottom-link" href="https://beta.gouv.fr/"
              >Les startups d'Etat</a
            >
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              :href="`${VUE_APP_DOCS_URL}`"
              target="_blank"
            >
              {{ $t("faq") }}
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              :href="`${VUE_APP_MAIN_URL}/blog?lang=${$i18n.locale}`"
            >
              {{ $t("blog") }}
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              href="https://github.com/MTES-MCT/Dossier-Facile-Frontend"
            >
              {{ $t("sources") }}
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link blue--link"
              href="mailto:contact@dossierfacile.fr"
              >{{ $t("contact") }}</a
            >
          </li>
          <li class="fr-footer__bottom-item">
            <a class="fr-footer__bottom-link" href="#">{{
              $t("accessibility")
            }}</a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              :href="
                `${VUE_APP_MAIN_URL}/securite-des-donnees?lang=${$i18n.locale}`
              "
            >
              {{ $t("legals") }}
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              :href="`${VUE_APP_MAIN_URL}/information?lang=${$i18n.locale}`"
            >
              {{ $t("information") }}
            </a>
          </li>
          <li class="fr-footer__bottom-item">
            <a
              class="fr-footer__bottom-link"
              target="_blank"
              href="https://twitter.com/dossierfacile"
              aria-label="twitter"
              rel="noreferrer"
            >
              <svg
                title="twitter"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="twitter-square"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 900 512"
                class="fa-icon"
              >
                <path
                  fill="currentColor"
                  d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z"
                  class=""
                ></path>
              </svg>
            </a>
            <a
              class="fr-footer__bottom-link"
              target="_blank"
              href="https://www.facebook.com/DossierFacile.fr"
              rel="noreferrer"
              aria-label="facebook"
            >
              <svg
                title="facebook"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="facebook-square"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 900 512"
                class="fa-icon"
              >
                <path
                  fill="currentColor"
                  d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"
                  class=""
                ></path>
              </svg>
            </a>
            <a
              class="fr-footer__bottom-link"
              target="_blank"
              href="https://www.linkedin.com/company/startup-d-etat-locatio/"
              rel="noreferrer"
              aria-label="linkedin"
            >
              <svg
                title="linkedin"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="linkedin"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 900 512"
                class="fa-icon"
              >
                <path
                  fill="currentColor"
                  d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
                  class=""
                ></path>
              </svg>
            </a>
          </li>
        </ul>
        <div class="fr-footer__bottom-copy">© République Française 2021</div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MyFooter extends Vue {
  VUE_APP_MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  VUE_APP_DOCS_URL = `//${process.env.VUE_APP_DOCS_URL}`;
}
</script>

<style lang="scss" scoped>
@import "../scss/_variables.scss";
.blue--link {
  color: $primary !important;
}

#footer {
  background-color: white;
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

.fr-grid-row {
  width: 100%;
}

.fr-footer__content-list {
  margin-bottom: 0;
}

.align-right {
  margin-top: 0;
  @media (min-width: 768px) {
    text-align: right;
    margin-right: 0;
  }
}

.fa-icon {
  height: 1.5rem;
  vertical-align: -0.75em;
}

.fr-footer__brand .fr-logo {
  margin-right: 0;
}

.beta-logo {
  padding: 1em;
}
</style>

<i18n>
{
  "en": {
    "contact": "Contact us",
    "legals": "Legal notice",
    "faq": "Help",
    "blog": "Blog",
    "information": "Information",
    "sources": "Source code",
    "accessibility": "Accessibility: partial"
  },
  "fr": {
    "contact": "Nous écrire",
    "legals": "Mentions légales",
    "faq": "Aide",
    "blog": "Blog",
    "information": "En savoir plus",
    "sources": "Code source",
    "accessibility": "Accessibilité: partiellement"
  }
}
</i18n>
