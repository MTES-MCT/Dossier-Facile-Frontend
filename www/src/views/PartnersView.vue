<template>
  <article>
    <div class="imagebg text-center">
      <div class="fr-container">
        <div class="fr-grid-row height-30">
          <div class="fr-col-md-12">
            <div>
              <h1 class="fr-h1 color--white">{{ t('partners.title') }}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-3w">
          <AllPartnersComponent></AllPartnersComponent>
          <div class="text-center fr-mt-5w fr-mb-5w">
            <p>
              <a :href="REGISTER_URL" class="fr-btn fr-mt-2w">
                <span class="text-center full-width">
                  {{ t("button") }}
                </span>
              </a>
            </p>
          </div>
      </section>
      <section class="fr-pb-md-5w fr-pt-md-9w fr-pt-3w fr-background-alt--blue-france">
        <AllInstitutionalPartnersComponent></AllInstitutionalPartnersComponent>
          <div class="text-center fr-mt-5w fr-mb-5w">
            <p>
              <a :href="REGISTER_URL" class="fr-btn fr-mt-2w">
                <span class="text-center full-width">
                  {{ t("button") }}
                </span>
              </a>
            </p>
          </div>
      </section>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import image from "../assets/cover-features.webp";
import { useI18n } from 'vue-i18n';
import AllInstitutionalPartnersComponent from "../components/AllInstitutionalPartnersComponent.vue";
import AllPartnersComponent from "../components/AllPartnersComponent.vue";

const { t } = useI18n();
const REGISTER_URL = import.meta.env.VITE_REGISTER_URL;

const title = "Les partenaires de DossierFacile";
const description =
  "Liste de tous les organismes avec lesquels DossierFacile est en partenariat.";
useHead({
  title: title,
  meta: [
    { name: "og:title", content: title },
    { name: "twitter:title", content: title },
    { name: "description", content: description },
    { name: "og:description", content: description },
    { name: "twitter:description", content: description },
    { name: "og:image", content: image },
    { name: "twitter:image", content: image },
  ],
});
</script>

<style scoped lang="scss">

.height-30 {
  height: auto;
  align-items: center;
  @media (min-height: 600px) and (min-width: 767px) {
    height: 30vh;
  }
}

.imagebg {
  width: 100%;
  top: 0;
  left: 0;
  background-size: cover !important;
  background-position: 50% 50% !important;
  background-image: url("../assets/cover-features.webp");
  background-color: #314467;
  z-index: 0;
}

</style>