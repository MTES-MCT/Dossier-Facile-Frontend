<template>
  <section class="fr-mb-12w">
    <article>
      <div>
        <div class="fr-container fr-mt-3w">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-md-8">
              <h1>Plan du site</h1>
              <p>
                <i>Dossier</i><b>Facile</b>, le dossier de location numérique de
                l’État.
              </p>

              <h4 v-for="page in mainPages" v-bind:key="page.url">
                <a :href="page.url">{{ page.name }}</a>
              </h4>

              <h4>Autres pages</h4>
              <ul>
                <li v-for="page in otherPages" v-bind:key="page.url">
                  <a :href="page.url">{{ page.name }}</a>
                </li>
              </ul>

              <h4 class="fr-mt-3w">Réseaux sociaux</h4>
              <ul>
                <li v-for="social in socials" v-bind:key="social.name">
                  <a :href="social.url">{{ social.name }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Sitemap extends Vue {
  TENANT_URL = `//${process.env.VUE_APP_TENANT_URL}`;
  OWNER_URL = `//${process.env.VUE_APP_OWNER_URL}`;

  mainPages = [
    {
      name: "Monter mon dossier de location",
      url: `${this.TENANT_URL}/signup`
    },
    {
      name: "Se connecter",
      url: `${this.TENANT_URL}/login`
    },
    {
      name: "Espace propriétaire",
      url: `${this.OWNER_URL}`
    },
    {
      name: "Qui sommes-nous ?",
      url: "/information"
    },
    {
      name: "Devenir partenaire",
      url: "https://partenaire.dossierfacile.fr"
    },
    {
      name: "Blog",
      url: "/blog"
    },
    {
      name: "Aide",
      url: "https://docs.dossierfacile.fr"
    },
    {
      name: "Contact",
      url: "/contact"
    }
  ];

  otherPages = [
    {
      name: "Les startups d’État",
      url: "https://beta.gouv.fr"
    },
    {
      name: "Accessibilité",
      url: "/accessibilite"
    },
    {
      name: "Mentions légales",
      url: "/mentions-legales"
    },
    {
      name: "Statistiques",
      url: "/stats"
    },
    {
      name: "Code source",
      url: "https://github.com/MTES-MCT/Dossier-Facile-Frontend"
    }
  ];

  socials = [
    {
      name: "Twitter",
      url: "https://twitter.com/dossierfacile"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/DossierFacile.fr"
    },
    {
      name: "Linkedin",
      url: "https://www.linkedin.com/company/startup-d-etat-locatio"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/dossierfacile"
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@dossierfacile"
    }
  ];
}
</script>
